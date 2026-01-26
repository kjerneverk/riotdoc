import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { RIOTDOC_STRUCTURE } from "../constants.js";
import type { DocumentObjectives, VoiceConfig } from "../types.js";

export interface OutlineSection {
    title: string;
    points: string[];
    subsections?: OutlineSection[];
}

export interface Outline {
    title: string;
    hook: string;
    sections: OutlineSection[];
    conclusion: string;
}

/**
 * Load outline from workspace
 */
export async function loadOutline(workspacePath: string): Promise<string> {
    const outlinePath = join(workspacePath, RIOTDOC_STRUCTURE.outlineFile);
    return await readFile(outlinePath, "utf-8");
}

/**
 * Save outline to workspace
 */
export async function saveOutline(workspacePath: string, content: string): Promise<void> {
    const outlinePath = join(workspacePath, RIOTDOC_STRUCTURE.outlineFile);
    await writeFile(outlinePath, content, "utf-8");
}

/**
 * Build prompt for outline generation
 */
export function buildOutlinePrompt(
    objectives: DocumentObjectives,
    voice: VoiceConfig,
    documentType: string
): string {
    return `Generate an outline for a ${documentType}.

## Objectives

Primary Goal: ${objectives.primaryGoal}

Secondary Goals:
${objectives.secondaryGoals.map(g => `- ${g}`).join("\n")}

Key Takeaways:
${objectives.keyTakeaways.map(t => `- ${t}`).join("\n")}

${objectives.emotionalArc ? `Emotional Arc: ${objectives.emotionalArc}` : ""}

## Voice & Tone

Tone: ${voice.tone}
Point of View: ${voice.pointOfView}

## Output Format

Create a markdown outline with:
1. A compelling hook/introduction
2. 3-5 main sections with bullet points
3. A conclusion with call to action

Use ## for main sections, ### for subsections, and - for bullet points.
`;
}

/**
 * Parse outline markdown into structure
 */
export function parseOutline(content: string): Outline {
    const lines = content.split("\n");
    const outline: Outline = {
        title: "",
        hook: "",
        sections: [],
        conclusion: "",
    };
    
    let currentSection: OutlineSection | null = null;
    let inIntro = false;
    let inConclusion = false;
    
    for (const line of lines) {
        // Title
        if (line.startsWith("# ")) {
            outline.title = line.slice(2).trim();
            continue;
        }
        
        // Main section
        if (line.startsWith("## ")) {
            const title = line.slice(3).trim().toLowerCase();
            if (title.includes("intro") || title.includes("hook")) {
                inIntro = true;
                inConclusion = false;
                currentSection = null;
            } else if (title.includes("conclusion")) {
                inIntro = false;
                inConclusion = true;
                currentSection = null;
            } else {
                inIntro = false;
                inConclusion = false;
                currentSection = { title: line.slice(3).trim(), points: [] };
                outline.sections.push(currentSection);
            }
            continue;
        }
        
        // Bullet point
        if (line.match(/^[-*]\s+/)) {
            const point = line.replace(/^[-*]\s+/, "").trim();
            if (inIntro) {
                outline.hook += (outline.hook ? "\n" : "") + point;
            } else if (inConclusion) {
                outline.conclusion += (outline.conclusion ? "\n" : "") + point;
            } else if (currentSection) {
                currentSection.points.push(point);
            }
        }
    }
    
    return outline;
}

/**
 * Format outline structure as markdown
 */
export function formatOutline(outline: Outline): string {
    const parts: string[] = [];
    
    parts.push(`# ${outline.title}\n`);
    
    if (outline.hook) {
        parts.push(`## Introduction\n`);
        parts.push(outline.hook.split("\n").map(p => `- ${p}`).join("\n"));
        parts.push("");
    }
    
    for (const section of outline.sections) {
        parts.push(`## ${section.title}\n`);
        parts.push(section.points.map(p => `- ${p}`).join("\n"));
        parts.push("");
    }
    
    if (outline.conclusion) {
        parts.push(`## Conclusion\n`);
        parts.push(outline.conclusion.split("\n").map(p => `- ${p}`).join("\n"));
    }
    
    return parts.join("\n");
}
