# RiotDoc MCP Quick Start Guide

## Installation

### 1. Build the Package

```bash
cd /Users/tobrien/gitw/kjerneverk/riotdoc
npm install
npm run build
```

This will:
- Install dependencies including `@modelcontextprotocol/sdk`
- Build the TypeScript source
- Create the executable MCP server at `dist/mcp-server.js`
- Copy prompt templates to `dist/mcp/prompts/`

### 2. Test Locally

```bash
# Test that the MCP server starts
./dist/mcp-server.js
```

The server should start without errors. Press Ctrl+C to stop.

### 3. Install Globally (Optional)

```bash
npm link
```

This makes `riotdoc-mcp` available globally.

## Configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

Or use the local path during development:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "/Users/tobrien/gitw/kjerneverk/riotdoc/dist/mcp-server.js"
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

Or use the local path:

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "/Users/tobrien/gitw/kjerneverk/riotdoc/dist/mcp-server.js"
    }
  }
}
```

## Testing

### 1. Test Tool Execution

In Claude or Cursor, try:

```
Create a new blog post workspace called "test-post" about AI in education
```

This should invoke `riotdoc_create` with appropriate parameters.

### 2. Test Resource Access

```
Show me the status of the document at /path/to/test-post
```

This should fetch the `riotdoc://status` resource.

### 3. Test Prompts

```
Use the create_document prompt to guide me through creating a new document
```

This should load and display the create_document workflow prompt.

## Example Workflow

Here's a complete example of creating a document through the MCP server:

```
1. Create a new blog post workspace:
   "Create a blog post workspace called 'kubernetes-guide' about Kubernetes basics for developers"

2. Check the document status:
   "What's the status of kubernetes-guide?"

3. Generate an outline:
   "Generate an outline for kubernetes-guide"

4. Create a draft:
   "Create a first draft for kubernetes-guide with full AI generation"

5. Review and revise:
   "Add revision feedback to draft 1: expand the introduction and add more examples"

6. Export:
   "Export kubernetes-guide to HTML format"
```

## Available Commands

### Tools
- `riotdoc_create` - Create workspace
- `riotdoc_outline` - Generate/view outline
- `riotdoc_draft` - Create drafts
- `riotdoc_status` - Check status
- `riotdoc_revise` - Add feedback
- `riotdoc_export` - Export document
- `riotdoc_cleanup` - Clean workspace
- `riotdoc_spellcheck` - Check spelling

### Resources
- `riotdoc://config` - Configuration
- `riotdoc://status` - Status
- `riotdoc://document` - Complete state
- `riotdoc://outline` - Outline
- `riotdoc://objectives` - Objectives
- `riotdoc://voice` - Voice config
- `riotdoc://style-report` - Style validation

### Prompts
- `create_document` - Creation workflow
- `outline_document` - Outline workflow
- `draft_document` - Drafting workflow
- `review_document` - Review workflow

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

## Development

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

## Next Steps

1. **Test thoroughly** - Try all tools, resources, and prompts
2. **Report issues** - Document any bugs or unexpected behavior
3. **Enhance** - Add missing functionality (draft, export, etc.)
4. **Document** - Add examples and tutorials

## Support

For issues or questions:
- Check `MCP.md` for detailed documentation
- Review `MCP-IMPLEMENTATION.md` for architecture details
- Open an issue on GitHub
