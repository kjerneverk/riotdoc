# Outline Document Workflow

## Objective

Generate or refine the document outline to provide structure for drafting.

## Prerequisites

Before creating an outline:
1. Document workspace exists
2. Objectives are defined (check `riotdoc://objectives`)
3. Voice is configured (check `riotdoc://voice`)

## Workflow Steps

1. **Check Current State**
   - Fetch `riotdoc://document/${path}` to see document status
   - Check if outline already exists
   - Review objectives and voice configuration

2. **Generate Outline**
   - Run `riotdoc_outline` with generate flag:
     ```
     riotdoc_outline({
       path: "${path}",
       generate: true
     })
     ```
   - This returns an AI prompt for outline generation
   - Use the prompt with your AI provider

3. **Save Outline**
   - Save the generated outline to OUTLINE.md in the workspace
   - Ensure it follows the document type structure

4. **Review and Refine**
   - Check outline against objectives
   - Verify it matches the voice and tone
   - Adjust structure as needed

5. **Validate Structure**
   - For blog posts: Introduction, main sections, conclusion
   - For technical docs: Overview, detailed sections, examples, reference
   - For podcast scripts: Opening, segments, transitions, closing
   - For newsletters: Header, main content blocks, call-to-action

## Outline Structure Guidelines

### Blog Post
```markdown
# Introduction
- Hook
- Context
- Thesis

# Main Section 1
- Key point
- Supporting details
- Examples

# Main Section 2
- Key point
- Supporting details
- Examples

# Conclusion
- Summary
- Call to action
```

### Technical Documentation
```markdown
# Overview
- Purpose
- Scope
- Prerequisites

# Getting Started
- Installation
- Basic setup
- First example

# Detailed Usage
- Feature 1
- Feature 2
- Advanced topics

# Reference
- API documentation
- Configuration options
```

### Podcast Script
```markdown
# Opening (0:00-2:00)
- Welcome
- Episode topic
- Guest introduction

# Segment 1 (2:00-15:00)
- Main topic discussion
- Key points
- Examples

# Segment 2 (15:00-28:00)
- Deep dive
- Q&A
- Practical applications

# Closing (28:00-30:00)
- Summary
- Next episode preview
- Call to action
```

## Example Flow

```
# Creating outline for a technical blog post

1. Fetch riotdoc://document/kubernetes-guide
   → Check objectives: "Help developers understand K8s basics"
   → Check voice: "Technical but accessible, second person"

2. riotdoc_outline({
     path: "kubernetes-guide",
     generate: true
   })
   → Returns prompt for AI generation

3. Use prompt with AI to generate outline

4. Save to kubernetes-guide/OUTLINE.md

5. Review outline:
   - Does it cover all key objectives?
   - Is the flow logical?
   - Are sections appropriately sized?

6. Refine as needed and proceed to drafting
```

## Important Notes

- The outline is the foundation for all drafts
- A good outline makes drafting much easier
- Outline should align with document type conventions
- Include estimated word counts or time markers for each section
- Reference evidence items in the outline where applicable
