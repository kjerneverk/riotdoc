# RiotDoc Testing Guide

## Overview

This guide provides comprehensive test scenarios for validating the complete RiotDoc template-driven workflow.

**Purpose**: Ensure all components work together correctly before deployment.

## Test Environment Setup

### Prerequisites

1. **RiotDoc installed and configured**
2. **All templates in place**:
   - `templates/blog-post-template.md`
   - `templates/podcast-script-template.md`
   - `templates/email-template.md`
   - `templates/project-plan-template.md`
   - `templates/research-paper-template.md`

3. **MCP server running** (if testing via MCP)
4. **Clean test workspace** (no existing documents)

### Test Data

Create test documents in isolated directories:
```
test-workspace/
  blog-post-test/
  podcast-script-test/
  outline-manipulation-test/
  version-numbering-test/
  narrative-checkpoint-test/
```

## Test Suite 1: Blog Post Workflow

### Objective
Validate complete blog post creation from exploration to publication.

### Test Steps

#### 1.1 Exploration Phase

**Action**: Use `explore_document` prompt

**Input**:
```
User: "I want to write a blog post"
```

**Expected Behavior**:
- ✅ Prompt loads `templates/blog-post-template.md`
- ✅ Asks Idea/Draft Phase questions (NOT Publishing Phase)
- ✅ Questions asked in groups of 2-5, not all at once
- ✅ Questions match template:
  - Title/idea for title
  - Main topic
  - Unique angle/perspective
  - Length (short/medium/long)
  - Main purpose
  - Tone (formal/conversational/etc.)
  - Target audience

**Continue**:
```
User answers:
- Title: "Why Templates Matter"
- Topic: Template-driven development
- Angle: Templates are scripts, not just data
- Length: Medium (1200 words)
- Purpose: Teach a concept
- Tone: Conversational but technical
- Audience: Developers
```

**Expected Behavior**:
- ✅ Each response captured with `riotdoc_add_narrative`
- ✅ Narratives saved to:
  - `.history/timeline.jsonl` (timeline event)
  - `.history/prompts/001-xxx.md` (numbered file)

**Continue**:
```
AI presents approaches from template:
1. Quick & Direct
2. Structured Single Post
3. Multi-Post Series

User: "Structured Single Post"
```

**Expected Behavior**:
- ✅ Approach selection logged to timeline
- ✅ Checkpoint created: "approach-selected"
- ✅ Exploration phase complete

**Validation**:
```bash
# Check timeline
cat .history/timeline.jsonl | grep "narrative_chunk"
cat .history/timeline.jsonl | grep "approach_selected"

# Check narrative files
ls .history/prompts/
# Should see: 001-*.md, 002-*.md, etc.

# Check checkpoint
ls .history/checkpoints/
# Should see: approach-selected/
```

#### 1.2 Drafting Phase

**Action**: Use `draft_document` prompt

**Expected Behavior**:
- ✅ Loads `templates/blog-post-template.md`
- ✅ Reads Output Document Structure section
- ✅ Reviews captured narrative for context
- ✅ Applies "Structured Single Post" approach strategy
- ✅ Generates draft with structure:
  ```markdown
  # Why Templates Matter
  
  [Opening hook]
  
  ## [Section 1]
  [Content based on user's angle]
  
  ## [Section 2]
  [Content based on user's purpose]
  
  ## Conclusion
  [Wrap up]
  ```

**Expected Behavior**:
- ✅ Draft saved as `current-draft.md`
- ✅ Version incremented to v0.1
- ✅ Draft snapshot saved to `drafts/draft-v0.1.md`
- ✅ Timeline event: `draft_created`
- ✅ Checkpoint created: "initial-draft"

**Validation**:
```bash
# Check draft exists
cat current-draft.md

# Check version
cat config.json | grep version
# Should show: "version": "0.1"

# Check draft snapshot
cat drafts/draft-v0.1.md

# Check timeline
cat .history/timeline.jsonl | grep "draft_created"

# Check checkpoint
ls .history/checkpoints/
# Should see: initial-draft/
```

#### 1.3 Revision Phase (Round 1)

**Action**: Use `revise_document` prompt

**Input**:
```
User: "The introduction is too technical. Make it more accessible."
```

**Expected Behavior**:
- ✅ Feedback captured with `riotdoc_add_narrative`
- ✅ Checkpoint created: "pre-revision-v0.1"
- ✅ Introduction revised (more accessible language)
- ✅ Draft updated in `current-draft.md`
- ✅ Version incremented to v0.2
- ✅ Snapshot saved to `drafts/draft-v0.2.md`
- ✅ Timeline event: `revision_added`

