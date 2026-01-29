# RiotDoc

Structured document creation with AI assistance.

## Overview

RiotDoc helps you create high-quality documents through a structured workflow:
- Define voice and style
- Create outlines
- Generate drafts with varying AI assistance levels
- Manage evidence and references
- Revise and refine
- Export final documents

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

RiotDoc includes an MCP server for AI assistant integration. See [guide/mcp.md](guide/mcp.md) for details.

```bash
# Available as
riotdoc-mcp
```

## Documentation

- [User Guide](guide/index.md) - Complete usage guide
- [MCP Server](guide/mcp.md) - Model Context Protocol integration

## License

Apache-2.0
