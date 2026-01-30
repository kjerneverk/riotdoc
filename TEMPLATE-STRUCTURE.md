# Template Structure Specification

## Overview

This document defines the canonical structure for RiotDoc document templates. Templates are **scripts that tell prompts what to ask** - they must be machine-readable so prompts can parse them at runtime and guide users through document creation conversationally.

**Key Principle**: Questions are split by **WHEN** they're answered:
- **Idea/Draft Phase**: Things you know NOW (title, topic, angle, purpose, tone)
- **Publishing Phase**: Things you figure out LATER (SEO, categories, tags, images, links)

## Why This Matters

Templates drive the entire document creation workflow. They determine:
- What questions to ask and when
- How to structure the conversation with the user
- What the final document looks like
- Which approaches/strategies are available

Templates must be simple markdown files with well-defined section names - **NOT YAML frontmatter**. The structure should be obvious to humans and parseable by prompts through consistent section conventions.

---

## Required Sections

Every document template MUST have these four sections:

### 1. Idea/Draft Phase Questions

**Section Header**: `## Questions to Answer` → `### Idea/Draft Phase`

Questions to ask when exploring and drafting the document. These are things the user knows **NOW** - the immediate creative concerns when starting the document.

**Characteristics**:
- Focus on core creative decisions
- Things you can answer immediately
- Essential to start writing
- No "after the fact" concerns

**Example for blog post**:
```markdown
### Idea/Draft Phase

#### Core Content
- **Title**: What's the title? (or idea for title)
- **Topic**: What's the main subject?
- **Angle**: What's your unique take or perspective?
- **Target length**: Short (500-800 words), medium (1000-1500), long (2000+)?

#### Writing Approach
- **Purpose**: Educate, entertain, persuade, inform?
- **Tone**: Casual, professional, humorous, serious?
- **Target audience**: Who are you writing for?
```

**What NOT to include**:
- SEO keywords (figure out later)
- Categories/tags (after the fact)
- Images (can add during publishing)
- Social media promotion (publishing concern)

---

### 2. Publishing Phase Questions

**Section Header**: `## Questions to Answer` → `### Publishing Phase`

Questions to ask before publishing the document. These are things the user figures out **LATER** - the "after the fact" concerns once the content is drafted.

**Characteristics**:
- Distribution and promotion
- SEO and discoverability
- Final polish and metadata
- Platform-specific requirements

**Example for blog post**:
```markdown
### Publishing Phase

#### SEO & Discoverability
- **SEO keywords**: Any specific keywords to target?
- **Category/tags**: How should this be categorized?
- **Meta description**: What should appear in search results?

#### Supporting Elements
- **Images needed**: Featured image, inline images, diagrams?
- **Links**: Internal links, external references?
- **Call to action**: What should readers do after reading?

#### Publication Details
- **Website/platform**: Where will this be published?
- **Publish date**: When should this go live?
- **Related content**: Does this connect to other posts?
```

---

### 3. Available Approaches

**Section Header**: `## Available Approaches`

Different strategies for creating this document type. Each approach defines a different workflow, output format, or level of structure.

**Purpose**: Let users choose HOW they want to create the document based on their situation.

**Each approach MUST define**:
- **Name**: Clear, descriptive name (e.g., "Quick & Direct", "Structured Single Post")
- **When to use**: Situation where this approach fits
- **Strategy**: How the document will be created
- **Output**: What gets produced (one doc, multiple docs, etc.)
- **Workflow**: How the process differs from other approaches

**Example for blog post**:
```markdown
## Available Approaches

### Approach 1: Quick & Direct
**When to use**: You have a simple idea and want to write and publish quickly.

**Strategy**: Minimal planning, write in one sitting, light editing.

**Output**: Single blog post, 500-1000 words.

**Workflow**:
1. Answer 3-5 core questions (title, topic, angle, tone)
2. Draft in one session
3. Quick revision
4. Publish

---

### Approach 2: Structured Single Post
**When to use**: Complex idea that needs careful organization and development.

**Strategy**: Build detailed outline, develop each section, thorough revision.

**Output**: Single blog post, 1500-3000 words.

**Workflow**:
1. Answer all Idea/Draft phase questions
2. Create detailed outline with sections
3. Draft each section separately
4. Revise and polish
5. Answer Publishing phase questions
6. Finalize and publish

---

### Approach 3: Multi-Post Series
**When to use**: Idea is too large for one post, or naturally breaks into multiple parts.

**Strategy**: Break into 3-5 related posts, each with its own focus.

**Output**: Series of 3-5 blog posts with connecting narrative.

**Workflow**:
1. Identify the overarching theme
2. Break into logical sub-topics
3. Create outline for each post
4. Draft posts in sequence
5. Ensure continuity and cross-linking
6. Publish as a series
```

