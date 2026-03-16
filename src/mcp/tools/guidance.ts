/**
 * Guidance Source Tools
 *
 * MCP tools for managing external guidance sources that provide context
 * for content generation (analysis files, research, legal notes, etc.).
 */

import { z } from "zod";
import { join, resolve } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { stringify } from "yaml";
import type { McpTool, ToolResult, ToolExecutionContext } from "../types.js";
import { executeCommand } from "./shared.js";
import { GuidanceCategorySchema } from "../../types/guidance.js";
import type { GuidanceConfig } from "../../types/guidance.js";
import {
    loadGuidanceConfig,
    resolveGuidanceSource,
    resolveAllGuidanceSources,
} from "../../guidance/loader.js";

const GUIDANCE_CONFIG = "context/guidance.yaml";

async function readOrCreateGuidanceConfig(
    configPath: string,
): Promise<GuidanceConfig> {
    try {
        return await loadGuidanceConfig(configPath);
    } catch {
        return { sources: [] };
    }
}

export const guidanceAddTool: McpTool = {
    name: "riotdoc_guidance_add",
    description:
        "Add an external guidance source to the project. " +
        "Guidance sources point to files or directories that provide context for content generation " +
        "(analysis, research, legal, production notes, style guides, etc.).",
    schema: {
        path: z
            .string()
            .optional()
            .describe(
                "Path to document workspace (defaults to current directory)",
            ),
        id: z.string().describe("Unique identifier for this guidance source"),
        label: z.string().describe("Human-readable label"),
        type: z
            .enum(["directory", "file"])
            .describe("Whether this points to a directory or a single file"),
        source_path: z
            .string()
            .describe(
                "Path to the source (absolute or relative to project root)",
            ),
        pattern: z
            .string()
            .optional()
            .describe(
                "Glob pattern when type is 'directory' (e.g., 'hn-*.md')",
            ),
        category: GuidanceCategorySchema.optional().describe(
            "Classification of the guidance type",
        ),
        description: z
            .string()
            .optional()
            .describe("What this guidance source provides"),
    },
    async execute(
        args: Record<string, unknown>,
        context: ToolExecutionContext,
    ): Promise<ToolResult> {
        return executeCommand(args, context, async () => {
            const workspacePath = resolve(
                (args.path as string) || process.cwd(),
            );
            const configPath = join(workspacePath, GUIDANCE_CONFIG);

            const config = await readOrCreateGuidanceConfig(configPath);

            const existingIndex = config.sources.findIndex(
                (s) => s.id === args.id,
            );
            if (existingIndex !== -1) {
                throw new Error(
                    `Guidance source with id "${args.id}" already exists. Remove it first or use a different id.`,
                );
            }

            const newSource: Record<string, unknown> = {
                id: args.id as string,
                label: args.label as string,
                type: args.type as string,
                path: args.source_path as string,
            };
            if (args.pattern) newSource.pattern = args.pattern;
            if (args.category) newSource.category = args.category;
            if (args.description) newSource.description = args.description;

            config.sources.push(newSource as any);

            await mkdir(join(workspacePath, "context"), { recursive: true });
            await writeFile(configPath, stringify(config), "utf-8");

            return {
                path: workspacePath,
                configFile: configPath,
                added: newSource,
                totalSources: config.sources.length,
            };
        });
    },
};

export const guidanceListTool: McpTool = {
    name: "riotdoc_guidance_list",
    description:
        "List all guidance sources configured for the current project. " +
        "Shows each source's metadata and resolved file counts with token estimates.",
    schema: {
        path: z
            .string()
            .optional()
            .describe(
                "Path to document workspace (defaults to current directory)",
            ),
    },
    async execute(
        args: Record<string, unknown>,
        context: ToolExecutionContext,
    ): Promise<ToolResult> {
        return executeCommand(args, context, async () => {
            const workspacePath = resolve(
                (args.path as string) || process.cwd(),
            );
            const configPath = join(workspacePath, GUIDANCE_CONFIG);

            const resolved = await resolveAllGuidanceSources(
                configPath,
                workspacePath,
            );

            return {
                path: workspacePath,
                sources: resolved.map((s) => ({
                    id: s.id,
                    label: s.label,
                    category: s.category,
                    fileCount: s.files.length,
                    totalTokenEstimate: s.totalTokenEstimate,
                    files: s.files.map((f) => f.path),
                })),
                totalSources: resolved.length,
                totalTokenEstimate: resolved.reduce(
                    (sum, s) => sum + s.totalTokenEstimate,
                    0,
                ),
            };
        });
    },
};

export const guidanceReadTool: McpTool = {
    name: "riotdoc_guidance_read",
    description:
        "Read content from a specific guidance source. " +
        "Returns the resolved file contents for the given source ID.",
    schema: {
        path: z
            .string()
            .optional()
            .describe(
                "Path to document workspace (defaults to current directory)",
            ),
        source_id: z.string().describe("ID of the guidance source to read"),
        max_files: z
            .number()
            .optional()
            .describe(
                "Maximum number of files to return (useful for large directories)",
            ),
    },
    async execute(
        args: Record<string, unknown>,
        context: ToolExecutionContext,
    ): Promise<ToolResult> {
        return executeCommand(args, context, async () => {
            const workspacePath = resolve(
                (args.path as string) || process.cwd(),
            );
            const configPath = join(workspacePath, GUIDANCE_CONFIG);

            const config = await loadGuidanceConfig(configPath);
            const source = config.sources.find(
                (s) => s.id === (args.source_id as string),
            );
            if (!source) {
                throw new Error(
                    `Guidance source "${args.source_id}" not found. Use riotdoc_guidance_list to see available sources.`,
                );
            }

            const resolved = await resolveGuidanceSource(
                source,
                workspacePath,
            );

            const maxFiles = args.max_files as number | undefined;
            const files =
                maxFiles && maxFiles > 0
                    ? resolved.files.slice(0, maxFiles)
                    : resolved.files;

            return {
                path: workspacePath,
                source: {
                    id: resolved.id,
                    label: resolved.label,
                    category: resolved.category,
                },
                files: files.map((f) => ({
                    path: f.path,
                    content: f.content,
                    tokenEstimate: Math.ceil(f.content.length / 4),
                })),
                totalFiles: resolved.files.length,
                returnedFiles: files.length,
                totalTokenEstimate: resolved.totalTokenEstimate,
            };
        });
    },
};
