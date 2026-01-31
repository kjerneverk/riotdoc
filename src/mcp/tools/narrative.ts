/**
 * MCP tools for narrative capture
 * 
 * Copied and adapted from RiotPlan (src/mcp/tools/idea.ts lines 312-374)
 * Original source: /Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/idea.ts
 * 
 * CRITICAL FIX: Saves narratives to BOTH timeline.jsonl AND .history/prompts/
 * This was a major user frustration point - narratives must be easily accessible
 * as reusable prompts, not just buried in timeline.jsonl
 */

import { z } from "zod";
import { join } from "node:path";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { formatTimestamp } from "./shared.js";
import { logEvent } from "./history.js";
import type { ToolResult, ToolExecutionContext } from '../types.js';

// Tool schema
export const AddNarrativeSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    content: z.string().describe("Raw narrative content to capture"),
    source: z.enum(["typing", "voice", "paste", "import"]).optional().describe("Source of the narrative"),
    context: z.string().optional().describe("Context about what prompted this narrative"),
    speaker: z.enum(["user", "assistant", "system"]).optional().describe("Who is speaking"),
});

/**
 * Add narrative chunk to document history
 * 
 * Saves to TWO locations:
 * 1. timeline.jsonl - chronological event log
 * 2. .history/prompts/NNN-description.md - reusable prompt files
 * 
 * This dual-save is CRITICAL for user workflow:
 * - Timeline: Complete event history
 * - Prompts: Easy access to conversations as reusable context
 */
export async function addNarrative(args: z.infer<typeof AddNarrativeSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const timestamp = formatTimestamp();
  
    // 1. Log narrative chunk to timeline
    // Narrative chunks are kept in the timeline for full-fidelity context
    await logEvent(docPath, {
        timestamp,
        type: 'narrative_chunk',
        data: { 
            content: args.content,
            source: args.source,
            context: args.context,
            speaker: args.speaker || 'user',
        },
    });
  
    // 2. ALSO save to .history/prompts/ directory as a numbered file
    // This makes narratives reusable as prompts for regenerating/updating documents
    const historyDir = join(docPath, ".history");
    const promptsDir = join(historyDir, "prompts");
    await mkdir(promptsDir, { recursive: true });
  
    // 3. Find next available number
    let files: string[] = [];
    try {
        files = await readdir(promptsDir);
    } catch {
        // Directory doesn't exist yet or is empty
        files = [];
    }
  
    const promptFiles = files
        .filter(f => /^\d{3}-.*\.md$/.test(f))
        .sort();
    
    const nextNum = promptFiles.length > 0
        ? parseInt(promptFiles[promptFiles.length - 1].substring(0, 3)) + 1
        : 1;
  
    // 4. Generate filename from context or use generic name
    const baseFilename = args.context
        ? args.context.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)
        : 'narrative';
    const filename = `${String(nextNum).padStart(3, '0')}-${baseFilename}.md`;
    const promptPath = join(promptsDir, filename);
  
    // 5. Create prompt file with full narrative content
    const promptContent = `# Narrative: ${args.context || 'User Input'}

**Date**: ${timestamp}
**Source**: ${args.source || 'unknown'}
**Speaker**: ${args.speaker || 'user'}

---

${args.content}
`;
  
    await writeFile(promptPath, promptContent, "utf-8");
  
    return `✅ Narrative saved to timeline and ${filename} (${args.content.length} characters)`;
}

// Tool executor for MCP
export async function executeAddNarrative(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = AddNarrativeSchema.parse(args);
        const result = await addNarrative(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Tool definition for MCP
import type { McpTool } from '../types.js';

export const addNarrativeTool: McpTool = {
    name: "riotdoc_add_narrative",
    description: "Capture raw narrative content to both timeline and prompts directory. Use for user conversations, voice transcripts, or any free-form input. Narratives are saved as numbered files (001-xxx.md, 002-xxx.md) in .history/prompts/ for easy access and reuse.",
    inputSchema: AddNarrativeSchema.shape as any,
};
