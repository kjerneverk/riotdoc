# Explore Document

**Purpose**: Guide user through document creation by reading template questions dynamically and presenting approaches.

**Core Innovation**: Templates are SCRIPTS. This prompt READS the script to know what to ask. Questions are not hardcoded - they come from the template.

## Workflow

### Phase 1: Detect Document Type

Ask user what type of document they want to create:

```
"What type of document do you want to create?"

Options:
- blog-post
- podcast-script
- email
- project-plan
- research-paper
```

**Capture response** with `riotdoc_add_narrative`.

### Phase 2: Load Template Dynamically

Read the template for the selected document type:

```typescript
import { readTemplate, resolveTemplatePath } from '../prompts/template-reader.js';

const templateFile = resolveTemplatePath(documentType);
const template = await readTemplate(templateFile);
```

**Key insight**: The template tells you what to ask. You're reading a script, not executing hardcoded logic.

### Phase 3: Ask Idea/Draft Phase Questions (Conversationally)

**CRITICAL RULE**: Don't ask all questions at once. Ask 2-5 questions per turn.

**Why**: Natural conversation. Users get overwhelmed by 10 questions at once.

**How**:

1. **Group questions** using `groupQuestions()`:
   ```typescript
   import { groupQuestions } from '../prompts/template-reader.js';
   const groups = groupQuestions(template.questions.ideaDraft, 3);
   ```

2. **Ask first group** naturally:
   ```
   "Great! Let's start with the core concept. [Question 1]? [Question 2]?"
   ```

3. **Wait for user response**

4. **Capture response**:
   ```typescript
   riotdoc_add_narrative({
       content: userResponse,
       context: "Answering core concept questions",
       source: "typing",
       speaker: "user"
   });
   ```

5. **Move to next group**:
   ```
   "Perfect. Now let's talk about scope. [Question 3]? [Question 4]?"
   ```

6. **Repeat** until all Idea/Draft questions answered

**Example conversation flow**:

```
AI: "What type of document do you want to create?"
User: "A blog post"

AI: [Loads templates/blog-post-template.md]
    [Extracts Idea/Draft Phase Questions]
    [Groups questions: [title, topic, angle], [length, purpose, tone], [audience]]

AI: "Great! Let's start with the core concept. What's the title or idea for the title? What's the main topic you want to write about?"
User: "Title is 'Why Templates Matter'. Topic is template-driven development."

AI: [Captures narrative]
    "Excellent. What's your unique angle or perspective on this? What makes your take different?"
User: "Templates aren't just data structures - they're scripts that drive behavior."

AI: [Captures narrative]
    "Perfect. How long do you want this post to be? What's the main purpose? What tone should it have?"
User: "Medium length, around 1200 words. Purpose is to teach a concept. Tone should be conversational but technical."

AI: [Captures narrative]
    [All Idea/Draft questions answered, move to Phase 4]
```

**Important**: Only ask **Idea/Draft Phase Questions** at this stage. Publishing phase questions (SEO, categories, etc.) come later.

### Phase 4: Present Approaches

After gathering initial information, present the approaches from the template:

```typescript
import { formatApproaches } from '../prompts/template-reader.js';
const approachesText = formatApproaches(template.approaches);
```

**Present to user**:

```
"Based on what you've told me, here are [X] ways we could create this [document type]:

[approachesText]

Which approach fits your situation?"
```

**Example**:

```
"Based on what you've told me, here are 3 ways we could create this blog post:

1. **Quick & Direct**: For quick posts without much planning - write draft quickly, minimal revisions, publish fast
2. **Structured Single Post**: For well-developed posts - build outline, develop sections systematically, multiple revisions
3. **Multi-Post Series**: For breaking into multiple related posts - create series structure, outline each post, coordinate publishing

Which approach fits your situation?"
```

### Phase 5: Capture Approach Selection

User selects an approach. **Log to timeline**:

```typescript
await logEvent(docPath, {
    timestamp: formatTimestamp(),
    type: 'document_created',
    data: {
        documentType,
        selectedApproach: approachName,
        initialQuestions: capturedResponses
    }
});
```

**Capture narrative**:

```typescript
riotdoc_add_narrative({
    content: `Selected approach: ${approachName}`,
    context: "Approach selection",
    source: "typing",
    speaker: "user"
});
```

### Phase 6: Proceed Based on Approach

Different approaches have different workflows:

#### Quick & Direct Approach
- Skip outline
- Go straight to draft generation
- Use `riotdoc_create_draft` or similar
- Minimal revisions

#### Structured Approach
- Build outline first
- Ask: "Let's create an outline. What sections do you want?"
- Use outline manipulation tools if needed
- Then proceed to draft

#### Multi-Document Approach
- Break into series
- Outline each document
- Create separate documents
- Coordinate publishing

**Adapt workflow** based on the approach's strategy description from template.

### Phase 7: Create Checkpoint

After approach selection and before starting work:

```typescript
riotdoc_create_checkpoint({
    name: "approach-selected",
    message: `Selected ${approachName} approach for ${documentType}`
});
```

## Tools to Use

### Required Tools

- **`riotdoc_add_narrative`**: Capture ALL user responses
  - Use for every answer to questions
  - Use for approach selection
  - Provides full-fidelity conversation history

- **`riotdoc_create_checkpoint`**: Save state at key moments
  - After approach selection
  - Before starting draft
  - At major milestones

### Optional Tools

- **`riotdoc_increment_version`**: Track document evolution
- **`riotdoc_outline_insert_section`**: Programmatic outline editing
- **Timeline tools**: Log events as needed

## Template Reading Reference

### Reading Template

```typescript
import { readTemplate, resolveTemplatePath } from '../prompts/template-reader.js';

// Get template filename
const templateFile = resolveTemplatePath('blog-post');
// Result: "blog-post-template.md"

// Read and parse template
const template = await readTemplate(templateFile);

// Access questions
console.log(template.questions.ideaDraft);
// ["What's the title?", "What's the topic?", ...]

console.log(template.questions.publishing);
// ["What categories?", "What SEO keywords?", ...]

// Access approaches
console.log(template.approaches);
// [{ name: "Quick & Direct", whenToUse: "...", ... }]
```

### Grouping Questions

```typescript
import { groupQuestions } from '../prompts/template-reader.js';

const groups = groupQuestions(template.questions.ideaDraft, 3);
// Result: [[q1, q2, q3], [q4, q5, q6], ...]

// Ask first group
const firstGroup = groups[0];
// Ask questions from firstGroup conversationally
```

### Formatting Approaches

```typescript
import { formatApproaches } from '../prompts/template-reader.js';

const formatted = formatApproaches(template.approaches);
// Result: "1. **Quick & Direct**: For quick posts...\n2. **Structured**: ..."
```

## Key Principles

### 1. Templates Drive Behavior

**Bad** (hardcoded):
```typescript
// DON'T DO THIS
const questions = ["What's the title?", "What's the topic?"];
```

**Good** (template-driven):
```typescript
// DO THIS
const template = await readTemplate('blog-post-template.md');
const questions = template.questions.ideaDraft;
```

**Why**: If template changes, prompt automatically adapts. No code changes needed.

### 2. Conversational Flow

**Bad** (overwhelming):
```
"What's the title, topic, angle, length, purpose, tone, and audience?"
```

**Good** (natural):
```
"What's the title? What's the main topic?"
[wait for response]
"What's your unique angle?"
[wait for response]
```

**Why**: Users can't process 7 questions at once. 2-5 at a time is natural.

### 3. Phase Separation

**Idea/Draft Phase** (now):
- Core concept questions
- Immediate concerns
- What user needs to start

**Publishing Phase** (later):
- SEO, categories, tags
- Distribution strategy
- Post-completion concerns

**Why**: Don't ask about SEO before the document exists. Ask what matters NOW.

