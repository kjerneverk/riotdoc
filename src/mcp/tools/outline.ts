/**
 * Outline Tool
 */

 
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { loadOutline, buildOutlinePrompt } from '../../outline/generator.js';
import { loadDocument } from '../../workspace/loader.js';
import { loadVoice } from '../../voice/loader.js';
import { loadObjectives } from '../../objectives/loader.js';
import { executeCommand } from './shared.js';
 

export const outlineTool: McpTool = {
    name: 'riotdoc_outline',
    description:
        'Generate or retrieve document outline. ' +
        'Can generate a new outline with AI assistance or return the existing outline. ' +
        'The outline provides the structural framework for the document.',
    inputSchema: {
        type: 'object',
        properties: {
            path: {
                type: 'string',
                description: 'Path to document workspace (defaults to current directory)',
            },
            generate: {
                type: 'boolean',
                description: 'Generate new outline with AI (default: false, just returns existing)',
            },
        },
    },
};

export async function executeOutline(args: any, context: ToolExecutionContext): Promise<ToolResult> {
    return executeCommand(
        args,
        context,
        async () => {
            const workspacePath = args.path || process.cwd();
            
            // Load document state
            const doc = await loadDocument(workspacePath);
            if (!doc) {
                throw new Error('Not a RiotDoc workspace');
            }
            
            if (args.generate) {
                // Generate outline prompt
                const voice = await loadVoice(workspacePath);
                const objectives = await loadObjectives(workspacePath);
                const prompt = buildOutlinePrompt(objectives, voice, doc.config.type);
                
                return {
                    action: 'generate',
                    prompt,
                    workspacePath,
                };
            } else {
                // Return existing outline
                const outline = await loadOutline(workspacePath);
                return {
                    action: 'read',
                    outline,
                    workspacePath,
                };
            }
        },
        (result) => {
            if (result.action === 'generate') {
                return {
                    action: 'generate',
                    prompt: result.prompt,
                    path: result.workspacePath,
                    note: 'Use this prompt with an AI provider to generate the outline, then save to OUTLINE.md',
                };
            } else {
                return {
                    action: 'read',
                    outline: result.outline,
                    path: result.workspacePath,
                };
            }
        }
    );
}
