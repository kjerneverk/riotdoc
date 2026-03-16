/**
 * Create Tool
 */

import { z } from 'zod';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import type { DocumentType } from '../../types.js';
import { createWorkspace } from '../../workspace/creator.js';
import { executeCommand } from './shared.js';

export const createTool: McpTool = {
    name: 'riotdoc_create',
    description:
        'Create a new document workspace with structured directories and configuration. ' +
        'Sets up the complete workspace structure including voice, objectives, evidence, and drafts directories.',
    schema: {
        name: z.string().describe('Document workspace name (will be used as directory name)'),
        title: z.string().optional().describe('Document title (defaults to formatted name)'),
        type: z.enum([
            'blog-post', 'blog-series', 'book', 'essay', 'podcast-script',
            'work-paper', 'technical-doc', 'newsletter', 'general', 'custom',
        ]).describe('Document type'),
        base_path: z.string().optional().describe('Base path for workspace creation (defaults to current directory)'),
        primary_goal: z.string().optional().describe('Primary goal of the document'),
        audience: z.string().optional().describe('Target audience description'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const { join, resolve } = await import('node:path');
                const basePath = (args.base_path as string) || process.cwd();
                const name = args.name as string;
                const workspacePath = resolve(join(basePath, name));

                const title = (args.title as string) || name
                    .split('-')
                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');

                await createWorkspace({
                    path: workspacePath,
                    id: name,
                    title,
                    type: args.type as DocumentType,
                    objectives: {
                        primaryGoal: (args.primary_goal as string) || '',
                        secondaryGoals: [],
                        keyTakeaways: [],
                    },
                });

                return {
                    workspacePath,
                    name,
                    title,
                    type: args.type,
                };
            },
            (result) => ({
                workspace: result.workspacePath,
                name: result.name,
                title: result.title,
                type: result.type,
                nextSteps: [
                    'Edit voice/tone.md to define your writing voice',
                    'Edit OBJECTIVES.md to refine your goals',
                    'Run: riotdoc_outline to generate outline',
                    'Run: riotdoc_draft to create first draft',
                ],
            })
        );
    },
};
