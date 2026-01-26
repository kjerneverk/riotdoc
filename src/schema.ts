import { z } from "zod";

export const DocumentConfigSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["blog-post", "podcast-script", "technical-doc", "newsletter", "custom"]),
    status: z.enum(["idea", "outlined", "drafting", "revising", "final", "exported"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    targetWordCount: z.number().optional(),
    audience: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});

export const VoiceConfigSchema = z.object({
    tone: z.string(),
    pointOfView: z.enum(["first", "second", "third"]),
    styleNotes: z.array(z.string()),
    avoid: z.array(z.string()),
    examplePhrases: z.array(z.string()).optional(),
});

export const DocumentObjectivesSchema = z.object({
    primaryGoal: z.string(),
    secondaryGoals: z.array(z.string()),
    callToAction: z.string().optional(),
    keyTakeaways: z.array(z.string()),
    emotionalArc: z.string().optional(),
});
