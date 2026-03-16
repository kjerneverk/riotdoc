import type { DocumentType } from "../types/project.js";

export interface DocumentTemplate {
    type: DocumentType;
    label: string;
    description: string;
    defaultVoiceHints: string[];
    structure: StructureDefinition;
    assemblyRules: AssemblyRules;
}

export interface StructureDefinition {
    singleFile: boolean;
    supportsParts: boolean;
    supportsManifest: boolean;
    defaultSections: string[];
}

export interface AssemblyRules {
    includeCorpus: boolean;
    includeGuidance: boolean;
    positionAware: boolean;
    contextIntegration: "standard" | "email-transcript" | "research-heavy";
}

export const DOCUMENT_TEMPLATES: Record<string, DocumentTemplate> = {
    "blog-post": {
        type: "blog-post",
        label: "Blog Post",
        description: "Single blog post with voice and analysis guidance focus",
        defaultVoiceHints: ["conversational", "opinionated", "practical"],
        structure: {
            singleFile: true,
            supportsParts: false,
            supportsManifest: false,
            defaultSections: ["Introduction", "Body", "Conclusion"],
        },
        assemblyRules: {
            includeCorpus: true,
            includeGuidance: true,
            positionAware: false,
            contextIntegration: "standard",
        },
    },
    "blog-series": {
        type: "blog-series",
        label: "Blog Series",
        description: "Multiple related posts with shared context and sequence awareness",
        defaultVoiceHints: ["conversational", "serialized", "callback-rich"],
        structure: {
            singleFile: false,
            supportsParts: true,
            supportsManifest: true,
            defaultSections: ["Part 1", "Part 2", "Part 3"],
        },
        assemblyRules: {
            includeCorpus: true,
            includeGuidance: true,
            positionAware: true,
            contextIntegration: "standard",
        },
    },
    "book": {
        type: "book",
        label: "Book",
        description: "Multi-chapter book with manifest-driven assembly",
        defaultVoiceHints: ["authoritative", "structured", "narrative"],
        structure: {
            singleFile: false,
            supportsParts: true,
            supportsManifest: true,
            defaultSections: ["Frontmatter", "Part I", "Part II", "Backmatter"],
        },
        assemblyRules: {
            includeCorpus: false,
            includeGuidance: true,
            positionAware: true,
            contextIntegration: "standard",
        },
    },
    "essay": {
        type: "essay",
        label: "Essay",
        description: "Single-file essay with argument structure",
        defaultVoiceHints: ["analytical", "structured", "persuasive"],
        structure: {
            singleFile: true,
            supportsParts: false,
            supportsManifest: false,
            defaultSections: ["Thesis", "Argument", "Evidence", "Conclusion"],
        },
        assemblyRules: {
            includeCorpus: true,
            includeGuidance: true,
            positionAware: false,
            contextIntegration: "research-heavy",
        },
    },
    "podcast-script": {
        type: "podcast-script",
        label: "Podcast Script",
        description: "Script with segments, timing, and conversational tone",
        defaultVoiceHints: ["conversational", "energetic", "segmented"],
        structure: {
            singleFile: true,
            supportsParts: true,
            supportsManifest: false,
            defaultSections: ["Intro", "Segment 1", "Segment 2", "Outro"],
        },
        assemblyRules: {
            includeCorpus: false,
            includeGuidance: true,
            positionAware: true,
            contextIntegration: "standard",
        },
    },
    "work-paper": {
        type: "work-paper",
        label: "Work Paper",
        description: "Professional document with email/transcript context integration",
        defaultVoiceHints: ["professional", "analytical", "evidence-based"],
        structure: {
            singleFile: false,
            supportsParts: true,
            supportsManifest: true,
            defaultSections: ["Executive Summary", "Background", "Analysis", "Recommendations"],
        },
        assemblyRules: {
            includeCorpus: false,
            includeGuidance: true,
            positionAware: false,
            contextIntegration: "email-transcript",
        },
    },
    "technical-doc": {
        type: "technical-doc",
        label: "Technical Document",
        description: "Technical documentation with structured sections",
        defaultVoiceHints: ["precise", "instructional", "reference-oriented"],
        structure: {
            singleFile: false,
            supportsParts: true,
            supportsManifest: true,
            defaultSections: ["Overview", "Getting Started", "API Reference", "Examples"],
        },
        assemblyRules: {
            includeCorpus: false,
            includeGuidance: true,
            positionAware: true,
            contextIntegration: "standard",
        },
    },
    general: {
        type: "general",
        label: "General",
        description: "Flexible document structure",
        defaultVoiceHints: ["adaptable"],
        structure: {
            singleFile: true,
            supportsParts: true,
            supportsManifest: true,
            defaultSections: ["Introduction", "Content", "Conclusion"],
        },
        assemblyRules: {
            includeCorpus: true,
            includeGuidance: true,
            positionAware: false,
            contextIntegration: "standard",
        },
    },
};

export function getTemplate(type: string): DocumentTemplate {
    return DOCUMENT_TEMPLATES[type] || DOCUMENT_TEMPLATES.general;
}
