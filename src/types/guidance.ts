import { z } from "zod";

export const GuidanceCategorySchema = z.enum([
    "analysis",
    "research",
    "reference",
    "legal",
    "production",
    "style-guide",
    "other",
]);

export type GuidanceCategory = z.infer<typeof GuidanceCategorySchema>;

/**
 * A single guidance source — a pointer to an external file or directory
 * that provides context for content generation without copying or
 * re-implementing the analysis.
 *
 * Modeled after the blog project's analysis/ directory (HN trends, next-topics,
 * Medium stats) and slop-codex's legal/production analysis files.
 */
export const GuidanceSourceSchema = z.object({
    id: z.string().describe("Unique identifier for this guidance source"),
    label: z.string().describe("Human-readable label"),
    type: z.enum(["directory", "file"]).describe("Whether this points to a directory or a single file"),
    path: z.string().describe("Path to the source (absolute or relative to project root)"),
    pattern: z.string().optional().describe("Glob pattern when type is 'directory' (e.g., 'hn-*.md')"),
    category: GuidanceCategorySchema.optional().describe("Classification of the guidance type"),
    description: z.string().optional().describe("What this guidance source provides"),
    includeInPrompt: z.boolean().default(true).describe("Whether to include in assembled prompts by default"),
    maxTokens: z.number().optional().describe("Token budget for this source during prompt assembly"),
});

export type GuidanceSource = z.infer<typeof GuidanceSourceSchema>;

/**
 * The guidance.yaml configuration file schema.
 * Lives at context/guidance.yaml within a RiotDoc project.
 */
export const GuidanceConfigSchema = z.object({
    sources: z.array(GuidanceSourceSchema).describe("List of external guidance sources"),
});

export type GuidanceConfig = z.infer<typeof GuidanceConfigSchema>;

/**
 * A resolved guidance source with loaded file contents.
 */
export interface ResolvedGuidanceSource {
    id: string;
    label: string;
    category?: GuidanceCategory;
    files: Array<{
        path: string;
        content: string;
    }>;
    totalTokenEstimate: number;
}
