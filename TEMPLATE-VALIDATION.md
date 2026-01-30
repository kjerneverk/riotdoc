# Template Validation Report

This document validates existing template prototypes against the canonical template structure defined in `TEMPLATE-STRUCTURE.md`.

**Validation Date**: 2026-01-30

---

## Validation Checklist

Each template is checked against these criteria:

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

## Template 1: Podcast Script

**Location**: `plans/riotdoc-enhancements/evidence/podcast-script-template.md`

**Status**: ✅ **MOSTLY COMPLIANT** (Model to follow)

### Validation Results

✅ **Has `## Questions to Answer` section** (line 9)
✅ **Has `### Idea/Draft Phase` subsection** (line 11)
✅ **Has `### Publishing Phase` subsection** (line 36)
✅ **Idea/Draft questions focus on immediate creative concerns**
  - Episode basics (title, number, topic, angle, length)
  - Format & structure
  - Content planning
  - Audio elements
  - All things you know NOW when starting the episode

✅ **Publishing questions focus on "after the fact" concerns**
  - Production details (show notes, timestamps, transcript)
  - Distribution (podcast feed, release date, social media)
  - All things you figure out LATER

❌ **Missing `## Available Approaches` section**
  - Should define approaches like:
    - Solo Episode (one host, prepared script)
    - Interview Episode (guest, Q&A format)
    - Co-hosted Discussion (multiple hosts, conversational)
    - Narrative Storytelling (scripted, produced)

✅ **Has `## Output Document Structure` section** (line 53)
✅ **Output structure is in markdown code block**
✅ **Output structure uses `[placeholder]` format**
✅ **Template is markdown with well-defined sections**
✅ **Section names are consistent and machine-parseable**
✅ **Questions are conversational and clear**
✅ **Template supports 2-5 questions at a time**

### Compliance Score: 13/15 (87%)

### Required Changes

1. **Add `## Available Approaches` section** with 2-3 approaches:
   - Solo Episode
   - Interview Episode
   - Co-hosted Discussion

### Recommended Changes

None - this template is the model to follow!

---

## Template 2: Blog Post

**Location**: `plans/riotdoc-enhancements/evidence/blog-post-template.md`

**Status**: ❌ **NEEDS MAJOR REVISION**

### Validation Results

✅ **Has `## Questions to Answer` section** (line 9)
❌ **Missing `### Idea/Draft Phase` subsection**
  - Has flat structure, not split by phase
  - Questions are grouped by topic, not by lifecycle

❌ **Missing `### Publishing Phase` subsection**
  - All questions mixed together

❌ **Idea/Draft questions NOT properly separated**
  - Mixes immediate concerns (title, topic, angle) with after-the-fact concerns (SEO, categories)
  - User feedback (Timeline Event 72): "too heavy" - asking about SEO/categories upfront

❌ **Publishing questions NOT properly separated**
  - SEO keywords, categories, tags should be in Publishing phase
  - Currently asked upfront in "Audience & Publication" section

❌ **Missing `## Available Approaches` section**
  - Should define approaches like:
    - Quick & Direct (500-1000 words, minimal planning)
    - Structured Single Post (1500-3000 words, detailed outline)
    - Multi-Post Series (break into 3-5 related posts)

✅ **Has `## Output Document Structure` section** (line 36)
✅ **Output structure is in markdown code block**
✅ **Output structure uses `[placeholder]` format**
✅ **Template is markdown with well-defined sections**
✅ **Section names are consistent and machine-parseable**
⚠️ **Questions are conversational but too many upfront**
  - 13 questions all at once is overwhelming
  - Should be split by phase and asked 2-5 at a time

### Compliance Score: 5/15 (33%)

### Required Changes

1. **Split questions into Idea/Draft and Publishing phases**:
   
   **Idea/Draft Phase** (things you know NOW):
   - Title (or idea for title)
   - Topic
   - Angle
   - Target length
   - Target audience
   - Purpose
   - Tone
   
   **Publishing Phase** (things you figure out LATER):
   - SEO keywords
   - Category/tags
   - Website/platform
   - Call to action
   - Images needed
   - Links (internal/external)
   - Related content

2. **Add `## Available Approaches` section** with 3 approaches:
   - Quick & Direct
   - Structured Single Post
   - Multi-Post Series

3. **Reduce question overload**:
   - Group questions by category within each phase
   - Support asking 2-5 at a time conversationally

### Recommended Changes

- Add examples or guidance in parentheses for questions
- Consider adding "Examples" section showing different blog post types

---

## Template 3: Email

**Location**: `plans/riotdoc-enhancements/evidence/email-template.md`

**Status**: ❌ **NEEDS PHASE SPLIT**

### Validation Results

✅ **Has `## Questions to Answer` section**
❌ **Missing `### Idea/Draft Phase` subsection**
  - Has flat structure, not split by phase

❌ **Missing `### Publishing Phase` subsection**
  - All questions mixed together

