# Getting Started

RiotDoc is a template-driven document creation system that guides you through creating high-quality documents using AI assistance, full history tracking, and version control.

## Installation

```bash
npm install -g @riotprompt/riotdoc
```

## Quick Start

### 1. Create a New Document

```bash
riotdoc create my-blog-post --type blog-post
```

This will:
- Create a complete workspace structure
- Set up configuration files
- Initialize version control
- Create template-specific files

### 2. Generate an Outline

```bash
riotdoc outline
```

The outline defines the structure of your document. You can:
- Generate it with AI assistance
- Edit it manually
- Use template-provided structure

### 3. Create a Draft

```bash
riotdoc draft --level expand
```

AI assistance levels:
- `generate` - Full AI generation from outline
- `expand` - AI expands your bullet points
- `revise` - AI improves existing content
- `cleanup` - Light editing for grammar and clarity
- `spellcheck` - Just fix spelling and grammar

### 4. Revise Your Draft

```bash
riotdoc revise
```

Provide feedback and iterate on your draft. Each revision creates a new version (v0.2, v0.3, etc.).

### 5. Export Final Document

```bash
riotdoc export
```

Export your document in various formats (Markdown, HTML, PDF).

## Key Concepts

### Template-Driven Workflow

Templates define:
- Questions to ask during creation
- Document structure and sections
- Appropriate approaches for different scenarios
- Publishing requirements

### Version Control

Documents follow semantic versioning:
- **v0.x** - Draft versions (v0.1, v0.2, v0.3)
- **v1.0** - First published version
- **v1.x** - Published updates

### Full History Tracking

Everything is captured:
- Timeline of all events (`.history/timeline.jsonl`)
- Conversation history (`.history/prompts/`)
- Version snapshots (`drafts/`)
- Checkpoints for experimentation

### Multiple Approaches

Each document type supports different workflows:
- **Blog Post**: Quick & Direct, Structured, Multi-Post Series
- **Podcast**: Solo Episode, Interview, Co-hosted Discussion
- **Email**: Quick Message, Formal Communication, Newsletter

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
│   ├── draft-v0.1.md
│   ├── draft-v0.2.md
│   └── ...
├── .history/             # Full history
│   ├── timeline.jsonl
│   └── prompts/
└── export/               # Final output
```

## Next Steps

- Read the [User Guide](user-guide.md) for detailed usage
- Learn about [Templates](templates.md)
- Understand the [Prompt Workflow](prompt-workflow.md)
- Set up the [MCP Server](mcp.md) for AI integration

## Example Workflow

```
1. Create workspace:
   riotdoc create kubernetes-guide --type blog-post

2. Select approach:
   "Structured approach for detailed coverage"

3. Answer questions (2-5 at a time):
   Title: "Kubernetes for Developers"
   Topic: "Container orchestration fundamentals"
   Angle: "Focus on practical developer workflows"

4. Generate outline:
   riotdoc outline --generate

5. Create draft:
   riotdoc draft --level expand
   Creates v0.1 draft

6. Revise:
   riotdoc revise
   "Expand the introduction and add more examples"
   Creates v0.2 with revisions

7. Export:
   riotdoc export
   Publish as v1.0
```

## MCP Server Integration

RiotDoc includes an MCP server for AI assistant integration (Claude Desktop, Cursor, etc.):

```bash
# Available as
riotdoc-mcp
```

Configure in Claude Desktop or Cursor:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

See the [MCP Server](mcp.md) guide for detailed setup instructions.
