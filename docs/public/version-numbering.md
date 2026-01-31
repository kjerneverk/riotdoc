# Version Numbering

## Overview

RiotDoc uses a simple, user-controlled version numbering system to track document evolution from draft to published state.

**Key Principle**: All version increments are **manual and intentional** - no automatic bumps.

## Version Format

Versions follow the format: `vMAJOR.MINOR`

Examples: `v0.1`, `v0.2`, `v1.0`, `v1.1`, `v2.0`

## Version Stages

### Draft Versions (v0.x)

**Purpose**: Work-in-progress, not yet ready for publication

**Characteristics**:
- Starts at `v0.1` for new documents
- User increments manually as they make progress
- Indicates document is still in draft state
- Not considered "published"

**When to increment**:
- After significant revisions
- When reaching a milestone (outline complete, first draft done, etc.)
- Before sharing for feedback
- Whenever you want to save a snapshot

**Examples**:
- `v0.1` - Initial draft
- `v0.2` - After first revision
- `v0.3` - After incorporating feedback
- `v0.9` - Nearly ready for publication

### Published Versions (v1.x)

**Purpose**: Finalized, ready for publication

**Characteristics**:
- `v1.0` marks the first published version
- Explicit user decision to "publish"
- Indicates document is complete and ready
- Can still be updated with minor versions

**When to use v1.0**:
- Document is complete and polished
- Ready to publish/export/share publicly
- No more major changes expected
- Intentional decision to mark as "done"

**Subsequent versions**:
- `v1.1` - Minor updates or corrections
- `v1.2` - Additional minor changes
- `v2.0` - Major rewrite or significant changes

## Usage

### Increment Minor Version (v0.x)

Use for draft iterations:

```typescript
riotdoc_increment_version({
    type: "minor",
    notes: "Completed first draft"
})
```

**Result**: `v0.1` → `v0.2`

### Publish Document (v0.x → v1.0)

Use when ready to publish:

```typescript
riotdoc_increment_version({
    type: "major",
    notes: "Ready for publication"
})
```

**Result**: `v0.9` → `v1.0` 🎉

### Update Published Document

Use for post-publication updates:

```typescript
riotdoc_increment_version({
    type: "minor",
    notes: "Fixed typos and updated examples"
})
```

**Result**: `v1.0` → `v1.1`

### Major Revision

Use for significant rewrites:

```typescript
riotdoc_increment_version({
    type: "major",
    notes: "Complete rewrite with new structure"
})
```

**Result**: `v1.5` → `v2.0`

## Version History

Every version increment is recorded in the document's version history:

```typescript
riotdoc_get_version()
```

**Output**:
```
# Version Information

**Current Version**: v0.3 📝 Draft
**Published**: No
**Last Updated**: 1/30/2026, 3:45 PM

## Version History

| Version | Date | Notes |
|---------|------|-------|
| v0.1 | 1/28/2026 | Initial draft |
| v0.2 | 1/29/2026 | Completed outline and first section |
| v0.3 | 1/30/2026 | Incorporated user feedback |
```

## Draft Snapshots

By default, each version increment saves the current draft as a versioned file:

```
document-workspace/
  drafts/
    draft-v0.1.md
    draft-v0.2.md
    draft-v0.3.md
  current-draft.md  (working copy)
```

**Benefits**:
- Easy to compare versions
- Can revert to previous version
- Preserves evolution of document
- Checkpoints for recovery

**Disable snapshots** (if needed):
```typescript
riotdoc_increment_version({
    type: "minor",
    saveDraft: false
})
```

## Workflow Examples

### Blog Post Workflow

```typescript
// 1. Start new blog post (automatically v0.1)
riotdoc_create({ title: "My Blog Post", type: "blog-post" })

// 2. After completing outline
riotdoc_increment_version({
    type: "minor",
    notes: "Outline complete"
})
// Now v0.2

// 3. After first draft
riotdoc_increment_version({
    type: "minor",
    notes: "First draft complete"
})
// Now v0.3

// 4. After revisions
riotdoc_increment_version({
    type: "minor",
    notes: "Incorporated feedback, ready to publish"
})
// Now v0.4

// 5. Publish!
riotdoc_increment_version({
    type: "major",
    notes: "Published to blog"
})
// Now v1.0 🎉
```

### Research Paper Workflow

```typescript
// 1. Start paper (v0.1)
riotdoc_create({ title: "Research Paper", type: "research-paper" })

// 2. Literature review complete (v0.2)
riotdoc_increment_version({
    type: "minor",
    notes: "Literature review and methodology complete"
})

// 3. Results written (v0.3)
riotdoc_increment_version({
    type: "minor",
    notes: "Results section complete"
})

// 4. Discussion complete (v0.4)
riotdoc_increment_version({
    type: "minor",
    notes: "Discussion and conclusion complete"
})

// 5. After peer review (v0.5)
riotdoc_increment_version({
    type: "minor",
    notes: "Addressed reviewer comments"
})

// 6. Submit for publication (v1.0)
riotdoc_increment_version({
    type: "major",
    notes: "Submitted to journal"
})
```

