# Template Structure - Quick Reference

This is a quick reference for the canonical RiotDoc template structure. For full details, see `TEMPLATE-STRUCTURE.md`.

---

## The 4 Required Sections

Every RiotDoc template MUST have these sections:

### 1. Idea/Draft Phase Questions
```markdown
## Questions to Answer
### Idea/Draft Phase

#### [Category Name]
- **[Field name]**: [Question text] ([optional guidance])
- **[Field name]**: [Question text]
```

**What to include**: Things you know NOW when starting the document
- Title, topic, angle
- Purpose, tone, audience
- Core creative decisions

**What NOT to include**: After-the-fact concerns (SEO, categories, images, etc.)

---

### 2. Publishing Phase Questions
```markdown
### Publishing Phase

#### [Category Name]
- **[Field name]**: [Question text]
- **[Field name]**: [Question text]
```

**What to include**: Things you figure out LATER before publishing
- SEO keywords, categories, tags
- Images, links, attachments
- Distribution and promotion
- Platform-specific requirements

---

### 3. Available Approaches
```markdown
## Available Approaches

### Approach 1: [Name]
**When to use**: [Situation where this fits]

**Strategy**: [How the document will be created]

**Output**: [What gets produced]

**Workflow**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

**Define 2-3+ approaches** for different situations:
- Quick/simple vs structured/complex
- Single document vs multiple documents
- Different workflows for different needs

---

### 4. Output Document Structure
````markdown
## Output Document Structure

```markdown
# [Document Title]

**[Metadata field]**: [Value]
**[Metadata field]**: [Value]

---

## [Section 1]
[Content]

---

## [Section 2]
[Content]
```
````

**Use `[placeholder]` format** for values to be filled in.

---

## Key Principles

### Lifecycle-Aware
Split questions by WHEN they're answered:
- **NOW** (Idea/Draft) vs **LATER** (Publishing)

### Conversational
Ask 2-5 questions at a time, not 20 upfront.

### Machine-Readable
Consistent section names that prompts can parse.

### Human-Readable
Simple markdown, no YAML frontmatter.

### Approach-Driven
Multiple strategies for different situations.

---

## Quick Validation

Check your template:
- [ ] Has Idea/Draft Phase questions
- [ ] Has Publishing Phase questions  
- [ ] Has 2-3+ approaches defined
- [ ] Has output document structure
- [ ] Questions split by lifecycle (NOW vs LATER)
- [ ] Approaches have name, when, strategy, output, workflow
- [ ] Uses markdown with well-defined sections
- [ ] No YAML frontmatter

---

## Examples

- **Full Specification**: `TEMPLATE-STRUCTURE.md`
- **Example Template**: `TEMPLATE-EXAMPLE.md` (meeting notes)
- **Parsing Guide**: `PARSING-GUIDE.md` (for prompt authors)
- **Validation Report**: `TEMPLATE-VALIDATION.md` (existing templates)

---

## Model Template

**Podcast Script** (`plans/riotdoc-enhancements/evidence/podcast-script-template.md`)
- ✅ Already has Idea/Draft and Publishing phases
- ✅ Questions properly split by lifecycle
- ❌ Just needs approaches added
- **87% compliant** - use this as the model!

---

**Version**: 1.0  
**Last Updated**: 2026-01-30
