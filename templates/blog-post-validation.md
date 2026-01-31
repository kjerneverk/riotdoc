# Blog Post Template Validation

**Template**: `blog-post-template.md` v2.0  
**Validation Date**: 2026-01-30  
**Validator**: Canonical structure from TEMPLATE-STRUCTURE.md

---

## Validation Checklist

- [x] Has `## Questions to Answer` section
- [x] Has `### Idea/Draft Phase` subsection with appropriate questions
- [x] Has `### Publishing Phase` subsection with appropriate questions
- [x] Idea/Draft questions focus on immediate creative concerns
- [x] Publishing questions focus on "after the fact" concerns
- [x] Has `## Available Approaches` section
- [x] Each approach has: name, when to use, strategy, output, workflow
- [x] At least 2-3 approaches defined (has 3)
- [x] Has `## Output Document Structure` section
- [x] Output structure is in markdown code block
- [x] Output structure uses `[placeholder]` format
- [x] Template is markdown with well-defined sections (NOT YAML)
- [x] Section names are consistent and machine-parseable
- [x] Questions are conversational and clear
- [x] Template supports 2-5 questions at a time (not overwhelming)

**Compliance Score**: 15/15 (100%) ✅

---

## Detailed Validation

### Section 1: Idea/Draft Phase Questions ✅

**Location**: Lines 11-34

**Questions included**:
- Title (or idea for title)
- Topic
- Angle
- Target length
- Purpose
- Tone
- Target audience

**Assessment**: 
- ✅ All questions focus on immediate creative decisions
- ✅ Things you can answer NOW when starting
- ✅ Grouped into logical categories (Core Concept, Scope & Approach, Audience)
- ✅ Includes helpful guidance in parentheses
- ✅ Conversational and clear

**Comparison to user feedback** (Timeline Event 72):
> "I'm gonna wanna focus on title Topic angle target length"

✅ All these are in Idea/Draft phase
✅ No SEO/categories/tags in this phase

---

### Section 2: Publishing Phase Questions ✅

**Location**: Lines 36-69

**Questions included**:
- SEO keywords
- Meta description
- Category/tags
- Website/platform
- Featured image
- Inline images
- Code examples
- Links (internal/external)
- Examples
- Related content
- Call to action
- Publish date
- Social media promotion
- Newsletter inclusion

**Assessment**:
- ✅ All questions are "after the fact" concerns
- ✅ Things you figure out LATER after drafting
- ✅ Grouped into logical categories (SEO & Discovery, Content Enhancement, Call to Action, Publication Details)
- ✅ Comprehensive but not overwhelming (asked later, not upfront)

**Comparison to user feedback** (Timeline Event 72):
> "categories an SCO is an after the fact concern"

✅ SEO and categories are in Publishing phase
✅ Not asked upfront anymore

---

### Section 3: Available Approaches ✅

**Location**: Lines 71-185

**Approaches defined**:

1. **Quick & Direct** (lines 73-97)
   - ✅ Name: Clear and descriptive
   - ✅ When to use: 5 specific situations
   - ✅ Strategy: 4 clear points
   - ✅ Output: Single blog post, 500-1000 words
   - ✅ Workflow: 5 numbered steps
   - ✅ Timeline: 2-4 hours

2. **Structured Single Post** (lines 99-135)
   - ✅ Name: Clear and descriptive
   - ✅ When to use: 5 specific situations
   - ✅ Strategy: 5 clear points
   - ✅ Output: Single blog post, 1500-3000 words
   - ✅ Workflow: 11 numbered steps
   - ✅ Timeline: 1-3 days

3. **Multi-Post Series** (lines 137-185)
   - ✅ Name: Clear and descriptive
   - ✅ When to use: 5 specific situations
   - ✅ Strategy: 6 clear points
   - ✅ Output: 3-5 related blog posts
   - ✅ Workflow: 8 numbered steps (with sub-steps)
   - ✅ Timeline: 1-2 weeks
   - ✅ Bonus: Series structure example

**Assessment**:
- ✅ Three distinct approaches for different situations
- ✅ Each approach has all required fields
- ✅ Workflows are detailed and actionable
- ✅ Clear differentiation between approaches
- ✅ Timelines help users choose

**Comparison to user feedback** (Timeline Event 89):
> "Some plugs are really quick and direct... might be larger than one block... one shape is to generate multiple blog posts"

