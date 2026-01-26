import type { VoiceConfig } from "../types.js";

/**
 * Build a prompt section describing the voice/tone
 */
export function buildVoicePrompt(voice: VoiceConfig): string {
    const sections: string[] = [];
    
    sections.push(`## Writing Voice\n`);
    sections.push(`Tone: ${voice.tone}`);
    sections.push(`Point of view: ${formatPointOfView(voice.pointOfView)}`);
    
    if (voice.styleNotes.length > 0) {
        sections.push(`\n### Style Guidelines\n`);
        sections.push(`Do:\n${voice.styleNotes.map(n => `- ${n}`).join("\n")}`);
    }
    
    if (voice.avoid.length > 0) {
        sections.push(`\nAvoid:\n${voice.avoid.map(a => `- ${a}`).join("\n")}`);
    }
    
    if (voice.examplePhrases && voice.examplePhrases.length > 0) {
        sections.push(`\n### Example Phrases\n`);
        sections.push(voice.examplePhrases.map(p => `"${p}"`).join("\n"));
    }
    
    return sections.join("\n");
}

function formatPointOfView(pov: "first" | "second" | "third"): string {
    switch (pov) {
        case "first": return "First person (I, we)";
        case "second": return "Second person (you)";
        case "third": return "Third person (they, it)";
    }
}
