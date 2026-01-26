/**
 * Standard directory structure for a RiotDoc workspace
 */
export const RIOTDOC_STRUCTURE = {
    /** Main configuration file */
    configFile: "riotdoc.yaml",
    
    /** Objectives document */
    objectivesFile: "OBJECTIVES.md",
    
    /** Outline document */
    outlineFile: "OUTLINE.md",
    
    /** Voice configuration directory */
    voiceDir: "voice",
    
    /** Voice files */
    voiceFiles: {
        tone: "tone.md",
        styleRules: "style-rules.md",
        glossary: "glossary.md",
    },
    
    /** Evidence directory */
    evidenceDir: "evidence",
    
    /** Drafts directory */
    draftsDir: "drafts",
    
    /** Revisions directory */
    revisionsDir: "revisions",
    
    /** Export directory */
    exportDir: "export",
} as const;

/**
 * Default voice configuration
 */
export const DEFAULT_VOICE = {
    tone: "conversational",
    pointOfView: "first" as const,
    styleNotes: [
        "Use active voice",
        "Keep sentences concise",
        "Include concrete examples",
    ],
    avoid: [
        "Jargon without explanation",
        "Passive voice",
        "Vague statements",
    ],
};

/**
 * Default objectives template
 */
export const DEFAULT_OBJECTIVES = {
    primaryGoal: "",
    secondaryGoals: [],
    keyTakeaways: [],
};
