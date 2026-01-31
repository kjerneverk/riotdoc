/**
 * MCP tools for document history and checkpointing
 * 
 * Copied and adapted from RiotPlan (src/mcp/tools/history.ts)
 * Original source: /Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/history.ts
 * Adapted for RiotDoc document workflows
 */

import { z } from "zod";
import { join } from "node:path";
import { readFile, writeFile, mkdir, appendFile, readdir } from "node:fs/promises";
import { formatTimestamp } from "./shared.js";
import type { ToolResult, ToolExecutionContext } from '../types.js';
import type { TimelineEvent, CheckpointMetadata } from '../../types.js';

// Re-export for backward compatibility
export type HistoryEvent = TimelineEvent;
export type { CheckpointMetadata };

// Tool schemas
export const CheckpointCreateSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    name: z.string().describe("Checkpoint name (kebab-case)"),
    message: z.string().describe("Description of why checkpoint created"),
    capturePrompt: z.boolean().optional().default(true).describe("Capture conversation context"),
});

export const CheckpointListSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
});

export const CheckpointShowSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    checkpoint: z.string().describe("Checkpoint name"),
});

export const CheckpointRestoreSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    checkpoint: z.string().describe("Checkpoint name"),
});

export const HistoryShowSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    since: z.string().optional().describe("Show events since this ISO timestamp"),
    eventType: z.string().optional().describe("Filter by event type"),
    limit: z.number().optional().describe("Maximum number of events to show"),
});

// Core history functions

/**
 * Log an event to the timeline
 */
export async function logEvent(docPath: string, event: TimelineEvent): Promise<void> {
    const historyDir = join(docPath, '.history');
    await mkdir(historyDir, { recursive: true });
  
    const timelinePath = join(historyDir, 'timeline.jsonl');
    const line = JSON.stringify(event) + '\n';
  
    await appendFile(timelinePath, line);
}

/**
 * Read timeline events
 */
export async function readTimeline(docPath: string): Promise<TimelineEvent[]> {
    const timelinePath = join(docPath, '.history', 'timeline.jsonl');
  
    try {
        const content = await readFile(timelinePath, 'utf-8');
        return content
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

/**
 * Capture current state snapshot
 */
async function captureCurrentState(docPath: string): Promise<{
    timestamp: string;
    status: string;
    config?: { exists: boolean; content?: string };
    outline?: { exists: boolean; content?: string };
    currentDraft?: { exists: boolean; content?: string };
}> {
    const snapshot = {
        timestamp: formatTimestamp(),
        status: 'unknown',
        config: undefined as { exists: boolean; content?: string } | undefined,
        outline: undefined as { exists: boolean; content?: string } | undefined,
        currentDraft: undefined as { exists: boolean; content?: string } | undefined,
    };
  
    // Try to read config.json
    try {
        const configContent = await readFile(join(docPath, 'config.json'), 'utf-8');
        snapshot.config = {
            content: configContent,
            exists: true,
        };
        
        // Extract status from config
        const config = JSON.parse(configContent);
        snapshot.status = config.status || 'unknown';
    } catch {
        snapshot.config = { exists: false };
    }
  
    // Try to read outline.md
    try {
        const outlineContent = await readFile(join(docPath, 'outline.md'), 'utf-8');
        snapshot.outline = {
            content: outlineContent,
            exists: true,
        };
    } catch {
        snapshot.outline = { exists: false };
    }
  
    // Try to read current draft (find latest draft file)
    try {
        const draftsDir = join(docPath, 'drafts');
        const draftFiles = await readdir(draftsDir);
        const mdDrafts = draftFiles.filter(f => f.endsWith('.md')).sort().reverse();
        
        if (mdDrafts.length > 0) {
            const latestDraft = mdDrafts[0];
            const draftContent = await readFile(join(draftsDir, latestDraft), 'utf-8');
            snapshot.currentDraft = {
                content: draftContent,
                exists: true,
            };
        } else {
            snapshot.currentDraft = { exists: false };
        }
    } catch {
        snapshot.currentDraft = { exists: false };
    }
  
    return snapshot;
}

/**
 * Count events since last checkpoint
 */
async function countEventsSinceLastCheckpoint(docPath: string): Promise<number> {
    const events = await readTimeline(docPath);
  
    // Find last checkpoint
    let lastCheckpointIndex = -1;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].type === 'checkpoint_created') {
            lastCheckpointIndex = i;
            break;
        }
    }
  
    if (lastCheckpointIndex === -1) {
        return events.length;
    }
  
    return events.length - lastCheckpointIndex - 1;
}

