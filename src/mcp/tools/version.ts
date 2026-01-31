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
import type { ToolResult, ToolExecutionContext } from '../types.js';
import type { DocumentConfig, VersionHistoryEntry } from '../../types.js';

// Tool schemas
export const IncrementVersionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    type: z.enum(["minor", "major"]).describe("Increment type: 'minor' for v0.x, 'major' for v1.0"),
    notes: z.string().optional().describe("Notes about this version"),
    saveDraft: z.boolean().optional().default(true).describe("Save current draft as versioned file"),
});

export const GetVersionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
});

export const ListVersionsSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
});

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
export async function incrementVersion(args: z.infer<typeof IncrementVersionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const configPath = join(docPath, 'config.json');
    
    // Read current config
    const configContent = await readFile(configPath, 'utf-8');
    const config: DocumentConfig = JSON.parse(configContent);
    
    // Parse current version
    const current = parseVersion(config.version);
    
    // Calculate new version
    let newMajor: number;
    let newMinor: number;
    let eventType: "version_incremented" | "version_published";
    
    if (args.type === 'major') {
        // Major increment: v0.x → v1.0 or v1.x → v2.0
        newMajor = current.major + 1;
        newMinor = 0;
        eventType = current.major === 0 ? 'version_published' : 'version_incremented';
    } else {
        // Minor increment: v0.1 → v0.2 or v1.0 → v1.1
        newMajor = current.major;
        newMinor = current.minor + 1;
        eventType = 'version_incremented';
    }
    
    const newVersion = formatVersion(newMajor, newMinor);
    const timestamp = formatTimestamp();
    
    // Save current draft as versioned file if requested
    let draftPath: string | undefined;
    if (args.saveDraft) {
        const draftsDir = join(docPath, 'drafts');
        await mkdir(draftsDir, { recursive: true });
        
        // Find current draft file (look for latest draft-*.md)
        const currentDraftPath = join(docPath, 'current-draft.md');
        try {
            const versionedFilename = `draft-v${config.version}.md`;
            draftPath = `drafts/${versionedFilename}`;
            await copyFile(currentDraftPath, join(docPath, draftPath));
        } catch (error: any) {
            // If current-draft.md doesn't exist, that's okay
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    
    // Update version history
    const versionEntry: VersionHistoryEntry = {
        version: newVersion,
        timestamp,
        draftPath,
        notes: args.notes,
    };
    
    config.versionHistory = config.versionHistory || [];
    config.versionHistory.push(versionEntry);
    
    // Update config
    const oldVersion = config.version;
    config.version = newVersion;
    config.published = newMajor >= 1;
    config.updatedAt = new Date(timestamp);
    
    // Save updated config
    await writeFile(configPath, JSON.stringify(config, null, 2));
    
    // Log version event to timeline
    await logEvent(docPath, {
        timestamp,
        type: eventType,
        data: {
            oldVersion,
            newVersion,
            incrementType: args.type,
            published: config.published,
            draftPath,
            notes: args.notes,
        },
    });
    
    // Build response message
    let message = `✅ Version incremented: v${oldVersion} → v${newVersion}`;
    
    if (eventType === 'version_published') {
        message += '\n\n🎉 Document published! (v1.0)';
    }
    
    if (draftPath) {
        message += `\n\nDraft saved: ${draftPath}`;
    }
    
    if (args.notes) {
        message += `\n\nNotes: ${args.notes}`;
    }
    
    return message;
}

/**
 * Get current version information
 */
export async function getVersion(args: z.infer<typeof GetVersionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const configPath = join(docPath, 'config.json');
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: DocumentConfig = JSON.parse(configContent);
    
    const { major, minor } = parseVersion(config.version);
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
            const notes = entry.notes || '-';
            output += `| v${entry.version} | ${date} | ${notes} |\n`;
        }
    }
    
    return output;
}

/**
 * List all versions
 */
export async function listVersions(args: z.infer<typeof ListVersionsSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
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

// Tool executors for MCP

export async function executeIncrementVersion(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = IncrementVersionSchema.parse(args);
        const result = await incrementVersion(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeGetVersion(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = GetVersionSchema.parse(args);
        const result = await getVersion(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeListVersions(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = ListVersionsSchema.parse(args);
        const result = await listVersions(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Tool definitions for MCP
import type { McpTool } from '../types.js';

export const incrementVersionTool: McpTool = {
    name: "riotdoc_increment_version",
    description: "Increment document version number. Use 'minor' for v0.x drafts (0.1→0.2), 'major' to publish (0.x→1.0) or for major updates (1.0→2.0). Optionally saves current draft as versioned file.",
    inputSchema: IncrementVersionSchema.shape as any,
};

export const getVersionTool: McpTool = {
    name: "riotdoc_get_version",
    description: "Get current version information and version history for a document.",
    inputSchema: GetVersionSchema.shape as any,
};

export const listVersionsTool: McpTool = {
    name: "riotdoc_list_versions",
    description: "List all versions in document history with timestamps and notes.",
    inputSchema: ListVersionsSchema.shape as any,
};
