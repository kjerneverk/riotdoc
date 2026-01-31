# Draft Document

**Purpose**: Generate the first draft of a document using template structure and selected approach.

**Phase**: Drafting (after exploration, before revision)

## Workflow

### Phase 1: Load Context

Read the document's configuration and selected approach:

```typescript
// Read config to get document type and selected approach
const config = await readConfig(docPath);
const documentType = config.type;
const selectedApproach = config.metadata?.selectedApproach;

// Load template to get output structure
import { readTemplate, resolveTemplatePath } from '../prompts/template-reader.js';
const templateFile = resolveTemplatePath(documentType);
const template = await readTemplate(templateFile);
```

### Phase 2: Review Captured Information

Read the timeline and narrative to understand what the user has shared:

```typescript
// Read timeline to see all captured information
const timeline = await readTimeline(docPath);

// Read narrative files to get full conversation context
// Files are in .history/prompts/NNN-*.md
```

**What to look for**:
- Answers to Idea/Draft phase questions
- Selected approach
- User preferences and constraints
- Any additional context shared

### Phase 3: Apply Template Structure

Use the template's **Output Document Structure** as the skeleton:

```typescript
const outputStructure = template.outputStructure;
// This contains the markdown template with [placeholders]
```

**Example** (blog post):
```markdown
# [Title]

[Opening hook]

## [Section 1]
[Content]

## [Section 2]
[Content]

## Conclusion
[Wrap up]
```

**Your job**: Fill in the placeholders with actual content based on:
- User's answers to questions
- Selected approach's strategy
- Document type conventions

### Phase 4: Adapt to Selected Approach

Different approaches require different drafting strategies:

#### Quick & Direct Approach
- Generate complete draft in one pass
- Minimal structure, focus on getting ideas down
- Don't over-polish
- Aim for 70-80% complete

#### Structured Approach
- Build outline first (if not already done)
- Develop each section systematically
- More polished initial draft
- Aim for 85-90% complete

#### Multi-Document Approach
- Draft one document at a time
- Ensure consistency across documents
- Reference other documents in series
- Coordinate structure

### Phase 5: Generate Draft

Create the draft content:

1. **Start with structure** from template
2. **Fill in content** based on captured information
3. **Follow approach strategy** (quick vs. structured)
4. **Maintain document type conventions**

**Save draft**:
```typescript
// Save as current-draft.md
await writeFile(join(docPath, 'current-draft.md'), draftContent);

// Create initial version (v0.1)
await riotdoc_increment_version({
    type: "minor",
    notes: "Initial draft created",
    saveDraft: true
});
```

### Phase 6: Log to Timeline

```typescript
await logEvent(docPath, {
    timestamp: formatTimestamp(),
    type: 'draft_created',
    data: {
        version: '0.1',
        approach: selectedApproach,
        wordCount: countWords(draftContent),
        sectionsCompleted: countSections(draftContent)
    }
});
```

### Phase 7: Create Checkpoint

```typescript
await riotdoc_create_checkpoint({
    name: "initial-draft",
    message: "First draft completed (v0.1)"
});
```

### Phase 8: Present to User

Show the draft and ask for feedback:

```
"I've created the first draft (v0.1) based on our conversation. Here's what I've written:

[Show draft or key excerpts]

What would you like to refine or change?"
```

**Capture feedback**:
```typescript
riotdoc_add_narrative({
    content: userFeedback,
    context: "Feedback on initial draft",
    source: "typing",
    speaker: "user"
});
```

## Tools to Use

### Required Tools

- **`riotdoc_increment_version`**: Create v0.1 after draft
  ```typescript
  riotdoc_increment_version({
      type: "minor",
      notes: "Initial draft created"
  });
  ```

- **`riotdoc_create_checkpoint`**: Save draft state
  ```typescript
  riotdoc_create_checkpoint({
      name: "initial-draft",
      message: "First draft completed"
  });
  ```

- **`riotdoc_add_narrative`**: Capture user feedback
  ```typescript
  riotdoc_add_narrative({
      content: feedback,
      context: "Draft feedback",
      speaker: "user"
  });
  ```

### Optional Tools

- **`riotdoc_outline_insert_section`**: Add sections if needed
- **Timeline reading**: Review captured context

## Template Integration

### Reading Output Structure

```typescript
const template = await readTemplate(templateFile);
const structure = template.outputStructure;

// Structure contains markdown template like:
// # [Title]
// ## [Section 1]
// [Content]

// Your job: Replace [placeholders] with actual content
```

### Using Approach Strategy

```typescript
const approach = template.approaches.find(a => a.name === selectedApproach);

// approach.strategy tells you HOW to draft
// Example: "Create detailed outline first, then develop each section"

// Follow the strategy's guidance
```

