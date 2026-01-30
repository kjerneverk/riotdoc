# Finalize Document

**Purpose**: Prepare document for publication by asking publishing phase questions and transitioning to v1.0.

**Phase**: Finalization (after drafting and revision, before export/publication)

## Workflow

### Phase 1: Verify Readiness

Confirm the document is ready to finalize:

```typescript
// Get current state
const config = await readConfig(docPath);
const currentVersion = config.version;
const currentDraft = await readFile(join(docPath, 'current-draft.md'), 'utf-8');

// Check if in draft phase
if (config.published) {
    return "This document is already published (v1.0+). Use revise_document for updates.";
}

// Confirm with user
"Your draft is currently at v${currentVersion}. Are you ready to finalize and publish this document?"
```

**If not ready**: Return to `revise_document` for more work.

**If ready**: Proceed to Phase 2.

### Phase 2: Load Publishing Phase Questions

Read template to get publishing-specific questions:

```typescript
import { readTemplate, resolveTemplatePath } from '../prompts/template-reader.js';

const templateFile = resolveTemplatePath(config.type);
const template = await readTemplate(templateFile);

// Get PUBLISHING phase questions (not Idea/Draft)
const publishingQuestions = template.questions.publishing;
```

**Key insight**: These are questions we DIDN'T ask during exploration. They're publication-specific concerns like:
- SEO keywords
- Categories/tags
- Distribution channels
- Publication date
- Social media descriptions
- Metadata

### Phase 3: Ask Publishing Questions (Conversationally)

Ask publishing phase questions in groups (2-5 at a time):

```typescript
import { groupQuestions } from '../prompts/template-reader.js';

const groups = groupQuestions(publishingQuestions, 3);

// Ask first group
"Before we publish, let's handle some publishing details. [Q1]? [Q2]?"
[wait for response]
[capture narrative]

// Ask next group
"A few more things. [Q3]? [Q4]?"
[wait for response]
[capture narrative]
```

**Example** (blog post):
```
AI: "Before we publish, let's add some metadata. What categories should this post be in? What are the main SEO keywords?"
User: "Categories: Development, Best Practices. Keywords: templates, document generation, automation"

AI: [Captures narrative]
    "Great. Do you want to add any tags? And what should the meta description be for search engines?"
User: "Tags: typescript, markdown, tools. Meta: Learn how templates drive document generation workflows."

AI: [Captures narrative]
```

**Capture all responses**:
```typescript
riotdoc_add_narrative({
    content: userResponse,
    context: "Publishing phase questions",
    source: "typing",
    speaker: "user"
});
```

### Phase 4: Update Document Metadata

Add publishing information to document:

```typescript
// Update config with publishing metadata
config.metadata = {
    ...config.metadata,
    categories: extractedCategories,
    keywords: extractedKeywords,
    tags: extractedTags,
    metaDescription: extractedDescription,
    // ... other publishing metadata
};

await writeConfig(config);
```

**Optional**: Add frontmatter to draft if needed:

```markdown
---
title: Why Templates Matter
categories: [Development, Best Practices]
keywords: [templates, document generation, automation]
tags: [typescript, markdown, tools]
description: Learn how templates drive document generation workflows
---

# Why Templates Matter

[Content...]
```

### Phase 5: Create Pre-Publication Checkpoint

Save state before publishing:

```typescript
await riotdoc_create_checkpoint({
    name: "pre-publication",
    message: "Before publishing v1.0"
});
```

**Why**: Last chance to revert if needed.

### Phase 6: Publish (v0.x → v1.0)

Transition to published state:

```typescript
await riotdoc_increment_version({
    type: "major",
    notes: "Published document",
    saveDraft: true
});
```

**Result**: v0.9 → v1.0 🎉

**This marks**:
- Document is complete
- Ready for publication
- No longer in draft state
- Committed to this version

### Phase 7: Log Publication

```typescript
await logEvent(docPath, {
    timestamp: formatTimestamp(),
    type: 'version_published',
    data: {
        version: '1.0',
        publishingMetadata: config.metadata,
        finalWordCount: countWords(currentDraft),
        totalRevisions: versionHistory.length
    }
});
```

### Phase 8: Create Post-Publication Checkpoint

```typescript
await riotdoc_create_checkpoint({
    name: "published-v1.0",
    message: "Document published and finalized"
});
```

### Phase 9: Present Final Document

