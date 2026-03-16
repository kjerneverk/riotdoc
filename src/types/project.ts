import { z } from "zod";

/**
 * Expanded document type classification.
 * Extends the original set (blog-post, podcast-script, technical-doc, newsletter, custom)
 * with types needed for books, essays, blog series, and work papers.
 */
export const DocumentTypeSchema = z.enum([
    "blog-post",
    "blog-series",
    "book",
    "essay",
    "podcast-script",
    "work-paper",
    "technical-doc",
    "newsletter",
    "general",
    "custom",
]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const CorpusPointerSchema = z.object({
    path: z.string().describe("Path to directory of previous content (absolute or relative to project root)"),
    pattern: z.string().default("**/*.md").describe("Glob pattern for matching files within the corpus directory"),
    label: z.string().optional().describe("Human-readable label for this corpus"),
});

export type CorpusPointer = z.infer<typeof CorpusPointerSchema>;

export const VoiceReferenceSchema = z.object({
    profile: z.string().optional().describe("Path to a shared voice profile directory to inherit from"),
    override: z.boolean().default(false).describe("When true, project voice files replace shared profile instead of supplementing"),
});

export type VoiceReference = z.infer<typeof VoiceReferenceSchema>;

export const AssetConfigSchema = z.object({
    imageDir: z.string().default("assets/images").describe("Directory for generated images"),
    promptDir: z.string().default("assets/prompts").describe("Directory for asset generation prompts"),
    globalStyle: z.string().optional().describe("Path to global style prompt for asset generation"),
});

export type AssetConfig = z.infer<typeof AssetConfigSchema>;

/**
 * The canonical riotdoc.yaml project configuration schema.
 * This is the root config file for every RiotDoc project.
 */
export const ProjectConfigSchema = z.object({
    name: z.string().describe("Project name"),
    type: DocumentTypeSchema.describe("Document type classification"),
    description: z.string().optional().describe("Brief description of the project"),
    voice: VoiceReferenceSchema.optional().describe("Voice profile configuration with optional shared profile inheritance"),
    corpus: z.array(CorpusPointerSchema).optional().describe("Directories of previous content for consistency querying"),
    guidance: z.array(z.string()).optional().describe("Paths to guidance source config files (guidance.yaml)"),
    assets: AssetConfigSchema.optional().describe("Asset management configuration"),
    audience: z.string().optional().describe("Target audience description"),
    targetWordCount: z.number().optional().describe("Target word count for the document"),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
