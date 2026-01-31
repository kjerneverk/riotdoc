# RiotDoc MCP Server

RiotDoc includes a Model Context Protocol (MCP) server that exposes document creation and management capabilities to AI assistants.

## Quick Start

### Installation

```bash
npm install -g @kjerneverk/riotdoc
```

### Build from Source

```bash
cd /path/to/riotdoc
npm install
npm run build
```

This will:
- Install dependencies including `@modelcontextprotocol/sdk`
- Build the TypeScript source
- Create the executable MCP server at `dist/mcp-server.js`
- Copy prompt templates to `dist/mcp/prompts/`

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

Or use local path during development:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "/Users/tobrien/gitw/kjerneverk/riotdoc/dist/mcp-server.js"
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

Or use local path:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "/Users/tobrien/gitw/kjerneverk/riotdoc/dist/mcp-server.js"
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

## Testing

### Test Server Starts

```bash
# Build
npm run build

# Test that the MCP server starts
./dist/mcp-server.js
```

The server should start without errors. Press Ctrl+C to stop.

### Test Tool Execution

In Claude or Cursor, try:

```
Create a new blog post workspace called "test-post" about AI in education
```

This should invoke `riotdoc_create` with appropriate parameters.

### Test Resource Access

```
Show me the status of the document at /path/to/test-post
```

This should fetch the `riotdoc://status` resource.

### Test Prompts

```
Use the create_document prompt to guide me through creating a new document
```

This should load and display the create_document workflow prompt.

## Development

### Building

```bash
npm run build
```

This builds the MCP server and copies prompt templates to `dist/mcp/prompts/`.

### Making Changes

1. Edit source files in `src/mcp/`
2. Rebuild: `npm run build`
3. Restart Claude/Cursor to pick up changes

### Adding New Tools

1. Create tool file in `src/mcp/tools/`
2. Add to `src/mcp/tools/index.ts`
3. Register in `src/mcp/server.ts`
4. Rebuild and test

### Adding New Resources

1. Create resource file in `src/mcp/resources/`
2. Add to `src/mcp/resources/index.ts`
3. Update `getResources()` function
4. Rebuild and test

### Adding New Prompts

1. Create markdown file in `src/mcp/prompts/`
2. Add to `getPrompts()` in `src/mcp/prompts/index.ts`
3. Register in `src/mcp/server.ts`
4. Rebuild (prompts are copied automatically)

## Architecture

The MCP server follows these patterns:

### Tool Structure
- Individual tool files in `tools/` directory
- Shared utilities in `tools/shared.ts`
- Tool registry in `tools/index.ts`
- Consistent error handling and result formatting

### Resource Structure
- URI-based resource access (`riotdoc://type[/path]`)
- Individual resource handlers in `resources/` directory
- Resource registry in `resources/index.ts`
- Consistent return types

### Prompt Structure
- Markdown templates in `prompts/` directory
- Template variable substitution
- Prompt registry in `prompts/index.ts`
- Copied to dist during build

### Server Implementation
- Uses `@modelcontextprotocol/sdk` high-level API
- Progress notification support
- Proper error handling with context
- Clean JSON serialization (removes undefined values)

## Troubleshooting

### Server Won't Start

```bash
# Check Node version (must be >= 24.0.0)
node --version

# Rebuild
npm run clean
npm run build

# Check for errors
./dist/mcp-server.js
```

### Tools Not Found

Make sure:
1. The server is properly configured in Claude/Cursor
2. You've restarted Claude/Cursor after configuration
3. The path to the MCP server is correct

### Resources Not Loading

Verify:
1. The workspace path exists
2. The workspace was created with `riotdoc_create`
3. The URI format is correct: `riotdoc://type[/path]`