## Key Principles

### 1. Template-Driven Structure

**Bad** (arbitrary structure):
```markdown
# My Blog Post

Some content here.

More content.

The end.
```

**Good** (template-driven):
```markdown
# [Title from user]

[Hook from template structure]

## [Section 1 from outline]
[Content based on user's angle]

## [Section 2 from outline]
[Content based on user's purpose]

## Conclusion
[Wrap up based on user's goal]
```

### 2. Use Captured Context

Don't ask questions already answered. Read the narrative:

**Bad**:
```
"What's the title again?"
```

**Good**:
```typescript
// Read from timeline/narrative
const title = extractFromNarrative('title');
// Use it: # ${title}
```

### 3. Approach-Aware Drafting

**Quick & Direct**:
- Fast, get ideas down
- Don't over-polish
- 70-80% complete is fine

**Structured**:
- Careful, systematic
- Well-developed sections
- 85-90% complete

**Multi-Doc**:
- One at a time
- Consistent across series
- Reference other docs

### 4. Version Control

Always create v0.1 after first draft:

```typescript
await riotdoc_increment_version({
    type: "minor",
    notes: "Initial draft created"
});
```

This:
- Saves snapshot in `drafts/draft-v0.1.md`
- Tracks in version history
- Enables comparison later

## Common Patterns

### Pattern: Structure-First Drafting

```typescript
// 1. Get structure from template
const structure = template.outputStructure;

// 2. Parse placeholders
const placeholders = extractPlaceholders(structure);
// Result: ["Title", "Section 1", "Content", ...]

// 3. Fill each placeholder from context
for (const placeholder of placeholders) {
    const value = resolveFromContext(placeholder);
    structure = structure.replace(`[${placeholder}]`, value);
}

// 4. Save draft
await writeFile('current-draft.md', structure);
```

### Pattern: Section-by-Section Development

```typescript
// For structured approach
const sections = outline.sections;

let draft = `# ${title}\n\n`;

for (const section of sections) {
    draft += `## ${section.title}\n\n`;
    draft += generateSectionContent(section);
    draft += `\n\n`;
}

await writeFile('current-draft.md', draft);
```

### Pattern: Feedback Loop

```typescript
// 1. Generate draft
const draft = generateDraft();

// 2. Present to user
presentDraft(draft);

// 3. Capture feedback
const feedback = await getUserFeedback();
riotdoc_add_narrative({ content: feedback, context: "Draft feedback" });

// 4. If needs revision, go to revise_document prompt
// If satisfied, go to finalize_document prompt
```

## Error Handling

### No Template Found

```typescript
if (!template) {
    return "I couldn't find the template for this document type. Please ensure templates are set up correctly.";
}
```

### Missing Context

```typescript
if (!capturedAnswers || capturedAnswers.length === 0) {
    return "I don't have enough information to create a draft. Let's go back to the exploration phase to gather the necessary details.";
}
```

### No Approach Selected

```typescript
if (!selectedApproach) {
    return "No approach was selected. Let's choose how you want to create this document.";
}
```

## Example: Blog Post Draft

**Context**:
- Title: "Why Templates Matter"
- Topic: Template-driven development
- Angle: Templates are scripts, not just data
- Length: 1200 words
- Approach: Structured Single Post

**Process**:

1. Load `templates/blog-post-template.md`
2. Read Output Document Structure:
   ```markdown
   # [Title]
   [Hook]
   ## [Section 1]
   ## [Section 2]
   ## Conclusion
   ```

3. Fill in from context:
   ```markdown
   # Why Templates Matter
   
   When you think of templates, you probably think of data structures...
   
   ## Templates as Scripts
   [Content about templates driving behavior]
   
   ## Real-World Applications
   [Content about practical uses]
   
   ## Conclusion
   [Wrap up the argument]
   ```

4. Save as `current-draft.md`
5. Create v0.1
6. Create checkpoint
7. Present to user for feedback

## Related Documentation

- `explore_document.md` - Previous phase (exploration)
- `revise_document.md` - Next phase (revision)
- `template-reader.ts` - Template reading utilities
- `version-numbering.md` - Version control system

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation

## Notes

**Key insight**: This prompt doesn't generate content from scratch. It:
1. Reads the template (structure)
2. Reads the narrative (content)
3. Combines them (draft)

The template provides the STRUCTURE. The user provides the CONTENT. This prompt is the COMBINER.

**Symbiotic relationship**:
- **Template**: Provides structure and conventions
- **Narrative**: Provides user's ideas and answers
- **This prompt**: Orchestrates the combination
- **Tools**: Execute the work (save, version, checkpoint)

Everything works together.
