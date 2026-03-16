/**
 * Prompt Assembly Tool
 *
 * MCP tool that assembles voice + guidance + corpus into a complete writing context.
 */

import { z } from "zod";
import { resolve } from "node:path";
import type { McpTool, ToolResult, ToolExecutionContext } from "../types.js";
import { executeCommand } from "./shared.js";
import { assemblePrompt } from "../../prompt/assembler.js";

export const assembleTool: McpTool = {
    name: "riotdoc_assemble",
    description:
        "Assemble a complete writing context by combining voice profile, guidance sources, " +
        "and corpus into a structured prompt. Returns system prompt, context block, task block, " +
        "self-check rubric, token estimate, and source provenance.",
    schema: {
        path: z
            .string()
            .optional()
            .describe(
                "Path to document workspace (defaults to current directory)",
            ),
        intent: z
            .enum(["draft", "revise", "outline", "review", "asset-generate"])
            .describe("The writing intent for this assembly"),
        guidance: z
            .array(z.string())
            .optional()
            .describe(
                "Guidance source IDs to include (omit to include all configured sources)",
            ),
        corpus_query: z
            .string()
            .optional()
            .describe(
                'Search query for corpus content, or "__recent__" for most recent entries',
            ),
        corpus_count: z
            .number()
            .optional()
            .default(5)
            .describe("Maximum number of corpus entries to include"),
        document_context: z
            .string()
            .optional()
            .describe("Additional context about the document being written"),
        instructions: z
            .string()
            .optional()
            .describe("Additional instructions to include in the task block"),
    },
    async execute(
        args: Record<string, unknown>,
        context: ToolExecutionContext,
    ): Promise<ToolResult> {
        return executeCommand(args, context, async () => {
            const projectPath = resolve(
                (args.path as string) || process.cwd(),
            );

            const assembled = await assemblePrompt({
                projectPath,
                intent: args.intent as
                    | "draft"
                    | "revise"
                    | "outline"
                    | "review"
                    | "asset-generate",
                guidanceSources: args.guidance as string[] | undefined,
                corpusQuery: args.corpus_query as string | undefined,
                corpusCount: (args.corpus_count as number | undefined) ?? 5,
                documentContext: args.document_context as string | undefined,
                additionalInstructions: args.instructions as string | undefined,
            });

            return {
                path: projectPath,
                intent: args.intent,
                systemPrompt: assembled.systemPrompt,
                contextBlock: assembled.contextBlock,
                taskBlock: assembled.taskBlock,
                selfCheckRubric: assembled.selfCheckRubric,
                tokenEstimate: assembled.tokenEstimate,
                sources: assembled.sources,
            };
        });
    },
};
