/**
 * Status Tool
 */

 
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { loadDocument } from '../../workspace/loader.js';
import { executeCommand } from './shared.js';
 

export const statusTool: McpTool = {
    name: 'riotdoc_status',
    description:
        'Get document status and metadata. ' +
        'Returns information about the document including title, type, status, dates, and word count target.',
    inputSchema: {
        type: 'object',
        properties: {
            path: {
                type: 'string',
                description: 'Path to document workspace (defaults to current directory)',
            },
        },
    },
};

export async function executeStatus(args: any, context: ToolExecutionContext): Promise<ToolResult> {
    return executeCommand(
        args,
        context,
        async () => {
            const workspacePath = args.path || process.cwd();
            const doc = await loadDocument(workspacePath);
            
            if (!doc) {
                throw new Error('Not a RiotDoc workspace');
            }
            
            return {
                path: workspacePath,
                title: doc.config.title,
                type: doc.config.type,
                status: doc.config.status,
                createdAt: doc.config.createdAt.toISOString(),
                updatedAt: doc.config.updatedAt.toISOString(),
                targetWordCount: doc.config.targetWordCount,
                audience: doc.config.audience,
                draftCount: doc.drafts.length,
                evidenceCount: doc.evidence.length,
            };
        }
    );
}
