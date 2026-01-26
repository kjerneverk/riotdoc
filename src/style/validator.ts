export interface StyleViolation {
    rule: string;
    message: string;
    line?: number;
    severity: "error" | "warning" | "info";
}

export interface StyleValidationResult {
    valid: boolean;
    violations: StyleViolation[];
    stats: DocumentStats;
}

export interface DocumentStats {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    avgSentencesPerParagraph: number;
}

/**
 * Validate document content against style rules
 */
export function validateStyle(
    content: string,
    rules: StyleRules
): StyleValidationResult {
    const violations: StyleViolation[] = [];
    const stats = calculateStats(content);
    
    // Check word count
    if (rules.maxWordCount && stats.wordCount > rules.maxWordCount) {
        violations.push({
            rule: "max-word-count",
            message: `Document has ${stats.wordCount} words, exceeds max of ${rules.maxWordCount}`,
            severity: "warning",
        });
    }
    
    if (rules.minWordCount && stats.wordCount < rules.minWordCount) {
        violations.push({
            rule: "min-word-count",
            message: `Document has ${stats.wordCount} words, below min of ${rules.minWordCount}`,
            severity: "warning",
        });
    }
    
    // Check sentence length
    if (rules.maxSentenceLength) {
        const longSentences = findLongSentences(content, rules.maxSentenceLength);
        for (const sentence of longSentences) {
            violations.push({
                rule: "sentence-length",
                message: `Sentence has ${sentence.wordCount} words: "${sentence.preview}..."`,
                line: sentence.line,
                severity: "info",
            });
        }
    }
    
    // Check passive voice
    if (rules.checkPassiveVoice) {
        const passiveInstances = findPassiveVoice(content);
        for (const instance of passiveInstances) {
            violations.push({
                rule: "passive-voice",
                message: `Possible passive voice: "${instance.text}"`,
                line: instance.line,
                severity: "info",
            });
        }
    }
    
    // Check for avoid patterns
    if (rules.avoidPatterns) {
        for (const pattern of rules.avoidPatterns) {
            const regex = new RegExp(pattern, "gi");
            const matches = content.matchAll(regex);
            for (const match of matches) {
                violations.push({
                    rule: "avoid-pattern",
                    message: `Found "${match[0]}" which should be avoided`,
                    severity: "warning",
                });
            }
        }
    }
    
    return {
        valid: violations.filter(v => v.severity === "error").length === 0,
        violations,
        stats,
    };
}

export interface StyleRules {
    maxWordCount?: number;
    minWordCount?: number;
    maxSentenceLength?: number;
    checkPassiveVoice?: boolean;
    avoidPatterns?: string[];
}

/**
 * Calculate document statistics
 */
function calculateStats(content: string): DocumentStats {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgWordsPerSentence: sentences.length > 0 
            ? Math.round(words.length / sentences.length) 
            : 0,
        avgSentencesPerParagraph: paragraphs.length > 0 
            ? Math.round(sentences.length / paragraphs.length) 
            : 0,
    };
}

/**
 * Find sentences exceeding word limit
 */
function findLongSentences(
    content: string, 
    maxWords: number
): Array<{ wordCount: number; preview: string; line: number }> {
    const results: Array<{ wordCount: number; preview: string; line: number }> = [];
    const lines = content.split("\n");
    
    let lineNum = 0;
    for (const line of lines) {
        lineNum++;
        const sentences = line.split(/[.!?]+/);
        for (const sentence of sentences) {
            const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
            if (words.length > maxWords) {
                results.push({
                    wordCount: words.length,
                    preview: sentence.trim().slice(0, 50),
                    line: lineNum,
                });
            }
        }
    }
    
    return results;
}

/**
 * Simple passive voice detection
 */
function findPassiveVoice(content: string): Array<{ text: string; line: number }> {
    const results: Array<{ text: string; line: number }> = [];
    const lines = content.split("\n");
    
    // Common passive voice patterns
    const passivePatterns = [
        /\b(was|were|been|being|is|are|am)\s+\w+ed\b/gi,
        /\b(was|were|been|being|is|are|am)\s+\w+en\b/gi,
    ];
    
    let lineNum = 0;
    for (const line of lines) {
        lineNum++;
        for (const pattern of passivePatterns) {
            const matches = line.matchAll(pattern);
            for (const match of matches) {
                results.push({
                    text: match[0],
                    line: lineNum,
                });
            }
        }
    }
    
    return results;
}
