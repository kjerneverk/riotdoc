# Architecture

## Overview

RiotDoc is a template-driven document creation system with full history, versioning, and narrative capture. The system consists of three main components:

1. **Templates** - Scripts that define questions, approaches, and document structure
2. **Prompts** - Orchestrate the workflow by reading templates and using tools
3. **Tools** - Execute operations (narrative capture, versioning, checkpoints)

## Core Components

### Templates

Templates are markdown files that act as scripts for document creation. They define:

- **Questions to Answer** - Split by lifecycle phase (Idea/Draft vs Publishing)
- **Available Approaches** - Different strategies for creating the document
- **Output Document Structure** - The final document template

Templates are stored in the `templates/` directory and parsed dynamically at runtime.

**Key Innovation**: Change a template → entire workflow adapts automatically. No code changes needed.

### Prompts

Prompts orchestrate the document creation workflow:

- `explore_document.md` - Phase 1: Exploration and approach selection
- `draft_document.md` - Phase 2: Drafting with selected approach
- `revise_document.md` - Phase 3: Revision and refinement
- `finalize_document.md` - Phase 4: Publishing preparation

Prompts read templates dynamically using the template-reader module and guide users through conversational workflows (2-5 questions at a time).

### Tools

Tools execute specific operations:

#### History & Timeline
- `riotdoc_checkpoint_create` - Create state snapshots
- `riotdoc_checkpoint_list` - List checkpoints
- `riotdoc_checkpoint_show` - Show checkpoint details
- `riotdoc_checkpoint_restore` - Restore from checkpoint
- `riotdoc_history_show` - Show timeline history

#### Narrative
- `riotdoc_add_narrative` - Capture conversational input
  - Dual-save: timeline.jsonl + numbered markdown files
  - Full-fidelity conversation history

#### Version Control
- `riotdoc_increment_version` - Bump version number
- `riotdoc_get_version` - Get version information
- `riotdoc_list_versions` - List version history
  - v0.x = draft versions (user-controlled)
  - v1.0 = published (explicit decision)
  - v1.x = maintenance updates

#### Outline Manipulation
- `riotdoc_outline_insert_section` - Insert section
- `riotdoc_outline_rename_section` - Rename section
- `riotdoc_outline_delete_section` - Delete section
- `riotdoc_outline_move_section` - Move section

## File Structure

```
riotdoc/
├── src/
│   ├── mcp/
│   │   ├── server.ts              # MCP server
│   │   ├── tools/
│   │   │   ├── history.ts         # History & checkpoints
│   │   │   ├── narrative.ts       # Narrative capture
│   │   │   ├── version.ts         # Version management
│   │   │   └── outline.ts         # Outline manipulation
│   │   ├── resources/             # Read-only resources
│   │   └── prompts/               # Workflow prompts
│   │       ├── explore_document.md
│   │       ├── draft_document.md
│   │       ├── revise_document.md
│   │       └── finalize_document.md
│   └── prompts/
│       └── template-reader.ts     # Template parsing
├── templates/                     # Document templates
│   ├── blog-post-template.md
│   ├── podcast-script-template.md
│   ├── email-template.md
│   ├── project-plan-template.md
│   └── research-paper-template.md
└── docs/                          # Documentation
```

## Workflow

### Complete Document Creation Flow

```
1. explore_document
   ↓ Read template
   ↓ Present approaches
   ↓ Ask Idea/Draft questions (2-5 at a time)
   ↓ Capture narrative
   
2. draft_document
   ↓ Read Output Structure from template
   ↓ Create v0.1 draft
   ↓ Save to drafts/
   
3. revise_document (iterate)
   ↓ Increment version (v0.2, v0.3, v0.4...)
   ↓ Apply revisions
   ↓ Capture narrative
   
4. finalize_document
   ↓ Ask Publishing questions
   ↓ Publish as v1.0
   ↓ Save final document
```

### History Tracking

Every operation is logged to `.history/timeline.jsonl`:

```jsonl
{"timestamp":"2026-01-30T10:00:00Z","type":"document_created","data":{...}}
{"timestamp":"2026-01-30T10:05:00Z","type":"outline_created","data":{...}}
{"timestamp":"2026-01-30T10:15:00Z","type":"draft_created","version":"v0.1","data":{...}}
{"timestamp":"2026-01-30T10:30:00Z","type":"revision_added","version":"v0.2","data":{...}}
```

### Narrative Capture

User input is captured in two places:

1. **Timeline** (`.history/timeline.jsonl`) - Machine-readable event log
2. **Markdown files** (`.history/prompts/001-xxx.md`) - Human-readable, numbered files

This dual-save mechanism ensures:
- Full-fidelity conversation history
- Easy human reading and review
- AI can reuse context from previous sessions

