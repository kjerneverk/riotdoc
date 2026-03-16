/**
 * Revise Tool
 */

import { z } from 'zod';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

export const reviseTool: McpTool = {
    name: 'riotdoc_revise',
    description:
        'Add revision feedback to a draft. ' +
        'Captures feedback and suggestions for improving a specific draft.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        draft: z.number().optional().describe('Target draft number for revision'),
        feedback: z.string().describe('Revision feedback and suggestions'),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        const workspacePath = (args.path as string) || process.cwd();

        return {
            success: true,
            data: {
                action: 'pending',
                path: workspacePath,
                draft: args.draft,
                feedback: args.feedback,
                note: 'Revise implementation pending',
            },
            message: 'Revise command - implementation pending',
        };
    },
};
