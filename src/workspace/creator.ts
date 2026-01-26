import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stringify } from "yaml";
import { RIOTDOC_STRUCTURE, DEFAULT_VOICE, DEFAULT_OBJECTIVES } from "../constants.js";
import type { DocumentConfig, VoiceConfig, DocumentObjectives } from "../types.js";

export interface CreateWorkspaceOptions {
    /** Workspace path */
    path: string;
    
    /** Document ID (derived from path if not provided) */
    id?: string;
    
    /** Document title */
    title: string;
    
    /** Document type */
    type: DocumentConfig["type"];
    
    /** Initial voice config (uses defaults if not provided) */
    voice?: Partial<VoiceConfig>;
    
    /** Initial objectives */
    objectives?: Partial<DocumentObjectives>;
}

/**
 * Create a new RiotDoc workspace
 */
export async function createWorkspace(options: CreateWorkspaceOptions): Promise<string> {
    const { path: workspacePath, title, type } = options;
    const id = options.id || workspacePath.split("/").pop() || "document";
    
    // Create main directory
    await mkdir(workspacePath, { recursive: true });
    
    // Create subdirectories
    await mkdir(join(workspacePath, RIOTDOC_STRUCTURE.voiceDir), { recursive: true });
    await mkdir(join(workspacePath, RIOTDOC_STRUCTURE.evidenceDir), { recursive: true });
    await mkdir(join(workspacePath, RIOTDOC_STRUCTURE.draftsDir), { recursive: true });
    await mkdir(join(workspacePath, RIOTDOC_STRUCTURE.revisionsDir), { recursive: true });
    await mkdir(join(workspacePath, RIOTDOC_STRUCTURE.exportDir), { recursive: true });
    
    // Create configuration file
    const config: DocumentConfig = {
        id,
        title,
        type,
        status: "idea",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.configFile),
        stringify(config),
        "utf-8"
    );
    
    // Create objectives file
    const objectives = { ...DEFAULT_OBJECTIVES, ...options.objectives };
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.objectivesFile),
        generateObjectivesMarkdown(title, objectives),
        "utf-8"
    );
    
    // Create outline file (placeholder)
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.outlineFile),
        generateOutlineMarkdown(title),
        "utf-8"
    );
    
    // Create voice files
    const voice = { ...DEFAULT_VOICE, ...options.voice };
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone),
        generateToneMarkdown(voice),
        "utf-8"
    );
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.styleRules),
        generateStyleRulesMarkdown(voice),
        "utf-8"
    );
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.glossary),
        generateGlossaryMarkdown(),
        "utf-8"
    );
    
    // Create evidence README
    await writeFile(
        join(workspacePath, RIOTDOC_STRUCTURE.evidenceDir, "README.md"),
        generateEvidenceReadme(),
        "utf-8"
    );
    
    return workspacePath;
}

function generateObjectivesMarkdown(title: string, objectives: DocumentObjectives): string {
    return `# ${title} - Objectives

## Primary Goal

${objectives.primaryGoal || "_Define the main purpose of this document..._"}

## Secondary Goals

${objectives.secondaryGoals.length > 0 
        ? objectives.secondaryGoals.map(g => `- ${g}`).join("\n")
        : "- _Add secondary objectives..._"}

## Key Takeaways

What should readers remember after reading this?

${objectives.keyTakeaways.length > 0
        ? objectives.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")
        : "1. _Define key takeaways..._"}

## Call to Action

${objectives.callToAction || "_What should readers do after reading?_"}

## Emotional Arc

${objectives.emotionalArc || "_Describe the emotional journey: hook → tension → resolution_"}
`;
}

function generateOutlineMarkdown(title: string): string {
    return `# ${title} - Outline

## Structure

_Define your document structure here..._

### Introduction

- Hook
- Context
- Thesis/main point

### Body

- Section 1
- Section 2
- Section 3

### Conclusion

- Summary
- Call to action
- Final thought

---

## Notes

_Add outline notes here..._
`;
}

function generateToneMarkdown(voice: VoiceConfig): string {
    return `# Voice & Tone

## Overall Tone

${voice.tone}

## Point of View

${voice.pointOfView === "first" ? "First person (I, we)" : 
        voice.pointOfView === "second" ? "Second person (you)" : 
            "Third person (they, it)"}

## Example Phrases

${voice.examplePhrases?.map(p => `> "${p}"`).join("\n\n") || "_Add example phrases that capture your voice..._"}

## Notes

_Additional tone guidance..._
`;
}

function generateStyleRulesMarkdown(voice: VoiceConfig): string {
    return `# Style Rules

## Do

${voice.styleNotes.map(n => `- ${n}`).join("\n")}

## Don't

${voice.avoid.map(a => `- ${a}`).join("\n")}

## Formatting

- Use headers to break up content
- Keep paragraphs short (3-4 sentences)
- Include examples where helpful

## Custom Rules

_Add document-specific style rules..._
`;
}

function generateGlossaryMarkdown(): string {
    return `# Glossary & Spelling

## Terms

| Term | Spelling/Usage |
|------|----------------|
| _example_ | _Always capitalize_ |

## Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| _e.g._ | _for example_ |

## Notes

_Add spelling preferences, proper nouns, etc._
`;
}

function generateEvidenceReadme(): string {
    return `# Evidence & References

Place research materials, quotes, data, and other reference materials here.

## Organization

- \`research/\` - Research notes and summaries
- \`quotes/\` - Quotations with attribution
- \`data/\` - Statistics, charts, data files
- \`images/\` - Images and diagrams

## Adding Evidence

When adding evidence, note:
- Source/attribution
- How you plan to use it
- Any permissions needed
`;
}
