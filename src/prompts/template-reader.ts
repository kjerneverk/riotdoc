/**
 * Template Reading Module
 * 
 * Parses document templates to extract questions, approaches, and output structures.
 * This is the CORE INNOVATION: Templates are scripts that drive prompt behavior.
 * 
 * When a prompt needs to know what to ask, it reads the template dynamically.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Template questions organized by lifecycle phase
 */
export interface TemplateQuestions {
    /** Questions for Idea/Draft phase (immediate concerns) */
    ideaDraft: string[];
    
    /** Questions for Publishing phase (later concerns) */
    publishing: string[];
}

/**
 * A document creation approach/strategy
 */
export interface TemplateApproach {
    /** Approach name (e.g., "Quick & Direct") */
    name: string;
    
    /** When to use this approach */
    whenToUse: string;
    
    /** Strategy description */
    strategy: string;
    
    /** Expected output */
    output: string;
}

/**
 * Parsed template structure
 */
export interface Template {
    /** Questions organized by phase */
    questions: TemplateQuestions;
    
    /** Available approaches for this document type */
    approaches: TemplateApproach[];
    
    /** Output document structure (markdown template) */
    outputStructure: string;
}

/**
 * Read and parse a document template
 * 
 * @param templatePath - Path to template file (relative to templates/ or absolute)
 * @returns Parsed template with questions, approaches, and output structure
 * 
 * @example
 * ```typescript
 * const template = await readTemplate('blog-post.md');
 * console.log(template.questions.ideaDraft); // ["What's the title?", ...]
 * console.log(template.approaches); // [{ name: "Quick & Direct", ... }]
 * ```
 */
export async function readTemplate(templatePath: string): Promise<Template> {
    // Resolve path (support both relative and absolute paths)
    const fullPath = templatePath.startsWith('/') 
        ? templatePath 
        : join(process.cwd(), 'templates', templatePath);
    
    const content = await readFile(fullPath, 'utf-8');
    
    // Parse Idea/Draft Phase Questions
    const ideaDraftSection = extractSection(content, '## Idea/Draft Phase Questions');
    const ideaDraftQuestions = parseQuestions(ideaDraftSection);
    
    // Parse Publishing Phase Questions
    const publishingSection = extractSection(content, '## Publishing Phase Questions');
    const publishingQuestions = parseQuestions(publishingSection);
    
    // Parse Available Approaches
    const approachesSection = extractSection(content, '## Available Approaches');
    const approaches = parseApproaches(approachesSection);
    
    // Parse Output Document Structure
    const outputSection = extractSection(content, '## Output Document Structure');
    
    return {
        questions: {
            ideaDraft: ideaDraftQuestions,
            publishing: publishingQuestions
        },
        approaches,
        outputStructure: outputSection
    };
}

/**
 * Extract a section from markdown content by header
 * 
 * @param content - Full markdown content
 * @param header - Section header to find (e.g., "## Idea/Draft Phase Questions")
 * @returns Section content (from header to next ## header or end of file)
 */
function extractSection(content: string, header: string): string {
    const start = content.indexOf(header);
    if (start === -1) return '';
    
    // Find next section header (## at start of line)
    const nextHeader = content.indexOf('\n## ', start + header.length);
    return nextHeader === -1 
        ? content.substring(start) 
        : content.substring(start, nextHeader);
}

/**
 * Parse questions from a section
 * 
 * Extracts questions from markdown list items:
 * - "- **Title**: What's the title?" → "What's the title?"
 * - "- What's the topic?" → "What's the topic?"
 * 
 * @param section - Section content containing questions
 * @returns Array of question strings
 */
function parseQuestions(section: string): string[] {
    const lines = section.split('\n');
    const questions: string[] = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('- **')) {
            // Format: "- **Field**: Question text"
            // Extract question: "- **Title**: What's the title?" → "What's the title?"
            const match = trimmed.match(/- \*\*[^*]+\*\*:\s*(.+)/);
            if (match) {
                questions.push(match[1]);
            }
        } else if (trimmed.startsWith('- ')) {
            // Simple list item: "- What's the topic?"
            questions.push(trimmed.substring(2));
        }
    }
    
    return questions;
}