/**
 * Get list of files in document directory
 */
async function getChangedFiles(docPath: string): Promise<string[]> {
    try {
        const files = await readdir(docPath);
        return files.filter(f => f.endsWith('.md') || f.endsWith('.json'));
    } catch {
        return [];
    }
}

/**
 * Format recent events for prompt capture
 */
async function formatRecentEvents(docPath: string, limit: number): Promise<string> {
    const events = await readTimeline(docPath);
    const recent = events.slice(-limit);
  
    return recent.map(event => {
        const time = new Date(event.timestamp).toLocaleString();
        return `- ${time}: ${event.type} - ${JSON.stringify(event.data)}`;
    }).join('\n');
}

/**
 * Format snapshot for prompt capture
 */
function formatSnapshot(snapshot: any): string {
    let output = '';
  
    if (snapshot.status) {
        output += `**Current Status**: ${snapshot.status}\n\n`;
    }
  
    if (snapshot.config?.exists) {
        output += `### config.json\n\n\`\`\`json\n${snapshot.config.content}\n\`\`\`\n\n`;
    }
  
    if (snapshot.outline?.exists) {
        output += `### outline.md\n\n${snapshot.outline.content}\n\n`;
    }
  
    if (snapshot.currentDraft?.exists) {
        const preview = snapshot.currentDraft.content.substring(0, 500);
        output += `### Current Draft (preview)\n\n${preview}...\n\n`;
    }
  
    return output;
}

/**
 * Capture prompt context at checkpoint
 */
async function capturePromptContext(
    docPath: string,
    checkpointName: string,
    snapshot: any,
    message: string
): Promise<void> {
    const promptDir = join(docPath, '.history', 'prompts');
    await mkdir(promptDir, { recursive: true });
  
    const prompt = `# Checkpoint: ${checkpointName}

**Timestamp**: ${snapshot.timestamp}
**Status**: ${snapshot.status || 'unknown'}
**Message**: ${message}

## Current State

${formatSnapshot(snapshot)}

## Files at This Point

${(await getChangedFiles(docPath)).map(f => `- ${f}`).join('\n')}

## Recent Timeline

${await formatRecentEvents(docPath, 10)}

---

This checkpoint captures the state of the document at this moment in time.
You can restore to this checkpoint using: \`riotdoc_checkpoint_restore({ checkpoint: "${checkpointName}" })\`
`;
  
    await writeFile(
        join(promptDir, `${checkpointName}.md`),
        prompt
    );
}

// Tool implementations