```
"🎉 Congratulations! Your document is now published as v1.0.

**Final version**: v1.0
**Word count**: [count] words
**Total revisions**: [count] versions (v0.1 → v1.0)

The document is ready for export or distribution. Would you like to:
- Export to a specific format
- Make post-publication updates (will create v1.1)
- Start a new document"
```

## Tools to Use

### Required Tools

- **`riotdoc_increment_version`**: Publish (v0.x → v1.0)
  ```typescript
  riotdoc_increment_version({
      type: "major",
      notes: "Published document"
  });
  ```

- **`riotdoc_create_checkpoint`**: Save pre/post publication state
  ```typescript
  riotdoc_create_checkpoint({
      name: "pre-publication",
      message: "Before publishing v1.0"
  });
  ```

- **`riotdoc_add_narrative`**: Capture publishing answers
  ```typescript
  riotdoc_add_narrative({
      content: publishingAnswers,
      context: "Publishing phase questions",
      speaker: "user"
  });
  ```

### Optional Tools

- **Export tools**: If available, export to final format
- **Distribution tools**: If available, publish to platforms

## Key Principles

### 1. Publishing Phase Questions Only

**Don't re-ask Idea/Draft questions**. Those were answered during exploration.

**Ask ONLY Publishing Phase questions**:
- SEO keywords
- Categories/tags
- Meta descriptions
- Distribution channels
- Publication dates
- Social media content

**Why**: Phase separation. Don't ask about SEO before the document exists.

### 2. v1.0 is a Commitment

Publishing (v0.x → v1.0) is intentional:

**Not ready**:
- "Pretty good but could be better" → Stay in v0.x, revise more
- "Needs one more pass" → Stay in v0.x
- "Almost there" → Stay in v0.x

**Ready**:
- "This is complete and polished" → Publish to v1.0
- "Ready to share publicly" → Publish to v1.0
- "No more major changes expected" → Publish to v1.0

**Why**: v1.0 signals completion. Don't rush it.

### 3. Checkpoint Before Publishing

Always create checkpoint before v1.0:

```typescript
await riotdoc_create_checkpoint({
    name: "pre-publication",
    message: "Last checkpoint before v1.0"
});
```

**Why**: Last chance to revert if user changes mind.

### 4. Capture Publishing Metadata

Store all publishing information:
- In document config
- In timeline
- In narrative

**Why**: Full history of publication decisions.

### 5. Celebrate Publication

v1.0 is a milestone! Acknowledge it:

```
"🎉 Congratulations! Your document is now published as v1.0."
```

**Why**: Publishing is an achievement. Recognize the work.

## Common Patterns

### Pattern: Full Finalization Flow

```typescript
// 1. Verify readiness
const ready = await confirmReadiness();
if (!ready) return "Let's do more revisions first";

// 2. Load publishing questions
const template = await readTemplate(templateFile);
const questions = template.questions.publishing;

// 3. Ask questions in groups
const groups = groupQuestions(questions, 3);
for (const group of groups) {
    const answers = await askQuestions(group);
    await riotdoc_add_narrative({ content: answers });
}

// 4. Update metadata
await updateMetadata(answers);

// 5. Pre-publication checkpoint
await riotdoc_create_checkpoint({
    name: "pre-publication",
    message: "Before v1.0"
});

// 6. Publish
await riotdoc_increment_version({
    type: "major",
    notes: "Published document"
});

// 7. Post-publication checkpoint
await riotdoc_create_checkpoint({
    name: "published-v1.0",
    message: "Document published"
});

// 8. Celebrate
return "🎉 Published as v1.0!";
```

### Pattern: Publishing Metadata Collection

```typescript
// Group publishing questions by category
const seoQuestions = filterQuestions(questions, 'SEO');
const categorizationQuestions = filterQuestions(questions, 'categories');
const distributionQuestions = filterQuestions(questions, 'distribution');

// Ask by category
const seo = await askQuestions(seoQuestions);
const categorization = await askQuestions(categorizationQuestions);
const distribution = await askQuestions(distributionQuestions);

// Combine into metadata
const metadata = {
    seo: parseSEO(seo),
    categorization: parseCategorization(categorization),
    distribution: parseDistribution(distribution)
};

// Store in config
config.metadata = { ...config.metadata, ...metadata };
```

### Pattern: Post-Publication Updates

