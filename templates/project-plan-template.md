# Project Plan Document Template

## Template Structure

This defines the structure and questions for creating project plan documents in RiotDoc.

**Template Type**: project-plan  
**Version**: 2.0  
**Last Updated**: 2026-01-30

---

## Questions to Answer

### Idea/Draft Phase

These are the questions you can answer **NOW** when initiating the project. Focus on the core goals and approach.

#### Project Basics
- **Project name**: What's the project called?
- **Project goal**: What are you trying to achieve? (one clear sentence)
- **Why now**: Why is this project important right now?
- **Stakeholders**: Who's involved? Who cares about this?
- **Timeline**: When does this need to be done? (rough estimate)

#### Scope Definition
- **In scope**: What's included in this project?
- **Out of scope**: What's explicitly NOT included?
- **Deliverables**: What will be produced?
- **Success criteria**: How will you know it's successful?

#### Approach & Methodology
- **Methodology**: Agile, waterfall, hybrid, custom?
- **Phases**: What are the major phases or milestones?
- **Team structure**: Who's doing what? (roles, not necessarily names)

---

### Publishing Phase

These are questions you figure out **LATER** - as you develop the detailed plan.

#### Detailed Planning
- **Dependencies**: What needs to happen first? External dependencies?
- **Risks**: What could go wrong? What's the mitigation strategy?
- **Budget/resources**: Detailed resource allocation and costs?
- **Constraints**: Technical, legal, or business constraints?

#### Team & Communication
- **Team assignments**: Specific people assigned to roles?
- **Communication plan**: How will the team stay in sync? (meetings, tools, frequency)
- **Decision-making**: Who approves what? What's the escalation path?
- **Reporting**: How often and to whom? What format?

#### Documentation & Governance
- **Documentation**: Where will project docs live?
- **Change management**: How will scope changes be handled?
- **Quality assurance**: How will quality be ensured?
- **Post-project review**: How will you capture learnings?

---

## Available Approaches

Choose the approach that best fits your project type and organizational culture.

### Approach 1: Agile Sprint Plan

**When to use**:
- Software development or product work
- Requirements may evolve
- Need flexibility and iteration
- Team works in sprints (1-4 weeks)
- Continuous delivery expected

**Strategy**:
- Define high-level goal and backlog
- Plan first sprint in detail, later sprints roughly
- Iterate and adapt based on feedback
- Regular retrospectives and adjustments

**Output**: Sprint-based project plan with backlog

**Workflow**:
1. Answer Idea/Draft phase questions
2. Create product backlog (user stories or tasks)
3. Prioritize backlog
4. Plan first sprint (2 weeks typical):
   - Select stories from backlog
   - Break into tasks
   - Estimate effort
5. Define sprint ceremonies:
   - Daily standup
   - Sprint review
   - Sprint retrospective
   - Sprint planning
6. Answer Publishing phase questions
7. Document communication plan
8. Start first sprint
9. Adapt plan based on learnings

**Timeline**: Ongoing, reviewed every sprint

**Plan Structure**:
- Product vision and goals
- Backlog of features/stories
- Sprint 1 detailed plan
- Sprint 2+ rough outline
- Team structure and ceremonies

---

### Approach 2: Waterfall Project Plan

**When to use**:
- Well-defined requirements
- Fixed scope and timeline
- Sequential phases make sense
- Regulatory or compliance requirements
- Traditional project management environment

**Strategy**:
- Plan entire project upfront in detail
- Sequential phases with gates
- Detailed documentation at each phase
- Change control process for scope changes

**Output**: Comprehensive project plan with phases and gates

**Workflow**:
1. Answer all Idea/Draft phase questions
2. Define all phases in detail:
   - Requirements gathering
   - Design
   - Implementation
   - Testing
   - Deployment
3. Create detailed timeline with milestones
4. Identify dependencies between phases
5. Answer all Publishing phase questions
6. Document risks and mitigation
7. Create communication and reporting plan
8. Define change control process
9. Get stakeholder approval
10. Execute phase by phase

