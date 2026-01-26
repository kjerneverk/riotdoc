import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { RIOTDOC_STRUCTURE } from "../constants.js";
import type { VoiceConfig } from "../types.js";

/**
 * Load voice configuration from a document workspace
 */
export async function loadVoice(workspacePath: string): Promise<VoiceConfig> {
    const voiceDir = join(workspacePath, RIOTDOC_STRUCTURE.voiceDir);
    
    // Load tone.md
    const tone = await loadToneFile(voiceDir);
    
    // Load style-rules.md
    const styleRules = await loadStyleRulesFile(voiceDir);
    
    return {
        tone: tone.tone,
        pointOfView: tone.pointOfView,
        styleNotes: styleRules.do,
        avoid: styleRules.dont,
        examplePhrases: tone.examplePhrases,
    };
}

/**
 * Parse tone.md file
 */
async function loadToneFile(voiceDir: string): Promise<{
    tone: string;
    pointOfView: "first" | "second" | "third";
    examplePhrases?: string[];
}> {
    const tonePath = join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone);
    
    try {
        const content = await readFile(tonePath, "utf-8");
        return parseToneMarkdown(content);
    } catch {
        return {
            tone: "conversational",
            pointOfView: "first",
        };
    }
}

/**
 * Parse tone markdown content
 */
export function parseToneMarkdown(content: string): {
    tone: string;
    pointOfView: "first" | "second" | "third";
    examplePhrases?: string[];
} {
    // Extract tone from ## Overall Tone section
    const toneMatch = content.match(/##\s*Overall\s+Tone\s*\n+([^\n#]+)/i);
    const tone = toneMatch ? toneMatch[1].trim() : "conversational";
    
    // Extract point of view
    let pointOfView: "first" | "second" | "third" = "first";
    if (content.includes("Second person") || content.includes("second person")) {
        pointOfView = "second";
    } else if (content.includes("Third person") || content.includes("third person")) {
        pointOfView = "third";
    }
    
    // Extract example phrases (quoted lines starting with >)
    const examplePhrases: string[] = [];
    const quoteMatches = content.matchAll(/>\s*"([^"]+)"/g);
    for (const match of quoteMatches) {
        examplePhrases.push(match[1]);
    }
    
    return {
        tone,
        pointOfView,
        examplePhrases: examplePhrases.length > 0 ? examplePhrases : undefined,
    };
}

/**
 * Parse style-rules.md file
 */
async function loadStyleRulesFile(voiceDir: string): Promise<{
    do: string[];
    dont: string[];
}> {
    const rulesPath = join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.styleRules);
    
    try {
        const content = await readFile(rulesPath, "utf-8");
        return parseStyleRulesMarkdown(content);
    } catch {
        return { do: [], dont: [] };
    }
}

/**
 * Parse style rules markdown
 */
export function parseStyleRulesMarkdown(content: string): {
    do: string[];
    dont: string[];
} {
    const doItems: string[] = [];
    const dontItems: string[] = [];
    
    // Find ## Do section
    const doMatch = content.match(/##\s*Do\s*\n([\s\S]*?)(?=\n##|$)/i);
    if (doMatch) {
        const items = doMatch[1].matchAll(/^[-*]\s+(.+)$/gm);
        for (const item of items) {
            doItems.push(item[1].trim());
        }
    }
    
    // Find ## Don't section
    const dontMatch = content.match(/##\s*Don'?t\s*\n([\s\S]*?)(?=\n##|$)/i);
    if (dontMatch) {
        const items = dontMatch[1].matchAll(/^[-*]\s+(.+)$/gm);
        for (const item of items) {
            dontItems.push(item[1].trim());
        }
    }
    
    return { do: doItems, dont: dontItems };
}

/**
 * Load glossary from workspace
 */
export async function loadGlossary(workspacePath: string): Promise<Map<string, string>> {
    const glossaryPath = join(
        workspacePath,
        RIOTDOC_STRUCTURE.voiceDir,
        RIOTDOC_STRUCTURE.voiceFiles.glossary
    );
    
    const glossary = new Map<string, string>();
    
    try {
        const content = await readFile(glossaryPath, "utf-8");
        
        // Parse table rows: | term | spelling/usage |
        const tableRows = content.matchAll(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
        for (const row of tableRows) {
            const term = row[1].trim();
            const usage = row[2].trim();
            if (term && usage && !term.startsWith("-") && term !== "Term") {
                glossary.set(term.toLowerCase(), usage);
            }
        }
    } catch {
        // No glossary file
    }
    
    return glossary;
}

/**
 * Check if voice configuration exists
 */
export async function hasVoiceConfig(workspacePath: string): Promise<boolean> {
    const tonePath = join(
        workspacePath,
        RIOTDOC_STRUCTURE.voiceDir,
        RIOTDOC_STRUCTURE.voiceFiles.tone
    );
    
    try {
        await stat(tonePath);
        return true;
    } catch {
        return false;
    }
}
