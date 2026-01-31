# Prompt Workflow Guide

## Overview

RiotDoc uses a **template-driven prompt system** where prompts orchestrate tools and resources to guide document creation from idea to publication.

**Core Innovation**: Templates are scripts. Prompts read the scripts to know what to do.

## The Four-Phase Workflow

### Phase 1: Explore (explore_document.md)

**Purpose**: Understand what the user wants to create

**What it does**:
1. Asks what document type to create
2. Loads the template for that type
3. Reads **Idea/Draft Phase Questions** from template
4. Asks questions conversationally (2-5 at a time)
5. Presents **Available Approaches** from template
6. Captures approach selection

**Tools used**:
- `riotdoc_add_narrative` - Capture all user responses
- `riotdoc_create_checkpoint` - Save state after approach selection

**Output**: Understanding of what to create and how to create it

**Example**:
```
User: "I want to write a blog post"
→ Loads blog-post-template.md
→ Asks: "What's the title? What's the topic?"
→ Asks: "What's your angle? What's the length?"
→ Presents: "Quick & Direct, Structured, or Multi-Post Series?"
→ User selects: "Structured Single Post"
```

### Phase 2: Draft (draft_document.md)

**Purpose**: Create the first draft

**What it does**:
1. Loads template's **Output Document Structure**
2. Reviews captured information from exploration
3. Applies selected approach's strategy
4. Generates draft content
5. Creates v0.1 (initial version)
6. Creates checkpoint

**Tools used**:
- `riotdoc_increment_version` - Create v0.1
- `riotdoc_create_checkpoint` - Save draft state
- `riotdoc_add_narrative` - Capture user feedback on draft

**Output**: First draft at v0.1

**Example**:
```
→ Reads blog-post-template.md Output Structure
→ Fills in: title, sections, content
→ Saves as current-draft.md
→ Creates v0.1
→ "Here's your first draft. What would you like to change?"
```

### Phase 3: Revise (revise_document.md)

**Purpose**: Improve and refine the draft

**What it does**:
1. Gathers user feedback on what to improve
2. Creates checkpoint before changes
3. Applies revisions
4. Increments version (v0.1 → v0.2 → v0.3 → ...)
5. Presents revised draft
6. Repeats until user is satisfied

**Tools used**:
- `riotdoc_create_checkpoint` - Save before changes
- `riotdoc_increment_version` - Track each revision
- `riotdoc_add_narrative` - Capture feedback
- `riotdoc_outline_*` - Structural changes if needed

**Output**: Polished draft ready for publication (v0.x)

**Example**:
```
User: "The intro is too long. Add more examples."
→ Creates checkpoint (pre-revision-v0.1)
→ Shortens intro, adds examples
→ Increments to v0.2
→ "Updated to v0.2. Want more changes?"
User: "Looks good!"
```

### Phase 4: Finalize (finalize_document.md)

**Purpose**: Prepare for publication

**What it does**:
1. Confirms user is ready to publish
2. Loads template's **Publishing Phase Questions**
3. Asks publishing questions (SEO, categories, etc.)
4. Updates document metadata
5. Creates pre-publication checkpoint
6. Publishes (v0.x → v1.0)
7. Celebrates! 🎉

**Tools used**:
- `riotdoc_add_narrative` - Capture publishing answers
- `riotdoc_create_checkpoint` - Save pre/post publication state
- `riotdoc_increment_version` - Publish to v1.0

**Output**: Published document at v1.0

**Example**:
```
User: "Ready to publish!"
→ Asks: "What categories? What SEO keywords?"
→ User provides metadata
→ Creates checkpoint (pre-publication)
→ Publishes to v1.0
→ "🎉 Published as v1.0!"
```

## Complete Example: Blog Post Journey

### Starting Point
User says: "I want to write a blog post about templates"

### Phase 1: Explore
```
AI: [Uses explore_document.md]
    [Loads templates/blog-post-template.md]
    [Reads Idea/Draft Phase Questions]

AI: "What's the title? What's the main topic?"
User: "Title: 'Why Templates Matter'. Topic: Template-driven development"

AI: [Captures narrative]
    "What's your unique angle?"
User: "Templates are scripts, not just data structures"

AI: [Captures narrative]
    "How long? What's the purpose?"
User: "1200 words, teach a concept, conversational tone"

AI: [Captures narrative]
    [Presents approaches from template]
    "Here are 3 ways to create this:
    1. Quick & Direct - fast, minimal planning
    2. Structured Single Post - outline first, polished
    3. Multi-Post Series - break into multiple posts
    
    Which fits?"
User: "Structured Single Post"

AI: [Logs approach selection]
    [Creates checkpoint: approach-selected]
```