**Timeline**: Full project planned upfront (weeks to months)

**Plan Structure**:
- Executive summary
- Detailed scope and requirements
- Phase-by-phase breakdown
- Resource allocation
- Risk management plan
- Communication plan

---

### Approach 3: Hybrid Approach

**When to use**:
- Mix of known and unknown requirements
- Some phases can be agile, others need structure
- Need flexibility but also predictability
- Cross-functional team with different working styles
- Organizational constraints require some waterfall elements

**Strategy**:
- Plan high-level phases (waterfall-style)
- Execute phases using agile practices
- Fixed milestones with flexible execution
- Adapt approach per phase as needed

**Output**: Hybrid plan with phase structure and iterative execution

**Workflow**:
1. Answer Idea/Draft phase questions
2. Define major phases and milestones (waterfall)
3. For each phase, plan iterative approach (agile):
   - Break into 1-2 week cycles
   - Define phase goal and deliverables
   - Allow flexibility in how to achieve
4. Identify which phases need more structure vs flexibility
5. Answer Publishing phase questions
6. Create communication plan that works for both styles
7. Document when to use agile vs waterfall practices
8. Execute with regular check-ins and adaptations

**Timeline**: Phases planned upfront, execution iterative

**Plan Structure**:
- Phase-based timeline with milestones
- Iterative execution within phases
- Flexibility where needed, structure where required
- Regular review and adaptation points

---

## Output Document Structure

```markdown
# Project Plan: [Project Name]

**Status**: [Planning/In Progress/Complete]
**Timeline**: [Start Date] - [End Date]
**Last Updated**: [Date]

---

## Executive Summary

[2-3 paragraph overview covering:
- What is the project?
- Why are we doing it?
- What will be delivered?
- When will it be done?]

---

## Project Overview

### Goal
[Primary goal in one clear sentence]

### Why Now
[Why this project is important right now]

### Timeline
- **Start**: [Date]
- **End**: [Date]
- **Duration**: [X weeks/months]

### Budget
[Budget or resource allocation]

### Stakeholders
- **Sponsor**: [Name and role]
- **Project Lead**: [Name]
- **Key Stakeholders**: [List]

---

## Scope

### In Scope
- [Item 1]
- [Item 2]
- [Item 3]

### Out of Scope
- [Item 1]
- [Item 2]

### Deliverables
1. **[Deliverable 1]**: [Description]
2. **[Deliverable 2]**: [Description]
3. **[Deliverable 3]**: [Description]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## Approach

### Methodology
[Agile/Waterfall/Hybrid - with brief description of how it will work]

### Phases & Milestones

#### Phase 1: [Name]
**Timeline**: [Dates]
**Goal**: [What this phase achieves]
**Deliverables**:
- [Deliverable 1]
- [Deliverable 2]
**Milestone**: [Key milestone]

#### Phase 2: [Name]
**Timeline**: [Dates]
**Goal**: [What this phase achieves]
**Deliverables**:
- [Deliverable 1]
- [Deliverable 2]
**Milestone**: [Key milestone]

[Additional phases as needed]

---

## Dependencies

### Internal Dependencies
- [Dependency 1 - what needs to happen first]
- [Dependency 2]

### External Dependencies
- [External dependency 1 - outside team/vendor]
- [External dependency 2]

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How we'll address it] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How we'll address it] |
| [Risk 3] | High/Med/Low | High/Med/Low | [How we'll address it] |

---

## Team & Responsibilities

| Role | Person | Responsibilities |
|------|--------|------------------|
| Project Lead | [Name] | [Overall project management, decisions] |
| [Role 2] | [Name] | [Specific responsibilities] |
| [Role 3] | [Name] | [Specific responsibilities] |

---

## Communication Plan

### Team Meetings
- **Frequency**: [Daily/Weekly/Bi-weekly]
- **Format**: [Standup/Status meeting/Review]
- **Duration**: [X minutes]
- **Attendees**: [Who attends]

### Status Reports
- **Frequency**: [Weekly/Bi-weekly/Monthly]
- **Audience**: [Stakeholders/Leadership]
- **Format**: [Email/Dashboard/Presentation]
- **Content**: [Progress, blockers, upcoming]

### Decision Log
- **Location**: [Where decisions are recorded]
- **Process**: [How decisions are made and documented]

### Escalation Path
1. [First level - Project Lead]
2. [Second level - Manager/Sponsor]
3. [Third level - Executive]

---

## Resources & Budget

### Team Resources
- [X] Full-time equivalents (FTEs)
- [List of team members and allocation %]

### Budget Breakdown
- Personnel: [$X]
- Tools/Software: [$X]
- External vendors: [$X]
- Contingency: [$X]
- **Total**: [$X]

---

## Quality Assurance

### Quality Standards
- [Standard 1]
- [Standard 2]

### Review Process
- [How work will be reviewed]
- [Who approves what]

### Testing Strategy
- [How deliverables will be tested]

---

## Change Management

### Scope Change Process
1. [Request submitted via X]
2. [Impact assessment by project lead]
3. [Approval required from Y]
4. [Plan updated and communicated]

### Change Log
| Date | Change | Requestor | Status | Impact |
|------|--------|-----------|--------|--------|
| [Date] | [Description] | [Name] | [Approved/Rejected] | [Impact on timeline/budget] |

---

## Appendices

### Supporting Documents
- [Link to requirements doc]
- [Link to design specs]
- [Link to technical architecture]

### References
- [Related projects]
- [Industry standards]
- [Research or background materials]
```

