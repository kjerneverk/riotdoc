/**
 * Context Resource Handler
 *
 * Provides the full assembled writing context via MCP resources.
 */

import type { RiotdocUri } from "../types.js";
import { assemblePrompt } from "../../prompt/assembler.js";

/**
 * Read the full assembled context for a project path.
 * Uses "draft" as the default intent for resource-based access.
 */
export async function readContextResource(uri: RiotdocUri) {
    const directory = uri.path || process.cwd();

    const assembled = await assemblePrompt({
        projectPath: directory,
        intent: "draft",
    });

    return {
        path: directory,
        systemPrompt: assembled.systemPrompt,
        contextBlock: assembled.contextBlock,
        taskBlock: assembled.taskBlock,
        selfCheckRubric: assembled.selfCheckRubric,
        tokenEstimate: assembled.tokenEstimate,
        sources: assembled.sources,
    };
}
