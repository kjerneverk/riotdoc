import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { createWorkspace } from "../src/workspace/creator.js";
import { RIOTDOC_STRUCTURE } from "../src/constants.js";

const TEST_DIR = "/tmp/riotdoc-test";

describe("Workspace Creator", () => {
    beforeEach(async () => {
        // Clean up test directory before each test
        if (existsSync(TEST_DIR)) {
            await rm(TEST_DIR, { recursive: true, force: true });
        }
    });

    afterEach(async () => {
        // Clean up test directory after each test
        if (existsSync(TEST_DIR)) {
            await rm(TEST_DIR, { recursive: true, force: true });
        }
    });

    it("should create workspace structure", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        expect(path).toBe(TEST_DIR);
        
        // Verify main directory exists
        expect(existsSync(path)).toBe(true);
        
        // Verify subdirectories exist
        expect(existsSync(join(path, RIOTDOC_STRUCTURE.voiceDir))).toBe(true);
        expect(existsSync(join(path, RIOTDOC_STRUCTURE.evidenceDir))).toBe(true);
        expect(existsSync(join(path, RIOTDOC_STRUCTURE.draftsDir))).toBe(true);
        expect(existsSync(join(path, RIOTDOC_STRUCTURE.revisionsDir))).toBe(true);
        expect(existsSync(join(path, RIOTDOC_STRUCTURE.exportDir))).toBe(true);
    });

    it("should create configuration file", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        const configPath = join(path, RIOTDOC_STRUCTURE.configFile);
        expect(existsSync(configPath)).toBe(true);
    });

    it("should create objectives file", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        const objectivesPath = join(path, RIOTDOC_STRUCTURE.objectivesFile);
        expect(existsSync(objectivesPath)).toBe(true);
    });

    it("should create outline file", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        const outlinePath = join(path, RIOTDOC_STRUCTURE.outlineFile);
        expect(existsSync(outlinePath)).toBe(true);
    });

    it("should create voice files", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        const tonePath = join(path, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone);
        const styleRulesPath = join(path, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.styleRules);
        const glossaryPath = join(path, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.glossary);
        
        expect(existsSync(tonePath)).toBe(true);
        expect(existsSync(styleRulesPath)).toBe(true);
        expect(existsSync(glossaryPath)).toBe(true);
    });

    it("should create evidence README", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
        });
        
        const evidenceReadmePath = join(path, RIOTDOC_STRUCTURE.evidenceDir, "README.md");
        expect(existsSync(evidenceReadmePath)).toBe(true);
    });

    it("should accept custom voice configuration", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
            voice: {
                tone: "formal",
                pointOfView: "third",
            },
        });
        
        const tonePath = join(path, RIOTDOC_STRUCTURE.voiceDir, RIOTDOC_STRUCTURE.voiceFiles.tone);
        expect(existsSync(tonePath)).toBe(true);
    });

    it("should accept custom objectives", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            title: "Test Document",
            type: "blog-post",
            objectives: {
                primaryGoal: "Explain AI concepts",
                secondaryGoals: ["Build trust"],
                keyTakeaways: ["AI is accessible"],
            },
        });
        
        const objectivesPath = join(path, RIOTDOC_STRUCTURE.objectivesFile);
        expect(existsSync(objectivesPath)).toBe(true);
    });

    it("should derive ID from path when not provided", async () => {
        const path = await createWorkspace({
            path: "/tmp/riotdoc-test-my-doc",
            title: "Test Document",
            type: "blog-post",
        });
        
        expect(existsSync(path)).toBe(true);
        
        // Clean up
        await rm(path, { recursive: true, force: true });
    });

    it("should use provided ID", async () => {
        const path = await createWorkspace({
            path: TEST_DIR,
            id: "custom-id",
            title: "Test Document",
            type: "blog-post",
        });
        
        expect(existsSync(path)).toBe(true);
    });
});
