# Draft Document Workflow

## Objective

Create a new draft of the document with appropriate AI assistance level.

## Prerequisites

Before drafting, ensure:
1. Document workspace exists
2. Outline is complete (check with `riotdoc://outline` resource)
3. Objectives are defined (check with `riotdoc://objectives` resource)
4. Voice is configured (check with `riotdoc://voice` resource)

## Assistance Levels

Choose the appropriate level based on needs:

- **generate**: Full AI generation from outline
  - Use when starting from scratch
  - AI writes complete sections based on outline
  - Requires well-defined outline and objectives

- **expand**: AI expands user-provided points
  - Use when you have bullet points or brief notes
  - AI fleshes out ideas into full paragraphs
  - Good for collaborative writing

- **revise**: AI improves existing content
  - Use when you have a rough draft
  - AI enhances clarity, flow, and style
  - Maintains your original structure and ideas

- **cleanup**: Light editing only
  - Use for near-final drafts
  - AI fixes grammar, punctuation, and minor issues
  - Minimal changes to content

- **spellcheck**: Just fix errors
  - Use for final review
  - Only corrects spelling and obvious typos
  - No content or style changes

## Workflow Steps

1. **Check Document Status**
   - Fetch `riotdoc://status` to verify document state
   - Ensure outline exists and objectives are defined

2. **Choose Assistance Level**
   - Based on current draft state and needs
   - Consider how much control you want vs. AI assistance

3. **Create Draft**
   - Run `riotdoc_draft` with chosen assistance level:
     ```
     riotdoc_draft({
       path: "${path}",
       assistance_level: "${level}"
     })
     ```

4. **Review Draft**
   - Check the generated draft in drafts/ directory
   - Verify it matches voice and objectives
   - Note areas for revision

5. **Iterate**
   - If needed, create revision feedback: `riotdoc_revise`
   - Create new draft with adjustments
   - Repeat until satisfied

## Example Flow

```
# Creating first draft with full AI generation

1. Fetch riotdoc://document/my-blog-post
   → Verify outline and objectives are complete

2. riotdoc_draft({
     path: "my-blog-post",
     assistance_level: "generate"
   })
   → Creates drafts/draft-01.md

3. Review draft-01.md
   → Identify areas needing adjustment

4. riotdoc_revise({
     path: "my-blog-post",
     draft: 1,
     feedback: "Expand the introduction, add more examples in section 2"
   })

5. riotdoc_draft({
     path: "my-blog-post",
     assistance_level: "revise"
   })
   → Creates drafts/draft-02.md with revisions
```

## Important Notes

- Each draft is numbered sequentially (01, 02, 03, etc.)
- Drafts are never overwritten - history is preserved
- Draft metadata includes word count and assistance level
- Use `riotdoc://document` resource to see all drafts