**Validation**:
```bash
# Check version
cat config.json | grep version
# Should show: "version": "0.2"

# Check version history
cat config.json | grep -A 10 versionHistory
# Should show both v0.1 and v0.2

# Compare versions
diff drafts/draft-v0.1.md drafts/draft-v0.2.md
# Should show introduction changes

# Check timeline
cat .history/timeline.jsonl | grep "revision_added"
```

#### 1.4 Revision Phase (Round 2)

**Input**:
```
User: "Add more examples in the middle section."
```

**Expected Behavior**:
- ✅ Feedback captured
- ✅ Checkpoint created: "pre-revision-v0.2"
- ✅ Examples added
- ✅ Version incremented to v0.3
- ✅ Snapshot saved

**Validation**:
```bash
# Check version progression
cat config.json | grep version
# Should show: "version": "0.3"

# Check all snapshots exist
ls drafts/
# Should see: draft-v0.1.md, draft-v0.2.md, draft-v0.3.md
```

#### 1.5 Finalization Phase

**Action**: Use `finalize_document` prompt

**Input**:
```
User: "Ready to publish!"
```

**Expected Behavior**:
- ✅ Prompt loads Publishing Phase Questions from template
- ✅ Asks publishing questions (NOT Idea/Draft questions):
  - Categories
  - Tags
  - SEO keywords
  - Meta description
  - Featured image
  - Publication date

**Continue**:
```
User answers:
- Categories: Development, Best Practices
- Tags: typescript, markdown, automation
- Keywords: templates, document generation, workflows
- Meta: "Learn how templates drive document workflows"
```

**Expected Behavior**:
- ✅ Responses captured with `riotdoc_add_narrative`
- ✅ Metadata added to `config.json`
- ✅ Checkpoint created: "pre-publication"
- ✅ Version incremented to v1.0 (major increment)
- ✅ `published: true` set in config
- ✅ Timeline event: `version_published`
- ✅ Checkpoint created: "published-v1.0"
- ✅ Celebration message: "🎉 Congratulations! Published as v1.0"

**Validation**:
```bash
# Check version
cat config.json | grep version
# Should show: "version": "1.0"

# Check published status
cat config.json | grep published
# Should show: "published": true

# Check metadata
cat config.json | grep -A 10 metadata
# Should show categories, tags, keywords, etc.

# Check timeline
cat .history/timeline.jsonl | grep "version_published"

# Check all snapshots
ls drafts/
# Should see: draft-v0.1.md through draft-v1.0.md
```

### Test Result Summary

**Blog Post Workflow**: ✅ PASS / ❌ FAIL

**Issues Found**:
- [List any issues]

**Notes**:
- [Any observations]

---

## Test Suite 2: Podcast Script Workflow

### Objective
Validate that different document types ask different questions.

### Test Steps

#### 2.1 Exploration Phase

**Action**: Use `explore_document` prompt

**Input**:
```
User: "I want to create a podcast script"
```

**Expected Behavior**:
- ✅ Prompt loads `templates/podcast-script-template.md`
- ✅ Asks PODCAST-SPECIFIC questions (NOT blog post questions):
  - Episode title
  - Format (solo/interview/panel/narrative)
  - Main topic/theme
  - Key points to cover
  - Episode length
  - Tone/style
  - Target audience

**Continue**:
```
User answers:
- Title: "The Template Revolution"
- Format: Interview
- Topic: How templates change development
- Key points: History, current state, future
- Length: 45 minutes
- Tone: Conversational, informative
- Audience: Developers and tech leads
```

**Expected Behavior**:
- ✅ Presents PODCAST-SPECIFIC approaches:
  - Quick Solo Episode
  - Structured Interview Episode
  - Narrative Series

**Continue**:
```
User: "Structured Interview Episode"
```

**Expected Behavior**:
- ✅ Approach selection logged
- ✅ Checkpoint created

#### 2.2 Drafting Phase

**Expected Behavior**:
- ✅ Generates script with PODCAST-SPECIFIC structure:
  ```markdown
  # The Template Revolution
  
  ## Pre-Show Notes
  [Technical setup, guest intro]
  
  ## Opening (0:00-2:00)
  [Intro music, welcome, episode overview]
  
  ## Segment 1: History (2:00-15:00)
  [Interview questions and talking points]
  
  ## Segment 2: Current State (15:00-30:00)
  [Interview questions and talking points]
  
  ## Segment 3: Future (30:00-42:00)
  [Interview questions and talking points]
  
  ## Closing (42:00-45:00)
  [Wrap up, call to action, outro]
  
  ## Production Notes
  [Editing notes, music cues, timestamps]
  ```

**Expected Behavior**:
- ✅ Includes timing information
- ✅ Includes segment structure
- ✅ Includes production notes
- ✅ Version v0.1 created