export async function checkpointCreate(args: z.infer<typeof CheckpointCreateSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const { name, message, capturePrompt } = args;
  
    // 1. Create checkpoint directory
    const checkpointDir = join(docPath, '.history', 'checkpoints');
    await mkdir(checkpointDir, { recursive: true });
  
    // 2. Snapshot current state
    const snapshot = await captureCurrentState(docPath);
  
    // 3. Save checkpoint metadata
    const checkpoint: CheckpointMetadata = {
        name,
        timestamp: snapshot.timestamp,
        message,
        status: snapshot.status,
        snapshot: {
            timestamp: snapshot.timestamp,
            config: snapshot.config,
            outline: snapshot.outline,
            currentDraft: snapshot.currentDraft,
        },
        context: {
            filesChanged: await getChangedFiles(docPath),
            eventsSinceLastCheckpoint: await countEventsSinceLastCheckpoint(docPath),
        },
    };
  
    await writeFile(
        join(checkpointDir, `${name}.json`),
        JSON.stringify(checkpoint, null, 2)
    );
  
    // 4. Capture prompt if requested
    if (capturePrompt) {
        await capturePromptContext(docPath, name, snapshot, message);
    }
  
    // 5. Log checkpoint event
    const checkpointEvent: TimelineEvent = {
        timestamp: snapshot.timestamp,
        type: 'checkpoint_created',
        data: { 
            name, 
            message,
            snapshotPath: `.history/checkpoints/${name}.json`,
            promptPath: `.history/prompts/${name}.md`,
        },
    };
    await logEvent(docPath, checkpointEvent);
  
    return `✅ Checkpoint created: ${name}\n\nLocation: ${docPath}/.history/checkpoints/${name}.json\nPrompt: ${docPath}/.history/prompts/${name}.md\n\nYou can restore this checkpoint later with:\n  riotdoc_checkpoint_restore({ checkpoint: "${name}" })`;
}

export async function checkpointList(args: z.infer<typeof CheckpointListSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const checkpointDir = join(docPath, '.history', 'checkpoints');
  
    try {
        const files = await readdir(checkpointDir);
        const checkpoints = files.filter(f => f.endsWith('.json'));
    
        if (checkpoints.length === 0) {
            return 'No checkpoints found.';
        }
    
        let output = `Found ${checkpoints.length} checkpoint(s):\n\n`;
    
        for (const file of checkpoints) {
            const content = await readFile(join(checkpointDir, file), 'utf-8');
            const checkpoint: CheckpointMetadata = JSON.parse(content);
            const time = new Date(checkpoint.timestamp).toLocaleString();
            output += `- **${checkpoint.name}** (${time})\n`;
            output += `  Status: ${checkpoint.status}\n`;
            output += `  Message: ${checkpoint.message}\n`;
            output += `  Events since last: ${checkpoint.context.eventsSinceLastCheckpoint}\n\n`;
        }
    
        return output;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return 'No checkpoints found.';
        }
        throw error;
    }
}

export async function checkpointShow(args: z.infer<typeof CheckpointShowSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const checkpointPath = join(docPath, '.history', 'checkpoints', `${args.checkpoint}.json`);
  
    const content = await readFile(checkpointPath, 'utf-8');
    const checkpoint: CheckpointMetadata = JSON.parse(content);
  
    const time = new Date(checkpoint.timestamp).toLocaleString();
  
    let output = `# Checkpoint: ${checkpoint.name}\n\n`;
    output += `**Created**: ${time}\n`;
    output += `**Status**: ${checkpoint.status}\n`;
    output += `**Message**: ${checkpoint.message}\n\n`;
    output += `## Context\n\n`;
    output += `- Files changed: ${checkpoint.context.filesChanged.join(', ')}\n`;
    output += `- Events since last checkpoint: ${checkpoint.context.eventsSinceLastCheckpoint}\n\n`;
    output += `## Snapshot\n\n`;
    output += `${formatSnapshot(checkpoint.snapshot)}\n`;
    output += `\n---\n\n`;
    output += `View full prompt context: ${docPath}/.history/prompts/${args.checkpoint}.md\n`;
    output += `Restore: riotdoc_checkpoint_restore({ checkpoint: "${args.checkpoint}" })`;
  
    return output;
}

