/**
 * MCP Tool Definitions and Executors
 *
 * Provides MCP tool interfaces for riotdoc commands
 */

 
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

// Tool imports
import { createTool, executeCreate } from './create.js';
import { outlineTool, executeOutline } from './outline.js';
import { draftTool, executeDraft } from './draft.js';
import { statusTool, executeStatus } from './status.js';
import { spellcheckTool, executeSpellcheck } from './spellcheck.js';
import { cleanupTool, executeCleanup } from './cleanup.js';
import { exportTool, executeExport } from './export.js';
import { reviseTool, executeRevise } from './revise.js';
 

/**
 * Base tool executor - wraps command logic
 */
export async function executeTool(
    toolName: string,
    args: Record<string, any>,
    context: ToolExecutionContext
): Promise<ToolResult> {
    try {
        // Route to specific tool handler
        switch (toolName) {
            case 'riotdoc_create':
                return await executeCreate(args, context);
            case 'riotdoc_outline':
                return await executeOutline(args, context);
            case 'riotdoc_draft':
                return await executeDraft(args, context);
            case 'riotdoc_status':
                return await executeStatus(args, context);
            case 'riotdoc_spellcheck':
                return await executeSpellcheck(args, context);
            case 'riotdoc_cleanup':
                return await executeCleanup(args, context);
            case 'riotdoc_export':
                return await executeExport(args, context);
            case 'riotdoc_revise':
                return await executeRevise(args, context);
            default:
                return {
                    success: false,
                    error: `Unknown tool: ${toolName}`,
                };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Tool execution failed',
            context: {
                tool: toolName,
                args,
            },
        };
    }
}

/**
 * Tool definitions array
 */
export const tools: McpTool[] = [
    createTool,
    outlineTool,
    draftTool,
    statusTool,
    spellcheckTool,
    cleanupTool,
    exportTool,
    reviseTool,
];
