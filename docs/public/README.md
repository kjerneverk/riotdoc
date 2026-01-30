# RiotDoc

Template-driven document creation with AI assistance, full history tracking, and version control.

## Overview

RiotDoc is a structured document creation system that guides you through creating high-quality documents using:

- **Template-driven workflows** - Templates define questions, approaches, and document structure
- **Conversational guidance** - Ask 2-5 questions at a time, not overwhelming forms
- **Multiple approaches** - Choose the workflow that fits your situation
- **Full history tracking** - Every decision and conversation captured
- **Version control** - Track evolution from draft (v0.x) to published (v1.0)
- **Checkpoints** - Create snapshots for experimentation and recovery
- **AI assistance** - Varying levels from full generation to light editing

## Installation

```bash
npm install -g @riotprompt/riotdoc
```

## Quick Start

```bash
# Create a new document
riotdoc create my-blog-post --type blog-post

# Generate an outline
riotdoc outline

# Create a draft
riotdoc draft --level expand

# Revise the draft
riotdoc revise

# Export final document
riotdoc export
```

## MCP Server

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

## Key Features

### Template-Driven

Templates act as scripts that tell prompts what to ask. Change a template → entire workflow adapts automatically.

### Lifecycle-Aware

Questions are split by phase:
- **Idea/Draft Phase** - Things you know NOW (title, topic, angle)
- **Publishing Phase** - Things you figure out LATER (SEO, categories, images)

### Approach-Driven

Multiple strategies for each document type:
- **Blog Post**: Quick & Direct, Structured, Multi-Post Series
- **Podcast**: Solo Episode, Interview, Co-hosted Discussion
- **Email**: Quick Message, Formal Communication, Newsletter

### Full History

Everything is captured:
- Timeline of all events (`.history/timeline.jsonl`)
- Conversation history (`.history/prompts/001-xxx.md`)
- Version snapshots (`drafts/draft-v0.1.md`)
- Checkpoints for restoration

## Documentation

### Getting Started
- [User Guide](guide/index.md) - Complete usage guide
- [MCP Server](guide/mcp.md) - Model Context Protocol integration

### For Users
- [Template System](docs/templates.md) - How templates work
- [Prompt Workflow](docs/prompt-workflow.md) - Document creation workflow
- [Version Numbering](docs/version-numbering.md) - Version management
- [Narrative Capture](docs/narrative-capture.md) - Conversation history

### For Developers
- [Architecture](docs/architecture.md) - System design and components
- [Testing Guide](docs/testing-guide.md) - Testing strategies

## Example Workflow

```
1. Create workspace:
   "Create a blog post about Kubernetes basics"

2. Select approach:
   "I'll use the Structured approach for detailed coverage"

3. Answer questions (2-5 at a time):
   "Title: 'Kubernetes for Developers'"
   "Topic: Container orchestration fundamentals"
   "Angle: Focus on practical developer workflows"

4. Draft document:
   Creates v0.1 draft using template structure

5. Revise:
   "Expand the introduction and add more examples"
   Creates v0.2 with revisions

6. Publish:
   Answer publishing questions (SEO, categories)
   Publish as v1.0
```

## Templates

RiotDoc includes templates for:
- Blog posts
- Podcast scripts
- Email messages
- Project plans
- Research papers

Add your own by creating a template file following the [canonical structure](docs/templates.md).

## License

Apache-2.0
