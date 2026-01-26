import { describe, it, expect } from "vitest";
import { DocumentConfigSchema, VoiceConfigSchema, DocumentObjectivesSchema } from "../src/schema.js";

describe("Document Types", () => {
    it("should validate document config", () => {
        const config = DocumentConfigSchema.parse({
            id: "my-post",
            title: "My Blog Post",
            type: "blog-post",
            status: "idea",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        expect(config.id).toBe("my-post");
        expect(config.title).toBe("My Blog Post");
        expect(config.type).toBe("blog-post");
        expect(config.status).toBe("idea");
    });

    it("should validate document config with optional fields", () => {
        const config = DocumentConfigSchema.parse({
            id: "my-post",
            title: "My Blog Post",
            type: "blog-post",
            status: "idea",
            createdAt: new Date(),
            updatedAt: new Date(),
            targetWordCount: 1000,
            audience: "developers",
            metadata: { tags: ["tech", "ai"] },
        });
        expect(config.targetWordCount).toBe(1000);
        expect(config.audience).toBe("developers");
        expect(config.metadata).toEqual({ tags: ["tech", "ai"] });
    });

    it("should validate voice config", () => {
        const voice = VoiceConfigSchema.parse({
            tone: "conversational",
            pointOfView: "first",
            styleNotes: ["Use simple language", "Be direct"],
            avoid: ["Jargon", "Passive voice"],
        });
        expect(voice.tone).toBe("conversational");
        expect(voice.pointOfView).toBe("first");
        expect(voice.styleNotes).toHaveLength(2);
        expect(voice.avoid).toHaveLength(2);
    });

    it("should validate document objectives", () => {
        const objectives = DocumentObjectivesSchema.parse({
            primaryGoal: "Explain AI concepts",
            secondaryGoals: ["Build trust", "Encourage action"],
            keyTakeaways: ["AI is accessible", "Start small"],
        });
        expect(objectives.primaryGoal).toBe("Explain AI concepts");
        expect(objectives.secondaryGoals).toHaveLength(2);
        expect(objectives.keyTakeaways).toHaveLength(2);
    });

    it("should reject invalid document type", () => {
        expect(() => {
            DocumentConfigSchema.parse({
                id: "my-post",
                title: "My Blog Post",
                type: "invalid-type",
                status: "idea",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }).toThrow();
    });

    it("should reject invalid status", () => {
        expect(() => {
            DocumentConfigSchema.parse({
                id: "my-post",
                title: "My Blog Post",
                type: "blog-post",
                status: "invalid-status",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }).toThrow();
    });

    it("should reject invalid point of view", () => {
        expect(() => {
            VoiceConfigSchema.parse({
                tone: "conversational",
                pointOfView: "fourth",
                styleNotes: [],
                avoid: [],
            });
        }).toThrow();
    });
});
