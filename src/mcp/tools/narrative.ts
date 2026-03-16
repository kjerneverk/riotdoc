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
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

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
async function addNarrative(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const content = args.content as string;
    const source = args.source as string | undefined;
    const context = args.context as string | undefined;
    const speaker = (args.speaker as string) || 'user';
    const timestamp = formatTimestamp();
  
    await logEvent(docPath, {
        timestamp,
        type: 'narrative_chunk',
        data: { 
            content,
            source,
            context,
            speaker,
        },
    });
  
    const historyDir = join(docPath, ".history");
    const promptsDir = join(historyDir, "prompts");
    await mkdir(promptsDir, { recursive: true });
  
    let files: string[] = [];
    try {
        files = await readdir(promptsDir);
    } catch {
        files = [];
    }
  
    const promptFiles = files
        .filter(f => /^\d{3}-.*\.md$/.test(f))
        .sort();
    
    const nextNum = promptFiles.length > 0
        ? parseInt(promptFiles[promptFiles.length - 1].substring(0, 3)) + 1
        : 1;
  
    const baseFilename = context
        ? context.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)
        : 'narrative';
    const filename = `${String(nextNum).padStart(3, '0')}-${baseFilename}.md`;
    const promptPath = join(promptsDir, filename);
  
    const promptContent = `# Narrative: ${context || 'User Input'}

**Date**: ${timestamp}
**Source**: ${source || 'unknown'}
**Speaker**: ${speaker}

---

${content}
`;
  
    await writeFile(promptPath, promptContent, "utf-8");
  
    return `✅ Narrative saved to timeline and ${filename} (${content.length} characters)`;
}

export const addNarrativeTool: McpTool = {
    name: "riotdoc_add_narrative",
    description: "Capture raw narrative content to both timeline and prompts directory. Use for user conversations, voice transcripts, or any free-form input. Narratives are saved as numbered files (001-xxx.md, 002-xxx.md) in .history/prompts/ for easy access and reuse.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        content: z.string().describe("Raw narrative content to capture"),
        source: z.enum(["typing", "voice", "paste", "import"]).optional().describe("Source of the narrative"),
        context: z.string().optional().describe("Context about what prompted this narrative"),
        speaker: z.enum(["user", "assistant", "system"]).optional().describe("Who is speaking"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await addNarrative(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};
