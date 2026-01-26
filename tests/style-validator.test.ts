import { describe, it, expect } from "vitest";
import { validateStyle } from "../src/style/validator.js";

describe("Style Validator", () => {
    describe("word count", () => {
        it("should detect exceeding max word count", () => {
            const content = "This is a test document with many words in it.";
            const result = validateStyle(content, { maxWordCount: 5 });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "max-word-count",
                    severity: "warning"
                })
            );
        });

        it("should detect below min word count", () => {
            const content = "Short.";
            const result = validateStyle(content, { minWordCount: 100 });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "min-word-count",
                    severity: "warning"
                })
            );
        });

        it("should pass when within limits", () => {
            const content = "This is a test document.";
            const result = validateStyle(content, { 
                minWordCount: 3, 
                maxWordCount: 10 
            });
            
            const wordCountViolations = result.violations.filter(
                v => v.rule === "max-word-count" || v.rule === "min-word-count"
            );
            expect(wordCountViolations).toHaveLength(0);
        });
    });

    describe("sentence length", () => {
        it("should detect long sentences", () => {
            const content = "This is a very long sentence that goes on and on and contains many words that exceed the limit.";
            const result = validateStyle(content, { maxSentenceLength: 10 });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "sentence-length",
                    severity: "info"
                })
            );
        });

        it("should not flag short sentences", () => {
            const content = "This is short.";
            const result = validateStyle(content, { maxSentenceLength: 10 });
            
            const sentenceViolations = result.violations.filter(
                v => v.rule === "sentence-length"
            );
            expect(sentenceViolations).toHaveLength(0);
        });
    });

    describe("passive voice", () => {
        it("should detect passive voice with 'was'", () => {
            const content = "The document was created yesterday.";
            const result = validateStyle(content, { checkPassiveVoice: true });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "passive-voice",
                    severity: "info"
                })
            );
        });

        it("should detect passive voice with 'were'", () => {
            const content = "The documents were written last week.";
            const result = validateStyle(content, { checkPassiveVoice: true });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "passive-voice"
                })
            );
        });

        it("should detect passive voice with 'been'", () => {
            const content = "The work has been completed.";
            const result = validateStyle(content, { checkPassiveVoice: true });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "passive-voice"
                })
            );
        });

        it("should not flag active voice", () => {
            const content = "The boy threw the ball.";
            const result = validateStyle(content, { checkPassiveVoice: true });
            
            const passiveViolations = result.violations.filter(
                v => v.rule === "passive-voice"
            );
            expect(passiveViolations).toHaveLength(0);
        });
    });

    describe("avoid patterns", () => {
        it("should detect avoided patterns", () => {
            const content = "This is very unique and absolutely essential.";
            const result = validateStyle(content, { 
                avoidPatterns: ["very", "absolutely"] 
            });
            
            const patternViolations = result.violations.filter(
                v => v.rule === "avoid-pattern"
            );
            expect(patternViolations.length).toBeGreaterThan(0);
        });

        it("should be case insensitive", () => {
            const content = "This is VERY important.";
            const result = validateStyle(content, { 
                avoidPatterns: ["very"] 
            });
            
            expect(result.violations).toContainEqual(
                expect.objectContaining({ 
                    rule: "avoid-pattern"
                })
            );
        });
    });

    describe("document statistics", () => {
        it("should calculate word count", () => {
            const content = "One two three four five.";
            const result = validateStyle(content, {});
            
            expect(result.stats.wordCount).toBe(5);
        });

        it("should calculate sentence count", () => {
            const content = "First sentence. Second sentence! Third sentence?";
            const result = validateStyle(content, {});
            
            expect(result.stats.sentenceCount).toBe(3);
        });

        it("should calculate paragraph count", () => {
            const content = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
            const result = validateStyle(content, {});
            
            expect(result.stats.paragraphCount).toBe(3);
        });

        it("should calculate average words per sentence", () => {
            const content = "One two. Three four five six.";
            const result = validateStyle(content, {});
            
            expect(result.stats.avgWordsPerSentence).toBe(3); // (2 + 4) / 2 = 3
        });
    });

    describe("validation result", () => {
        it("should be valid when no errors", () => {
            const content = "This is a test.";
            const result = validateStyle(content, {});
            
            expect(result.valid).toBe(true);
        });

        it("should be valid with warnings and info", () => {
            const content = "Short.";
            const result = validateStyle(content, { 
                minWordCount: 100,
                checkPassiveVoice: true 
            });
            
            expect(result.valid).toBe(true);
        });

        it("should include line numbers when available", () => {
            const content = "Line one.\nThis is a very long sentence that goes on and on and on.";
            const result = validateStyle(content, { maxSentenceLength: 5 });
            
            const violation = result.violations.find(v => v.rule === "sentence-length");
            expect(violation?.line).toBe(2);
        });
    });

    describe("empty content", () => {
        it("should handle empty content", () => {
            const content = "";
            const result = validateStyle(content, {});
            
            expect(result.stats.wordCount).toBe(0);
            expect(result.stats.sentenceCount).toBe(0);
        });
    });
});
