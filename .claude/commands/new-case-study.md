---
description: Create a new portfolio case study with frontmatter and section scaffolding
argument-hint: "[project-title]"
allowed-tools: Read, Write, Glob
---

Creates a new portfolio case study from scratch.

## Steps

1. **Ask for the following information** if not already provided in $ARGUMENTS:
   - Project title
   - Short one-sentence description (shown on the home card)
   - Accent/brand color (hex or rgb — should read well with white text)
   - Project type (`client`, `internal`, or `personal`)
   - Roles (list of design disciplines involved, e.g. UX Design, UI Design, Design Systems)
   - Date (approximate completion date — YYYY-MM-DD format)
   - Hero image filename (must already be in `public/images/` — ask user to confirm)
   - Case study content sections (if available — otherwise create a structured template)

2. **Determine the slug** from the title: lowercase, spaces to hyphens, no special characters. Example: "Offer Hub" → `offer-hub`.

3. **Create the MDX file** at `src/content/work/[slug].mdx` with:
   - Complete frontmatter using the schema in CLAUDE.md
   - Set `draft: true` initially
   - Content body with these standard sections as `##` headings:
     - Context & Background
     - Problem
     - Goals
     - Discovery & Insights
     - Design
     - Outcome (or Results)
   - Fill in any content provided; use clear placeholder comments like `{/* TODO: add insights */}` for missing sections

4. **Confirm with the user**:
   - Show the file path and frontmatter
   - Show the URL it will appear at: `/work/[slug]`
   - Remind them to run `/dev [slug]` to preview
   - Remind them to use `/publish-case-study [slug]` when ready to go live

## Notes

- Do not create the file if the slug already exists — show the existing file and ask what they want to do.
- If the user has a Pencil design file open, offer to use `/design-sync` to extract content from it first.
- Images must be placed in `public/images/` before they can be referenced — Claude cannot add images directly; remind the user to do this manually or via Finder.