❌ **Idea/Draft questions NOT properly separated**
  - Mixes immediate concerns (recipient, subject, purpose) with after-the-fact concerns (send time, tracking)

❌ **Publishing questions NOT properly separated**
  - Send time, tracking, follow-up should be in Publishing phase

❌ **Missing `## Available Approaches` section**
  - Should define approaches like:
    - Quick Message (brief, informal)
    - Formal Communication (structured, professional)
    - Newsletter/Announcement (formatted, designed)

⚠️ **Missing CC and BCC fields** (user noted - Timeline Event 72)

✅ **Has `## Output Document Structure` section** (line 37)
✅ **Output structure is in markdown code block**
✅ **Output structure uses `[placeholder]` format**
✅ **Template is markdown with well-defined sections**
✅ **Section names are consistent and machine-parseable**
✅ **Questions are conversational and clear**

### Compliance Score: 6/15 (40%)

### Required Changes

1. **Split questions into Idea/Draft and Publishing phases**:
   
   **Idea/Draft Phase**:
   - Recipient(s)
   - CC and BCC (ADD THIS - user feedback)
   - Subject line
   - Purpose
   - Tone
   - Key message
   
   **Publishing Phase**:
   - Send time
   - Tracking/read receipts
   - Follow-up needed
   - Attachments
   - Signature

2. **Add CC and BCC fields** to questions and output structure

3. **Add `## Available Approaches` section** with 2-3 approaches:
   - Quick Message
   - Formal Communication
   - Newsletter/Announcement

### Recommended Changes

- Add guidance for different email types (internal, external, customer, etc.)
- Consider adding templates for common email patterns (meeting request, follow-up, etc.)

---

## Template 4: Research Paper

**Location**: `plans/riotdoc-enhancements/evidence/research-paper-template.md`

**Status**: ⚠️ **NOT YET VALIDATED** (Lower priority)

**Note**: Research paper template will be validated in Step 4 when creating remaining templates. It's a more complex document type that may need special consideration.

---

## Template 5: Project Plan

**Location**: `plans/riotdoc-enhancements/evidence/project-plan-template.md`

**Status**: ⚠️ **NOT YET VALIDATED** (Lower priority)

**Note**: Project plan template will be validated in Step 4 when creating remaining templates. It's a more complex document type that may need special consideration.

---

## Summary

### Compliance Overview

| Template | Compliance Score | Status | Priority |
|----------|-----------------|--------|----------|
| Podcast Script | 87% (13/15) | ✅ Mostly Compliant | Model to follow |
| Blog Post | 33% (5/15) | ❌ Needs Major Revision | High - Step 2 |
| Email | 40% (6/15) | ❌ Needs Phase Split | Medium - Step 4 |
| Research Paper | Not Validated | ⚠️ Pending | Low - Step 4 |
| Project Plan | Not Validated | ⚠️ Pending | Low - Step 4 |

### Key Findings

1. **Podcast Script is the Model**: 87% compliant, just needs approaches added. This is the template structure to follow.

2. **Blog Post Needs Major Work**: Only 33% compliant. User said it was "too heavy" - asking about SEO/categories upfront is wrong. Needs complete restructuring.

3. **Email Needs Phase Split**: 40% compliant. Structure is okay, just needs to split questions by lifecycle phase and add CC/BCC fields.

4. **Missing Approaches Everywhere**: None of the templates define approaches/strategies, which is a critical part of the canonical structure.

### Action Items

**Step 2: Create Blog Post Template** (High Priority)
- Complete restructure following canonical structure
- Split questions into Idea/Draft and Publishing phases
- Add 3 approaches (Quick & Direct, Structured, Multi-Post Series)
- Reduce question overload

**Step 3: Create Podcast Script Template** (High Priority)
- Minor update to existing template
- Add 3 approaches (Solo, Interview, Co-hosted)
- Keep everything else as-is

**Step 4: Create Remaining Templates** (Medium Priority)
- Update Email template (phase split, add CC/BCC, add approaches)
- Validate and update Research Paper template
- Validate and update Project Plan template

---

## Validation Methodology

Templates were validated by:

1. **Manual inspection** of each template file
2. **Comparison** against canonical structure in `TEMPLATE-STRUCTURE.md`
3. **Reference** to user feedback from timeline events
4. **Scoring** against 15-point checklist

Each criterion was marked as:
- ✅ Fully compliant
- ⚠️ Partially compliant
- ❌ Not compliant

---

## Next Steps

1. **Step 2**: Revise blog post template (major restructure)
2. **Step 3**: Update podcast script template (add approaches)
3. **Step 4**: Update remaining templates (email, research paper, project plan)
4. **Ongoing**: Validate any new templates against this structure

---

## Related Documentation

- `TEMPLATE-STRUCTURE.md` - Canonical template structure specification
- `TEMPLATE-EXAMPLE.md` - Example template (meeting notes)
- `PARSING-GUIDE.md` - Guide for prompt authors on parsing templates

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-30
**Status**: Initial validation of template prototypes
