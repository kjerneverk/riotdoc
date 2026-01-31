# RiotDoc Guide

## Overview

RiotDoc is a structured document creation tool with AI assistance. It helps you create high-quality documents through a systematic workflow.

## Installation

```bash
npm install -g @kjerneverk/riotdoc
```

## Quick Start

### 1. Create a New Document

```bash
riotdoc create my-blog-post
```

This will:
- Prompt for document type (blog post, podcast script, technical doc, newsletter, custom)
- Ask for title and objectives
- Create a complete workspace structure

### 2. Define Your Voice

Edit `voice/tone.md` to define your writing voice:
- Tone (conversational, formal, academic, etc.)
- Point of view (first, second, third person)
- Style guidelines
- Things to avoid

### 3. Refine Objectives

Edit `OBJECTIVES.md` to clarify:
- Primary goal
- Secondary goals
- Key takeaways
- Call to action
- Emotional arc

### 4. Create an Outline

```bash
riotdoc outline my-blog-post --generate
```

Or edit manually:

```bash
riotdoc outline my-blog-post --edit
```

### 5. Generate Drafts

```bash
riotdoc draft my-blog-post --level expand
```

Assistance levels:
- `generate` - Full AI generation
- `expand` - AI expands your points
- `revise` - AI improves existing content
- `cleanup` - Light editing only
- `spellcheck` - Just fix errors

### 6. Revise and Refine

```bash
riotdoc revise my-blog-post --draft 01
```

### 7. Export Final Document

```bash
riotdoc export my-blog-post --draft 01
```

## Workspace Structure

```
my-blog-post/
├── riotdoc.yaml          # Configuration
├── OBJECTIVES.md         # Goals and objectives
├── OUTLINE.md            # Document outline
├── voice/                # Voice and style
│   ├── tone.md          # Tone and POV
│   ├── style-rules.md   # Do's and don'ts
│   └── glossary.md      # Terms and spelling
├── evidence/             # Research and references
├── drafts/               # Draft iterations
├── revisions/            # Revision feedback
└── export/               # Final output
```

## Commands

### `riotdoc create <name>`

Create a new document workspace.

Options:
- `-t, --type <type>` - Document type
- `-T, --title <title>` - Document title
- `-p, --path <path>` - Base path

### `riotdoc outline [path]`

Generate or edit document outline.

Options:
- `-g, --generate` - Generate outline with AI
- `-e, --edit` - Open outline in editor

### `riotdoc draft [path]`

Create a new draft.

Options:
- `-l, --level <level>` - AI assistance level
- `-f, --from <draft>` - Base on existing draft

### `riotdoc revise [path]`

Add revision feedback.

Options:
- `-d, --draft <number>` - Target draft number
- `-m, --message <message>` - Revision feedback

### `riotdoc cleanup [path]`

Light editing pass for grammar and clarity.

Options:
- `-d, --draft <number>` - Target draft

### `riotdoc spellcheck [path]`

Fix spelling and grammar only.

Options:
- `-d, --draft <number>` - Target draft

### `riotdoc export [path]`

Export publication-ready document.

Options:
- `-d, --draft <number>` - Source draft
- `-o, --output <file>` - Output file name

### `riotdoc status [path]`

Show document status and statistics.

## Voice Configuration

The voice configuration defines how your document should sound. Edit `voice/tone.md`:

```markdown
# Voice & Tone

## Overall Tone

Conversational and friendly

## Point of View

First person (I, we)

## Example Phrases

> "Let's dive in"
> "Here's the thing"
```

## Style Rules

Define style guidelines in `voice/style-rules.md`:

```markdown
# Style Rules

## Do

- Use active voice
- Keep sentences concise
- Include concrete examples

## Don't

- Use jargon without explanation
- Be vague
- Use passive voice
```

## Evidence Management

Place research materials, quotes, and references in the `evidence/` directory:

```
evidence/
├── research/
├── quotes/
├── data/
└── images/
```

## Best Practices

1. **Start with clear objectives** - Define your goals before writing
2. **Establish voice early** - Set tone and style guidelines upfront
3. **Iterate on outline** - Get the structure right before drafting
4. **Use appropriate assistance levels** - Match AI help to your needs
5. **Collect evidence first** - Gather research before drafting
6. **Revise systematically** - Use revision feedback to improve
7. **Export when ready** - Don't over-edit

## AI Integration

RiotDoc is designed to work with various AI providers. The tool generates prompts that include:
- Document objectives
- Voice and tone guidelines
- Style rules
- Outline structure
- Evidence references

These prompts can be used with any LLM provider.

## License

Apache-2.0
