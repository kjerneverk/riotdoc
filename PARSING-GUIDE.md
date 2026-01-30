# Template Parsing Guide for Prompt Authors

This guide explains how to parse and use RiotDoc templates at runtime. Templates are markdown files with well-defined sections that prompts read to guide document creation workflows.

---

## Overview

Templates are **scripts that tell prompts what to ask**. They define:
- Questions to ask (split by lifecycle phase)
- Approaches/strategies available
- Final document structure

Prompts parse templates at runtime to:
1. Extract questions for each phase
2. Present approach options to users
3. Guide conversational workflow
4. Generate final documents

---

## Template Structure

Every template has these sections:

```markdown
# [Document Type] Document Template

## Questions to Answer
### Idea/Draft Phase
[Questions for immediate creative decisions]

### Publishing Phase
[Questions for "after the fact" concerns]

## Available Approaches
### Approach 1: [Name]
[Definition with when/strategy/output/workflow]

### Approach 2: [Name]
[Definition]

## Output Document Structure
```markdown
[Template for final document]
```
```

---

## Parsing Questions

### Step 1: Load Template File

```typescript
import { readFile } from 'fs/promises';

async function loadTemplate(templateName: string): Promise<string> {
  const path = `./templates/${templateName}-template.md`;
  return await readFile(path, 'utf-8');
}

const template = await loadTemplate('blog-post');
```

### Step 2: Extract Idea/Draft Phase Questions

**Find the section**:
```typescript
function extractIdeaDraftQuestions(template: string): Question[] {
  // Find "## Questions to Answer" section
  const questionsSection = extractSection(template, '## Questions to Answer');
  
  // Find "### Idea/Draft Phase" subsection
  const ideaDraftSection = extractSubsection(questionsSection, '### Idea/Draft Phase');
  
  return parseQuestions(ideaDraftSection);
}
```

**Parse questions**:
```typescript
interface Question {
  text: string;
  guidance?: string;
  category?: string;
}

function parseQuestions(section: string): Question[] {
  const questions: Question[] = [];
  const lines = section.split('\n');
  let currentCategory: string | undefined;
  
  for (const line of lines) {
    // Category headers (#### Heading)
    if (line.startsWith('####')) {
      currentCategory = line.replace(/^####\s*/, '').trim();
      continue;
    }
    
    // Questions (- **Label**: Question text)
    const match = line.match(/^-\s*\*\*(.+?)\*\*:\s*(.+)$/);
    if (match) {
      const [, label, questionText] = match;
      
      // Extract guidance from parentheses
      const guidanceMatch = questionText.match(/^(.+?)\s*\((.+)\)$/);
      
      questions.push({
        text: guidanceMatch ? guidanceMatch[1].trim() : questionText.trim(),
        guidance: guidanceMatch ? guidanceMatch[2].trim() : undefined,
        category: currentCategory,
      });
    }
  }
  
  return questions;
}
```

**Example output**:
```typescript
[
  {
    text: "What's the title?",
    guidance: "or idea for title",
    category: "Core Content"
  },
  {
    text: "What's the main subject?",
    category: "Core Content"
  },
  {
    text: "What's your unique take or perspective?",
    category: "Core Content"
  },
  // ...
]
```

### Step 3: Extract Publishing Phase Questions

Same process as Idea/Draft, but extract `### Publishing Phase` subsection:

```typescript
function extractPublishingQuestions(template: string): Question[] {
  const questionsSection = extractSection(template, '## Questions to Answer');
  const publishingSection = extractSubsection(questionsSection, '### Publishing Phase');
  return parseQuestions(publishingSection);
}
```

---

## Parsing Approaches

### Step 1: Extract Approaches Section

```typescript
interface Approach {
  name: string;
  whenToUse: string;
  strategy: string;
  output: string;
  workflow: string[];
}

function extractApproaches(template: string): Approach[] {
  const approachesSection = extractSection(template, '## Available Approaches');
  return parseApproaches(approachesSection);
}
```

