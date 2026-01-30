# Template Example: Meeting Notes

This is an example template showing the canonical structure in practice. Use this as a reference when creating new document templates.

---

## Questions to Answer

### Idea/Draft Phase

#### Meeting Basics
- **Meeting title**: What's the meeting about?
- **Date and time**: When is/was the meeting?
- **Attendees**: Who's attending? (names or roles)
- **Duration**: How long is the meeting? (30 min, 1 hour, etc.)

#### Purpose & Focus
- **Meeting type**: Standup, planning, retrospective, brainstorming, decision-making, status update?
- **Primary goal**: What's the main objective of this meeting?
- **Key topics**: What are the 3-5 main topics to discuss?
- **Decisions needed**: What decisions need to be made?

#### Context
- **Project/initiative**: What project or initiative is this related to?
- **Background**: Any context or background needed?
- **Pre-reading**: Any documents or materials to review beforehand?

### Publishing Phase

#### Distribution
- **Who needs these notes**: Who should receive the notes?
- **Where to share**: Email, Slack, wiki, project management tool?
- **Format**: Full notes, summary only, or both?

#### Follow-Up
- **Action items**: What tasks came out of the meeting?
- **Owners**: Who's responsible for each action item?
- **Deadlines**: When are action items due?
- **Next meeting**: When's the next meeting on this topic?

#### Attachments
- **Documents**: Any documents to attach or link?
- **Recordings**: Is there a recording to include?
- **Related notes**: Links to previous meeting notes?

---

## Available Approaches

### Approach 1: Quick Standup Notes
**When to use**: Short daily/weekly standup or status update meeting (15-30 minutes).

**Strategy**: Capture key updates, blockers, and next steps in a simple format.

**Output**: Brief notes document with updates and action items.

**Workflow**:
1. Answer 3-4 core questions (meeting title, date, attendees, type)
2. Take notes during meeting (updates, blockers, action items)
3. Quick review and formatting
4. Share immediately after meeting

**Note-taking focus**: Bullet points, quick updates, action items only.

---

### Approach 2: Structured Meeting Notes
**When to use**: Longer planning, decision-making, or brainstorming meeting (1-2 hours).

**Strategy**: Detailed notes with sections for each topic, decisions, and action items.

**Output**: Comprehensive notes document with full context and decisions.

**Workflow**:
1. Answer all Idea/Draft phase questions
2. Create agenda/outline before meeting
3. Take detailed notes during meeting
4. Organize notes by topic after meeting
5. Add action items and owners
6. Answer Publishing phase questions
7. Distribute to stakeholders

**Note-taking focus**: Full context, discussion points, decisions made, rationale.

---

### Approach 3: Meeting Summary + Full Notes
**When to use**: Important meeting with diverse audience (some need details, others just need summary).

**Strategy**: Create executive summary + detailed notes for different audiences.

**Output**: Two-part document: brief summary at top, full notes below.

**Workflow**:
1. Answer all Idea/Draft phase questions
2. Take comprehensive notes during meeting
3. Write executive summary (3-5 bullet points)
4. Organize full notes by topic
5. Add action items with owners and deadlines
6. Answer Publishing phase questions
7. Distribute with note about summary vs details

**Note-taking focus**: Both high-level takeaways and detailed discussion capture.

---

## Output Document Structure

```markdown
# Meeting Notes: [Meeting Title]

**Date**: [Date and time]
**Attendees**: [List of attendees]
**Duration**: [Duration]
**Type**: [Meeting type]
**Project**: [Related project/initiative]

---

## Executive Summary
[3-5 bullet points summarizing key outcomes]
- [Key outcome 1]
- [Key outcome 2]
- [Key decision made]

---

## Meeting Objective
[Primary goal of the meeting]

---

## Agenda / Topics Discussed

### [Topic 1]
**Discussion**:
[Notes on what was discussed]

**Key Points**:
- [Point 1]
- [Point 2]

**Decision**: [Any decision made]

---

### [Topic 2]
**Discussion**:
[Notes on what was discussed]

**Key Points**:
- [Point 1]
- [Point 2]

**Decision**: [Any decision made]

---

### [Topic 3]
**Discussion**:
[Notes on what was discussed]

---

## Decisions Made
1. **[Decision 1]**: [Brief description and rationale]
2. **[Decision 2]**: [Brief description and rationale]

---

## Action Items

| Action Item | Owner | Deadline | Status |
|-------------|-------|----------|--------|
| [Task 1] | [Name] | [Date] | Not Started |
| [Task 2] | [Name] | [Date] | Not Started |
| [Task 3] | [Name] | [Date] | Not Started |

---

## Parking Lot
[Topics raised but not discussed - to be addressed later]
- [Topic 1]
- [Topic 2]

---

## Next Steps
- [Next step 1]
- [Next step 2]

**Next Meeting**: [Date and time of next meeting]

---

## Attachments & Links
- [Link to relevant document 1]
- [Link to relevant document 2]
- [Recording link if available]

---

## Metadata
- **Project**: [Project name]
- **Meeting series**: [If part of recurring series]
- **Distribution**: [Who received these notes]
- **Notes taken by**: [Name]
```

---

## Example Use Cases

- Daily standup meetings
- Sprint planning sessions
- Retrospectives
- Brainstorming sessions
- Decision-making meetings
- Status update meetings
- One-on-one meetings
- Team sync meetings
- Client meetings
- Board meetings

---

## Notes on This Example

This template demonstrates:

1. **Lifecycle phases**: Idea/Draft focuses on meeting basics and purpose (things you know before/during the meeting). Publishing focuses on distribution and follow-up (things you do after the meeting).

2. **Multiple approaches**: Three different workflows for different meeting types and audiences.

3. **Conversational questions**: Questions are clear, specific, and can be answered 2-5 at a time.

4. **Flexible structure**: The output structure can be adapted based on the approach chosen.

5. **Machine-readable**: Consistent section names (`## Questions to Answer`, `### Idea/Draft Phase`, etc.) that prompts can parse.

6. **Human-readable**: Simple markdown that anyone can read and understand.

When creating your own templates, follow this pattern:
- Split questions by lifecycle phase
- Define 2-3+ approaches for different situations
- Make questions conversational and clear
- Provide a complete output structure
- Keep it simple markdown with well-defined sections