## Version Status Indicators

Documents show their status based on version:

- 📝 **Draft** (v0.x) - Work in progress
- 📗 **Published** (v1.0+) - Finalized and published

## Timeline Integration

Version increments are logged to the timeline:

```json
{
    "timestamp": "2026-01-30T15:45:00.000Z",
    "type": "version_incremented",
    "data": {
        "oldVersion": "0.2",
        "newVersion": "0.3",
        "incrementType": "minor",
        "published": false,
        "draftPath": "drafts/draft-v0.2.md",
        "notes": "Completed first draft"
    }
}
```

Special event for publishing:

```json
{
    "timestamp": "2026-01-30T16:00:00.000Z",
    "type": "version_published",
    "data": {
        "oldVersion": "0.9",
        "newVersion": "1.0",
        "incrementType": "major",
        "published": true,
        "notes": "Ready for publication"
    }
}
```

## Best Practices

### 1. Increment Intentionally

Don't increment for every small change. Increment when:
- Reaching a milestone
- Before sharing for feedback
- After significant revisions
- When you want a checkpoint

### 2. Use Notes

Always add notes to explain what changed:

✅ **Good**: `notes: "Completed introduction and methodology sections"`  
❌ **Bad**: `notes: "Update"`

### 3. Don't Rush to v1.0

Stay in v0.x as long as you're iterating:
- v0.x gives you freedom to make changes
- v1.0 should feel like a commitment
- It's okay to have many v0.x versions

### 4. v1.0 is a Decision

Publishing (v0.x → v1.0) should be intentional:
- Document is complete
- You're ready to share publicly
- Major changes are unlikely
- It's a milestone worth celebrating

### 5. Keep Version History Clean

Use meaningful version numbers:
- Don't skip numbers (v0.1 → v0.5)
- Increment sequentially (v0.1 → v0.2 → v0.3)
- Each version should represent real progress

## Comparison with Other Systems

### vs Semantic Versioning (SemVer)

**SemVer** (used in software): `MAJOR.MINOR.PATCH`
- Complex three-part versioning
- Strict rules about breaking changes
- Designed for APIs and libraries

**RiotDoc** (documents): `MAJOR.MINOR`
- Simple two-part versioning
- User-controlled, no strict rules
- Designed for document evolution

### vs Google Docs Versioning

**Google Docs**: Automatic version history
- Every change saved automatically
- No explicit version numbers
- Hard to identify significant milestones

**RiotDoc**: Manual version control
- User decides when to version
- Explicit version numbers
- Clear milestones and checkpoints

## Technical Details

### Config Structure

```json
{
    "version": "0.3",
    "published": false,
    "versionHistory": [
        {
            "version": "0.1",
            "timestamp": "2026-01-28T10:00:00.000Z",
            "draftPath": "drafts/draft-v0.1.md",
            "notes": "Initial draft"
        },
        {
            "version": "0.2",
            "timestamp": "2026-01-29T14:30:00.000Z",
            "draftPath": "drafts/draft-v0.2.md",
            "notes": "Completed outline"
        },
        {
            "version": "0.3",
            "timestamp": "2026-01-30T15:45:00.000Z",
            "draftPath": "drafts/draft-v0.3.md",
            "notes": "First draft complete"
        }
    ]
}
```

### Version Parsing

Versions are parsed as `MAJOR.MINOR`:
- `v0.1` → major: 0, minor: 1
- `v1.0` → major: 1, minor: 0
- `v2.5` → major: 2, minor: 5

### Increment Logic

**Minor increment**: `minor + 1`
- `v0.1` → `v0.2`
- `v1.0` → `v1.1`

**Major increment**: `major + 1, minor = 0`
- `v0.9` → `v1.0`
- `v1.5` → `v2.0`

## Troubleshooting

### Version Not Incrementing

**Check**:
1. Is config.json present?
2. Is current version valid format?
3. Are you using correct increment type?

**Solution**: Verify config.json has valid version field.

### Draft Not Saved

**Check**:
1. Does current-draft.md exist?
2. Is drafts/ directory writable?
3. Did you set `saveDraft: false`?

**Solution**: Ensure current-draft.md exists before incrementing.

### Version History Missing

**Check**:
1. Is versionHistory array in config?
2. Has version been incremented at least once?

**Solution**: Version history is created on first increment.

## Related Documentation

- `history.ts` - Timeline and event logging
- `checkpoint.ts` - Checkpoint system
- `types.ts` - Version type definitions

## Version

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: Initial implementation
