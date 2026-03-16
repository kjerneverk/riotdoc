/**
 * MCP tools for version management
 * 
 * Implements user-controlled version numbering:
 * - v0.x = draft versions (user increments)
 * - v1.0 = published (explicit user decision)
 * - v1.x = maintenance updates after publication
 */

import { z } from "zod";
import { join } from "node:path";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { formatTimestamp } from "./shared.js";
import { logEvent } from "./history.js";
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import type { DocumentConfig, VersionHistoryEntry } from '../../types.js';

/**
 * Parse version string into major and minor numbers
 */
function parseVersion(version: string): { major: number; minor: number } {
    const match = version.match(/^v?(\d+)\.(\d+)$/);
    if (!match) {
        throw new Error(`Invalid version format: ${version}. Expected format: v0.1 or 1.0`);
    }
    return {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
    };
}

/**
 * Format version as string
 */
function formatVersion(major: number, minor: number): string {
    return `${major}.${minor}`;
}

/**
 * Increment version number
 */
async function incrementVersion(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const type = args.type as "minor" | "major";
    const notes = args.notes as string | undefined;
    const saveDraft = args.saveDraft !== false;
    const configPath = join(docPath, 'config.json');
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: DocumentConfig = JSON.parse(configContent);
    
    const current = parseVersion(config.version);
    
    let newMajor: number;
    let newMinor: number;
    let eventType: "version_incremented" | "version_published";
    
    if (type === 'major') {
        newMajor = current.major + 1;
        newMinor = 0;
        eventType = current.major === 0 ? 'version_published' : 'version_incremented';
    } else {
        newMajor = current.major;
        newMinor = current.minor + 1;
        eventType = 'version_incremented';
    }
    
    const newVersion = formatVersion(newMajor, newMinor);
    const timestamp = formatTimestamp();
    
    let draftPath: string | undefined;
    if (saveDraft) {
        const draftsDir = join(docPath, 'drafts');
        await mkdir(draftsDir, { recursive: true });
        
        const currentDraftPath = join(docPath, 'current-draft.md');
        try {
            const versionedFilename = `draft-v${config.version}.md`;
            draftPath = `drafts/${versionedFilename}`;
            await copyFile(currentDraftPath, join(docPath, draftPath));
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    
    const versionEntry: VersionHistoryEntry = {
        version: newVersion,
        timestamp,
        draftPath,
        notes,
    };
    
    config.versionHistory = config.versionHistory || [];
    config.versionHistory.push(versionEntry);
    
    const oldVersion = config.version;
    config.version = newVersion;
    config.published = newMajor >= 1;
    config.updatedAt = new Date(timestamp);
    
    await writeFile(configPath, JSON.stringify(config, null, 2));
    
    await logEvent(docPath, {
        timestamp,
        type: eventType,
        data: {
            oldVersion,
            newVersion,
            incrementType: type,
            published: config.published,
            draftPath,
            notes,
        },
    });
    
    let message = `✅ Version incremented: v${oldVersion} → v${newVersion}`;
    
    if (eventType === 'version_published') {
        message += '\n\n🎉 Document published! (v1.0)';
    }
    
    if (draftPath) {
        message += `\n\nDraft saved: ${draftPath}`;
    }
    
    if (notes) {
        message += `\n\nNotes: ${notes}`;
    }
    
    return message;
}

/**
 * Get current version information
 */
async function getVersion(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const configPath = join(docPath, 'config.json');
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: DocumentConfig = JSON.parse(configContent);
    
    const { major } = parseVersion(config.version);
    const status = major >= 1 ? '📗 Published' : '📝 Draft';
    
    let output = `# Version Information\n\n`;
    output += `**Current Version**: v${config.version} ${status}\n`;
    output += `**Published**: ${config.published ? 'Yes' : 'No'}\n`;
    output += `**Last Updated**: ${new Date(config.updatedAt).toLocaleString()}\n\n`;
    
    if (config.versionHistory && config.versionHistory.length > 0) {
        output += `## Version History\n\n`;
        output += `| Version | Date | Notes |\n`;
        output += `|---------|------|-------|\n`;
        
        for (const entry of config.versionHistory) {
            const date = new Date(entry.timestamp).toLocaleDateString();
            const entryNotes = entry.notes || '-';
            output += `| v${entry.version} | ${date} | ${entryNotes} |\n`;
        }
    }
    
    return output;
}

/**
 * List all versions
 */
async function listVersions(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const configPath = join(docPath, 'config.json');
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: DocumentConfig = JSON.parse(configContent);
    
    if (!config.versionHistory || config.versionHistory.length === 0) {
        return 'No version history found.';
    }
    
    let output = `# Version History\n\n`;
    output += `**Current Version**: v${config.version}\n\n`;
    
    for (const entry of config.versionHistory) {
        const date = new Date(entry.timestamp).toLocaleString();
        output += `## v${entry.version}\n\n`;
        output += `**Date**: ${date}\n`;
        
        if (entry.draftPath) {
            output += `**Draft**: ${entry.draftPath}\n`;
        }
        
        if (entry.notes) {
            output += `**Notes**: ${entry.notes}\n`;
        }
        
        output += `\n`;
    }
    
    return output;
}

// Tool definitions

export const incrementVersionTool: McpTool = {
    name: "riotdoc_increment_version",
    description: "Increment document version number. Use 'minor' for v0.x drafts (0.1→0.2), 'major' to publish (0.x→1.0) or for major updates (1.0→2.0). Optionally saves current draft as versioned file.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        type: z.enum(["minor", "major"]).describe("Increment type: 'minor' for v0.x, 'major' for v1.0"),
        notes: z.string().optional().describe("Notes about this version"),
        saveDraft: z.boolean().optional().default(true).describe("Save current draft as versioned file"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await incrementVersion(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export const getVersionTool: McpTool = {
    name: "riotdoc_get_version",
    description: "Get current version information and version history for a document.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await getVersion(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export const listVersionsTool: McpTool = {
    name: "riotdoc_list_versions",
    description: "List all versions in document history with timestamps and notes.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await listVersions(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};
