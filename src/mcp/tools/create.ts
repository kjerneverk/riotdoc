/**
 * Create Tool
 */

 
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { createWorkspace } from '../../workspace/creator.js';
import { executeCommand } from './shared.js';
 

export const createTool: McpTool = {
    name: 'riotdoc_create',
    description:
        'Create a new document workspace with structured directories and configuration. ' +
        'Sets up the complete workspace structure including voice, objectives, evidence, and drafts directories.',
    inputSchema: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Document workspace name (will be used as directory name)',
            },
            title: {
                type: 'string',
                description: 'Document title (defaults to formatted name)',
            },
            type: {
                type: 'string',
                enum: ['blog-post', 'podcast-script', 'technical-doc', 'newsletter', 'custom'],
                description: 'Document type',
            },
            base_path: {
                type: 'string',
                description: 'Base path for workspace creation (defaults to current directory)',
            },
            primary_goal: {
                type: 'string',
                description: 'Primary goal of the document',
            },
            audience: {
                type: 'string',
                description: 'Target audience description',
            },
        },
        required: ['name', 'type'],
    },
};

export async function executeCreate(args: any, context: ToolExecutionContext): Promise<ToolResult> {
    return executeCommand(
        args,
        context,
        async () => {
            const { join, resolve } = await import('node:path');
            const basePath = args.base_path || process.cwd();
            const workspacePath = resolve(join(basePath, args.name));
            
            // Generate title if not provided
            const title = args.title || args.name
                .split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            
            await createWorkspace({
                path: workspacePath,
                id: args.name,
                title,
                type: args.type,
                objectives: {
                    primaryGoal: args.primary_goal || '',
                    secondaryGoals: [],
                    keyTakeaways: [],
                },
            });
            
            return {
                workspacePath,
                name: args.name,
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
}
