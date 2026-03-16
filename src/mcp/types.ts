/**
 * MCP Type Definitions for RiotDoc
 *
 * Aligned with the RiotPlan MCP architecture:
 * - McpTool: Zod schema + execute function combined
 * - McpResource: URI-based handlers
 * - McpPrompt: Template-based workflow prompts
 */

import type { z } from "zod";

// ============================================================================
// MCP Tool / Resource / Prompt (RiotPlan-aligned)
// ============================================================================

/**
 * MCP Tool definition matching RiotPlan's pattern.
 * Each tool is self-contained: schema + executor in one object.
 */
export interface McpTool {
    name: string;
    description: string;
    schema: z.ZodRawShape;
    execute: (args: Record<string, unknown>, context: ToolExecutionContext) => Promise<ToolResult>;
}

/**
 * MCP Resource definition with handler function.
 */
export interface McpResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    handler: (parsedUri: RiotdocUri, context: ResourceContext) => Promise<unknown>;
}

/**
 * MCP Prompt definition with handler function.
 */
export interface McpPrompt {
    name: string;
    description: string;
    arguments: PromptArgument[];
    handler: (args: Record<string, string>) => Promise<McpPromptMessage[]>;
}

export interface PromptArgument {
    name: string;
    description: string;
    required: boolean;
}

/**
 * MCP Prompt Message
 */
export interface McpPromptMessage {
    role: "user" | "assistant";
    content: {
        type: "text" | "image" | "resource";
        text?: string;
        data?: string;
        mimeType?: string;
    };
}

// ============================================================================
// Resource Result Types
// ============================================================================

export interface ConfigResource {
    path: string;
    exists: boolean;
    config: unknown;
}

export interface DocumentStatusResource {
    path: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    targetWordCount?: number;
    audience?: string;
}

export interface DocumentResource {
    path: string;
    config: {
        id: string;
        title: string;
        type: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        targetWordCount?: number;
        audience?: string;
    };
    voice: unknown;
    objectives: unknown;
    outline: unknown;
    drafts: Array<{
        number: number;
        path: string;
        createdAt: string;
        wordCount: number;
    }>;
    evidence: Array<{
        id: string;
        path: string;
        description: string;
        type: string;
    }>;
}

export interface OutlineResource {
    path: string;
    content: string;
    exists: boolean;
}

export interface ObjectivesResource {
    path: string;
    primaryGoal: string;
    secondaryGoals: string[];
    keyTakeaways: string[];
    callToAction?: string;
    emotionalArc?: string;
}

export interface VoiceResource {
    path: string;
    tone: string;
    pointOfView: string;
    styleNotes: string[];
    avoid: string[];
    examplePhrases?: string[];
}

export interface StyleReportResource {
    path: string;
    issues: Array<unknown>;
    summary: {
        errors: number;
        warnings: number;
        info: number;
    };
}

// ============================================================================
// RiotDoc-Specific Types
// ============================================================================

/**
 * Parsed riotdoc:// URI
 */
export interface RiotdocUri {
    scheme: "riotdoc";
    type: string;
    path?: string;
    query?: Record<string, string>;
}

/**
 * Tool Execution Context
 */
export interface ToolExecutionContext {
    workingDirectory: string;
    config?: unknown;
    logger?: unknown;
    progressCallback?: ProgressCallback;
    sendNotification?: (notification: {
        method: string;
        params: {
            progressToken?: string | number;
            progress: number;
            total?: number;
            message?: string;
        };
    }) => Promise<void>;
    progressToken?: string | number;
}

/**
 * Resource execution context
 */
export interface ResourceContext {
    workingDirectory: string;
}

/**
 * Progress notification callback
 */
export interface ProgressCallback {
    (progress: number, total: number | null, message: string, logs?: string[]): void | Promise<void>;
}

/**
 * Tool Result
 */
export interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
    message?: string;
    context?: Record<string, unknown>;
    recovery?: string[];
    details?: {
        stdout?: string;
        stderr?: string;
        exitCode?: number;
        files?: string[];
        phase?: string;
    };
    logs?: string[];
}