**Result**: Clear understanding of what to create

### Phase 2: Draft
```
AI: [Uses draft_document.md]
    [Reads Output Document Structure from template]
    [Reviews captured narrative]
    [Applies Structured approach strategy]

AI: [Generates draft]
    # Why Templates Matter
    
    When you think of templates...
    
    ## Templates as Scripts
    [Content based on user's angle]
    
    ## Real-World Applications
    [Content based on user's purpose]
    
    ## Conclusion
    [Wrap up]

AI: [Saves as current-draft.md]
    [Creates v0.1]
    [Creates checkpoint: initial-draft]

AI: "I've created the first draft (v0.1). Here it is:
    [Shows draft]
    What would you like to change?"
```

**Result**: First draft at v0.1

### Phase 3: Revise (Round 1)
```
User: "The intro is too technical. Make it more accessible."

AI: [Uses revise_document.md]
    [Captures feedback in narrative]
    [Creates checkpoint: pre-revision-v0.1]
    [Revises introduction]
    [Saves updated draft]
    [Increments to v0.2]

AI: "Updated to v0.2. I've made the intro more accessible.
    Want more changes?"
```

### Phase 3: Revise (Round 2)
```
User: "Add more examples in the middle section."

AI: [Captures feedback]
    [Creates checkpoint: pre-revision-v0.2]
    [Adds examples]
    [Increments to v0.3]

AI: "Updated to v0.3. Added 3 examples.
    Ready to publish or more revisions?"
```

### Phase 3: Revise (Round 3)
```
User: "One more thing - expand the conclusion."

AI: [Captures feedback]
    [Creates checkpoint: pre-revision-v0.3]
    [Expands conclusion]
    [Increments to v0.4]

AI: "Updated to v0.4. Conclusion is now more detailed.
    Ready to finalize?"
User: "Yes!"
```

**Result**: Polished draft at v0.4

### Phase 4: Finalize
```
AI: [Uses finalize_document.md]
    [Reads Publishing Phase Questions from template]

AI: "Great! Let's add metadata. What categories?"
User: "Development, Best Practices"

AI: [Captures narrative]
    "What SEO keywords?"
User: "templates, automation, workflows"

AI: [Captures narrative]
    "Tags and meta description?"
User: "Tags: typescript, markdown. Meta: Learn how templates drive workflows."

AI: [Updates metadata]
    [Creates checkpoint: pre-publication]
    [Publishes to v1.0]
    [Creates checkpoint: published-v1.0]

AI: "🎉 Congratulations! Your blog post is published as v1.0!
    
    **Final version**: v1.0
    **Word count**: 1,247 words
    **Total revisions**: 4 versions (v0.1 → v0.4 → v1.0)
    
    Ready to export or publish to your blog!"
```

**Result**: Published blog post at v1.0

## How Prompts Work Together

### Symbiotic Relationship

**Templates** (the scripts):
- Define questions to ask
- Define approaches available
- Define output structure
- Provide publishing requirements

**Prompts** (the orchestrators):
- Read templates dynamically
- Ask questions from templates
- Guide user through workflow
- Coordinate tools

**Tools** (the workers):
- `riotdoc_add_narrative` - Capture input
- `riotdoc_increment_version` - Track evolution
- `riotdoc_create_checkpoint` - Save state
- `riotdoc_outline_*` - Manipulate structure

**Resources** (the context):
- Timeline - Event history
- Narrative files - Conversation history
- Checkpoints - State snapshots
- Version history - Evolution tracking

### Information Flow

```
User Input
    ↓
explore_document (reads template)
    ↓
Captures: answers, approach selection
    ↓
draft_document (reads template structure)
    ↓
Creates: v0.1 draft
    ↓
revise_document (iterative)
    ↓
Creates: v0.2, v0.3, v0.4...
    ↓
finalize_document (reads publishing questions)
    ↓
Creates: v1.0 published document
```

### State Progression

```
No document
    ↓ explore_document
Approach selected
    ↓ draft_document
v0.1 draft exists
    ↓ revise_document
v0.2, v0.3, v0.4... (iterations)
    ↓ finalize_document
v1.0 published
    ↓ revise_document (post-publication)
v1.1, v1.2... (updates)
```

## Key Principles

### 1. Templates Drive Prompts

Prompts don't have hardcoded questions. They READ questions from templates.

**Why**: If template changes, prompts automatically adapt. No code changes needed.

**Test**: Add a new question to blog-post-template.md. The prompt will automatically ask it.

### 2. Phase Separation

Each phase has distinct concerns:

- **Explore**: What to write (Idea/Draft questions)
- **Draft**: Write it (Output structure)
- **Revise**: Improve it (Iterative refinement)
- **Finalize**: Publish it (Publishing questions)