---

## Example Use Cases

### Software Development
- New feature development
- Platform migration
- System integration
- Technical debt reduction

### Marketing
- Product launch campaign
- Rebranding initiative
- Content strategy rollout
- Event planning

### Operations
- Process improvement
- Infrastructure upgrade
- Tool implementation
- Organizational change

### Research
- Research study
- Data analysis project
- Pilot program
- Feasibility study

---

## Project Planning Tips

### For Agile Sprint Plans
- Keep backlog groomed and prioritized
- Plan only 1-2 sprints ahead in detail
- Review and adapt after each sprint
- Focus on delivering value incrementally
- Don't over-plan - embrace change

### For Waterfall Plans
- Invest time in upfront planning
- Document everything thoroughly
- Get stakeholder sign-off at each gate
- Manage scope changes carefully
- Plan for testing and deployment

### For Hybrid Approaches
- Be clear when using agile vs waterfall
- Communicate approach to all stakeholders
- Adapt based on what's working
- Don't force one approach everywhere
- Balance flexibility with predictability

---

## Common Pitfalls to Avoid

❌ **Don't**: Start without clear success criteria
✅ **Do**: Define measurable success criteria upfront

❌ **Don't**: Underestimate dependencies
✅ **Do**: Map all dependencies early and track them

❌ **Don't**: Ignore risks until they become issues
✅ **Do**: Identify and mitigate risks proactively

❌ **Don't**: Over-plan in agile or under-plan in waterfall
✅ **Do**: Match planning detail to your methodology

❌ **Don't**: Forget to communicate regularly
✅ **Do**: Establish communication rhythm from day one

❌ **Don't**: Let scope creep without process
✅ **Do**: Have clear change management process

---

## Template Notes

**Version 2.0 Changes** (2026-01-30):
- Split questions into Idea/Draft and Publishing phases
- Added three approaches: Agile Sprint, Waterfall, Hybrid
- Added detailed workflows for each approach
- Enhanced risk management and communication planning
- Follows canonical template structure from TEMPLATE-STRUCTURE.md

**When to use this template**:
- Starting a new project (any size)
- Need to communicate project plan to stakeholders
- Want structured approach to project execution
- Need to track progress and manage changes

---

## Related Templates

- **Meeting Notes Template**: For project meetings
- **Blog Post Template**: For project updates or announcements
- **Email Template**: For stakeholder communication

---

## Version History

- **v2.0** (2026-01-30): Added lifecycle phases and approaches
- **v1.0** (2026-01-XX): Initial template (no phase split)
