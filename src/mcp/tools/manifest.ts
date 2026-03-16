import { z } from 'zod';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { executeCommand } from './shared.js';
import { loadManifest, addManifestItem, assembleFromManifest } from '../../manifest/loader.js';

export const manifestShowTool: McpTool = {
    name: 'riotdoc_manifest_show',
    description:
        'Show the current document manifest structure. ' +
        'Displays the manifest.yaml contents including parts, chapters, and assembly order.',
    schema: {
        path: z.string().optional().describe('Path to the document project root (defaults to current directory)'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const projectRoot = (args.path as string) || process.cwd();
                const manifest = await loadManifest(projectRoot);
                if (!manifest) {
                    throw new Error('No manifest.yaml found in project root');
                }
                return manifest;
            },
            (manifest) => ({
                manifest,
                summary: {
                    title: manifest.title,
                    totalParts: manifest.parts.length,
                    totalItems: manifest.parts.reduce(
                        (sum: number, p: { items: unknown[] }) => sum + p.items.length,
                        0,
                    ),
                },
            }),
        );
    },
};

export const manifestAddTool: McpTool = {
    name: 'riotdoc_manifest_add',
    description:
        'Add a section or chapter to the document manifest. ' +
        'Creates or updates manifest.yaml with a new item in the specified part.',
    schema: {
        path: z.string().optional().describe('Path to the document project root (defaults to current directory)'),
        part_index: z.number().default(0).describe('Index of the part to add to (0-based, creates parts as needed)'),
        type: z.enum(['chapter', 'frontmatter', 'backmatter', 'divider', 'section', 'post'])
            .describe('Type of manifest item to add'),
        file: z.string().describe('Relative file path for this manifest item'),
        title: z.string().optional().describe('Title for this manifest item'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const projectRoot = (args.path as string) || process.cwd();
                const partIndex = (args.part_index as number) ?? 0;
                const item = {
                    type: args.type as 'chapter' | 'frontmatter' | 'backmatter' | 'divider' | 'section' | 'post',
                    file: args.file as string,
                    title: args.title as string | undefined,
                };
                return addManifestItem(projectRoot, partIndex, item);
            },
            (manifest) => ({
                manifest,
                added: {
                    type: args.type,
                    file: args.file,
                    title: args.title,
                    partIndex: args.part_index ?? 0,
                },
            }),
        );
    },
};

export const manifestAssembleTool: McpTool = {
    name: 'riotdoc_manifest_assemble',
    description:
        'Assemble a complete document from its manifest parts. ' +
        'Reads all files referenced in manifest.yaml and concatenates them in order.',
    schema: {
        path: z.string().optional().describe('Path to the document project root (defaults to current directory)'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const projectRoot = (args.path as string) || process.cwd();
                const assembled = await assembleFromManifest(projectRoot);
                return { content: assembled, wordCount: assembled.split(/\s+/).filter(Boolean).length };
            },
            (result) => ({
                content: result.content,
                wordCount: result.wordCount,
            }),
        );
    },
};
