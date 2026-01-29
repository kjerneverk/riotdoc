/**
 * Shared utilities for MCP tools
 */

 
import type { ToolExecutionContext, ToolResult } from '../types.js';
 

/**
 * Helper to create a basic config object from MCP args
 */
export function createConfig(args: any, _context: ToolExecutionContext): any {
    return {
        dryRun: args.dry_run || false,
        verbose: false,
        debug: false,
    };
}

/**
 * Generic command executor - wraps command execution with common patterns
 * Handles directory changes, error formatting, and result building
 */
export async function executeCommand<T>(
    args: any,
    context: ToolExecutionContext,
    commandFn: () => Promise<T>,
    resultBuilder?: (result: T, args: any, originalCwd: string) => any
): Promise<ToolResult> {
    const originalCwd = process.cwd();
    const logs: string[] = [];

    try {
        // Change to target directory if specified
        if (args.path) {
            process.chdir(args.path);
            logs.push(`Changed to directory: ${args.path}`);
        }

        // Execute the command
        const result = await commandFn();

        // Restore original directory
        if (args.path) {
            process.chdir(originalCwd);
        }

        // Build the result
        const data = resultBuilder 
            ? resultBuilder(result, args, originalCwd) 
            : { result, path: args.path || originalCwd };

        return {
            success: true,
            data,
            message: args.dry_run ? 'Dry run completed' : 'Command completed successfully',
            logs: logs.length > 0 ? logs : undefined,
        };
    } catch (error: any) {
        // Restore directory on error
        if (args.path && process.cwd() !== originalCwd) {
            try {
                process.chdir(originalCwd);
            } catch {
                // Ignore errors restoring directory
            }
        }

        return {
            success: false,
            error: error.message || 'Command failed',
            context: {
                path: args.path || originalCwd,
                command: error.command,
            },
            logs: logs.length > 0 ? logs : undefined,
        };
    }
}

/**
 * Helper to format error messages for MCP
 */
export function formatError(error: any): { message: string; context?: Record<string, any> } {
    const message = error.message || 'Unknown error';
    const context: Record<string, any> = {};

    if (error.code) {
        context.code = error.code;
    }
    if (error.path) {
        context.path = error.path;
    }
    if (error.command) {
        context.command = error.command;
    }

    return {
        message,
        context: Object.keys(context).length > 0 ? context : undefined,
    };
}