export async function checkpointRestore(args: z.infer<typeof CheckpointRestoreSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const checkpointPath = join(docPath, '.history', 'checkpoints', `${args.checkpoint}.json`);
  
    const content = await readFile(checkpointPath, 'utf-8');
    const checkpoint: CheckpointMetadata = JSON.parse(content);
  
    // Restore files from snapshot
    if (checkpoint.snapshot.config?.exists && checkpoint.snapshot.config.content) {
        await writeFile(join(docPath, 'config.json'), checkpoint.snapshot.config.content);
    }
  
    if (checkpoint.snapshot.outline?.exists && checkpoint.snapshot.outline.content) {
        await writeFile(join(docPath, 'outline.md'), checkpoint.snapshot.outline.content);
    }
  
    if (checkpoint.snapshot.currentDraft?.exists && checkpoint.snapshot.currentDraft.content) {
        // Restore to drafts directory with checkpoint name
        const draftsDir = join(docPath, 'drafts');
        await mkdir(draftsDir, { recursive: true });
        await writeFile(
            join(draftsDir, `restored-from-${args.checkpoint}.md`),
            checkpoint.snapshot.currentDraft.content
        );
    }
  
    // Log restoration event
    const restoreEvent: TimelineEvent = {
        timestamp: formatTimestamp(),
        type: 'checkpoint_restored',
        data: { 
            checkpoint: args.checkpoint,
            restoredFrom: checkpoint.timestamp,
        },
    };
    await logEvent(docPath, restoreEvent);
  
    return `✅ Restored to checkpoint: ${args.checkpoint}\n\nRestored from: ${checkpoint.timestamp}\nStatus: ${checkpoint.status}\n\nFiles restored:\n${checkpoint.context.filesChanged.map((f: string) => `  - ${f}`).join('\n')}`;
}

export async function historyShow(args: z.infer<typeof HistoryShowSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    let events = await readTimeline(docPath);
  
    if (events.length === 0) {
        return 'No history events found.';
    }
  
    // Filter by timestamp if provided
    if (args.since) {
        const sinceTime = new Date(args.since).getTime();
        events = events.filter(e => new Date(e.timestamp).getTime() >= sinceTime);
    }
  
    // Filter by event type if provided
    if (args.eventType) {
        events = events.filter(e => e.type === args.eventType);
    }
  
    // Limit if provided
    if (args.limit) {
        events = events.slice(-args.limit);
    }
  
    let output = `# Document History\n\n`;
    output += `Total events: ${events.length}\n\n`;
  
    for (const event of events) {
        const time = new Date(event.timestamp).toLocaleString();
        output += `## ${time} - ${event.type}\n\n`;
        output += `\`\`\`json\n${JSON.stringify(event.data, null, 2)}\n\`\`\`\n\n`;
    }
  
    return output;
}

// Tool executors for MCP

export async function executeCheckpointCreate(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = CheckpointCreateSchema.parse(args);
        const result = await checkpointCreate(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeCheckpointList(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = CheckpointListSchema.parse(args);
        const result = await checkpointList(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeCheckpointShow(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = CheckpointShowSchema.parse(args);
        const result = await checkpointShow(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeCheckpointRestore(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = CheckpointRestoreSchema.parse(args);
        const result = await checkpointRestore(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeHistoryShow(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = HistoryShowSchema.parse(args);
        const result = await historyShow(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Tool definitions for MCP
import type { McpTool } from '../types.js';

export const checkpointCreateTool: McpTool = {
    name: "riotdoc_checkpoint_create",
    description: "Create a named checkpoint of current document state with prompt capture. Use this at key decision points to save your progress.",
    inputSchema: CheckpointCreateSchema.shape as any,
};

export const checkpointListTool: McpTool = {
    name: "riotdoc_checkpoint_list",
    description: "List all checkpoints for a document with timestamps and messages.",
    inputSchema: CheckpointListSchema.shape as any,
};

export const checkpointShowTool: McpTool = {
    name: "riotdoc_checkpoint_show",
    description: "Show detailed information about a specific checkpoint including full snapshot.",
    inputSchema: CheckpointShowSchema.shape as any,
};

export const checkpointRestoreTool: McpTool = {
    name: "riotdoc_checkpoint_restore",
    description: "Restore document to a previous checkpoint state. This will overwrite current files with checkpoint snapshot.",
    inputSchema: CheckpointRestoreSchema.shape as any,
};

export const historyShowTool: McpTool = {
    name: "riotdoc_history_show",
    description: "Show document history timeline with all events. Can filter by time, event type, or limit results.",
    inputSchema: HistoryShowSchema.shape as any,
};