### Step 2: Parse Each Approach

```typescript
function parseApproaches(section: string): Approach[] {
  const approaches: Approach[] = [];
  
  // Split by "### Approach N:" headers
  const approachBlocks = section.split(/^### Approach \d+:/m).slice(1);
  
  for (const block of approachBlocks) {
    const lines = block.split('\n');
    const name = lines[0].trim();
    
    const approach: Approach = {
      name,
      whenToUse: extractField(block, '**When to use**:'),
      strategy: extractField(block, '**Strategy**:'),
      output: extractField(block, '**Output**:'),
      workflow: extractWorkflow(block),
    };
    
    approaches.push(approach);
  }
  
  return approaches;
}

function extractField(text: string, fieldName: string): string {
  const match = text.match(new RegExp(`${fieldName}\\s*(.+?)(?=\\n\\*\\*|\\n\\n|$)`, 's'));
  return match ? match[1].trim() : '';
}

function extractWorkflow(text: string): string[] {
  const workflowMatch = text.match(/\*\*Workflow\*\*:\s*\n((?:\d+\..+\n?)+)/);
  if (!workflowMatch) return [];
  
  return workflowMatch[1]
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*/, '').trim());
}
```

**Example output**:
```typescript
[
  {
    name: "Quick & Direct",
    whenToUse: "You have a simple idea and want to write and publish quickly.",
    strategy: "Minimal planning, write in one sitting, light editing.",
    output: "Single blog post, 500-1000 words.",
    workflow: [
      "Answer 3-5 core questions (title, topic, angle, tone)",
      "Draft in one session",
      "Quick revision",
      "Publish"
    ]
  },
  // ...
]
```

---

## Parsing Output Structure

### Extract Document Template

```typescript
function extractOutputStructure(template: string): string {
  const section = extractSection(template, '## Output Document Structure');
  
  // Extract markdown code block
  const codeBlockMatch = section.match(/```markdown\n([\s\S]+?)\n```/);
  
  return codeBlockMatch ? codeBlockMatch[1] : '';
}
```

**Example output**:
```markdown
# [Blog Post Title]

**Author**: [Name]
**Date**: [Date]
**Category**: [Category]

---

## Introduction
[Hook that grabs attention]
...
```

### Use as Template

```typescript
function generateDocument(structure: string, values: Record<string, string>): string {
  let document = structure;
  
  // Replace [placeholders] with actual values
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `[${key}]`;
    document = document.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return document;
}

// Usage
const structure = extractOutputStructure(template);
const document = generateDocument(structure, {
  'Blog Post Title': 'Building Better APIs',
  'Name': 'John Doe',
  'Date': '2026-01-30',
  'Category': 'Engineering',
  // ...
});
```

---

## Conversational Workflow

### Phase 1: Select Approach

```typescript
async function selectApproach(approaches: Approach[]): Promise<Approach> {
  // Present approaches to user
  console.log("How would you like to create this document?\n");
  
  approaches.forEach((approach, index) => {
    console.log(`${index + 1}. ${approach.name}`);
    console.log(`   ${approach.whenToUse}`);
    console.log(`   Output: ${approach.output}\n`);
  });
  
  // Get user selection
  const selection = await getUserInput("Which approach fits your needs? (1-3): ");
  return approaches[parseInt(selection) - 1];
}
```

### Phase 2: Ask Idea/Draft Questions

**Key principle**: Ask 2-5 questions at a time, conversationally. Don't dump all questions at once.

