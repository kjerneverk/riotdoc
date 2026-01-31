/**
 * MCP tools for outline manipulation
 * 
 * Provides programmatic tools for editing document outlines.
 * Primary method is still direct editing - these tools are for
 * conversational/programmatic manipulation.
 */

import { z } from "zod";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { formatTimestamp } from "./shared.js";
import { logEvent } from "./history.js";
import type { ToolResult, ToolExecutionContext } from '../types.js';

// Tool schemas
export const InsertSectionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    title: z.string().describe("Section title"),
    position: z.number().optional().describe("Position to insert (1-based, optional)"),
    after: z.string().optional().describe("Insert after this section title (optional)"),
});

export const RenameSectionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    oldTitle: z.string().describe("Current section title"),
    newTitle: z.string().describe("New section title"),
});

export const DeleteSectionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    title: z.string().describe("Section title to delete"),
});

export const MoveSectionSchema = z.object({
    path: z.string().optional().describe("Path to document directory"),
    title: z.string().describe("Section title to move"),
    position: z.number().describe("New position (1-based)"),
});

/**
 * Parse outline markdown into sections
 */
function parseOutline(content: string): string[] {
    const lines = content.split('\n');
    const sections: string[] = [];
    
    for (const line of lines) {
        // Match markdown headings (## Section Title)
        if (line.match(/^##\s+/)) {
            sections.push(line);
        }
    }
    
    return sections;
}

/**
 * Find section index by title
 */
function findSectionIndex(sections: string[], title: string): number {
    return sections.findIndex(section => 
        section.toLowerCase().includes(title.toLowerCase())
    );
}

/**
 * Insert section into outline
 */
export async function insertSection(args: z.infer<typeof InsertSectionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const outlinePath = join(docPath, 'outline.md');
    
    // Read current outline
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    // Determine insertion position
    let insertIndex: number;
    
    if (args.after) {
        // Find the section to insert after
        const afterIndex = lines.findIndex(line => 
            line.toLowerCase().includes(args.after!.toLowerCase())
        );
        
        if (afterIndex === -1) {
            throw new Error(`Section not found: ${args.after}`);
        }
        
        insertIndex = afterIndex + 1;
    } else if (args.position) {
        // Count existing sections to validate position
        const sections = parseOutline(content);
        if (args.position < 1 || args.position > sections.length + 1) {
            throw new Error(`Invalid position: ${args.position}. Must be between 1 and ${sections.length + 1}`);
        }
        
        // Find the line index for this section position
        let sectionCount = 0;
        insertIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/^##\s+/)) {
                sectionCount++;
                if (sectionCount === args.position) {
                    insertIndex = i;
                    break;
                }
            }
        }
        
        if (insertIndex === 0) {
            insertIndex = lines.length;
        }
    } else {
        // Append to end
        insertIndex = lines.length;
    }
    
    // Insert new section
    const newSection = `## ${args.title}`;
    lines.splice(insertIndex, 0, newSection, '');
    
    // Write updated outline
    await writeFile(outlinePath, lines.join('\n'));
    
    // Log to timeline
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'insert',
            title: args.title,
            position: insertIndex,
        },
    });
    
    return `✅ Section inserted: "${args.title}" at position ${insertIndex}`;
}

/**
 * Rename section in outline
 */
export async function renameSection(args: z.infer<typeof RenameSectionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const outlinePath = join(docPath, 'outline.md');
    
    // Read current outline
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find and rename section
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(args.oldTitle.toLowerCase())) {
            lines[i] = `## ${args.newTitle}`;
            found = true;
            break;
        }
    }
    
    if (!found) {
        throw new Error(`Section not found: ${args.oldTitle}`);
    }
    
    // Write updated outline
    await writeFile(outlinePath, lines.join('\n'));
    
    // Log to timeline
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'rename',
            oldTitle: args.oldTitle,
            newTitle: args.newTitle,
        },
    });
    
    return `✅ Section renamed: "${args.oldTitle}" → "${args.newTitle}"`;
}