**Why approaches matter**:
- Different situations need different workflows
- Users can choose based on time, complexity, and goals
- Prompts adjust their guidance based on selected approach
- Shapes the entire document creation experience

---

### 4. Output Document Structure

**Section Header**: `## Output Document Structure`

The markdown structure of the final document. Shows what the finished document looks like.

**Purpose**: 
- Template for the final document
- Shows user what they're creating
- Guides prompts in document assembly

**Format**: Use a markdown code block with placeholders in `[brackets]`.

**Example for blog post**:
````markdown
## Output Document Structure

```markdown
# [Blog Post Title]

**Author**: [Name]
**Date**: [Date]
**Category**: [Category]
**Tags**: [tag1, tag2, tag3]
**Estimated reading time**: [X minutes]

---

## Introduction
[Hook that grabs attention]
[Brief overview of what the post covers]
[Why the reader should care]

---

## [Section 1 Heading]
[Main content for this section]
[Examples, explanations, or stories]

### [Subsection if needed]
[Additional detail]

---

## [Section 2 Heading]
[Main content for this section]

---

## Conclusion
[Summary of key points]
[Final thoughts or takeaway]
[Call to action]

---

## Metadata
- **Target audience**: [Description]
- **SEO keywords**: [List]
- **Internal links**: [List of related posts]
- **External references**: [List of sources]
```
````

---

## How Prompts Read Templates

Templates are parsed at runtime by prompts to guide the document creation workflow.

### Reading Questions

**Step 1**: Load template markdown file
```typescript
const template = await loadTemplate('blog-post');
```

**Step 2**: Find `## Questions to Answer` section, then `### Idea/Draft Phase` subsection

**Step 3**: Parse questions
- Lines starting with `-` or `**` are questions
- Group related questions under subheadings (e.g., `#### Core Content`)
- Extract question text and any guidance (e.g., options in parentheses)

**Step 4**: Ask 2-5 questions at a time, conversationally
```
"Let's start with the core content. What's the title or idea for a title?"
[User responds]
"Great! What's the main topic you want to cover?"
[User responds]
"What's your unique angle or perspective on this?"
[Continue conversationally...]
```

**Step 5**: Capture responses with narrative tool
```typescript
riotdoc_capture_narrative({
  content: "Title: 'Building Better APIs'\nTopic: API design principles\nAngle: Focus on developer experience",
  context: "Answering Idea/Draft phase questions"
});
```

**Later, when publishing**:

**Step 6**: Find `### Publishing Phase` section

**Step 7**: Ask remaining questions
```
"Now let's prepare this for publishing. What SEO keywords should we target?"
[User responds]
"Which categories or tags should we use?"
[Continue...]
```

**Step 8**: Finalize document

### Reading Approaches

**Step 1**: Find `## Available Approaches` section

**Step 2**: Parse approach definitions
- Each approach is a `### Approach N: Name` heading
- Extract: name, when to use, strategy, output, workflow

**Step 3**: Present to user
```
"How would you like to create this blog post?

1. Quick & Direct - Simple idea, write and publish quickly (500-1000 words)
2. Structured Single Post - Complex idea, detailed outline (1500-3000 words)
3. Multi-Post Series - Large topic, break into 3-5 related posts

Which approach fits your needs?"
```

**Step 4**: Capture selected approach
```typescript
riotdoc_capture_narrative({
  content: "Selected approach: Structured Single Post",
  context: "Choosing document creation strategy"
});
```

**Step 5**: Adjust workflow based on selection
- Quick & Direct: Minimal questions, fast drafting
- Structured: Full outline phase, section-by-section drafting
- Multi-Post: Break into sub-topics, create multiple documents

### Reading Output Structure

**Step 1**: Find `## Output Document Structure` section

**Step 2**: Extract markdown template from code block

