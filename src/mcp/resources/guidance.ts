/**
 * Guidance Resource Handler
 *
 * Provides resolved guidance sources via MCP resources.
 */

import { join } from "node:path";
import type { RiotdocUri } from "../types.js";
import { resolveAllGuidanceSources } from "../../guidance/loader.js";

const GUIDANCE_CONFIG = "context/guidance.yaml";

/**
 * Read all resolved guidance sources for a project path.
 * Returns source metadata and token estimates (not full file contents).
 */
export async function readGuidanceResource(uri: RiotdocUri) {
    const directory = uri.path || process.cwd();
    const configPath = join(directory, GUIDANCE_CONFIG);

    const resolved = await resolveAllGuidanceSources(configPath, directory);

    return {
        path: directory,
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
}
