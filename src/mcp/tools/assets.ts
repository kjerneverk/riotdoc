/**
 * Asset Management Tools
 */

import { z } from 'zod';
import { resolve, join } from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { executeCommand } from './shared.js';
import { loadAssetManifest, registerAsset, saveAssetManifest } from '../../assets/manager.js';

export const assetRegisterTool: McpTool = {
    name: 'riotdoc_asset_register',
    description:
        'Register an asset (image, diagram, chart, etc.) in the project manifest. ' +
        'Updates existing assets if the id already exists.',
    schema: {
        id: z.string().describe('Unique identifier for this asset'),
        filename: z.string().describe('Filename within the assets directory'),
        type: z.enum(['image', 'diagram', 'chart', 'video', 'audio', 'other']).describe('Asset type'),
        prompt_file: z.string().optional().describe('Path to the generation prompt file relative to assets/prompts/'),
        generated_with: z.string().optional().describe('Tool used to generate (e.g., "chatgpt-4", "midjourney")'),
        tags: z.array(z.string()).optional().describe('Tags for organization and filtering'),
        linked_document: z.string().optional().describe('Which document/chapter/section this asset belongs to'),
        description: z.string().optional().describe('Brief description of the asset'),
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const assetsDir = join(workspacePath, 'assets');
                await mkdir(assetsDir, { recursive: true });

                const manifest = await registerAsset(workspacePath, {
                    id: args.id as string,
                    filename: args.filename as string,
                    type: args.type as 'image' | 'diagram' | 'chart' | 'video' | 'audio' | 'other',
                    promptFile: args.prompt_file as string | undefined,
                    generatedWith: args.generated_with as string | undefined,
                    tags: args.tags as string[] | undefined,
                    linkedDocument: args.linked_document as string | undefined,
                    description: args.description as string | undefined,
                });

                return {
                    path: workspacePath,
                    assetId: args.id,
                    totalAssets: manifest.assets.length,
                };
            },
            (result) => ({
                ...result,
                message: `Asset "${result.assetId}" registered (${result.totalAssets} total assets)`,
            }),
        );
    },
};

export const assetListTool: McpTool = {
    name: 'riotdoc_asset_list',
    description:
        'List all registered assets in the project manifest. ' +
        'Optionally filter by type or linked document.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        type: z.enum(['image', 'diagram', 'chart', 'video', 'audio', 'other']).optional().describe('Filter by asset type'),
        document: z.string().optional().describe('Filter by linked document'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const manifest = await loadAssetManifest(workspacePath);

                let assets = manifest.assets;
                if (args.type) {
                    assets = assets.filter(a => a.type === args.type);
                }
                if (args.document) {
                    assets = assets.filter(a => a.linkedDocument === args.document);
                }

                return {
                    path: workspacePath,
                    totalAssets: manifest.assets.length,
                    filteredCount: assets.length,
                    assets,
                };
            },
        );
    },
};

export const assetPromptTool: McpTool = {
    name: 'riotdoc_asset_prompt',
    description:
        'Get or set the generation prompt for an asset. ' +
        'If prompt content is provided, saves it; otherwise returns the existing prompt.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        asset_id: z.string().describe('ID of the asset'),
        prompt: z.string().optional().describe('Prompt content to save (omit to read existing prompt)'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const manifest = await loadAssetManifest(workspacePath);
                const asset = manifest.assets.find(a => a.id === args.asset_id);

                if (!asset) {
                    throw new Error(`Asset not found: ${args.asset_id}`);
                }

                const promptsDir = join(workspacePath, 'assets', 'prompts');
                const promptFile = asset.promptFile || `${asset.id}.md`;
                const promptPath = join(promptsDir, promptFile);

                if (args.prompt) {
                    await mkdir(promptsDir, { recursive: true });
                    await writeFile(promptPath, args.prompt as string, 'utf-8');

                    if (!asset.promptFile) {
                        asset.promptFile = promptFile;
                        await saveAssetManifest(workspacePath, manifest);
                    }

                    return {
                        path: workspacePath,
                        assetId: args.asset_id,
                        promptFile,
                        action: 'saved',
                    };
                }

                try {
                    const content = await readFile(promptPath, 'utf-8');
                    return {
                        path: workspacePath,
                        assetId: args.asset_id,
                        promptFile,
                        prompt: content,
                    };
                } catch {
                    return {
                        path: workspacePath,
                        assetId: args.asset_id,
                        promptFile,
                        prompt: null,
                        note: 'No prompt file found for this asset',
                    };
                }
            },
        );
    },
};
