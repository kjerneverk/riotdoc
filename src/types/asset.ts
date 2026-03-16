import { z } from "zod";

/**
 * A tracked asset (image, diagram, chart, etc.) with optional link
 * to the generation prompt that produced it.
 *
 * Modeled after slop-codex's assets/ directory where each image has
 * a corresponding markdown prompt file in assets/prompts/.
 */
export const AssetSchema = z.object({
    id: z.string().describe("Unique identifier for this asset"),
    filename: z.string().describe("Filename within the assets directory"),
    type: z.enum(["image", "diagram", "chart", "video", "audio", "other"]).describe("Asset type"),
    promptFile: z.string().optional().describe("Path to the generation prompt file relative to assets/prompts/"),
    generatedWith: z.string().optional().describe("Tool used to generate (e.g., 'chatgpt-4', 'midjourney')"),
    tags: z.array(z.string()).optional().describe("Tags for organization and filtering"),
    linkedDocument: z.string().optional().describe("Which document/chapter/section this asset belongs to"),
    description: z.string().optional().describe("Brief description of the asset"),
});

export type Asset = z.infer<typeof AssetSchema>;

/**
 * The asset manifest that tracks all assets in a project.
 * Lives at assets/manifest.yaml within a RiotDoc project.
 */
export const AssetManifestSchema = z.object({
    globalStyle: z.string().optional().describe("Path to global style prompt applied to all asset generation"),
    namingConvention: z.string().optional().describe("Description of the naming convention for assets"),
    assets: z.array(AssetSchema).default([]).describe("Registered assets"),
});

export type AssetManifest = z.infer<typeof AssetManifestSchema>;
