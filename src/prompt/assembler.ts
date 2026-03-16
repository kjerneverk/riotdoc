/**
 * Composite Prompt Assembler
 *
 * Assembles voice + guidance + corpus into complete writing prompts.
 * This is the central integration point that combines all RiotDoc context
 * sources into a structured prompt suitable for content generation.
 */

import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { resolveVoiceProfile } from "../voice/profile-loader.js";
import { resolveAllGuidanceSources } from "../guidance/loader.js";
import { indexCorpus, searchCorpus, corpusRecent } from "../corpus/indexer.js";
import { ProjectConfigSchema } from "../types/project.js";
import type { ProjectConfig } from "../types/project.js";

export interface PromptAssemblyConfig {
    projectPath: string;
    intent: "draft" | "revise" | "outline" | "review" | "asset-generate";
    guidanceSources?: string[];
    corpusQuery?: string;
    corpusCount?: number;
    documentContext?: string;
    additionalInstructions?: string;
}

export interface AssembledPrompt {
    systemPrompt: string;
    contextBlock: string;
    taskBlock: string;
    selfCheckRubric: string;
    tokenEstimate: number;
    sources: string[];
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function assemblePrompt(
    config: PromptAssemblyConfig,
): Promise<AssembledPrompt> {
    const sources: string[] = [];

    // Load project config
    let projectConfig: ProjectConfig | null = null;
    try {
        const configContent = await readFile(
            join(config.projectPath, "riotdoc.yaml"),
            "utf-8",
        );
        projectConfig = ProjectConfigSchema.parse(parse(configContent));
    } catch {
        /* fallback to defaults */
    }

    // Load voice profile
    const voice = await resolveVoiceProfile({
        projectVoiceDir: join(config.projectPath, "voice"),
        sharedProfilePath: projectConfig?.voice?.profile,
        override: projectConfig?.voice?.override ?? false,
    });

    const systemParts: string[] = [];
    systemParts.push(
        "You are writing as the author defined by the following voice profile.\n",
    );

    if (voice.voice && voice.sources.voice !== "default") {
        systemParts.push("## Voice\n\n" + voice.voice);
        sources.push(`voice/voice.md (${voice.sources.voice})`);
    }
    if (voice.tone && voice.sources.tone !== "default") {
        systemParts.push("## Tone\n\n" + voice.tone);
        sources.push(`voice/tone.md (${voice.sources.tone})`);
    }
    if (voice.rhetoric && voice.sources.rhetoric !== "default") {
        systemParts.push("## Rhetorical Patterns\n\n" + voice.rhetoric);
        sources.push(`voice/rhetoric.md (${voice.sources.rhetoric})`);
    }

    const systemPrompt = systemParts.join("\n\n");

    // Load guidance sources
    const contextParts: string[] = [];
    const guidanceConfigPath = join(
        config.projectPath,
        "context",
        "guidance.yaml",
    );
    const allGuidance = await resolveAllGuidanceSources(
        guidanceConfigPath,
        config.projectPath,
    );

    for (const source of allGuidance) {
        if (
            config.guidanceSources &&
            !config.guidanceSources.includes(source.id)
        )
            continue;
        if (source.files.length > 0) {
            contextParts.push(`### Guidance: ${source.label}\n`);
            for (const file of source.files) {
                contextParts.push(file.content);
                sources.push(`guidance:${source.id}/${file.path}`);
            }
        }
    }

    // Query corpus for relevant past content
    if (config.corpusQuery && projectConfig?.corpus) {
        for (const corpusPtr of projectConfig.corpus) {
            try {
                const idx = await indexCorpus(corpusPtr.path, corpusPtr.pattern);
                const results =
                    config.corpusQuery === "__recent__"
                        ? corpusRecent(idx, config.corpusCount || 5)
                        : searchCorpus(idx, config.corpusQuery).slice(
                            0,
                            config.corpusCount || 5,
                        );

                if (results.length > 0) {
                    contextParts.push(
                        `### Previous Content (${corpusPtr.label || corpusPtr.path})\n`,
                    );
                    for (const entry of results) {
                        contextParts.push(
                            `**${entry.title}** (${entry.date || "undated"}, ${entry.wordCount} words)`,
                        );
                        if (entry.summary) contextParts.push(entry.summary);
                        sources.push(`corpus:${entry.path}`);
                    }
                }
            } catch {
                /* skip failed corpus */
            }
        }
    }

    const contextBlock = contextParts.join("\n\n");

    // Build task block
    const taskParts: string[] = [];
    const docType = projectConfig?.type || "general";
    taskParts.push(`**Intent**: ${config.intent}`);
    taskParts.push(`**Document Type**: ${docType}`);
    if (config.documentContext)
        taskParts.push(`**Context**: ${config.documentContext}`);
    if (config.additionalInstructions)
        taskParts.push(`\n${config.additionalInstructions}`);
    const taskBlock = taskParts.join("\n");

    // Self-check rubric
    const selfCheckRubric = [
        "Before finalizing, verify:",
        "- Does the output match the described voice perspective?",
        "- Is the tone appropriate for the context and audience?",
        "- Are the rhetorical patterns being used naturally?",
        "- Is the content consistent with previous work (if corpus was provided)?",
        "- Does it address the guidance/analysis context where relevant?",
    ].join("\n");

    const fullText = [systemPrompt, contextBlock, taskBlock, selfCheckRubric].join(
        "\n\n",
    );

    return {
        systemPrompt,
        contextBlock,
        taskBlock,
        selfCheckRubric,
        tokenEstimate: estimateTokens(fullText),
        sources,
    };
}
