# RiotDoc MCP Server

RiotDoc includes a Model Context Protocol (MCP) server that exposes document creation and management capabilities to AI assistants.

## Quick Start

### Installation

```bash
npm install -g @riotprompt/riotdoc
```

### Configuration

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

**Cursor** (MCP settings):

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

## Tools

### `riotdoc_create`
Create a new document workspace.

**Parameters:**
- `name` (required): Workspace name
- `type` (required): Document type (blog-post, podcast-script, technical-doc, newsletter, custom)
- `title` (optional): Document title
- `primary_goal` (optional): Primary goal
- `audience` (optional): Target audience

**Example:**
```typescript
riotdoc_create({
  name: "kubernetes-guide",
  type: "blog-post",
  title: "Kubernetes Basics for Developers",
  primary_goal: "Help developers understand Kubernetes fundamentals",
  audience: "Software developers new to Kubernetes"
})
```

### `riotdoc_outline`
Generate or retrieve document outline.

**Parameters:**
- `path` (optional): Workspace path
- `generate` (optional): Generate new outline with AI

### `riotdoc_draft`
Create a new draft.

**Parameters:**
- `path` (optional): Workspace path
- `assistance_level` (optional): generate, expand, revise, cleanup, spellcheck
- `draft_number` (optional): Specific draft to retrieve

### `riotdoc_status`
Get document status and metadata.

**Parameters:**
- `path` (optional): Workspace path

### `riotdoc_revise`
Add revision feedback to a draft.

**Parameters:**
- `path` (optional): Workspace path
- `draft` (optional): Target draft number
- `feedback` (required): Revision feedback

### `riotdoc_export`
Export document to various formats.

**Parameters:**
- `path` (optional): Workspace path
- `format` (required): html, pdf, docx, markdown
- `draft` (optional): Draft number to export

### `riotdoc_cleanup`
Clean up workspace by removing temporary files.

**Parameters:**
- `path` (optional): Workspace path
- `keep_drafts` (optional): Number of recent drafts to keep
- `dry_run` (optional): Preview without deleting

### `riotdoc_spellcheck`
Run spell checking on document content.

**Parameters:**
- `path` (optional): Workspace path
- `file` (optional): Specific file to check

## Resources

Resources provide read-only access to document state.

### `riotdoc://config[/path]`
Configuration from riotdoc.yaml.

### `riotdoc://status[/path]`
Document status including title, type, dates, and progress.

### `riotdoc://document[/path]`
Complete document state including config, voice, objectives, drafts, and evidence.

### `riotdoc://outline[/path]`
Document outline from OUTLINE.md.

### `riotdoc://objectives[/path]`
Document objectives from OBJECTIVES.md.

### `riotdoc://voice[/path]`
Voice and tone configuration from voice/tone.md.

### `riotdoc://style-report[/path]`
Style validation results.

## Prompts

Workflow templates for common operations.

### `create_document`
Guided workflow for creating a new document workspace.

**Arguments:**
- `name` (required): Workspace name
- `type` (required): Document type
- `title`, `goal`, `audience`, `base_path` (optional)

### `outline_document`
Guided workflow for generating or refining document outline.

**Arguments:**
- `path` (optional): Workspace path

### `draft_document`
Guided workflow for creating document drafts with AI assistance.

**Arguments:**
- `path` (optional): Workspace path
- `level` (optional): Assistance level

### `review_document`
Guided workflow for reviewing and providing feedback on drafts.

**Arguments:**
- `path` (optional): Workspace path
- `draft_number` (optional): Draft to review

## Example Workflow

```
1. Create workspace:
   "Create a blog post workspace called 'kubernetes-guide' about Kubernetes basics"

2. Check status:
   "What's the status of kubernetes-guide?"

3. Generate outline:
   "Generate an outline for kubernetes-guide"

4. Create draft:
   "Create a first draft for kubernetes-guide with full AI generation"

5. Review and revise:
   "Add revision feedback to draft 1: expand the introduction"

6. Export:
   "Export kubernetes-guide to HTML format"
```

## Development

### Building

```bash
npm run build
```

This builds the MCP server and copies prompt templates to `dist/mcp/prompts/`.

### Local Testing

```bash
# Build
npm run build

# Test server starts
./dist/mcp-server.js

# Configure with local path during development
{
  "mcpServers": {
    "riotdoc": {
      "command": "/path/to/riotdoc/dist/mcp-server.js"
    }
  }
}
```

## Architecture

The MCP server follows these patterns:

- **Tools**: Individual files in `src/mcp/tools/` for each command
- **Resources**: URI-based access in `src/mcp/resources/`
- **Prompts**: Markdown templates in `src/mcp/prompts/`
- **Server**: Main logic in `src/mcp/server.ts`

Built with `@modelcontextprotocol/sdk` using the high-level API for progress notifications and proper error handling.
