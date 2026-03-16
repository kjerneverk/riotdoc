import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { ResolvedVoiceProfile, VoiceLayerSource } from "../types/voice.js";
import {
    DEFAULT_VOICE_CONTENT,
    DEFAULT_TONE_CONTENT,
    DEFAULT_RHETORIC_CONTENT,
} from "../types/voice.js";

export interface VoiceResolutionConfig {
    projectVoiceDir: string;
    sharedProfilePath?: string;
    override: boolean;
}

async function tryReadFile(path: string): Promise<string | null> {
    try {
        await stat(path);
        return await readFile(path, "utf-8");
    } catch {
        return null;
    }
}

export async function resolveVoiceProfile(
    config: VoiceResolutionConfig
): Promise<ResolvedVoiceProfile> {
    const layers = ["voice", "tone", "rhetoric"] as const;
    const files = { voice: "voice.md", tone: "tone.md", rhetoric: "rhetoric.md" };
    const defaults = {
        voice: DEFAULT_VOICE_CONTENT,
        tone: DEFAULT_TONE_CONTENT,
        rhetoric: DEFAULT_RHETORIC_CONTENT,
    };

    const result: Record<string, string> = {};
    const sources: Record<string, VoiceLayerSource> = {};

    for (const layer of layers) {
        const projectPath = join(config.projectVoiceDir, files[layer]);
        const sharedPath = config.sharedProfilePath
            ? join(config.sharedProfilePath, files[layer])
            : null;

        const projectContent = await tryReadFile(projectPath);
        const sharedContent = sharedPath ? await tryReadFile(sharedPath) : null;

        if (config.override && projectContent) {
            result[layer] = projectContent;
            sources[layer] = "project";
        } else if (projectContent && !sharedContent) {
            result[layer] = projectContent;
            sources[layer] = "project";
        } else if (sharedContent && !projectContent) {
            result[layer] = sharedContent;
            sources[layer] = "shared";
        } else if (projectContent && sharedContent) {
            result[layer] = projectContent;
            sources[layer] = "project";
        } else {
            result[layer] = defaults[layer];
            sources[layer] = "default";
        }
    }

    return {
        voice: result.voice,
        tone: result.tone,
        rhetoric: result.rhetoric,
        sources: {
            voice: sources.voice as VoiceLayerSource,
            tone: sources.tone as VoiceLayerSource,
            rhetoric: sources.rhetoric as VoiceLayerSource,
        },
    };
}
