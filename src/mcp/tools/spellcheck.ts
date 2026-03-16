/**
 * Spellcheck Tool
 */

import { z } from 'zod';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

export const spellcheckTool: McpTool = {
    name: 'riotdoc_spellcheck',
    description:
        'Run spell checking on document content. ' +
        'Checks drafts and other markdown files for spelling errors.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        file: z.string().optional().describe('Specific file to check (omit to check all drafts)'),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        const workspacePath = (args.path as string) || process.cwd();

        return {
            success: true,
            data: {
                action: 'pending',
                path: workspacePath,
                file: args.file,
                note: 'Spellcheck implementation pending',
            },
            message: 'Spellcheck command - implementation pending',
        };
    },
};