**Step 3**: Use as template for final document
- Replace `[placeholders]` with actual content
- Maintain structure and formatting
- Generate the final document

---

## Template Validation Checklist

Use this checklist to validate any template against the canonical structure:

- [ ] Has `## Questions to Answer` section
- [ ] Has `### Idea/Draft Phase` subsection with appropriate questions
- [ ] Has `### Publishing Phase` subsection with appropriate questions
- [ ] Idea/Draft questions focus on immediate creative concerns
- [ ] Publishing questions focus on "after the fact" concerns
- [ ] Has `## Available Approaches` section
- [ ] Each approach has: name, when to use, strategy, output, workflow
- [ ] At least 2-3 approaches defined
- [ ] Has `## Output Document Structure` section
- [ ] Output structure is in markdown code block
- [ ] Output structure uses `[placeholder]` format
- [ ] Template is markdown with well-defined sections (NOT YAML)
- [ ] Section names are consistent and machine-parseable
- [ ] Questions are conversational and clear
- [ ] Template supports 2-5 questions at a time (not overwhelming)

---

## Design Principles

### 1. Lifecycle-Aware
Questions are split by WHEN they're answered, not by category. This matches how people actually work.

### 2. Conversational
Templates support asking 2-5 questions at a time, not dumping 20 questions upfront. The workflow is a conversation, not a form.

### 3. Machine-Readable
Prompts can parse templates at runtime through consistent section names and markdown conventions. No YAML needed.

### 4. Human-Readable
Templates are simple markdown files that anyone can read, understand, and modify.

### 5. Approach-Driven
Different situations need different workflows. Templates define multiple approaches so users can choose what fits their needs.

### 6. Flexible
Templates guide the workflow but don't constrain it. Users can skip questions, add their own, or deviate from the structure.

---

## Anti-Patterns

❌ **Don't**: Mix Idea/Draft and Publishing questions together
✅ **Do**: Clearly separate by lifecycle phase

❌ **Don't**: Ask 20 questions upfront
✅ **Do**: Ask 2-5 questions at a time, conversationally

❌ **Don't**: Include only one approach
✅ **Do**: Define 2-3+ approaches for different situations

❌ **Don't**: Use YAML frontmatter or complex syntax
✅ **Do**: Use simple markdown with well-defined sections

❌ **Don't**: Make templates rigid and prescriptive
✅ **Do**: Make templates flexible guides that support conversation

❌ **Don't**: Ask about SEO/categories/tags in Idea/Draft phase
✅ **Do**: Save "after the fact" concerns for Publishing phase

---

## Examples of Good vs Bad Questions

### Idea/Draft Phase

✅ **Good**: "What's the title or idea for a title?"
- Immediate creative decision
- Can answer right now
- Essential to start writing

❌ **Bad**: "What SEO keywords should we target?"
- After the fact concern
- Requires research
- Not needed to start writing

✅ **Good**: "What's your unique angle or perspective?"
- Core creative decision
- Shapes the entire piece
- Answers "why write this?"

❌ **Bad**: "What images do you need?"
- Can figure out later
- Not essential to drafting
- Publishing concern

### Publishing Phase

✅ **Good**: "What SEO keywords should we target?"
- Optimization concern
- Requires finished content
- Improves discoverability

❌ **Bad**: "What's the main topic?"
- Should have been answered in Idea/Draft
- Too late to decide this
- Core creative decision

✅ **Good**: "Where will this be published?"
- Platform-specific formatting
- Distribution concern
- Publishing detail

❌ **Bad**: "What's your tone?"
- Should have been decided in Idea/Draft
- Shapes the writing itself
- Core creative decision

---

## Template Evolution

Templates can evolve over time:

1. **Start simple**: Begin with basic structure, add complexity as needed
2. **User feedback**: Adjust questions based on what users actually need
3. **Approach refinement**: Add new approaches as use cases emerge
4. **Question tuning**: Reword questions for clarity and conversational flow
5. **Structure updates**: Adjust output structure as document needs change

Templates are **living documents**, not static specifications.

---

## Related Documentation

- `TEMPLATE-EXAMPLE.md` - Example template showing structure in practice
- `PARSING-GUIDE.md` - Detailed guide for prompt authors on parsing templates
- Individual template files in `templates/` directory

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-30
**Status**: Canonical specification