✅ Quick & Direct approach for simple posts
✅ Multi-Post Series approach for large ideas

---

### Section 4: Output Document Structure ✅

**Location**: Lines 187-232

**Structure includes**:
- Metadata (author, date, category, tags, reading time)
- Introduction section with guidance
- Multiple content sections with subsections
- Conclusion with summary and CTA
- Metadata section for SEO and links

**Assessment**:
- ✅ In markdown code block
- ✅ Uses `[placeholder]` format consistently
- ✅ Shows complete document structure
- ✅ Includes guidance comments in brackets
- ✅ Flexible structure (sections can be added/removed)

---

## Improvements Over v1.0

### Problem in v1.0
- Asked ALL questions upfront (13 questions)
- Mixed immediate concerns with "after the fact" concerns
- User said it was "too heavy"
- No approaches defined
- No workflow guidance

### Solutions in v2.0
- ✅ Split into Idea/Draft (7 questions) and Publishing (14 questions)
- ✅ Right questions at right time
- ✅ Three approaches with detailed workflows
- ✅ Clear guidance on when to use each approach
- ✅ Timelines to set expectations
- ✅ Writing tips and common pitfalls

---

## Parsing Test

### Can prompts extract Idea/Draft questions?
✅ Yes - clear section header `### Idea/Draft Phase`

### Can prompts extract Publishing questions?
✅ Yes - clear section header `### Publishing Phase`

### Can prompts extract approaches?
✅ Yes - clear section header `## Available Approaches`
✅ Each approach has `### Approach N: Name` header

### Can prompts extract output structure?
✅ Yes - clear section header `## Output Document Structure`
✅ Structure in markdown code block

### Can prompts ask questions conversationally?
✅ Yes - questions grouped by category
✅ 2-3 questions per category
✅ Can ask category by category

---

## User Feedback Validation

### Timeline Event 72
> "when I'm starting to write a blog post and I'm starting to think about the idea, I'm gonna wanna focus on title Topic angle target length I'm actually not really gonna focus too much on SCO keywords category tag both of those things categories an SCO is an after the fact concern"

**Validation**:
- ✅ Title, topic, angle, target length are in Idea/Draft phase
- ✅ SEO keywords, categories, tags are in Publishing phase
- ✅ No longer "too heavy" - right questions at right time

### Timeline Event 89
> "Some plugs are really quick and direct... The other thing is like this idea... might be larger than one block... one shape is to generate multiple blog posts"

**Validation**:
- ✅ Quick & Direct approach for simple posts
- ✅ Structured Single Post for complex ideas
- ✅ Multi-Post Series for large ideas that need multiple posts

---

## Acceptance Criteria Check

From Step 2 plan:

- [x] Questions split into Idea/Draft Phase and Publishing Phase
- [x] Idea/Draft Phase has: title, topic, angle, length, purpose, tone, audience
- [x] Publishing Phase has: SEO, categories, tags, images, links, CTA, related content
- [x] Three approaches defined: Quick & Direct, Structured, Multi-Post Series
- [x] Each approach has: when to use, strategy, output, workflow
- [x] Template follows canonical structure from Step 1
- [x] Template can be parsed by prompts to extract questions
- [x] No more "too heavy" - right questions at right time

**All acceptance criteria met!** ✅

---

## Recommendations

### Strengths
1. **Lifecycle-aware**: Perfect split between NOW and LATER questions
2. **Approach-driven**: Three clear strategies for different situations
3. **Detailed workflows**: Users know exactly what to do
4. **User feedback addressed**: No longer "too heavy"
5. **Machine-readable**: Prompts can easily parse this
6. **Human-readable**: Clear, conversational, helpful

### Potential Enhancements (Future)
1. Could add more examples of each approach in practice
2. Could add templates for specific blog post types (tutorial, opinion, case study)
3. Could add checklist for each approach
4. Could add estimated word counts per section

### No Changes Needed
This template is ready to use as-is. It's 100% compliant with the canonical structure and addresses all user feedback.

---

## Conclusion

**Status**: ✅ **FULLY COMPLIANT**

The blog post template v2.0 is a complete success:
- Follows canonical structure perfectly
- Addresses user feedback completely
- Provides three clear approaches
- Ready for prompts to parse and use
- No longer "too heavy"

This template can serve as a model for other templates going forward.

---

**Validated by**: Canonical structure comparison  
**Date**: 2026-01-30  
**Result**: 15/15 criteria met (100% compliance)