### Checkpoints

Checkpoints capture complete state snapshots:

```
.history/checkpoints/before-major-revision/
├── checkpoint.json        # Metadata
├── config.json           # Configuration
├── outline.md            # Outline at this point
├── drafts/               # All drafts
└── current-draft.md      # Current draft
```

Users can restore to any checkpoint for experimentation and recovery.

### Version Management

Version numbering follows semantic conventions:

- **v0.1, v0.2, v0.3...** - Draft versions (user-controlled increments)
- **v1.0** - Published version (explicit user decision)
- **v1.1, v1.2...** - Post-publication updates

Each version increment:
- Creates snapshot in `drafts/draft-v0.X.md`
- Logs to timeline
- Preserves history for comparison

## Design Principles

### Template-Driven Behavior

Prompts read templates dynamically. No hardcoded questions. Change template → prompt adapts.

### Conversational Flow

Ask 2-5 questions at a time. Group related questions. Natural dialogue, not interrogation.

### Phase Separation

Idea/Draft questions (immediate concerns) vs Publishing questions (later concerns). Right questions at right time.

### Full-Fidelity Capture

All user input captured. Saved to timeline AND files. Human-readable and AI-reusable.

### User Control

User decides when to version. User decides when to publish. No automatic decisions.

### Safety Nets

Checkpoints before major changes. Version snapshots for comparison. Restoration capability.

## Key Innovations

### 1. Templates as Scripts

**Before**: Prompts had hardcoded questions  
**After**: Prompts read questions from templates dynamically

**Impact**: Change template → entire workflow adapts automatically

### 2. Lifecycle-Aware Templates

**Before**: All questions asked at once  
**After**: Questions separated by phase (Idea/Draft vs Publishing)

**Impact**: Don't ask about SEO before document exists

### 3. Approach-Driven Workflows

**Before**: One-size-fits-all workflow  
**After**: Multiple approaches per document type

**Examples**:
- Blog Post: Quick & Direct, Structured, Multi-Post Series
- Podcast: Quick Solo, Structured Interview, Narrative Series

### 4. Dual-Save Narrative Capture

**Before**: Only saved to timeline (hard to read)  
**After**: Saves to both timeline AND numbered markdown files

**Impact**: Full-fidelity conversation history, human-readable, AI-reusable

### 5. User-Controlled Versioning

**Before**: No version tracking  
**After**: v0.x (drafts) → v1.0 (published) → v1.x (updates)

**Impact**: Clear evolution tracking, easy comparison, restoration capability

## MCP Server

RiotDoc exposes its functionality through a Model Context Protocol server.

### Components

- **8 Tools** - Create, outline, draft, status, revise, export, cleanup, spellcheck
- **7 Resources** - Config, status, document, outline, objectives, voice, style-report
- **4 Prompts** - Create, outline, draft, review workflows

### Configuration

```json
{
  "mcpServers": {
    "riotdoc": {
      "command": "riotdoc-mcp"
    }
  }
}
```

### Patterns

The MCP implementation follows patterns from kodrdriv:

1. **Tool Structure** - Individual files in `tools/` directory
2. **Resource Structure** - URI-based access (`riotdoc://type[/path]`)
3. **Prompt Structure** - Markdown templates with variable substitution
4. **Server Implementation** - Uses `@modelcontextprotocol/sdk` high-level API

## Extension Points

### Adding New Document Types

1. Create template in `templates/[type]-template.md`
2. Follow canonical structure (Questions, Approaches, Output Structure)
3. No code changes needed - prompts adapt automatically

### Adding New Tools

1. Create tool file in `src/mcp/tools/`
2. Add to tool registry in `src/mcp/tools/index.ts`
3. Register in `src/mcp/server.ts`

### Adding New Resources

1. Create resource file in `src/mcp/resources/`
2. Add to resource registry
3. Update `getResources()` function

### Adding New Prompts

1. Create markdown file in `src/mcp/prompts/`
2. Add to `getPrompts()` in `src/mcp/prompts/index.ts`
3. Register in `src/mcp/server.ts`

## Testing

Comprehensive test coverage includes:

- Template parsing and validation
- Prompt workflow (explore → draft → revise → finalize)
- Tool functionality (history, narrative, version, outline)
- Integration tests (end-to-end workflows)
- Performance tests (large documents, many versions)
- Error handling (malformed templates, missing files)

See [Testing Guide](testing-guide.md) for details.

## Related Documentation

- [Template System](templates.md) - Template structure and creation
- [Prompt Workflow](prompt-workflow.md) - How prompts orchestrate workflows
- [Testing Guide](testing-guide.md) - Testing strategies
- [Version Numbering](version-numbering.md) - Version management details
- [Narrative Capture](narrative-capture.md) - Conversation history system
