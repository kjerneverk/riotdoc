import chalk from "chalk";
import type { StyleValidationResult, StyleViolation } from "./validator.js";

/**
 * Format style validation result for terminal
 */
export function formatStyleReport(result: StyleValidationResult): string {
    const lines: string[] = [];
    
    lines.push(chalk.cyan("\n📊 Document Statistics"));
    lines.push(chalk.gray(`   Words: ${result.stats.wordCount}`));
    lines.push(chalk.gray(`   Sentences: ${result.stats.sentenceCount}`));
    lines.push(chalk.gray(`   Paragraphs: ${result.stats.paragraphCount}`));
    lines.push(chalk.gray(`   Avg words/sentence: ${result.stats.avgWordsPerSentence}`));
    
    if (result.violations.length === 0) {
        lines.push(chalk.green("\n✅ No style violations found."));
        return lines.join("\n");
    }
    
    lines.push(chalk.yellow(`\n⚠️  Style Issues (${result.violations.length}):`));
    
    const grouped = groupViolations(result.violations);
    
    for (const [severity, violations] of Object.entries(grouped)) {
        if (violations.length === 0) continue;
        
        const icon = severity === "error" ? "❌" : severity === "warning" ? "⚠️" : "ℹ️";
        const color = severity === "error" ? chalk.red : severity === "warning" ? chalk.yellow : chalk.gray;
        
        lines.push(color(`\n${icon} ${severity.toUpperCase()} (${violations.length}):`));
        for (const v of violations.slice(0, 5)) {
            const lineInfo = v.line ? ` (line ${v.line})` : "";
            lines.push(color(`   - ${v.message}${lineInfo}`));
        }
        if (violations.length > 5) {
            lines.push(color(`   ... and ${violations.length - 5} more`));
        }
    }
    
    return lines.join("\n");
}

function groupViolations(violations: StyleViolation[]): Record<string, StyleViolation[]> {
    return {
        error: violations.filter(v => v.severity === "error"),
        warning: violations.filter(v => v.severity === "warning"),
        info: violations.filter(v => v.severity === "info"),
    };
}