**Validation**:
```bash
# Check script structure
cat current-draft.md | grep "##"
# Should show: Pre-Show, Opening, Segments, Closing, Production Notes

# Check timing
cat current-draft.md | grep "0:00"
# Should show timestamps
```

### Test Result Summary

**Podcast Script Workflow**: ✅ PASS / ❌ FAIL

**Key Validation**: Different document type = different questions and structure

---

## Test Suite 3: Outline Manipulation

### Objective
Validate outline manipulation tools work correctly.

### Test Steps

#### 3.1 Insert Section

**Setup**: Create document with outline

**Action**: Use `riotdoc_outline_insert_section`

**Input**:
```typescript
riotdoc_outline_insert_section({
    title: "New Section",
    after: "Introduction"
});
```

**Expected Behavior**:
- ✅ Section inserted after Introduction
- ✅ Outline file updated
- ✅ Timeline event logged

**Validation**:
```bash
# Check outline
cat outline.md
# Should show new section after Introduction

# Check timeline
cat .history/timeline.jsonl | grep "outline_created"
```

#### 3.2 Move Section

**Action**: Use `riotdoc_outline_move_section`

**Input**:
```typescript
riotdoc_outline_move_section({
    title: "Conclusion",
    position: 2
});
```

**Expected Behavior**:
- ✅ Conclusion moved to position 2
- ✅ Outline reordered
- ✅ Timeline event logged

**Validation**:
```bash
# Check outline order
cat outline.md | grep "##"
# Should show Conclusion at position 2
```

#### 3.3 Rename Section

**Action**: Use `riotdoc_outline_rename_section`

**Input**:
```typescript
riotdoc_outline_rename_section({
    oldTitle: "New Section",
    newTitle: "Background"
});
```

**Expected Behavior**:
- ✅ Section renamed
- ✅ Timeline event logged

#### 3.4 Delete Section

**Action**: Use `riotdoc_outline_delete_section`

**Input**:
```typescript
riotdoc_outline_delete_section({
    title: "Background"
});
```

**Expected Behavior**:
- ✅ Section removed
- ✅ Timeline event logged

### Test Result Summary

**Outline Manipulation**: ✅ PASS / ❌ FAIL

---

## Test Suite 4: Version Numbering

### Objective
Validate version control system works correctly.

### Test Steps

#### 4.1 Initial Version

**Expected**: New documents start at v0.1

**Validation**:
```bash
cat config.json | grep version
# Should show: "version": "0.1"
```

#### 4.2 Minor Increments (Draft Versions)

**Action**: Multiple revisions

**Expected**:
- v0.1 → v0.2 → v0.3 → v0.4

**Validation**:
```bash
# Check version history
cat config.json | grep -A 20 versionHistory
# Should show all versions with timestamps

# Check snapshots
ls drafts/
# Should have: draft-v0.1.md, draft-v0.2.md, etc.
```

#### 4.3 Major Increment (Publication)

**Action**: Finalize document

**Expected**:
- v0.x → v1.0
- `published: true`

**Validation**:
```bash
cat config.json | grep version
# Should show: "version": "1.0"

cat config.json | grep published
# Should show: "published": true
```

#### 4.4 Post-Publication Updates

**Action**: Revise published document

**Expected**:
- v1.0 → v1.1 → v1.2

**Validation**:
```bash
# Check version progression
cat config.json | grep version
# Should show: "version": "1.1" or "1.2"

# Check published status remains true
cat config.json | grep published
# Should still show: "published": true
```

### Test Result Summary

**Version Numbering**: ✅ PASS / ❌ FAIL

---

## Test Suite 5: Narrative & Checkpoint System

### Objective
Validate narrative capture and checkpoint restoration.

### Test Steps

#### 5.1 Narrative Capture

**Action**: Add narrative

**Input**:
```typescript
riotdoc_add_narrative({
    content: "This is a test narrative with important context about the document.",
    context: "Testing narrative capture",
    source: "typing",
    speaker: "user"
});
```

**Expected Behavior**:
- ✅ Event logged to `.history/timeline.jsonl`
- ✅ File created in `.history/prompts/NNN-testing-narrative-capture.md`
- ✅ File contains:
  - Timestamp
  - Context
  - Source
  - Speaker
  - Full content

**Validation**:
```bash
# Check timeline
cat .history/timeline.jsonl | grep "narrative_chunk"

# Check prompt file exists
ls .history/prompts/
# Should see numbered file with slugified context

# Check file content
cat .history/prompts/001-testing-narrative-capture.md
# Should contain all metadata and content
```

#### 5.2 Checkpoint Creation

**Action**: Create checkpoint

**Input**:
```typescript
riotdoc_create_checkpoint({
    name: "test-checkpoint",
    message: "Testing checkpoint system"
});
```

