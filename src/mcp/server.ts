#!/usr/bin/env node
/**
 * RiotDoc MCP Server
 *
 * Exposes riotdoc commands, resources, and prompts via MCP.
 *
 * This server provides:
 * - Tools: Document creation and management commands
 * - Resources: Document state, configuration, and content
 * - Prompts: Workflow templates for document operations
 *
 * Uses McpServer high-level API for better progress notification support
 */

 
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { executeTool } from './tools.js';
import { getResources, readResource } from './resources/index.js';
import { getPrompts, getPrompt } from './prompts/index.js';
 

/**
 * Recursively remove undefined values from an object to prevent JSON serialization issues
 * Preserves null values as they are valid in JSON
 */
export function removeUndefinedValues(obj: any): any {
    if (obj === undefined) {
        return undefined;
    }
    if (obj === null) {
        return null;
    }
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedValues).filter(item => item !== undefined);
    }
    if (typeof obj === 'object') {
        const cleaned: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = removeUndefinedValues(value);
            if (cleanedValue !== undefined) {
                cleaned[key] = cleanedValue;
            }
        }
        return cleaned;
    }
    return obj;
}

async function main() {
    // Initialize MCP server with high-level API
    const server = new McpServer(
        {
            name: 'riotdoc',
            version: '1.0.0',
        },
        {
            capabilities: {
                tools: {},
                resources: {
                    subscribe: false,
                    listChanged: false,
                },
                prompts: {
                    listChanged: false,
                },
            },
        }
    );

    // ========================================================================
    // Tools Handlers
    // ========================================================================

    /**
     * Helper to register a tool with progress notification support
     */
    function registerTool(
        name: string,
        description: string,
        inputSchema: z.ZodRawShape
    ) {
        server.tool(
            name,
            description,
            inputSchema,
            async (args, { sendNotification, _meta }) => {
                const context = {
                    workingDirectory: process.cwd(),
                    config: undefined,
                    logger: undefined,
                    sendNotification: async (notification: {
                        method: string;
                        params: {
                            progressToken?: string | number;
                            progress: number;
                            total?: number;
                            message?: string;
                        };
                    }) => {
                        if (notification.method === 'notifications/progress' && _meta?.progressToken) {
                            const params: Record<string, any> = {
                                progressToken: _meta.progressToken,
                                progress: notification.params.progress,
                            };
                            if (notification.params.total !== undefined) {
                                params.total = notification.params.total;
                            }
                            if (notification.params.message !== undefined) {
                                params.message = notification.params.message;
                            }
                            await sendNotification({
                                method: 'notifications/progress',
                                params: removeUndefinedValues(params) as any,
                            });
                        }
                    },
                    progressToken: _meta?.progressToken,
                };

                const result = await executeTool(name, args, context);

                if (result.success) {
                    const content: Array<{ type: 'text'; text: string }> = [];

                    if (result.logs && result.logs.length > 0) {
                        content.push({
                            type: 'text' as const,
                            text: '=== Command Output ===\n' + result.logs.join('\n') + '\n\n=== Result ===',
                        });
                    }

                    const cleanData = removeUndefinedValues(result.data);
                    content.push({
                        type: 'text' as const,
                        text: JSON.stringify(cleanData, null, 2),
                    });

                    return { content };
                } else {
                    const errorParts: string[] = [];

                    if (result.logs && result.logs.length > 0) {
                        errorParts.push('=== Command Output ===');
                        errorParts.push(result.logs.join('\n'));
                        errorParts.push('\n=== Error ===');
                    }

                    errorParts.push(result.error || 'Unknown error');

                    if (result.context && typeof result.context === 'object') {
                        errorParts.push('\n=== Context ===');
                        for (const [key, value] of Object.entries(result.context)) {
                            if (value !== undefined && value !== null) {
                                errorParts.push(`${key}: ${String(value)}`);
                            }
                        }
                    }

                    if (result.recovery && result.recovery.length > 0) {
                        errorParts.push('\n=== Recovery Steps ===');
                        errorParts.push(...result.recovery.map((step, i) => `${i + 1}. ${step}`));
                    }

                    return {
                        content: [{
                            type: 'text' as const,
                            text: errorParts.join('\n'),
                        }],
                        isError: true,
                    };
                }
            }
        );
    }

    // Register all tools
    registerTool(
        'riotdoc_create',
        'Create a new document workspace with structured directories and configuration',
        {
            name: z.string(),
            title: z.string().optional(),
            type: z.enum(['blog-post', 'podcast-script', 'technical-doc', 'newsletter', 'custom']),
            base_path: z.string().optional(),
            primary_goal: z.string().optional(),
            audience: z.string().optional(),
        }
    );

    registerTool(
        'riotdoc_outline',
        'Generate or retrieve document outline',
        {
            path: z.string().optional(),
            generate: z.boolean().optional(),
        }
    );

    registerTool(
        'riotdoc_draft',
        'Create a new draft or retrieve existing drafts',
        {
            path: z.string().optional(),
            assistance_level: z.enum(['generate', 'expand', 'revise', 'cleanup', 'spellcheck']).optional(),
            draft_number: z.number().optional(),
        }
    );

    registerTool(
        'riotdoc_status',
        'Get document status and metadata',
        {
            path: z.string().optional(),
        }
    );

    registerTool(
        'riotdoc_spellcheck',
        'Run spell checking on document content',
        {
            path: z.string().optional(),
            file: z.string().optional(),
        }
    );

    registerTool(
        'riotdoc_cleanup',
        'Clean up document workspace by removing temporary files and old drafts',
        {
            path: z.string().optional(),
            keep_drafts: z.number().optional(),
            dry_run: z.boolean().optional(),
        }
    );

    registerTool(
        'riotdoc_export',
        'Export document to various formats',
        {
            path: z.string().optional(),
            format: z.enum(['html', 'pdf', 'docx', 'markdown']),
            draft: z.number().optional(),
            output: z.string().optional(),
        }
    );

    registerTool(
        'riotdoc_revise',
        'Add revision feedback to a draft',
        {
            path: z.string().optional(),
            draft: z.number().optional(),
            feedback: z.string(),
        }
    );

    // ========================================================================
    // Resources Handlers
    // ========================================================================

    const resources = getResources();
    for (const resource of resources) {
        server.resource(
            resource.name,
            resource.uri,
            {
                description: resource.description || '',
            },
            async () => {
                const data = await readResource(resource.uri);
                return {
                    contents: [{
                        uri: resource.uri,
                        mimeType: resource.mimeType || 'application/json',
                        text: JSON.stringify(data, null, 2),
                    }],
                };
            }
        );
    }

    // ========================================================================
    // Prompts Handlers
    // ========================================================================

    const prompts = getPrompts();
    for (const prompt of prompts) {
        const promptArgs: Record<string, z.ZodTypeAny> = {};
        if (prompt.arguments) {
            for (const arg of prompt.arguments) {
                promptArgs[arg.name] = arg.required ? z.string() : z.string().optional();
            }
        }
        server.prompt(
            prompt.name,
            prompt.description,
            promptArgs,
            async (args, _extra) => {
                const argsRecord: Record<string, string> = {};
                for (const [key, value] of Object.entries(args)) {
                    if (typeof value === 'string') {
                        argsRecord[key] = value;
                    }
                }
                const messages = await getPrompt(prompt.name, argsRecord);
                return {
                    messages: messages.map(msg => {
                        if (msg.content.type === 'text') {
                            return {
                                role: msg.role,
                                content: {
                                    type: 'text' as const,
                                    text: msg.content.text || '',
                                },
                            };
                        }
                        return msg as any;
                    }),
                };
            }
        );
    }

    // ========================================================================
    // Start Server
    // ========================================================================

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

// Handle errors
main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('MCP Server error:', error);
    process.exit(1);
});
