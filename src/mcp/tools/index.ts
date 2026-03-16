/**
 * MCP Tool Definitions and Executors
 *
 * Provides MCP tool interfaces for riotdoc commands
 */

import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

// Tool imports
import { createTool } from './create.js';
import { 
    insertSectionTool, 
    renameSectionTool, 
    deleteSectionTool, 
    moveSectionTool,
} from './outline.js';
import { draftTool } from './draft.js';
import { statusTool } from './status.js';
import { spellcheckTool } from './spellcheck.js';
import { cleanupTool } from './cleanup.js';
import { exportTool } from './export.js';
import { reviseTool } from './revise.js';
import { addNarrativeTool } from './narrative.js';
import {
    checkpointCreateTool,
    checkpointListTool,
    checkpointShowTool,
    checkpointRestoreTool,
    historyShowTool,
} from './history.js';
import {
    incrementVersionTool,
    getVersionTool,
    listVersionsTool,
} from './version.js';
import { voiceShowTool, voiceSetTool } from './voice.js';
import { guidanceAddTool, guidanceListTool, guidanceReadTool } from './guidance.js';
import { assetRegisterTool, assetListTool, assetPromptTool } from './assets.js';
import { corpusIndexTool, corpusSearchTool, corpusReadTool } from './corpus.js';
import { assembleTool } from './assemble.js';
import { manifestShowTool, manifestAddTool, manifestAssembleTool } from './manifest.js';

/**
 * All registered tools
 */
export const tools: McpTool[] = [
    createTool,
    insertSectionTool,
    renameSectionTool,
    deleteSectionTool,
    moveSectionTool,
    draftTool,
    statusTool,
    spellcheckTool,
    cleanupTool,
    exportTool,
    reviseTool,
    addNarrativeTool,
    checkpointCreateTool,
    checkpointListTool,
    checkpointShowTool,
    checkpointRestoreTool,
    historyShowTool,
    incrementVersionTool,
    getVersionTool,
    listVersionsTool,
    voiceShowTool,
    voiceSetTool,
    guidanceAddTool,
    guidanceListTool,
    guidanceReadTool,
    assetRegisterTool,
    assetListTool,
    assetPromptTool,
    corpusIndexTool,
    corpusSearchTool,
    corpusReadTool,
    assembleTool,
    manifestShowTool,
    manifestAddTool,
    manifestAssembleTool,
];

/**
 * Map for O(1) tool lookup by name
 */
export const toolMap = new Map<string, McpTool>(
    tools.map(t => [t.name, t])
);

/**
 * Execute a tool by name using Map-based dispatch
 */
export async function executeTool(
    toolName: string,
    args: Record<string, unknown>,
    context: ToolExecutionContext
): Promise<ToolResult> {
    try {
        const tool = toolMap.get(toolName);
        if (!tool) {
            return {
                success: false,
                error: `Unknown tool: ${toolName}`,
            };
        }
        return await tool.execute(args, context);
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
