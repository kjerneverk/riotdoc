# Review Document Workflow

## Objective

Review a document draft and provide structured feedback for revision.

## Prerequisites

- Document workspace exists
- At least one draft has been created
- Fetch `riotdoc://document` to see available drafts

## Review Checklist

### Content Quality
- [ ] Does it achieve the primary goal?
- [ ] Are all key takeaways covered?
- [ ] Is the information accurate and well-supported?
- [ ] Are examples relevant and helpful?
- [ ] Is the depth appropriate for the audience?

### Structure & Flow
- [ ] Does the introduction hook the reader?
- [ ] Do sections flow logically?
- [ ] Are transitions smooth?
- [ ] Is the conclusion satisfying?
- [ ] Is the length appropriate?

### Voice & Style
- [ ] Does it match the defined tone?
- [ ] Is the point of view consistent?
- [ ] Are style guidelines followed?
- [ ] Are "avoid" items absent?
- [ ] Do example phrases appear naturally?

### Technical Quality
- [ ] Grammar and spelling correct?
- [ ] Punctuation appropriate?
- [ ] Formatting consistent?
- [ ] Links and references valid?
- [ ] Code examples (if any) working?

## Workflow Steps

1. **Read the Draft**
   - Fetch `riotdoc://document/${path}` to see draft list
   - Read the specific draft file
   - Compare against outline and objectives

2. **Check Against Standards**
   - Fetch `riotdoc://voice` for style guidelines
   - Fetch `riotdoc://objectives` for goals
   - Run `riotdoc://style-report` for validation

3. **Document Feedback**
   - Note specific issues with line numbers
   - Identify sections needing expansion or reduction
   - Suggest structural changes if needed
   - Highlight particularly good sections

4. **Provide Revision Guidance**
   - Use `riotdoc_revise` to save feedback:
     ```
     riotdoc_revise({
       path: "${path}",
       draft: ${draft_number},
       feedback: "${detailed_feedback}"
     })
     ```

5. **Create Revised Draft**
   - After feedback is provided, create new draft:
     ```
     riotdoc_draft({
       path: "${path}",
       assistance_level: "revise"
     })
     ```

## Feedback Template

```markdown
# Draft ${number} Review

## Overall Assessment
[Summary of draft quality and readiness]

## Strengths
- [What works well]
- [Effective sections]
- [Good examples]

## Areas for Improvement

### Content
- [Missing information]
- [Unclear explanations]
- [Weak examples]

### Structure
- [Flow issues]
- [Section ordering]
- [Transition problems]

### Style
- [Voice inconsistencies]
- [Tone issues]
- [Style guideline violations]

## Specific Changes

### Introduction (lines 1-50)
- [Specific feedback]

### Section 1 (lines 51-150)
- [Specific feedback]

### Section 2 (lines 151-250)
- [Specific feedback]

### Conclusion (lines 251-300)
- [Specific feedback]

## Next Steps
- [Priority revisions]
- [Optional improvements]
- [Ready for export?]
```

## Example Flow

```
# Reviewing a blog post draft

1. Fetch riotdoc://document/ai-healthcare
   → See draft-02.md is latest

2. Read draft-02.md
   → 1,500 words, covers main topics

3. Fetch riotdoc://voice/ai-healthcare
   → Should be conversational, third person

4. Fetch riotdoc://style-report/ai-healthcare
   → Check for style violations

5. Document feedback:
   - Introduction too technical, needs hook
   - Section 2 needs more examples
   - Conclusion lacks call-to-action
   - Overall voice is good

6. riotdoc_revise({
     path: "ai-healthcare",
     draft: 2,
     feedback: "Revise introduction to be more engaging..."
   })

7. riotdoc_draft({
     path: "ai-healthcare",
     assistance_level: "revise"
   })
   → Creates draft-03.md with improvements
```

## Important Notes

- Be specific with feedback - reference line numbers
- Balance criticism with recognition of strengths
- Focus on high-impact changes first
- Consider the document's goals and audience
- Multiple revision cycles are normal and expected