```typescript
async function askIdeaDraftQuestions(questions: Question[]): Promise<Record<string, string>> {
  const responses: Record<string, string> = {};
  
  // Group questions by category
  const categories = groupByCategory(questions);
  
  for (const [category, categoryQuestions] of Object.entries(categories)) {
    console.log(`\n--- ${category} ---\n`);
    
    // Ask 2-5 questions at a time
    for (const question of categoryQuestions) {
      const prompt = question.guidance 
        ? `${question.text} (${question.guidance})`
        : question.text;
      
      const response = await getUserInput(prompt);
      responses[question.text] = response;
      
      // Capture narrative
      await captureNarrative({
        content: `${question.text}: ${response}`,
        context: "Answering Idea/Draft phase questions"
      });
    }
  }
  
  return responses;
}
```

### Phase 3: Draft Document

Based on selected approach, guide user through drafting:

```typescript
async function draftDocument(approach: Approach, responses: Record<string, string>) {
  console.log(`\nGreat! Let's create your document using the "${approach.name}" approach.\n`);
  
  // Show workflow steps
  console.log("Here's the workflow:");
  approach.workflow.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
  
  // Guide through each step
  for (const step of approach.workflow) {
    console.log(`\n--- ${step} ---\n`);
    await executeWorkflowStep(step, responses);
  }
}
```

### Phase 4: Ask Publishing Questions

When ready to publish:

```typescript
async function askPublishingQuestions(questions: Question[]): Promise<Record<string, string>> {
  console.log("\n--- Publishing Phase ---\n");
  console.log("Let's prepare your document for publishing.\n");
  
  const responses: Record<string, string> = {};
  
  // Same conversational approach as Idea/Draft
  for (const question of questions) {
    const response = await getUserInput(question.text);
    responses[question.text] = response;
    
    await captureNarrative({
      content: `${question.text}: ${response}`,
      context: "Answering Publishing phase questions"
    });
  }
  
  return responses;
}
```

### Phase 5: Generate Final Document

```typescript
async function generateFinalDocument(
  template: string,
  ideaDraftResponses: Record<string, string>,
  publishingResponses: Record<string, string>,
  draftContent: string
): Promise<string> {
  const structure = extractOutputStructure(template);
  
  // Combine all responses
  const allResponses = { ...ideaDraftResponses, ...publishingResponses };
  
  // Generate document from template
  let document = generateDocument(structure, allResponses);
  
  // Insert drafted content
  document = insertDraftContent(document, draftContent);
  
  return document;
}
```

---

## Complete Workflow Example

```typescript
async function createDocument(templateName: string) {
  // 1. Load template
  const template = await loadTemplate(templateName);
  
  // 2. Parse template
  const ideaDraftQuestions = extractIdeaDraftQuestions(template);
  const publishingQuestions = extractPublishingQuestions(template);
  const approaches = extractApproaches(template);
  
  // 3. Select approach
  const selectedApproach = await selectApproach(approaches);
  await captureNarrative({
    content: `Selected approach: ${selectedApproach.name}`,
    context: "Choosing document creation strategy"
  });
  
  // 4. Ask Idea/Draft questions
  const ideaDraftResponses = await askIdeaDraftQuestions(ideaDraftQuestions);
  
  // 5. Draft document
  const draftContent = await draftDocument(selectedApproach, ideaDraftResponses);
  
  // 6. Ask Publishing questions
  const publishingResponses = await askPublishingQuestions(publishingQuestions);
  
  // 7. Generate final document
  const finalDocument = await generateFinalDocument(
    template,
    ideaDraftResponses,
    publishingResponses,
    draftContent
  );
  
  // 8. Save document
  await saveDocument(finalDocument);
  
  console.log("\nDocument created successfully!");
}
```

---

## Helper Functions

### Extract Section

```typescript
function extractSection(markdown: string, heading: string): string {
  const lines = markdown.split('\n');
  const startIndex = lines.findIndex(line => line.trim() === heading);
  
  if (startIndex === -1) return '';
  
  // Find next heading of same or higher level
  const headingLevel = heading.match(/^#+/)?.[0].length || 2;
  const endIndex = lines.findIndex((line, index) => {
    if (index <= startIndex) return false;
    const match = line.match(/^#+/);
    return match && match[0].length <= headingLevel;
  });
  
  const sectionLines = endIndex === -1 
    ? lines.slice(startIndex + 1)
    : lines.slice(startIndex + 1, endIndex);
  
  return sectionLines.join('\n');
}
```

### Extract Subsection

```typescript
function extractSubsection(section: string, subheading: string): string {
  return extractSection(section, subheading);
}
```

### Group Questions by Category

```typescript
function groupByCategory(questions: Question[]): Record<string, Question[]> {
  const grouped: Record<string, Question[]> = {};
  
  for (const question of questions) {
    const category = question.category || 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(question);
  }
  
  return grouped;
}
```

---

## Best Practices

### 1. Ask Questions Conversationally

❌ **Don't**: Dump all questions at once
```
What's the title?
What's the topic?
What's the angle?
What's the length?
What's the purpose?
What's the tone?
[20 more questions...]
```

✅ **Do**: Ask 2-5 at a time, grouped by category
```
"Let's start with the core content."
"What's the title or idea for a title?"
[User responds]
"Great! What's the main topic?"
[User responds]
"What's your unique angle or perspective?"
[Continue...]
```

### 2. Capture Narrative Throughout

Capture user responses and decisions as narrative:

```typescript
await captureNarrative({
  content: "Title: 'Building Better APIs'\nTopic: API design\nAngle: Focus on DX",
  context: "Answering Idea/Draft phase questions"
});

await captureNarrative({
  content: "Selected approach: Structured Single Post - Complex idea needs detailed outline",
  context: "Choosing document creation strategy"
});
```

### 3. Adapt Workflow to Approach

Different approaches = different workflows:

**Quick & Direct**:
- Minimal questions (3-5)
- Fast drafting
- Light revision

**Structured**:
- All Idea/Draft questions
- Detailed outline phase
- Section-by-section drafting
- Thorough revision

**Multi-Part**:
- Break into sub-topics
- Create multiple documents
- Ensure continuity

### 4. Handle Missing Sections Gracefully

Not all templates may have all sections (especially older templates):

```typescript
function extractIdeaDraftQuestions(template: string): Question[] {
  try {
    // Try to extract Idea/Draft phase
    return extractIdeaDraftQuestionsFromPhase(template);
  } catch {
    // Fall back to all questions
    return extractAllQuestions(template);
  }
}
```

### 5. Support Template Evolution

Templates may change over time. Parse defensively:

```typescript
function parseApproaches(section: string): Approach[] {
  try {
    return parseApproachesStrict(section);
  } catch (error) {
    console.warn('Failed to parse approaches strictly, using fallback');
    return parseApproachesFallback(section);
  }
}
```

---

## Testing Templates

### Validation Checklist

```typescript
function validateTemplate(template: string): ValidationResult {
  const errors: string[] = [];
  
  // Check required sections
  if (!hasSection(template, '## Questions to Answer')) {
    errors.push('Missing "## Questions to Answer" section');
  }
  
  if (!hasSubsection(template, '### Idea/Draft Phase')) {
    errors.push('Missing "### Idea/Draft Phase" subsection');
  }
  
  if (!hasSubsection(template, '### Publishing Phase')) {
    errors.push('Missing "### Publishing Phase" subsection');
  }
  
  if (!hasSection(template, '## Available Approaches')) {
    errors.push('Missing "## Available Approaches" section');
  }
  
  if (!hasSection(template, '## Output Document Structure')) {
    errors.push('Missing "## Output Document Structure" section');
  }
  
  // Check approaches
  const approaches = extractApproaches(template);
  if (approaches.length < 2) {
    errors.push('Should have at least 2 approaches defined');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## Related Documentation

- `TEMPLATE-STRUCTURE.md` - Canonical template structure specification
- `TEMPLATE-EXAMPLE.md` - Example template showing structure in practice
- Individual template files in `templates/` directory

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-30
**Status**: Guide for prompt authors