**Expected Behavior**:
- ✅ Checkpoint directory created: `.history/checkpoints/test-checkpoint/`
- ✅ Files captured:
  - `config.json`
  - `outline.md`
  - `current-draft.md`
  - `drafts/` (all versions)
- ✅ Metadata file: `checkpoint.json`
- ✅ Timeline event logged

**Validation**:
```bash
# Check checkpoint exists
ls .history/checkpoints/
# Should see: test-checkpoint/

# Check captured files
ls .history/checkpoints/test-checkpoint/
# Should see: config.json, outline.md, current-draft.md, drafts/, checkpoint.json

# Check timeline
cat .history/timeline.jsonl | grep "checkpoint_created"
```

#### 5.3 Make Changes

**Action**: Modify document significantly

```bash
# Make breaking changes to draft
echo "BROKEN CONTENT" > current-draft.md

# Increment version
# (simulating a bad revision)
```

#### 5.4 Checkpoint Restoration

**Action**: Restore from checkpoint

**Input**:
```typescript
riotdoc_checkpoint_restore({
    checkpoint: "test-checkpoint"
});
```

**Expected Behavior**:
- ✅ All files restored to checkpoint state
- ✅ `current-draft.md` restored (no longer broken)
- ✅ `config.json` restored
- ✅ Timeline event: `checkpoint_restored`

**Validation**:
```bash
# Check draft restored
cat current-draft.md
# Should NOT contain "BROKEN CONTENT"

# Check timeline
cat .history/timeline.jsonl | grep "checkpoint_restored"
```

### Test Result Summary

**Narrative & Checkpoint System**: ✅ PASS / ❌ FAIL

---

## Integration Tests

### Test: Template Change Propagation

**Objective**: Verify prompts adapt when templates change

**Steps**:
1. Edit `templates/blog-post-template.md`
2. Add new question to Idea/Draft Phase: "- **Hook**: What's the opening hook?"
3. Run `explore_document` for new blog post
4. **Expected**: Prompt automatically asks the new question

**Result**: ✅ PASS / ❌ FAIL

### Test: Cross-Phase Consistency

**Objective**: Verify information flows between phases

**Steps**:
1. Answer questions in exploration phase
2. Generate draft in drafting phase
3. **Expected**: Draft uses answers from exploration (no re-asking)

**Result**: ✅ PASS / ❌ FAIL

### Test: Version History Integrity

**Objective**: Verify version history is complete and accurate

**Steps**:
1. Create document with 5 revisions (v0.1 → v0.5)
2. Publish (v0.5 → v1.0)
3. Check version history in config
4. **Expected**: All 6 versions listed with timestamps and notes

**Result**: ✅ PASS / ❌ FAIL

---

## Performance Tests

### Test: Large Document Handling

**Objective**: Verify system handles large documents

**Steps**:
1. Create document with 10,000+ words
2. Make multiple revisions
3. Check performance of version snapshots
4. **Expected**: No significant slowdown

**Result**: ✅ PASS / ❌ FAIL

### Test: Many Revisions

**Objective**: Verify system handles many versions

**Steps**:
1. Create document
2. Make 20+ revisions (v0.1 → v0.20)
3. Check version history
4. Check draft snapshots
5. **Expected**: All versions tracked correctly

**Result**: ✅ PASS / ❌ FAIL

---

## Error Handling Tests

### Test: Missing Template

**Input**: Request document type with no template

**Expected**: Clear error message listing available types

**Result**: ✅ PASS / ❌ FAIL

### Test: Invalid Version Operation

**Input**: Try to increment version on non-existent document

**Expected**: Clear error message

**Result**: ✅ PASS / ❌ FAIL

### Test: Checkpoint Restoration Failure

**Input**: Try to restore non-existent checkpoint

**Expected**: Clear error message listing available checkpoints

**Result**: ✅ PASS / ❌ FAIL

---

## Test Summary

### Overall Results

| Test Suite | Status | Issues |
|------------|--------|--------|
| Blog Post Workflow | ✅/❌ | |
| Podcast Script Workflow | ✅/❌ | |
| Outline Manipulation | ✅/❌ | |
| Version Numbering | ✅/❌ | |
| Narrative & Checkpoint | ✅/❌ | |
| Integration Tests | ✅/❌ | |
| Performance Tests | ✅/❌ | |
| Error Handling | ✅/❌ | |

### Critical Issues

[List any critical issues that must be fixed]

### Minor Issues

[List any minor issues or improvements]

### Known Limitations

[List any known limitations or future enhancements]

---

## Sign-Off

**Tested By**: _______________  
**Date**: _______________  
**Version**: 1.0  
**Status**: ✅ APPROVED / ❌ NEEDS WORK

**Notes**:
[Any additional notes or observations]
