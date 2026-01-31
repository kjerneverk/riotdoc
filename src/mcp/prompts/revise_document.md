# Revise Document

**Purpose**: Improve and refine an existing draft based on user feedback.

**Phase**: Revision (after drafting, before finalization)

## Workflow

### Phase 1: Assess Current State

Understand what version we're working with:

```typescript
// Get current version
const config = await readConfig(docPath);
const currentVersion = config.version;

// Read current draft
const currentDraft = await readFile(join(docPath, 'current-draft.md'), 'utf-8');

// Check if still in draft phase (v0.x)
if (config.published) {
    // Already published (v1.0+), different workflow
    // Maintenance updates vs. draft revisions
}
```

### Phase 2: Gather Feedback

Understand what needs to change:

**Ask user**:
```
"What would you like to revise or improve in this draft?"
```

**Common feedback types**:
- Structural changes (reorder sections, add/remove content)
- Content improvements (expand, clarify, simplify)
- Tone adjustments (more formal, more casual)
- Technical corrections (accuracy, examples)
- Style refinements (flow, transitions, readability)

**Capture feedback**:
```typescript
riotdoc_add_narrative({
    content: userFeedback,
    context: `Revision feedback for v${currentVersion}`,
    source: "typing",
    speaker: "user"
});
```

### Phase 3: Create Checkpoint (Before Changes)

Save current state before making changes:

```typescript
await riotdoc_create_checkpoint({
    name: `pre-revision-v${currentVersion}`,
    message: `Before revision: ${feedbackSummary}`
});
```

**Why**: If revision goes wrong, can restore to this point.

### Phase 4: Apply Revisions

Make the requested changes:

1. **Understand the scope**:
   - Minor edits (typos, wording)
   - Major changes (restructure, new sections)
   - Complete rewrites

2. **Apply changes systematically**:
   - For minor edits: Direct changes
   - For major changes: May need outline manipulation
   - For rewrites: May need to regenerate sections

3. **Maintain template structure**:
   - Keep output structure from template
   - Ensure consistency with document type conventions

4. **Save updated draft**:
   ```typescript
   await writeFile(join(docPath, 'current-draft.md'), revisedContent);
   ```

### Phase 5: Increment Version

After completing revision:

```typescript
await riotdoc_increment_version({
    type: "minor",
    notes: feedbackSummary,
    saveDraft: true
});
```

**Result**: v0.1 → v0.2 → v0.3 → ...

**Why**:
- Tracks evolution
- Saves snapshot of each version
- Can compare versions later
- Clear history of changes

### Phase 6: Log Revision

```typescript
await logEvent(docPath, {
    timestamp: formatTimestamp(),
    type: 'revision_added',
    data: {
        oldVersion: currentVersion,
        newVersion: newVersion,
        changeType: 'major' | 'minor',
        changesSummary: feedbackSummary,
        wordCountDelta: newWordCount - oldWordCount
    }
});
```

### Phase 7: Present Revised Draft

Show the changes:

```
"I've updated the draft to v${newVersion}. Here are the changes I made:

[Summary of changes]

[Show revised sections or full draft]

Would you like to make more revisions, or is this ready to finalize?"
```

### Phase 8: Iterate or Finalize

**If more revisions needed**:
- Repeat workflow (gather feedback → revise → increment)
- Continue in v0.x (v0.3 → v0.4 → v0.5)

**If ready to finalize**:
- Move to `finalize_document` prompt
- Transition to v1.0 (publishing)

## Tools to Use

### Required Tools

- **`riotdoc_increment_version`**: Track each revision
  ```typescript
  riotdoc_increment_version({
      type: "minor",
      notes: "Expanded introduction, clarified examples"
  });
  ```

- **`riotdoc_create_checkpoint`**: Save state before changes
  ```typescript
  riotdoc_create_checkpoint({
      name: "pre-revision-v0.2",
      message: "Before restructuring sections"
  });
  ```

- **`riotdoc_add_narrative`**: Capture feedback
  ```typescript
  riotdoc_add_narrative({
      content: feedback,
      context: "Revision feedback",
      speaker: "user"
  });
  ```

### Optional Tools

- **`riotdoc_outline_insert_section`**: Add sections
- **`riotdoc_outline_move_section`**: Reorder sections
- **`riotdoc_outline_delete_section`**: Remove sections
- **`riotdoc_checkpoint_restore`**: Undo changes if needed

## Key Principles

### 1. Version Every Revision

**Always increment version** after making changes:

```typescript
// After revision
await riotdoc_increment_version({
    type: "minor",
    notes: "What changed"
});
```

**Why**:
- Clear history
- Can compare versions
- Easy to revert
- Tracks progress

### 2. Checkpoint Before Major Changes

Before significant revisions:

```typescript
await riotdoc_create_checkpoint({
    name: "pre-major-revision",
    message: "Before restructuring entire document"
});
```

**Why**: Can restore if changes don't work out.

### 3. Capture All Feedback

Use narrative for ALL user feedback:

```typescript
riotdoc_add_narrative({
    content: "The introduction is too technical. Make it more accessible.",
    context: "Revision feedback",
    speaker: "user"
});
```

**Why**: Full history of what user wanted and why.

### 4. Stay in v0.x Until Ready

Don't jump to v1.0 during revisions:
- v0.1 → v0.2 → v0.3 → ... → v0.9 → v1.0
- Stay in draft mode (v0.x) until truly ready to publish
- v1.0 is a commitment, not a revision

### 5. Maintain Template Structure

