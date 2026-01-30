# Template System

RiotDoc uses a template-driven approach where templates act as scripts that guide the document creation workflow.

## Overview

Templates define:
- Questions to ask users (split by lifecycle phase)
- Available approaches/strategies for creating the document
- Final document structure

Prompts read templates dynamically at runtime, so changing a template automatically adapts the entire workflow.

## Template Structure

Every RiotDoc template has four required sections:

### 1. Idea/Draft Phase Questions

Questions about immediate creative concerns - things you know NOW when starting:

```markdown
## Questions to Answer
### Idea/Draft Phase

#### Core Content
- **Title**: What's the title? (or idea for title)
- **Topic**: What's the main subject?
- **Angle**: What's your unique perspective?
```

### 2. Publishing Phase Questions

Questions about "after the fact" concerns - things you figure out LATER:

```markdown
### Publishing Phase

#### SEO & Discoverability
- **SEO keywords**: Any specific keywords to target?
- **Category/tags**: How should this be categorized?
```

### 3. Available Approaches

Different strategies for creating this document type:

```markdown
## Available Approaches

### Approach 1: Quick & Direct
**When to use**: Simple idea, write and publish quickly.

**Strategy**: Minimal planning, write in one sitting.

**Output**: Single document, 500-1000 words.

**Workflow**:
1. Answer 3-5 core questions
2. Draft in one session
3. Quick revision
4. Publish
```

### 4. Output Document Structure

The markdown template for the final document:

````markdown
## Output Document Structure

```markdown
# [Document Title]

**Author**: [Name]
**Date**: [Date]

## Introduction
[Hook that grabs attention]

## [Section 1]
[Content]
```
````

## Design Principles

### Lifecycle-Aware
Questions are split by WHEN they're answered (NOW vs LATER), not by category.

### Conversational
Templates support asking 2-5 questions at a time, not overwhelming users with 20 questions upfront.

### Machine-Readable
Prompts parse templates at runtime through consistent section names and markdown conventions.

### Approach-Driven
Different situations need different workflows. Templates define multiple approaches so users can choose what fits their needs.

## Creating Templates

When creating a new template:

1. **Split questions by lifecycle phase**
   - Idea/Draft: Things you know NOW (title, topic, angle, purpose)
   - Publishing: Things you figure out LATER (SEO, categories, images)

2. **Define 2-3+ approaches** for different situations
   - Quick/simple vs structured/complex
   - Single document vs multiple documents

3. **Make questions conversational**
   - Clear and specific
   - Can be answered 2-5 at a time
   - Include guidance in parentheses when helpful

4. **Provide complete output structure**
   - Use `[placeholder]` format for values
   - Show the full document structure
   - Keep it simple markdown

## Validation Checklist

- [ ] Has `## Questions to Answer` section
- [ ] Has `### Idea/Draft Phase` with appropriate questions
- [ ] Has `### Publishing Phase` with appropriate questions
- [ ] Idea/Draft questions focus on immediate concerns
- [ ] Publishing questions focus on "after the fact" concerns
- [ ] Has `## Available Approaches` section
- [ ] Each approach has: name, when to use, strategy, output, workflow
- [ ] At least 2-3 approaches defined
- [ ] Has `## Output Document Structure` section
- [ ] Output structure uses `[placeholder]` format
- [ ] Template is simple markdown with consistent sections

## Example Templates

RiotDoc includes templates for:
- Blog posts
- Podcast scripts
- Email messages
- Project plans
- Research papers

See the `templates/` directory for examples.

## For Developers: Parsing Templates

If you're building prompts or tools that work with templates:

### Reading Questions

```typescript
// 1. Load template
const template = await readFile(`templates/${type}-template.md`, 'utf-8');

// 2. Extract Idea/Draft questions
const questionsSection = extractSection(template, '## Questions to Answer');
const ideaDraftSection = extractSubsection(questionsSection, '### Idea/Draft Phase');
const questions = parseQuestions(ideaDraftSection);

// 3. Ask conversationally (2-5 at a time)
for (const question of questions) {
  const response = await ask(question.text);
  await captureNarrative({ content: `${question.text}: ${response}` });
}
```

### Reading Approaches

```typescript
// 1. Extract approaches section
const approachesSection = extractSection(template, '## Available Approaches');

// 2. Parse each approach
const approaches = parseApproaches(approachesSection);

// 3. Present to user
console.log("How would you like to create this document?");
approaches.forEach((approach, i) => {
  console.log(`${i+1}. ${approach.name} - ${approach.whenToUse}`);
});
```

### Reading Output Structure

```typescript
// 1. Extract output structure
const structureSection = extractSection(template, '## Output Document Structure');
const codeBlock = structureSection.match(/```markdown\n([\s\S]+?)\n```/);
const structure = codeBlock[1];

// 2. Use as template
let document = structure;
for (const [key, value] of Object.entries(responses)) {
  document = document.replace(`[${key}]`, value);
}
```

## Best Practices

### Ask Questions Conversationally

❌ Don't dump all questions at once:
```
What's the title?
What's the topic?
What's the angle?
[20 more questions...]
```

✅ Ask 2-5 at a time, grouped by category:
```
"Let's start with the core content."
"What's the title or idea for a title?"
[User responds]
"Great! What's the main topic?"
[Continue...]
```

### Capture Narrative Throughout

Save user responses for context:

```typescript
await captureNarrative({
  content: "Title: 'Building Better APIs'\nTopic: API design",
  context: "Answering Idea/Draft phase questions"
});
```

### Adapt Workflow to Approach

Different approaches = different workflows:
- **Quick & Direct**: Minimal questions, fast drafting
- **Structured**: All questions, detailed outline, thorough revision
- **Multi-Part**: Break into sub-topics, create multiple documents

## Related Documentation

- [Prompt Workflow](prompt-workflow.md) - How prompts use templates
- [Testing Guide](testing-guide.md) - Testing template-driven workflows
