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
    const secondaryMatch = content.match(/##\s*Secondary\s+Goals\s*\n([\s\S]*?)(?=\n##|$)/i);
    if (secondaryMatch) {
        const goals = secondaryMatch[1].matchAll(/^[-*]\s+(.+)$/gm);
        for (const goal of goals) {
            const text = goal[1].trim().replace(/^_|_$/g, "");
            if (text && !text.startsWith("Add")) {
                objectives.secondaryGoals.push(text);
            }
        }
    }
    
    // Extract key takeaways
    const takeawaysMatch = content.match(/##\s*Key\s+Takeaways\s*\n([\s\S]*?)(?=\n##|$)/i);
    if (takeawaysMatch) {
        const takeaways = takeawaysMatch[1].matchAll(/^\d+\.\s+(.+)$/gm);
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