**Why**: Don't ask about SEO before the document exists. Don't ask about content during finalization.

### 3. Conversational Flow

Ask 2-5 questions at a time, not all at once.

**Why**: Natural conversation. Users can't process 10 questions simultaneously.

### 4. Capture Everything

Use `riotdoc_add_narrative` for ALL user input.

**Why**: Full-fidelity history. Can replay, reuse, understand evolution.

### 5. Version Everything

Every draft and revision gets a version number.

**Why**: Track evolution, compare versions, enable restoration.

### 6. Checkpoint Key Moments

Save state before major changes and at milestones.

**Why**: Safety net. Can restore if something goes wrong.

## Prompt Selection Guide

### When to Use Each Prompt

**Use explore_document when**:
- Starting a new document
- User says "I want to write/create..."
- Need to understand requirements
- No document exists yet

**Use draft_document when**:
- Exploration is complete
- Approach is selected
- Ready to generate first draft
- No draft exists yet (v0.0)

**Use revise_document when**:
- Draft exists (v0.x or v1.x)
- User wants to improve/change content
- Iterating on existing work
- Not ready to publish yet (if v0.x)

**Use finalize_document when**:
- Draft is polished (v0.x)
- User says "ready to publish"
- Need to add publication metadata
- Transitioning to v1.0

### Prompt Transitions

```
explore_document
    ↓ (approach selected)
draft_document
    ↓ (draft created)
revise_document ←→ revise_document (iterate)
    ↓ (user satisfied)
finalize_document
    ↓ (published v1.0)
revise_document (post-publication updates)
```

## Common Patterns

### Pattern: Quick Document (Skip Revisions)

```
explore_document
    ↓
draft_document
    ↓
finalize_document
```

**When**: User selects "Quick & Direct" approach

### Pattern: Thorough Document (Multiple Revisions)

```
explore_document
    ↓
draft_document
    ↓
revise_document (v0.1 → v0.2)
    ↓
revise_document (v0.2 → v0.3)
    ↓
revise_document (v0.3 → v0.4)
    ↓
finalize_document (v0.4 → v1.0)
```

**When**: User selects "Structured" approach

### Pattern: Post-Publication Update

```
[Document at v1.0]
    ↓
revise_document (v1.0 → v1.1)
    ↓
revise_document (v1.1 → v1.2)
```

**When**: Document already published, needs updates

## Troubleshooting

### Wrong Prompt Used

**Problem**: User is in revision phase but explore_document is active

**Solution**: Detect document state and suggest correct prompt:
```typescript
if (draftExists && version.startsWith('0.')) {
    return "This document already has a draft (v${version}). Use revise_document to improve it.";
}
```

### Missing Context

**Problem**: Prompt needs information that wasn't captured

**Solution**: Read timeline and narrative to find context. If missing, ask user.

### Template Not Found

**Problem**: Template doesn't exist for document type

**Solution**: Provide clear error and list available templates.

## Advanced Usage

### Custom Workflows

Some document types may need custom workflows:

**Example**: Research paper with peer review phase
```
explore_document
    ↓
draft_document
    ↓
revise_document (internal revisions)
    ↓
[CUSTOM: peer_review phase]
    ↓
revise_document (address reviewer comments)
    ↓
finalize_document
```

### Branching Workflows

Multi-document approaches may branch:

```
explore_document (series planning)
    ↓
    ├─→ draft_document (post 1)
    ├─→ draft_document (post 2)
    └─→ draft_document (post 3)
```

## Related Documentation

- `explore_document.md` - Phase 1 prompt
- `draft_document.md` - Phase 2 prompt
- `revise_document.md` - Phase 3 prompt
- `finalize_document.md` - Phase 4 prompt
- `template-reader.ts` - Template reading utilities
- `TEMPLATE-STRUCTURE.md` - Template format
- `version-numbering.md` - Version control
- `narrative-capture.md` - Narrative system

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation

## Notes

**From Timeline Event 88**: "This is where the real value is - prompts orchestrate tools and resources. There's a symbiotic relationship: prompts execute the workflow, tools are the units of work, resources provide context. Prompts must integrate all three."

This guide shows that relationship in action:
- **Prompts**: Execute the workflow (explore → draft → revise → finalize)
- **Tools**: Units of work (narrative, version, checkpoint)
- **Resources**: Provide context (templates, timeline, narrative files)

Everything works together. Templates drive prompts. Prompts orchestrate tools. Tools capture state. State informs next steps. It's a complete system.

**The magic**: Change a template, and the entire workflow adapts automatically. No code changes needed. The templates are the scripts. The prompts read the scripts. The system just works.