Even during revisions, respect template structure:
- Don't break document conventions
- Keep output structure consistent
- Follow document type patterns

## Common Patterns

### Pattern: Iterative Revision Loop

```typescript
while (!userSatisfied) {
    // 1. Get feedback
    const feedback = await getUserFeedback();
    
    // 2. Capture feedback
    await riotdoc_add_narrative({ content: feedback });
    
    // 3. Checkpoint before changes
    await riotdoc_create_checkpoint({ name: `pre-revision-v${version}` });
    
    // 4. Apply changes
    const revised = applyRevisions(currentDraft, feedback);
    await writeFile('current-draft.md', revised);
    
    // 5. Increment version
    await riotdoc_increment_version({ type: "minor", notes: feedback });
    
    // 6. Present revised draft
    presentDraft(revised);
    
    // 7. Check satisfaction
    userSatisfied = await askIfSatisfied();
}
```

### Pattern: Structural Revision

```typescript
// For major structural changes
await riotdoc_create_checkpoint({ name: "pre-restructure" });

// Use outline tools
await riotdoc_outline_move_section({ title: "Section 2", position: 1 });
await riotdoc_outline_insert_section({ title: "New Section", after: "Introduction" });

// Regenerate draft based on new structure
const newDraft = regenerateFromOutline();

// Increment version
await riotdoc_increment_version({
    type: "minor",
    notes: "Restructured: moved Section 2 to beginning, added new section"
});
```

### Pattern: Content Expansion

```typescript
// For expanding specific sections
const feedback = "Expand the examples section with more detail";

// Capture feedback
await riotdoc_add_narrative({ content: feedback });

// Identify section to expand
const section = findSection(currentDraft, "Examples");

// Generate expanded content
const expandedSection = expandContent(section, feedback);

// Replace in draft
const revised = replaceSectionContent(currentDraft, "Examples", expandedSection);

// Save and version
await writeFile('current-draft.md', revised);
await riotdoc_increment_version({
    type: "minor",
    notes: "Expanded examples section with more detail"
});
```

## Revision Types

### Minor Revisions (v0.x → v0.x+1)

**Examples**:
- Fix typos
- Improve wording
- Add examples
- Clarify explanations
- Adjust tone

**Process**:
- Direct edits
- Quick turnaround
- Increment version
- No checkpoint needed (unless user requests)

### Major Revisions (v0.x → v0.x+1)

**Examples**:
- Restructure sections
- Add/remove major content
- Change approach
- Complete rewrites of sections

**Process**:
- Create checkpoint first
- Systematic changes
- Increment version
- May need outline tools

### Post-Publication Updates (v1.x → v1.x+1)

**Examples**:
- Update outdated information
- Fix errors
- Add new sections
- Improve clarity

**Process**:
- Same as draft revisions
- But document is already published
- More careful (users may have seen v1.0)
- Clear changelog

## Error Handling

### No Current Draft

```typescript
if (!currentDraft) {
    return "There's no draft to revise. Let's create one first using the draft_document prompt.";
}
```

### Already Published

```typescript
if (config.published && currentVersion.startsWith('1.')) {
    // Different workflow for published documents
    return "This document is already published (v1.0+). Updates will create maintenance versions (v1.1, v1.2, etc.).";
}
```

### Checkpoint Restoration

```typescript
// If user wants to undo changes
await riotdoc_checkpoint_restore({
    checkpoint: "pre-revision-v0.2"
});
```

## Example: Blog Post Revision

**Starting state**: v0.1 draft exists

**User feedback**: "The introduction is too long. Cut it in half. Also, add more examples in the middle section."

**Process**:

1. **Capture feedback**:
   ```typescript
   riotdoc_add_narrative({
       content: "The introduction is too long. Cut it in half. Also, add more examples in the middle section.",
       context: "Revision feedback for v0.1"
   });
   ```

2. **Create checkpoint**:
   ```typescript
   riotdoc_create_checkpoint({
       name: "pre-revision-v0.1",
       message: "Before shortening intro and adding examples"
   });
   ```

3. **Apply changes**:
   - Shorten introduction (cut from 300 words to 150)
   - Add 2-3 more examples in middle section

4. **Save revised draft**:
   ```typescript
   await writeFile('current-draft.md', revisedContent);
   ```

5. **Increment version**:
   ```typescript
   riotdoc_increment_version({
       type: "minor",
       notes: "Shortened introduction, added more examples"
   });
   ```
   **Result**: v0.1 → v0.2

6. **Present**:
   ```
   "I've updated the draft to v0.2. Changes:
   - Shortened introduction from 300 to 150 words
   - Added 3 new examples in the middle section
   
   Would you like to make more revisions?"
   ```

## Related Documentation

- `draft_document.md` - Previous phase (drafting)
- `finalize_document.md` - Next phase (finalization)
- `version-numbering.md` - Version control system
- `checkpoint.md` - Checkpoint system

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation

## Notes

**Key insight**: Revision is iterative. Users rarely get it perfect in one pass. Expect:
- Multiple rounds of feedback
- Incremental improvements
- Version numbers climbing: v0.1 → v0.2 → v0.3 → v0.4 → ...

**Don't rush to v1.0**. Stay in v0.x as long as needed. v1.0 is for when the document is truly ready to publish, not just "pretty good."

**Symbiotic relationship**:
- **User feedback**: Drives what changes
- **This prompt**: Orchestrates the changes
- **Version control**: Tracks the evolution
- **Checkpoints**: Provide safety net
- **Narrative**: Preserves the why

Everything works together to support iterative refinement.
