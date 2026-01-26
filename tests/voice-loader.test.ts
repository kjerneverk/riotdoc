import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync } from "node:fs";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadVoice, loadGlossary, hasVoiceConfig, parseToneMarkdown, parseStyleRulesMarkdown } from "../src/voice/loader.js";
import { buildVoicePrompt } from "../src/voice/prompt-builder.js";
import { RIOTDOC_STRUCTURE } from "../src/constants.js";

const TEST_DIR = "/tmp/riotdoc-voice-test";

describe("Voice Loader", () => {
    beforeEach(async () => {
        if (existsSync(TEST_DIR)) {
            await rm(TEST_DIR, { recursive: true, force: true });
        }
        await mkdir(TEST_DIR, { recursive: true });
    });

    afterEach(async () => {
        if (existsSync(TEST_DIR)) {
            await rm(TEST_DIR, { recursive: true, force: true });
        }
    });

    describe("parseToneMarkdown", () => {
        it("should parse tone file", () => {
            const result = parseToneMarkdown(`
# Voice & Tone

## Overall Tone

Conversational and friendly

## Point of View

First person (I, we)
            `);
            
            expect(result.tone).toBe("Conversational and friendly");
            expect(result.pointOfView).toBe("first");
        });

        it("should detect second person", () => {
            const result = parseToneMarkdown(`
## Overall Tone

Professional

## Point of View

Second person (you)
            `);
            
            expect(result.pointOfView).toBe("second");
        });

        it("should detect third person", () => {
            const result = parseToneMarkdown(`
## Overall Tone

Academic

## Point of View

Third person (they, it)
            `);
            
            expect(result.pointOfView).toBe("third");
        });

        it("should extract example phrases", () => {
            const result = parseToneMarkdown(`
## Overall Tone

Friendly

## Example Phrases

> "Let's dive in"
> "Here's the thing"
            `);
            
            expect(result.examplePhrases).toEqual(["Let's dive in", "Here's the thing"]);
        });

        it("should default to conversational and first person", () => {
            const result = parseToneMarkdown("");
            
            expect(result.tone).toBe("conversational");
            expect(result.pointOfView).toBe("first");
        });
    });

    describe("parseStyleRulesMarkdown", () => {
        it("should parse Do and Don't sections", () => {
            const result = parseStyleRulesMarkdown(`
# Style Rules

## Do

- Use active voice
- Keep sentences short
- Include examples

## Don't

- Use jargon
- Be vague
            `);
            
            expect(result.do).toEqual([
                "Use active voice",
                "Keep sentences short",
                "Include examples"
            ]);
            expect(result.dont).toEqual([
                "Use jargon",
                "Be vague"
            ]);
        });

        it("should handle missing sections", () => {
            const result = parseStyleRulesMarkdown("# Style Rules");
            
            expect(result.do).toEqual([]);
            expect(result.dont).toEqual([]);
        });
    });

    describe("loadVoice", () => {
        it("should load voice configuration from workspace", async () => {
            const voiceDir = join(TEST_DIR, RIOTDOC_STRUCTURE.voiceDir);
            await mkdir(voiceDir, { recursive: true });
            
            await writeFile(
                join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone),
                `## Overall Tone\n\nCasual\n\n## Point of View\n\nSecond person`,
                "utf-8"
            );
            
            await writeFile(
                join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.styleRules),
                `## Do\n\n- Be direct\n\n## Don't\n\n- Be boring`,
                "utf-8"
            );
            
            const voice = await loadVoice(TEST_DIR);
            
            expect(voice.tone).toBe("Casual");
            expect(voice.pointOfView).toBe("second");
            expect(voice.styleNotes).toEqual(["Be direct"]);
            expect(voice.avoid).toEqual(["Be boring"]);
        });

        it("should return defaults if files don't exist", async () => {
            const voice = await loadVoice(TEST_DIR);
            
            expect(voice.tone).toBe("conversational");
            expect(voice.pointOfView).toBe("first");
            expect(voice.styleNotes).toEqual([]);
            expect(voice.avoid).toEqual([]);
        });
    });

    describe("loadGlossary", () => {
        it("should load glossary from table", async () => {
            const voiceDir = join(TEST_DIR, RIOTDOC_STRUCTURE.voiceDir);
            await mkdir(voiceDir, { recursive: true });
            
            await writeFile(
                join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.glossary),
                `
| Term | Spelling/Usage |
|------|----------------|
| AI | Always capitalize |
| email | One word, lowercase |
                `,
                "utf-8"
            );
            
            const glossary = await loadGlossary(TEST_DIR);
            
            expect(glossary.get("ai")).toBe("Always capitalize");
            expect(glossary.get("email")).toBe("One word, lowercase");
        });

        it("should return empty map if file doesn't exist", async () => {
            const glossary = await loadGlossary(TEST_DIR);
            
            expect(glossary.size).toBe(0);
        });
    });

    describe("hasVoiceConfig", () => {
        it("should return true if voice config exists", async () => {
            const voiceDir = join(TEST_DIR, RIOTDOC_STRUCTURE.voiceDir);
            await mkdir(voiceDir, { recursive: true });
            await writeFile(
                join(voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone),
                "test",
                "utf-8"
            );
            
            const result = await hasVoiceConfig(TEST_DIR);
            
            expect(result).toBe(true);
        });

        it("should return false if voice config doesn't exist", async () => {
            const result = await hasVoiceConfig(TEST_DIR);
            
            expect(result).toBe(false);
        });
    });

    describe("buildVoicePrompt", () => {
        it("should build voice prompt", () => {
            const prompt = buildVoicePrompt({
                tone: "friendly",
                pointOfView: "first",
                styleNotes: ["Be clear", "Use examples"],
                avoid: ["Jargon", "Complexity"],
                examplePhrases: ["Let's explore", "Here's how"],
            });
            
            expect(prompt).toContain("## Writing Voice");
            expect(prompt).toContain("Tone: friendly");
            expect(prompt).toContain("First person (I, we)");
            expect(prompt).toContain("- Be clear");
            expect(prompt).toContain("- Jargon");
            expect(prompt).toContain('"Let\'s explore"');
        });

        it("should handle minimal voice config", () => {
            const prompt = buildVoicePrompt({
                tone: "neutral",
                pointOfView: "third",
                styleNotes: [],
                avoid: [],
            });
            
            expect(prompt).toContain("## Writing Voice");
            expect(prompt).toContain("Tone: neutral");
            expect(prompt).toContain("Third person (they, it)");
        });
    });
});
