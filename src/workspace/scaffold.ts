import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { stringify } from "yaml";
import type { DocumentType, ProjectConfig } from "../types/project.js";
import {
    DEFAULT_VOICE_CONTENT,
    DEFAULT_TONE_CONTENT,
    DEFAULT_RHETORIC_CONTENT,
} from "../types/voice.js";

export interface ScaffoldOptions {
    name: string;
    type: DocumentType;
    description?: string;
    voiceProfilePath?: string;
    audience?: string;
    targetWordCount?: number;
}

/**
 * Canonical directory and file names for the new RiotDoc project structure.
 */
export const PROJECT_STRUCTURE = {
    configFile: "riotdoc.yaml",
    voiceDir: "voice",
    voiceFiles: {
        voice: "voice.md",
        tone: "tone.md",
        rhetoric: "rhetoric.md",
    },
    contextDir: "context",
    guidanceFile: "guidance.yaml",
    assetsDir: "assets",
    assetsDirs: {
        images: "images",
        prompts: "prompts",
    },
    assetsFiles: {
        style: "style.md",
        manifest: "manifest.yaml",
    },
    corpusDir: "corpus",
    draftsDir: "drafts",
    outputDir: "output",
    internalDir: ".riotdoc",
    internalDirs: {
        history: "history",
        cache: "cache",
    },
} as const;

/**
 * Scaffold a new RiotDoc project with the canonical directory structure.
 *
 * Creates:
 * ```
 * root/
 *   riotdoc.yaml
 *   voice/
 *     voice.md
 *     tone.md
 *     rhetoric.md
 *   context/
 *     guidance.yaml
 *   assets/
 *     images/
 *     prompts/
 *     style.md
 *     manifest.yaml
 *   corpus/
 *   drafts/
 *   output/
 *   .riotdoc/
 *     history/
 *     cache/
 * ```
 */
export async function scaffoldProject(root: string, options: ScaffoldOptions): Promise<string> {
    await mkdir(root, { recursive: true });

    const dirs = [
        join(root, PROJECT_STRUCTURE.voiceDir),
        join(root, PROJECT_STRUCTURE.contextDir),
        join(root, PROJECT_STRUCTURE.assetsDir, PROJECT_STRUCTURE.assetsDirs.images),
        join(root, PROJECT_STRUCTURE.assetsDir, PROJECT_STRUCTURE.assetsDirs.prompts),
        join(root, PROJECT_STRUCTURE.corpusDir),
        join(root, PROJECT_STRUCTURE.draftsDir),
        join(root, PROJECT_STRUCTURE.outputDir),
        join(root, PROJECT_STRUCTURE.internalDir, PROJECT_STRUCTURE.internalDirs.history),
        join(root, PROJECT_STRUCTURE.internalDir, PROJECT_STRUCTURE.internalDirs.cache),
    ];

    await Promise.all(dirs.map(d => mkdir(d, { recursive: true })));

    const projectConfig: ProjectConfig = {
        name: options.name,
        type: options.type,
        ...(options.description && { description: options.description }),
        ...(options.voiceProfilePath && {
            voice: {
                profile: options.voiceProfilePath,
                override: false,
            },
        }),
        ...(options.audience && { audience: options.audience }),
        ...(options.targetWordCount && { targetWordCount: options.targetWordCount }),
    };

    const writes: Array<[string, string]> = [
        [join(root, PROJECT_STRUCTURE.configFile), stringify(projectConfig)],
        [join(root, PROJECT_STRUCTURE.voiceDir, PROJECT_STRUCTURE.voiceFiles.voice), DEFAULT_VOICE_CONTENT],
        [join(root, PROJECT_STRUCTURE.voiceDir, PROJECT_STRUCTURE.voiceFiles.tone), DEFAULT_TONE_CONTENT],
        [join(root, PROJECT_STRUCTURE.voiceDir, PROJECT_STRUCTURE.voiceFiles.rhetoric), DEFAULT_RHETORIC_CONTENT],
        [join(root, PROJECT_STRUCTURE.contextDir, PROJECT_STRUCTURE.guidanceFile), stringify({ sources: [] })],
        [join(root, PROJECT_STRUCTURE.assetsDir, PROJECT_STRUCTURE.assetsFiles.style), DEFAULT_ASSET_STYLE_CONTENT],
        [join(root, PROJECT_STRUCTURE.assetsDir, PROJECT_STRUCTURE.assetsFiles.manifest), stringify({ assets: [] })],
    ];

    await Promise.all(writes.map(([path, content]) => writeFile(path, content, "utf-8")));

    return root;
}

const DEFAULT_ASSET_STYLE_CONTENT = `# Global Asset Style

_Define the default visual style applied to all generated assets._

## Style Description

_e.g., "Graphite pencil sketchbook style, pure white background, hand-drawn with imperfect lines"_

## Technical Requirements

_e.g., "300 DPI, print-ready output"_

## Constraints

_e.g., "No trademarked imagery, diverse representation in human characters"_
`;

/**
 * Detect whether a directory uses the old workspace format (has riotdoc.yaml
 * but uses the legacy voice/tone.md + voice/style-rules.md + voice/glossary.md
 * structure) or the new project format (voice/voice.md + voice/tone.md + voice/rhetoric.md).
 */
export async function detectWorkspaceFormat(root: string): Promise<"legacy" | "project" | "none"> {
    try {
        await stat(join(root, PROJECT_STRUCTURE.configFile));
    } catch {
        return "none";
    }

    try {
        await stat(join(root, PROJECT_STRUCTURE.voiceDir, PROJECT_STRUCTURE.voiceFiles.rhetoric));
        return "project";
    } catch {
        // No rhetoric.md means legacy format
    }

    try {
        await stat(join(root, PROJECT_STRUCTURE.voiceDir, "style-rules.md"));
        return "legacy";
    } catch {
        return "project";
    }
}