```typescript
// After v1.0, updates create v1.1, v1.2, etc.
if (config.version.startsWith('1.')) {
    // Already published
    const update = await getUpdateContent();
    
    await riotdoc_create_checkpoint({
        name: `pre-update-v${config.version}`,
        message: "Before post-publication update"
    });
    
    await applyUpdate(update);
    
    await riotdoc_increment_version({
        type: "minor",
        notes: "Post-publication update"
    });
    
    // Result: v1.0 → v1.1
}
```

## Publishing Phase Questions by Document Type

### Blog Post
- Categories
- Tags
- SEO keywords
- Meta description
- Featured image
- Publication date
- Social media descriptions

### Podcast Script
- Episode number
- Publication date
- Show notes
- Timestamps
- Guest bios
- Links and resources
- Transcript availability

### Email
- Send date/time
- Recipient list
- Subject line variations (A/B test)
- Preview text
- Tracking settings

### Project Plan
- Stakeholders
- Distribution list
- Approval workflow
- Version control settings
- Access permissions

### Research Paper
- Journal/venue
- Submission date
- Keywords
- Abstract
- Author affiliations
- Acknowledgments
- Supplementary materials

## Error Handling

### Not Ready to Publish

```typescript
if (!userConfirmsReady) {
    return "Let's do more revisions first. Use revise_document to continue improving the draft.";
}
```

### Missing Publishing Questions

```typescript
if (publishingQuestions.length === 0) {
    // Template doesn't have publishing questions
    // Proceed with basic publication
    return "This template doesn't have specific publishing questions. Proceeding with basic publication.";
}
```

### Already Published

```typescript
if (config.published) {
    return "This document is already published (v1.0+). Use revise_document for post-publication updates.";
}
```

## Example: Blog Post Finalization

**Starting state**: v0.5 draft, user says ready to publish

**Process**:

1. **Confirm readiness**:
   ```
   AI: "Your draft is at v0.5. Are you ready to finalize and publish?"
   User: "Yes, let's do it!"
   ```

2. **Load publishing questions**:
   ```typescript
   const template = await readTemplate('blog-post-template.md');
   const questions = template.questions.publishing;
   // ["What categories?", "What SEO keywords?", ...]
   ```

3. **Ask publishing questions**:
   ```
   AI: "Great! Let's add some metadata. What categories should this post be in? What are the main SEO keywords?"
   User: "Categories: Development, Best Practices. Keywords: templates, automation, workflows"
   
   AI: "Perfect. What tags would you like? And what should the meta description be?"
   User: "Tags: typescript, markdown. Meta: Learn how templates drive document workflows."
   ```

4. **Update metadata**:
   ```typescript
   config.metadata = {
       categories: ["Development", "Best Practices"],
       keywords: ["templates", "automation", "workflows"],
       tags: ["typescript", "markdown"],
       metaDescription: "Learn how templates drive document workflows."
   };
   ```

5. **Pre-publication checkpoint**:
   ```typescript
   await riotdoc_create_checkpoint({
       name: "pre-publication",
       message: "Before publishing v1.0"
   });
   ```

6. **Publish**:
   ```typescript
   await riotdoc_increment_version({
       type: "major",
       notes: "Published blog post"
   });
   // v0.5 → v1.0
   ```

7. **Celebrate**:
   ```
   AI: "🎉 Congratulations! Your blog post is now published as v1.0.
   
   **Final version**: v1.0
   **Word count**: 1,247 words
   **Total revisions**: 5 versions (v0.1 → v1.0)
   
   The post is ready to publish to your blog!"
   ```

## Related Documentation

- `explore_document.md` - Initial phase (exploration)
- `draft_document.md` - Second phase (drafting)
- `revise_document.md` - Third phase (revision)
- `version-numbering.md` - Version control system
- `TEMPLATE-STRUCTURE.md` - Publishing phase questions

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation

## Notes

**Key insight**: Finalization is about PUBLICATION, not perfection. The document should already be polished from revisions. This phase is about:
- Adding publication metadata
- Making the commitment to v1.0
- Preparing for distribution

**Phase separation is critical**:
- **Exploration**: What to write (Idea/Draft questions)
- **Drafting**: Write it
- **Revision**: Improve it
- **Finalization**: Publish it (Publishing questions)

Don't ask about SEO during exploration. Don't ask about content during finalization. Each phase has its purpose.

**Symbiotic relationship**:
- **Template**: Provides publishing questions
- **This prompt**: Asks the questions and orchestrates publication
- **Version control**: Marks the milestone (v1.0)
- **Checkpoints**: Provide safety net
- **Narrative**: Captures publication decisions

Everything works together to support the transition from draft to published.