/**
 * Parse approaches from a section
 * 
 * Looks for approach definitions with structure:
 * ### Approach Name
 * **When to use**: ...
 * **Strategy**: ...
 * **Output**: ...
 * 
 * @param section - Section content containing approaches
 * @returns Array of parsed approaches
 */
function parseApproaches(section: string): TemplateApproach[] {
    const approaches: TemplateApproach[] = [];
    const lines = section.split('\n');
    
    let currentApproach: Partial<TemplateApproach> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // New approach starts with ### heading
        if (line.startsWith('### ')) {
            // Save previous approach if exists
            if (currentApproach && currentApproach.name) {
                approaches.push(currentApproach as TemplateApproach);
            }
            
            // Start new approach
            currentApproach = {
                name: line.substring(4).trim(),
                whenToUse: '',
                strategy: '',
                output: ''
            };
        }
        // Parse approach fields
        else if (currentApproach) {
            if (line.startsWith('**When to use**:')) {
                currentApproach.whenToUse = line.substring(16).trim();
            } else if (line.startsWith('**Strategy**:')) {
                currentApproach.strategy = line.substring(13).trim();
            } else if (line.startsWith('**Output**:')) {
                currentApproach.output = line.substring(11).trim();
            }
            // Multi-line field continuation
            else if (line && !line.startsWith('**') && !line.startsWith('###')) {
                // Append to last field
                if (currentApproach.output && !line.startsWith('-')) {
                    currentApproach.output += ' ' + line;
                } else if (currentApproach.strategy && !line.startsWith('-')) {
                    currentApproach.strategy += ' ' + line;
                } else if (currentApproach.whenToUse && !line.startsWith('-')) {
                    currentApproach.whenToUse += ' ' + line;
                }
            }
        }
    }
    
    // Save last approach
    if (currentApproach && currentApproach.name) {
        approaches.push(currentApproach as TemplateApproach);
    }
    
    return approaches;
}

/**
 * Group questions for conversational flow
 * 
 * Groups related questions together for asking 2-5 at a time.
 * This creates natural conversation flow instead of overwhelming the user.
 * 
 * @param questions - Array of questions to group
 * @param groupSize - Desired group size (default: 3)
 * @returns Array of question groups
 * 
 * @example
 * ```typescript
 * const questions = ["Title?", "Topic?", "Angle?", "Length?", "Purpose?"];
 * const groups = groupQuestions(questions, 2);
 * // Result: [["Title?", "Topic?"], ["Angle?", "Length?"], ["Purpose?"]]
 * ```
 */
export function groupQuestions(questions: string[], groupSize: number = 3): string[][] {
    const groups: string[][] = [];
    
    for (let i = 0; i < questions.length; i += groupSize) {
        groups.push(questions.slice(i, i + groupSize));
    }
    
    return groups;
}

/**
 * Format approaches for presentation to user
 * 
 * Creates a readable list of approaches with descriptions.
 * 
 * @param approaches - Array of approaches to format
 * @returns Formatted markdown string
 * 
 * @example
 * ```typescript
 * const formatted = formatApproaches(template.approaches);
 * // Result:
 * // "1. **Quick & Direct**: For quick posts without much planning
 * //  2. **Structured Single Post**: For well-developed, polished posts
 * //  3. **Multi-Post Series**: For breaking into multiple related posts"
 * ```
 */
export function formatApproaches(approaches: TemplateApproach[]): string {
    return approaches
        .map((approach, index) => 
            `${index + 1}. **${approach.name}**: ${approach.whenToUse}`
        )
        .join('\n');
}

/**
 * Resolve template path from document type
 * 
 * @param documentType - Document type (e.g., "blog-post", "podcast-script")
 * @returns Template filename
 * 
 * @example
 * ```typescript
 * const filename = resolveTemplatePath('blog-post');
 * // Result: "blog-post-template.md"
 * ```
 */
export function resolveTemplatePath(documentType: string): string {
    return `${documentType}-template.md`;
}
