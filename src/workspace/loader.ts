import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { RIOTDOC_STRUCTURE } from "../constants.js";
import type { RiotDoc, DocumentConfig } from "../types.js";

/**
 * Load document from workspace
 */
export async function loadDocument(workspacePath: string): Promise<RiotDoc | null> {
    try {
        const configPath = join(workspacePath, RIOTDOC_STRUCTURE.configFile);
        const content = await readFile(configPath, "utf-8");
        const config = parse(content) as DocumentConfig;
        
        // Convert date strings to Date objects
        config.createdAt = new Date(config.createdAt);
        config.updatedAt = new Date(config.updatedAt);
        
        return {
            config,
            voice: { tone: "", pointOfView: "first", styleNotes: [], avoid: [] },
            objectives: { primaryGoal: "", secondaryGoals: [], keyTakeaways: [] },
            evidence: [],
            drafts: [],
            revisions: [],
            workspacePath,
        };
    } catch {
        return null;
    }
}

/**
 * Check if path is a RiotDoc workspace
 */
export async function isRiotDocWorkspace(path: string): Promise<boolean> {
    try {
        const configPath = join(path, RIOTDOC_STRUCTURE.configFile);
        await stat(configPath);
        return true;
    } catch {
        return false;
    }
}
