/**
 * Voice Profile Tools
 *
 * MCP tools for viewing and setting voice profile layers.
 */

import { z } from 'zod';
import { join, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { resolveVoiceProfile } from '../../voice/profile-loader.js';
import { executeCommand } from './shared.js';

type VoiceLayer = 'voice' | 'tone' | 'rhetoric';

const LAYER_FILES: Record<VoiceLayer, string> = {
    voice: 'voice.md',
    tone: 'tone.md',
    rhetoric: 'rhetoric.md',
};

export const voiceShowTool: McpTool = {
    name: 'riotdoc_voice_show',
    description:
        'Show the resolved voice profile for a project. ' +
        'Returns voice, tone, and rhetoric layers with source tracking (project, shared, or default).',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        layer: z.enum(['voice', 'tone', 'rhetoric']).optional().describe('Show only a specific layer'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const projectVoiceDir = join(workspacePath, 'voice');

                const profile = await resolveVoiceProfile({
                    projectVoiceDir,
                    override: false,
                });

                const layer = args.layer as VoiceLayer | undefined;

                if (layer) {
                    return {
                        path: workspacePath,
                        layer,
                        content: profile[layer],
                        source: profile.sources[layer],
                    };
                }

                return {
                    path: workspacePath,
                    voice: { content: profile.voice, source: profile.sources.voice },
                    tone: { content: profile.tone, source: profile.sources.tone },
                    rhetoric: { content: profile.rhetoric, source: profile.sources.rhetoric },
                };
            },
        );
    },
};

export const voiceSetTool: McpTool = {
    name: 'riotdoc_voice_set',
    description:
        'Set content for a specific voice layer. ' +
        'Writes the content to the appropriate file in the project voice directory.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        layer: z.enum(['voice', 'tone', 'rhetoric']).describe('Voice layer to set'),
        content: z.string().describe('Markdown content for the voice layer'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const layer = args.layer as VoiceLayer;
                const content = args.content as string;

                const voiceDir = join(workspacePath, 'voice');
                await mkdir(voiceDir, { recursive: true });

                const filePath = join(voiceDir, LAYER_FILES[layer]);
                await writeFile(filePath, content, 'utf-8');

                return {
                    path: workspacePath,
                    layer,
                    file: filePath,
                    written: true,
                };
            },
            (result) => ({
                ...result,
                message: `Voice layer "${result.layer}" written to ${result.file}`,
            }),
        );
    },
};
