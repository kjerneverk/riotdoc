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
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';

/**
 * Parse outline markdown into sections
 */
function parseOutline(content: string): string[] {
    const lines = content.split('\n');
    const sections: string[] = [];
    
    for (const line of lines) {
        if (line.match(/^##\s+/)) {
            sections.push(line);
        }
    }
    
    return sections;
}

/**
 * Insert section into outline
 */
async function insertSection(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const title = args.title as string;
    const after = args.after as string | undefined;
    const position = args.position as number | undefined;
    const outlinePath = join(docPath, 'outline.md');
    
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    let insertIndex: number;
    
    if (after) {
        const afterIndex = lines.findIndex(line => 
            line.toLowerCase().includes(after.toLowerCase())
        );
        
        if (afterIndex === -1) {
            throw new Error(`Section not found: ${after}`);
        }
        
        insertIndex = afterIndex + 1;
    } else if (position) {
        const sections = parseOutline(content);
        if (position < 1 || position > sections.length + 1) {
            throw new Error(`Invalid position: ${position}. Must be between 1 and ${sections.length + 1}`);
        }
        
        let sectionCount = 0;
        insertIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/^##\s+/)) {
                sectionCount++;
                if (sectionCount === position) {
                    insertIndex = i;
                    break;
                }
            }
        }
        
        if (insertIndex === 0) {
            insertIndex = lines.length;
        }
    } else {
        insertIndex = lines.length;
    }
    
    const newSection = `## ${title}`;
    lines.splice(insertIndex, 0, newSection, '');
    
    await writeFile(outlinePath, lines.join('\n'));
    
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'insert',
            title,
            position: insertIndex,
        },
    });
    
    return `✅ Section inserted: "${title}" at position ${insertIndex}`;
}

/**
 * Rename section in outline
 */
async function renameSection(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const oldTitle = args.oldTitle as string;
    const newTitle = args.newTitle as string;
    const outlinePath = join(docPath, 'outline.md');
    
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(oldTitle.toLowerCase())) {
            lines[i] = `## ${newTitle}`;
            found = true;
            break;
        }
    }
    
    if (!found) {
        throw new Error(`Section not found: ${oldTitle}`);
    }
    
    await writeFile(outlinePath, lines.join('\n'));
    
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'rename',
            oldTitle,
            newTitle,
        },
    });
    
    return `✅ Section renamed: "${oldTitle}" → "${newTitle}"`;
}

/**
 * Delete section from outline
 */
async function deleteSection(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const title = args.title as string;
    const outlinePath = join(docPath, 'outline.md');
    
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    let found = false;
    let deleteIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(title.toLowerCase())) {
            deleteIndex = i;
            found = true;
            break;
        }
    }
    
    if (!found) {
        throw new Error(`Section not found: ${title}`);
    }
    
    lines.splice(deleteIndex, lines[deleteIndex + 1] === '' ? 2 : 1);
    
    await writeFile(outlinePath, lines.join('\n'));
    
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'delete',
            title,
        },
    });
    
    return `✅ Section deleted: "${title}"`;
}

/**
 * Move section to new position
 */
async function moveSection(args: Record<string, unknown>): Promise<string> {
    const docPath = (args.path as string) || process.cwd();
    const title = args.title as string;
    const position = args.position as number;
    const outlinePath = join(docPath, 'outline.md');
    
    const content = await readFile(outlinePath, 'utf-8');
    const lines = content.split('\n');
    
    let sectionIndex = -1;
    let sectionLine = '';
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/) && 
            lines[i].toLowerCase().includes(title.toLowerCase())) {
            sectionIndex = i;
            sectionLine = lines[i];
            break;
        }
    }
    
    if (sectionIndex === -1) {
        throw new Error(`Section not found: ${title}`);
    }
    
    lines.splice(sectionIndex, 1);
    
    const sections = parseOutline(lines.join('\n'));
    if (position < 1 || position > sections.length + 1) {
        throw new Error(`Invalid position: ${position}. Must be between 1 and ${sections.length + 1}`);
    }
    
    let insertIndex = 0;
    let sectionCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+/)) {
            sectionCount++;
            if (sectionCount === position) {
                insertIndex = i;
                break;
            }
        }
    }
    
    if (insertIndex === 0 && position > sections.length) {
        insertIndex = lines.length;
    }
    
    lines.splice(insertIndex, 0, sectionLine);
    
    await writeFile(outlinePath, lines.join('\n'));
    
    await logEvent(docPath, {
        timestamp: formatTimestamp(),
        type: 'outline_created',
        data: {
            action: 'move',
            title,
            newPosition: position,
        },
    });
    
    return `✅ Section moved: "${title}" to position ${position}`;
}

export const insertSectionTool: McpTool = {
    name: "riotdoc_outline_insert_section",
    description: "Insert a new section into the document outline. Can specify position or insert after a specific section.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        title: z.string().describe("Section title"),
        position: z.number().optional().describe("Position to insert (1-based, optional)"),
        after: z.string().optional().describe("Insert after this section title (optional)"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await insertSection(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export const renameSectionTool: McpTool = {
    name: "riotdoc_outline_rename_section",
    description: "Rename an existing section in the document outline.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        oldTitle: z.string().describe("Current section title"),
        newTitle: z.string().describe("New section title"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await renameSection(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export const deleteSectionTool: McpTool = {
    name: "riotdoc_outline_delete_section",
    description: "Delete a section from the document outline.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        title: z.string().describe("Section title to delete"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await deleteSection(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export const moveSectionTool: McpTool = {
    name: "riotdoc_outline_move_section",
    description: "Move a section to a new position in the document outline.",
    schema: {
        path: z.string().optional().describe("Path to document directory"),
        title: z.string().describe("Section title to move"),
        position: z.number().describe("New position (1-based)"),
    },
    async execute(args: Record<string, unknown>, _context: ToolExecutionContext): Promise<ToolResult> {
        try {
            const result = await moveSection(args);
            return { success: true, data: { message: result } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};
