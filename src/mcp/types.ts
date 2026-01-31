/**
 * MCP Type Definitions for RiotDoc
 *
 * This module defines types for the Model Context Protocol integration,
 * including protocol types, RiotDoc-specific types, and resource result types.
 */

// ============================================================================
// MCP Protocol Types
// ============================================================================

/**
 * MCP Tool definition
 * Represents a callable tool exposed via MCP
 */
export interface McpTool {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, McpToolParameter>;
        required?: string[];
    };
}

/**
 * MCP Tool Parameter definition
 * Describes a single parameter for a tool
 */
export interface McpToolParameter {
    type: string;
    description: string;
    enum?: string[];
    items?: { type: string };
}

/**
 * MCP Resource definition
 * Represents a readable resource exposed via MCP
 */
export interface McpResource {
    uri: string;
    name: string;
    description: string;
    mimeType?: string;
}

/**
 * MCP Prompt definition
 * Represents a workflow prompt template
 */
export interface McpPrompt {
    name: string;
    description: string;
    arguments?: Array<{
        name: string;
        description: string;
        required: boolean;
    }>;
}

/**
 * MCP Prompt Message
 * Represents a message in a prompt template
 */
export interface McpPromptMessage {
    role: 'user' | 'assistant';
    content: {
        type: 'text' | 'image' | 'resource';
        text?: string;
        data?: string;
        mimeType?: string;
    };
}

// ============================================================================
// RiotDoc-Specific Types
// ============================================================================

/**
 * Parsed riotdoc:// URI
 * Represents the structured components of a riotdoc URI
 */
export interface RiotdocUri {
    scheme: 'riotdoc';
    type: 'config' | 'status' | 'document' | 'outline' | 'objectives' | 
          'voice' | 'drafts' | 'evidence' | 'style-report';
    path?: string;
    query?: Record<string, string>;
}

/**
 * Progress notification callback
 * Called periodically during long-running operations to send progress updates
 */
export interface ProgressCallback {
    (progress: number, total: number | null, message: string, logs?: string[]): void | Promise<void>;
}

/**
 * Tool Execution Context
 * Provides context for tool execution
 */
export interface ToolExecutionContext {
    workingDirectory: string;
    config?: any;
    logger?: any;
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
 * Tool Result
 * Standard result format for tool execution
 */
export interface ToolResult {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
    context?: Record<string, any>;
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

// ============================================================================
// Resource Result Types
// ============================================================================

/**
 * Configuration Resource
 * Result of reading a riotdoc configuration
 */
export interface ConfigResource {
    path: string;
    exists: boolean;
    config?: any;
}

/**
 * Document Status Resource
 * Result of reading document status
 */
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

/**
 * Document Resource
 * Result of reading complete document state
 */
export interface DocumentResource {
    path: string;
    config: any;
    voice: any;
    objectives: any;
    outline?: string;
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

/**
 * Outline Resource
 * Result of reading document outline
 */
export interface OutlineResource {
    path: string;
    content: string;
    exists: boolean;
}

/**
 * Objectives Resource
 * Result of reading document objectives
 */
export interface ObjectivesResource {
    path: string;
    primaryGoal: string;
    secondaryGoals: string[];
    keyTakeaways: string[];
    callToAction?: string;
    emotionalArc?: string;
}

/**
 * Voice Resource
 * Result of reading voice configuration
 */
export interface VoiceResource {
    path: string;
    tone: string;
    pointOfView: string;
    styleNotes: string[];
    avoid: string[];
    examplePhrases?: string[];
}

/**
 * Style Report Resource
 * Result of style validation
 */
export interface StyleReportResource {
    path: string;
    issues: Array<{
        line: number;
        column: number;
        severity: 'error' | 'warning' | 'info';
        message: string;
        rule: string;
    }>;
    summary: {
        errors: number;
        warnings: number;
        info: number;
    };
}
