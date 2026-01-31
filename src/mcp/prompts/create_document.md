# Create Document Workflow

## Objective

Create a new document workspace with proper structure and initial configuration.

## Workflow Steps

1. **Gather Information**
   - Document name (will be used as directory name)
   - Document type (blog-post, podcast-script, technical-doc, newsletter, custom)
   - Document title (defaults to formatted name)
   - Primary goal
   - Target audience

2. **Create Workspace**
   - Run `riotdoc_create` with the gathered information:
     ```
     riotdoc_create({
       name: "${name}",
       type: "${type}",
       title: "${title}",
       primary_goal: "${goal}",
       audience: "${audience}",
       base_path: "${base_path}"
     })
     ```

3. **Customize Voice**
   - Edit the voice/tone.md file to define writing style
   - Set tone (conversational, formal, technical, etc.)
   - Define point of view (first, second, third person)
   - Add style notes and things to avoid

4. **Refine Objectives**
   - Edit OBJECTIVES.md to add:
     - Secondary goals
     - Key takeaways
     - Call to action (if applicable)
     - Emotional arc (if applicable)

5. **Next Steps**
   - Generate outline: `riotdoc_outline({ path: "${name}", generate: true })`
   - Create first draft: `riotdoc_draft({ path: "${name}", assistance_level: "generate" })`

## Example

```
# Creating a blog post about AI in healthcare

1. riotdoc_create({
     name: "ai-healthcare-revolution",
     type: "blog-post",
     title: "The AI Revolution in Healthcare",
     primary_goal: "Educate readers about AI applications in healthcare",
     audience: "Healthcare professionals and tech enthusiasts"
   })

2. Edit voice/tone.md:
   - Tone: Informative yet conversational
   - POV: Third person with occasional first person for examples
   - Style: Clear, accessible, evidence-based

3. Edit OBJECTIVES.md:
   - Add secondary goals (build trust, inspire action)
   - Add key takeaways (3-5 main points)
   - Add CTA (subscribe to newsletter)

4. riotdoc_outline({ path: "ai-healthcare-revolution", generate: true })
```

## Important Notes

- The workspace structure is created automatically
- All directories (voice/, evidence/, drafts/, export/) are set up
- Configuration is saved to riotdoc.yaml
- Objectives are initialized in OBJECTIVES.md
