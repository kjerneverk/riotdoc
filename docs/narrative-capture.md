# Narrative Capture

## Purpose

Captures raw conversational content to preserve full context and deliberation during document creation. This is essential for maintaining the "why" behind decisions, not just the "what."

## Why Two Locations?

Narratives are saved to **TWO** locations for different purposes:

### 1. `timeline.jsonl` - Complete Event History

All events (including narratives) are logged chronologically to `.history/timeline.jsonl`. This provides:
- Complete audit trail of document evolution
- Chronological ordering of all events
- Machine-readable event stream
- Integration with checkpoints and history tools

### 2. `.history/prompts/NNN-xxx.md` - Reusable Prompts

Narratives are ALSO saved as individual markdown files in `.history/prompts/`. This provides:
- **Easy access** to conversations without parsing timeline
- **Reusable prompts** for regenerating or updating documents
- **Human-readable** format that's easy to browse
- **Numbered files** for clear sequencing (001, 002, 003...)

## The Problem This Solves

**Original bug** (fixed in this implementation):
- Narratives were ONLY saved to timeline.jsonl
- Hard to find and read conversations
- Not reusable as prompts
- User frustration: "I don't see it in the timeline and that's not really where I wanted it to be anyway"

**User insight**: "the prompt is the prompt" - captured conversations should be directly reusable as prompts for AI tools.

## Usage

### Basic Usage

```typescript
riotdoc_add_narrative({
    content: "I want this blog post to focus on practical examples rather than theory. The target audience is junior developers who are just learning React, so keep the language simple and avoid jargon.",
    context: "User explaining blog post requirements",
    speaker: "user"
})
```

**Result**:
- Saved to timeline: `.history/timeline.jsonl` (as event)
- Saved to file: `.history/prompts/001-user-explaining-blog-post-requirements.md`

### With Source Tracking

```typescript
riotdoc_add_narrative({
    content: "[Full voice transcript here...]",
    source: "voice",
    context: "Voice notes about podcast script structure",
    speaker: "user"
})
```

**Result**: `.history/prompts/002-voice-notes-about-podcast-script-structure.md`

### Assistant Responses

```typescript
riotdoc_add_narrative({
    content: "Based on your requirements, I suggest structuring the blog post with three main sections: Introduction with a real-world problem, Step-by-step tutorial with code examples, and Common pitfalls to avoid.",
    context: "Assistant proposing blog post structure",
    speaker: "assistant"
})
```

**Result**: `.history/prompts/003-assistant-proposing-blog-post-structure.md`

## File Naming

### Auto-Numbering

Files are automatically numbered sequentially:
- First narrative: `001-xxx.md`
- Second narrative: `002-xxx.md`
- Third narrative: `003-xxx.md`
- And so on...

Numbers are always 3 digits with zero-padding for proper sorting.

### Filename Generation

Filenames are generated from the `context` parameter:

| Context | Filename |
|---------|----------|
| "User feedback" | `001-user-feedback.md` |
| "Voice notes about templates" | `002-voice-notes-about-templates.md` |
| "User's thoughts on approach & strategy" | `003-users-thoughts-on-approach-strategy.md` |

**Rules**:
- Lowercase
- Non-alphanumeric characters replaced with hyphens
- Leading/trailing hyphens removed
- Maximum 50 characters
- If no context provided, uses "narrative"

## File Format

Each narrative file contains:

```markdown
# Narrative: [Context]

**Date**: [ISO 8601 timestamp]
**Source**: [typing/voice/paste/import]
**Speaker**: [user/assistant/system]

---

[Full narrative content here, preserved verbatim]
```

**Example**:

```markdown
# Narrative: User explaining blog post requirements

**Date**: 2026-01-30T15:30:00.000Z
**Source**: typing
**Speaker**: user

---

I want this blog post to focus on practical examples rather than theory. The target audience is junior developers who are just learning React, so keep the language simple and avoid jargon. 

The post should be around 1500 words and include at least 3 code examples. I'd like to start with a simple component, then show how to add state, and finally demonstrate how to handle user input.

Tone should be friendly and encouraging - remember these are beginners who might be intimidated by React.
```

## Reading Narratives

### Browse Prompt Files

Simply open `.history/prompts/` and read the numbered markdown files:

```bash
ls -la .history/prompts/
# 001-user-explaining-blog-post-requirements.md
# 002-voice-notes-about-podcast-script-structure.md
# 003-assistant-proposing-blog-post-structure.md
```

