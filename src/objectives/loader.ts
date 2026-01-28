import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { RIOTDOC_STRUCTURE } from "../constants.js";
import type { DocumentObjectives } from "../types.js";

/**
 * Load objectives from workspace
 */
export async function loadObjectives(workspacePath: string): Promise<DocumentObjectives> {
    const objectivesPath = join(workspacePath, RIOTDOC_STRUCTURE.objectivesFile);
    
    try {
        const content = await readFile(objectivesPath, "utf-8");
        return parseObjectivesMarkdown(content);
    } catch {
        return {
            primaryGoal: "",
            secondaryGoals: [],
            keyTakeaways: [],
        };
    }
}

/**
 * Parse objectives markdown
 */
function parseObjectivesMarkdown(content: string): DocumentObjectives {
    const objectives: DocumentObjectives = {
        primaryGoal: "",
        secondaryGoals: [],
        keyTakeaways: [],
    };
    
    // Extract primary goal
    const goalMatch = content.match(/##\s*Primary\s+Goal\s*\n+([^\n#]+)/i);
    if (goalMatch) {
        objectives.primaryGoal = goalMatch[1].trim().replace(/^_|_$/g, "");
    }
    
    // Extract secondary goals
    // Use line-by-line parsing to avoid polynomial regex
    const lines = content.split('\n');
    const secondaryLines: string[] = [];
    let inSecondary = false;
    
    for (const line of lines) {
        if (/^##\s*Secondary\s+Goals$/i.test(line)) {
            inSecondary = true;
            continue;
        }
        if (inSecondary && /^##/.test(line)) {
            break;
        }
        if (inSecondary) {
            secondaryLines.push(line);
        }
    }
    
    if (secondaryLines.length > 0) {
        const sectionContent = secondaryLines.join('\n');
        const goals = sectionContent.matchAll(/^[-*]\s+(.+)$/gm);
        for (const goal of goals) {
            const text = goal[1].trim().replace(/^_|_$/g, "");
            if (text && !text.startsWith("Add")) {
                objectives.secondaryGoals.push(text);
            }
        }
    }
    
    // Extract key takeaways
    // Use line-by-line parsing to avoid polynomial regex
    const takeawayLines: string[] = [];
    let inTakeaways = false;
    
    for (const line of lines) {
        if (/^##\s*Key\s+Takeaways$/i.test(line)) {
            inTakeaways = true;
            continue;
        }
        if (inTakeaways && /^##/.test(line)) {
            break;
        }
        if (inTakeaways) {
            takeawayLines.push(line);
        }
    }
    
    if (takeawayLines.length > 0) {
        const sectionContent = takeawayLines.join('\n');
        const takeaways = sectionContent.matchAll(/^\d+\.\s+(.+)$/gm);
        for (const takeaway of takeaways) {
            const text = takeaway[1].trim().replace(/^_|_$/g, "");
            if (text && !text.startsWith("Define")) {
                objectives.keyTakeaways.push(text);
            }
        }
    }
    
    // Extract call to action
    const ctaMatch = content.match(/##\s*Call\s+to\s+Action\s*\n+([^\n#]+)/i);
    if (ctaMatch) {
        const cta = ctaMatch[1].trim().replace(/^_|_$/g, "");
        if (cta && !cta.startsWith("What")) {
            objectives.callToAction = cta;
        }
    }
    
    // Extract emotional arc
    const arcMatch = content.match(/##\s*Emotional\s+Arc\s*\n+([^\n#]+)/i);
    if (arcMatch) {
        const arc = arcMatch[1].trim().replace(/^_|_$/g, "");
        if (arc && !arc.startsWith("Describe")) {
            objectives.emotionalArc = arc;
        }
    }
    
    return objectives;
}
