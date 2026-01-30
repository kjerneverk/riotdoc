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
 * Version history entry
 */
export interface VersionHistoryEntry {
    /** Version number (e.g., "0.1", "1.0") */
    version: string;
    
    /** When this version was created */
    timestamp: string;
    
    /** Draft file path for this version */
    draftPath?: string;
    
    /** Notes about this version */
    notes?: string;
}

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
    
    /** Current version (e.g., "0.1", "1.0") */
    version: string;
    
    /** Whether document is published (v1.0+) or draft (v0.x) */
    published: boolean;
    
    /** Version history */
    versionHistory: VersionHistoryEntry[];
    
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

// ============================================================================
// Timeline and History Types
// Copied and adapted from RiotPlan (src/types.ts lines 264-413)
// ============================================================================

/**
 * Timeline event types for document lifecycle
 */
export type TimelineEventType =
    | "document_created"
    | "outline_created"
    | "draft_created"
    | "revision_added"
    | "evidence_added"
    | "exported"
    | "narrative_chunk"
    | "checkpoint_created"
    | "checkpoint_restored";

/**
 * Base timeline event structure
 */
export interface TimelineEvent {
    /** ISO 8601 timestamp */
    timestamp: string;

    /** Event type identifier */
    type: TimelineEventType;

    /** Event-specific data */
    data: Record<string, any>;
}

/**
 * Narrative chunk event - captures raw conversational input
 */
export interface NarrativeChunkEvent extends TimelineEvent {
    type: "narrative_chunk";
    data: {
        /** Raw user input */
        content: string;

        /** Source of input */
        source?: "typing" | "voice" | "paste" | "import";

        /** Context about what prompted this */
        context?: string;

        /** Who is speaking */
        speaker?: "user" | "assistant" | "system";
    };
}

/**
 * Checkpoint created event
 */
export interface CheckpointCreatedEvent extends TimelineEvent {
    type: "checkpoint_created";
    data: {
        /** Checkpoint name (kebab-case) */
        name: string;

        /** Description of checkpoint */
        message: string;

        /** Path to checkpoint snapshot (relative) */
        snapshotPath?: string;

        /** Path to prompt context (relative) */
        promptPath?: string;
    };
}

/**
 * Checkpoint restored event
 */
export interface CheckpointRestoredEvent extends TimelineEvent {
    type: "checkpoint_restored";
    data: {
        /** Name of restored checkpoint */
        checkpoint: string;

        /** Timestamp of original checkpoint */
        restoredFrom: string;
    };
}

/**
 * File snapshot in checkpoint
 */
export interface FileSnapshot {
    /** Whether file exists */
    exists: boolean;

    /** File content (if exists) */
    content?: string;
}

/**
 * Checkpoint metadata structure
 */
export interface CheckpointMetadata {
    /** Checkpoint name */
    name: string;

    /** When created (ISO 8601) */
    timestamp: string;

    /** User-provided description */
    message: string;

    /** Current status */
    status: string;

    /** Snapshot of document files */
    snapshot: {
        timestamp: string;
        config?: FileSnapshot;
        outline?: FileSnapshot;
        currentDraft?: FileSnapshot;
    };

    /** Context information */
    context: {
        /** List of .md files at checkpoint */
        filesChanged: string[];

        /** Timeline events since last checkpoint */
        eventsSinceLastCheckpoint: number;
    };
}
