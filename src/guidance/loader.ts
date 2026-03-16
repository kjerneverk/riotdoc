/**
 * Guidance Source Loader
 *
 * Resolves guidance sources declared in guidance.yaml into loaded file content.
 * Guidance sources point to external files/directories that provide context
 * for content generation (analysis, research, legal, production notes, etc.).
 */

import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parse } from "yaml";
import { GuidanceConfigSchema } from "../types/guidance.js";
import type {
    GuidanceSource,
    GuidanceConfig,
    ResolvedGuidanceSource,
} from "../types/guidance.js";

const READABLE_EXTENSIONS = new Set([".md", ".json", ".txt", ".yaml", ".yml"]);

function matchPattern(filename: string, pattern: string): boolean {
    const regex = new RegExp(
        "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
    );
    return regex.test(filename);
}

function hasReadableExtension(filename: string): boolean {
    return [...READABLE_EXTENSIONS].some((ext) => filename.endsWith(ext));
}

export async function loadGuidanceConfig(
    configPath: string,
): Promise<GuidanceConfig> {
    const content = await readFile(configPath, "utf-8");
    const raw = parse(content);
    return GuidanceConfigSchema.parse(raw);
}

export async function resolveGuidanceSource(
    source: GuidanceSource,
    projectRoot: string,
): Promise<ResolvedGuidanceSource> {
    const resolvedPath = resolve(projectRoot, source.path);
    const files: Array<{ path: string; content: string }> = [];

    if (source.type === "file") {
        try {
            const content = await readFile(resolvedPath, "utf-8");
            files.push({ path: resolvedPath, content });
        } catch {
            // file doesn't exist or unreadable — return empty
        }
    } else if (source.type === "directory") {
        try {
            const entries = await readdir(resolvedPath);
            for (const entry of entries.sort()) {
                if (source.pattern && !matchPattern(entry, source.pattern))
                    continue;
                if (!hasReadableExtension(entry)) continue;
                try {
                    const content = await readFile(
                        join(resolvedPath, entry),
                        "utf-8",
                    );
                    files.push({ path: join(resolvedPath, entry), content });
                } catch {
                    /* skip unreadable files */
                }
            }
        } catch {
            // directory doesn't exist
        }
    }

    const totalTokenEstimate = files.reduce(
        (sum, f) => sum + Math.ceil(f.content.length / 4),
        0,
    );

    return {
        id: source.id,
        label: source.label,
        category: source.category,
        files,
        totalTokenEstimate,
    };
}

export async function resolveAllGuidanceSources(
    configPath: string,
    projectRoot: string,
): Promise<ResolvedGuidanceSource[]> {
    try {
        const config = await loadGuidanceConfig(configPath);
        return await Promise.all(
            config.sources.map((s) => resolveGuidanceSource(s, projectRoot)),
        );
    } catch {
        return [];
    }
}