/**
 * Delete section from outline
 */
export async function deleteSection(args: z.infer<typeof DeleteSectionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const outlinePath = join(docPath, 'outline.md');
    
    // Read current outline
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find and delete section
    let found = false;
    let deleteIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(args.title.toLowerCase())) {
            deleteIndex = i;
            found = true;
            break;
        }
    }
    
    if (!found) {
        throw new Error(`Section not found: ${args.title}`);
    }
    
    // Remove section line (and empty line after if present)
    lines.splice(deleteIndex, lines[deleteIndex + 1] === '' ? 2 : 1);
    
    // Write updated outline
    await writeFile(outlinePath, lines.join('\n'));
    
    // Log to timeline
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'delete',
            title: args.title,
        },
    });
    
    return `✅ Section deleted: "${args.title}"`;
}

/**
 * Move section to new position
 */
export async function moveSection(args: z.infer<typeof MoveSectionSchema>): Promise<string> {
    const docPath = args.path || process.cwd();
    const outlinePath = join(docPath, 'outline.md');
    
    // Read current outline
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find section to move
    let sectionIndex = -1;
    let sectionLine = '';
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(args.title.toLowerCase())) {
            sectionIndex = i;
            sectionLine = lines[i];
            break;
        }
    }
    
    if (sectionIndex === -1) {
        throw new Error(`Section not found: ${args.title}`);
    }
    
    // Remove section from current position
    lines.splice(sectionIndex, 1);
    
    // Calculate new position (adjust if moving down)
    const sections = parseOutline(lines.join('\n'));
    if (args.position < 1 || args.position > sections.length + 1) {
        throw new Error(`Invalid position: ${args.position}. Must be between 1 and ${sections.length + 1}`);
    }
    
    // Find insertion point
    let insertIndex = 0;
    let sectionCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/)) {
            sectionCount++;
            if (sectionCount === args.position) {
                insertIndex = i;
                break;
            }
        }
    }
    
    if (insertIndex === 0 && args.position > sections.length) {
        insertIndex = lines.length;
    }
    
    // Insert at new position
    lines.splice(insertIndex, 0, sectionLine);
    
    // Write updated outline
    await writeFile(outlinePath, lines.join('\n'));
    
    // Log to timeline
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'move',
            title: args.title,
            newPosition: args.position,
        },
    });
    
    return `✅ Section moved: "${args.title}" to position ${args.position}`;
}

// Tool executors for MCP

export async function executeInsertSection(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = InsertSectionSchema.parse(args);
        const result = await insertSection(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeRenameSection(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = RenameSectionSchema.parse(args);
        const result = await renameSection(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeDeleteSection(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = DeleteSectionSchema.parse(args);
        const result = await deleteSection(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function executeMoveSection(args: any, _context: ToolExecutionContext): Promise<ToolResult> {
    try {
        const validated = MoveSectionSchema.parse(args);
        const result = await moveSection(validated);
        return { success: true, data: { message: result } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Tool definitions for MCP
import type { McpTool } from '../types.js';

export const insertSectionTool: McpTool = {
    name: "riotdoc_outline_insert_section",
    description: "Insert a new section into the document outline. Can specify position or insert after a specific section.",
    inputSchema: InsertSectionSchema.shape as any,
};

export const renameSectionTool: McpTool = {
    name: "riotdoc_outline_rename_section",
    description: "Rename an existing section in the document outline.",
    inputSchema: RenameSectionSchema.shape as any,
};

export const deleteSectionTool: McpTool = {
    name: "riotdoc_outline_delete_section",
    description: "Delete a section from the document outline.",
    inputSchema: DeleteSectionSchema.shape as any,
};

export const moveSectionTool: McpTool = {
    name: "riotdoc_outline_move_section",
    description: "Move a section to a new position in the document outline.",
    inputSchema: MoveSectionSchema.shape as any,
};
