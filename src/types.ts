/**
 * Document type classification
 */
export type DocumentType = 
    | "blog-post"
    | "podcast-script"
    | "technical-doc"
    | "newsletter"
    | "custom";

/**
 * AI assistance level for operations
 */
export type AssistanceLevel =
    | "generate"    // Full AI generation
    | "expand"      // AI expands user points
    | "revise"      // AI improves existing content
    | "cleanup"     // Light editing only
    | "spellcheck"; // Just fix errors

/**
 * Document lifecycle status
 */
export type DocumentStatus =
    | "idea"        // Initial concept
    | "outlined"    // Has outline
    | "drafting"    // Working on draft
    | "revising"    // In revision cycle
    | "final"       // Ready for export
    | "exported";   // Published/exported

/**
 * Core document configuration
 */
export interface DocumentConfig {
    /** Document identifier */
    id: string;
    
    /** Human-readable title */
    title: string;
    
    /** Document type */
    type: DocumentType;
    
    /** Current status */
    status: DocumentStatus;
    
    /** Creation timestamp */
    createdAt: Date;
    
    /** Last modified timestamp */
    updatedAt: Date;
    
    /** Target word count (optional) */
    targetWordCount?: number;
    
    /** Target audience description */
    audience?: string;
    
    /** Custom metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Voice and tone configuration
 */
export interface VoiceConfig {
    /** Tone description (e.g., "conversational", "formal") */
    tone: string;
    
    /** Point of view (first, second, third) */
    pointOfView: "first" | "second" | "third";
    
    /** Style notes */
    styleNotes: string[];
    
    /** Things to avoid */
    avoid: string[];
    
    /** Example phrases that capture the voice */
    examplePhrases?: string[];
}

/**
 * Document objectives
 */
export interface DocumentObjectives {
    /** Primary goal of the document */
    primaryGoal: string;
    
    /** Secondary objectives */
    secondaryGoals: string[];
    
    /** Call to action (if any) */
    callToAction?: string;
    
    /** Key takeaways for reader */
    keyTakeaways: string[];
    
    /** Emotional arc description */
    emotionalArc?: string;
}

/**
 * Evidence/reference item
 */
export interface EvidenceItem {
    /** Unique identifier */
    id: string;
    
    /** File path relative to evidence/ */
    path: string;
    
    /** Description of the evidence */
    description: string;
    
    /** Type of evidence */
    type: "research" | "quote" | "data" | "image" | "link" | "other";
    
    /** Whether it's been incorporated */
    incorporated: boolean;
    
    /** Which draft incorporated it */
    incorporatedIn?: string;
}

/**
 * Draft metadata
 */
export interface Draft {
    /** Draft number (01, 02, etc.) */
    number: number;
    
    /** File path relative to drafts/ */
    path: string;
    
    /** Creation timestamp */
    createdAt: Date;
    
    /** Word count */
    wordCount: number;
    
    /** Assistance level used */
    assistanceLevel: AssistanceLevel;
    
    /** Notes about this draft */
    notes?: string;
}

/**
 * Revision feedback
 */
export interface Revision {
    /** Revision number */
    number: number;
    
    /** File path */
    path: string;
    
    /** Timestamp */
    createdAt: Date;
    
    /** Which draft this revises */
    targetDraft: number;
    
    /** Summary of feedback */
    summary: string;
}

/**
 * Complete document state
 */
export interface RiotDoc {
    /** Configuration */
    config: DocumentConfig;
    
    /** Voice settings */
    voice: VoiceConfig;
    
    /** Objectives */
    objectives: DocumentObjectives;
    
    /** Evidence items */
    evidence: EvidenceItem[];
    
    /** Draft history */
    drafts: Draft[];
    
    /** Revision history */
    revisions: Revision[];
    
    /** Path to document workspace */
    workspacePath: string;
}
