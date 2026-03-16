#!/usr/bin/env node
/**
 * RiotDoc MCP Server
 *
 * Architecture aligned with RiotPlan MCP patterns:
 * - Tools registered by iterating the tools array (Map-based dispatch)
 * - Resources registered by iterating the resources array
 * - Prompts registered by iterating the prompts array
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { tools, executeTool } from "./tools/index.js";
import { resources, readResource } from "./resources/index.js";
import { prompts, getPrompt } from "./prompts/index.js";

export function removeUndefinedValues(obj: unknown): unknown {
    if (obj === undefined) return undefined;
    if (obj === null) return null;
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedValues).filter(item => item !== undefined);
    }
    if (typeof obj === "object") {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
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
    const server = new McpServer(
        { name: "riotdoc", version: "1.0.0" },
        {
            capabilities: {
                tools: {},
                resources: { subscribe: false, listChanged: false },
                prompts: { listChanged: false },
            },
        }
    );

    // ========================================================================
    // Register Tools from registry
    // ========================================================================
    for (const tool of tools) {
        server.tool(
            tool.name,
            tool.description,
            tool.schema,
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
                        if (notification.method === "notifications/progress" && _meta?.progressToken) {
                            const params: Record<string, unknown> = {
                                progressToken: _meta.progressToken,
                                progress: notification.params.progress,
                            };
                            if (notification.params.total !== undefined) params.total = notification.params.total;
                            if (notification.params.message !== undefined) params.message = notification.params.message;
                            await (sendNotification as (n: unknown) => Promise<void>)({
                                method: "notifications/progress",
                                params: removeUndefinedValues(params) as Record<string, unknown>,
                            });
                        }
                    },
                    progressToken: _meta?.progressToken,
                };

                const result = await executeTool(tool.name, args as Record<string, unknown>, context);

                if (result.success) {
                    const content: Array<{ type: "text"; text: string }> = [];
                    if (result.logs && result.logs.length > 0) {
                        content.push({
                            type: "text" as const,
                            text: "=== Command Output ===\n" + result.logs.join("\n") + "\n\n=== Result ===",
                        });
                    }
                    content.push({
                        type: "text" as const,
                        text: JSON.stringify(removeUndefinedValues(result.data), null, 2),
                    });
                    return { content };
                } else {
                    const errorParts: string[] = [];
                    if (result.logs && result.logs.length > 0) {
                        errorParts.push("=== Command Output ===", result.logs.join("\n"), "\n=== Error ===");
                    }
                    errorParts.push(result.error || "Unknown error");
                    if (result.context && typeof result.context === "object") {
                        errorParts.push("\n=== Context ===");
                        for (const [key, value] of Object.entries(result.context)) {
                            if (value !== undefined && value !== null) errorParts.push(`${key}: ${String(value)}`);
                        }
                    }
                    if (result.recovery && result.recovery.length > 0) {
                        errorParts.push("\n=== Recovery Steps ===");
                        errorParts.push(...result.recovery.map((step, i) => `${i + 1}. ${step}`));
                    }
                    return {
                        content: [{ type: "text" as const, text: errorParts.join("\n") }],
                        isError: true,
                    };
                }
            }
        );
    }

    // ========================================================================
    // Register Resources from registry
    // ========================================================================
    for (const resource of resources) {
        server.resource(
            resource.name,
            resource.uri,
            { description: resource.description || "" },
            async () => {
                const data = await readResource(resource.uri);
                return {
                    contents: [{
                        uri: resource.uri,
                        mimeType: resource.mimeType || "application/json",
                        text: JSON.stringify(data, null, 2),
                    }],
                };
            }
        );
    }

    // ========================================================================
    // Register Prompts from registry
    // ========================================================================
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
            async (args) => {
                const argsRecord: Record<string, string> = {};
                for (const [key, value] of Object.entries(args)) {
                    if (typeof value === "string") argsRecord[key] = value;
                }
                const messages = await getPrompt(prompt.name, argsRecord);
                return {
                    messages: messages.map(msg => {
                        if (msg.content.type === "text") {
                            return {
                                role: msg.role,
                                content: { type: "text" as const, text: msg.content.text || "" },
                            };
                        }
                        return msg as ReturnType<typeof msg.content.type extends "text" ? never : never>;
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

main().catch((error) => {
    process.stderr.write(`MCP Server error: ${error}\n`);
    process.exit(1);
});