### Use as Prompts

Copy content from narrative files to use as prompts:

```bash
cat .history/prompts/001-user-explaining-blog-post-requirements.md
# Copy the content and use it as context for AI tools
```

### Query Timeline

Use history tools to query narratives in timeline:

```typescript
riotdoc_history_show({
    eventType: "narrative_chunk",
    limit: 10
})
```

## Use Cases

### 1. Voice Transcripts

Capture voice notes during document planning:

```typescript
riotdoc_add_narrative({
    content: "[Full voice transcript from recording...]",
    source: "voice",
    context: "Voice brainstorming session",
    speaker: "user"
})
```

### 2. User Feedback

Capture detailed feedback on drafts:

```typescript
riotdoc_add_narrative({
    content: "The introduction is too technical. Can we simplify it and add a concrete example upfront? Also, section 3 feels rushed - needs more explanation.",
    context: "User feedback on draft v2",
    speaker: "user"
})
```

### 3. Design Decisions

Document why certain decisions were made:

```typescript
riotdoc_add_narrative({
    content: "Decided to use 'Quick & Direct' approach instead of 'Structured' because the topic is simple and doesn't need extensive outlining. Target length is 800 words.",
    context: "Approach selection rationale",
    speaker: "assistant"
})
```

### 4. Conversation History

Preserve full conversations for context:

```typescript
riotdoc_add_narrative({
    content: `User: What tone should this have?
Assistant: Based on your target audience (junior developers), I recommend a friendly, encouraging tone. Avoid jargon and explain concepts simply.
User: Perfect, that's exactly what I want.`,
    context: "Tone discussion",
    speaker: "system"
})
```

## Best Practices

### 1. Provide Context

Always provide meaningful context - it becomes the filename:

✅ **Good**: `context: "User explaining target audience"`  
❌ **Bad**: `context: "feedback"`

### 2. Capture Liberally

Don't overthink it - capture any significant conversation or decision:
- User requirements
- Design decisions
- Feedback on drafts
- Voice notes
- Questions and answers
- Rationale for choices

### 3. Use Speaker Field

Distinguish between user, assistant, and system:
- `speaker: "user"` - User input
- `speaker: "assistant"` - AI responses
- `speaker: "system"` - Combined conversations or system notes

### 4. Preserve Verbatim

Don't summarize or edit - capture the full, raw content:
- Preserves nuance and tone
- Maintains complete context
- Allows later analysis
- Reusable as-is for prompts

## Integration with Checkpoints

Narratives are included in checkpoint context:

```typescript
riotdoc_checkpoint_create({
    name: "after-requirements-discussion",
    message: "Captured user requirements and approach decision"
})
```

The checkpoint will reference recent narratives in its prompt context file.

## Technical Details

### Schema

```typescript
{
    path: string (optional) - Document directory path
    content: string (required) - Raw narrative content
    source: "typing" | "voice" | "paste" | "import" (optional)
    context: string (optional) - Context description
    speaker: "user" | "assistant" | "system" (optional)
}
```

### Timeline Event

```json
{
    "timestamp": "2026-01-30T15:30:00.000Z",
    "type": "narrative_chunk",
    "data": {
        "content": "[Full content]",
        "source": "typing",
        "context": "User explaining requirements",
        "speaker": "user"
    }
}
```

### File Location

```
document-workspace/
  .history/
    prompts/
      001-user-explaining-requirements.md
      002-voice-notes-about-structure.md
      003-assistant-proposing-approach.md
    timeline.jsonl
```

## Troubleshooting

### Narratives Not Appearing in Prompts Directory

**Check**:
1. Is `.history/prompts/` directory created?
2. Are files being created with correct numbering?
3. Check file permissions

**Solution**: The tool creates directories automatically, but verify write permissions.

### Filename Too Long

**Problem**: Context generates very long filename

**Solution**: Filenames are automatically truncated to 50 characters. Use shorter, more concise context descriptions.

### Special Characters in Filename

**Problem**: Context has special characters

**Solution**: Special characters are automatically converted to hyphens. Example: "User's feedback & ideas" → "users-feedback-ideas"

## Related Documentation

- `history.ts` - Timeline and checkpoint infrastructure
- `timeline-utils.ts` - Timeline query utilities
- `TEMPLATE-STRUCTURE.md` - Document template structure

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Critical bug fix implemented