### 4. Capture Everything

Use `riotdoc_add_narrative` for ALL user input:
- Answers to questions
- Approach selection
- Decisions made
- Ideas shared

**Why**: Full-fidelity conversation history. Can replay, reuse as prompts, understand evolution.

## Testing

### Test 1: Blog Post

**Scenario**: User wants to create a blog post

**Verify**:
1. ✅ Loads `templates/blog-post-template.md`
2. ✅ Extracts Idea/Draft questions (title, topic, angle, length, purpose, tone, audience)
3. ✅ Does NOT ask Publishing questions (SEO, categories)
4. ✅ Asks questions in groups (2-5 at a time)
5. ✅ Presents 3 approaches from template
6. ✅ Captures approach selection
7. ✅ Proceeds based on selected approach

### Test 2: Podcast Script

**Scenario**: User wants to create a podcast script

**Verify**:
1. ✅ Loads `templates/podcast-script-template.md`
2. ✅ Extracts DIFFERENT questions (episode title, format, segments, etc.)
3. ✅ Asks podcast-specific questions (not blog questions)
4. ✅ Presents podcast-specific approaches
5. ✅ Workflow adapts to podcast context

### Test 3: Dynamic Adaptation

**Scenario**: Add new question to blog post template

**Steps**:
1. Edit `templates/blog-post-template.md`
2. Add new question: "- **Hook**: What's the opening hook?"
3. Run explore_document prompt

**Verify**:
- ✅ Prompt automatically asks the new question
- ✅ No code changes needed
- ✅ Template drives behavior

## Common Patterns

### Pattern: Multi-Turn Question Flow

```typescript
// Group 1: Core concept
"Let's start with the core concept. [Q1]? [Q2]?"
[wait for response]
[capture narrative]

// Group 2: Scope
"Now let's talk about scope. [Q3]? [Q4]?"
[wait for response]
[capture narrative]

// Group 3: Audience
"Who is this for? [Q5]?"
[wait for response]
[capture narrative]
```

### Pattern: Approach Presentation

```typescript
"Based on what you've told me, here are [N] ways we could create this [type]:

[formatted approaches]

Which approach fits your situation?"
```

### Pattern: Workflow Branching

```typescript
if (selectedApproach === "Quick & Direct") {
    // Skip outline, go to draft
} else if (selectedApproach === "Structured") {
    // Build outline first
} else if (selectedApproach === "Multi-Doc") {
    // Break into series
}
```

## Error Handling

### Template Not Found

```typescript
try {
    const template = await readTemplate(templateFile);
} catch (error) {
    return "Sorry, I couldn't find the template for that document type. Available types: blog-post, podcast-script, email, project-plan, research-paper.";
}
```

### No Questions in Template

```typescript
if (template.questions.ideaDraft.length === 0) {
    return "This template doesn't have any Idea/Draft phase questions defined. Please check the template structure.";
}
```

### No Approaches in Template

```typescript
if (template.approaches.length === 0) {
    // Fall back to single default approach
    // Or ask user to define workflow
}
```

## Related Documentation

- `TEMPLATE-STRUCTURE.md` - Canonical template format
- `PARSING-GUIDE.md` - How to parse templates
- `template-reader.ts` - Template reading implementation
- `narrative-capture.md` - Narrative capture feature

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation

## Notes

**From Timeline Event 88**: "This is where the real value is - prompts orchestrate tools and resources. There's a symbiotic relationship: prompts execute the workflow, tools are the units of work, resources provide context. Prompts must integrate all three."

This prompt demonstrates that relationship:
- **Prompts** (this file): Execute the workflow
- **Tools** (`riotdoc_add_narrative`, etc.): Units of work
- **Resources** (templates): Provide context

Everything works together. Templates drive prompts. Prompts orchestrate tools. Tools capture state. State informs next steps.

**Test question**: If you change the blog post template to add a new question, does this prompt automatically ask it? If yes, the system works. If no, something is wrong.
