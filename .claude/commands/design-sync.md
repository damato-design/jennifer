---
description: Extract content from an open Pencil design file and sync it into a case study
argument-hint: "[case-study-slug]"
allowed-tools: Read, Write, Edit, Glob, mcp__pencil__get_editor_state, mcp__pencil__batch_get, mcp__pencil__get_screenshot
---

Extracts design content from an open Pencil (.pen) file and maps it to portfolio case study content.

Use this when you have a design layout or mockup open in Pencil and want to pull copy, colors, structure, or image references into an MDX case study file.

## Steps

1. **Check editor state** using `get_editor_state` to confirm which `.pen` file is active and what is selected.

2. **Identify the target case study** from $ARGUMENTS (e.g. `/design-sync offer-hub`) or ask the user which case study this design corresponds to. Check `src/content/work/` for existing files.

3. **Extract design content** using `batch_get` to read the relevant frames/nodes in the `.pen` file:
   - Look for text layers: headlines, body copy, labels, captions
   - Look for color styles or fills used on hero/background elements → map to `accent`
   - Look for image layers or linked assets → note filenames for `public/images/`
   - Look for section structure that maps to case study headings

4. **Take a screenshot** with `get_screenshot` to visually confirm the design before writing anything.

5. **Map extracted content to MDX**:

   | Pencil design element         | Portfolio field                    |
   | ----------------------------- | ---------------------------------- |
   | Project title / hero heading  | `title` frontmatter                |
   | Subheading or tagline         | `desc` frontmatter                 |
   | Hero background color / fill  | `accent` frontmatter               |
   | Hero or card image            | `img` frontmatter                  |
   | Section headings              | `##` / `###` MDX headings          |
   | Body copy / annotations       | MDX paragraph content              |
   | Role labels / tags            | `roles` frontmatter array          |
   | Year / date                   | `date` frontmatter                 |

6. **Update or create the MDX file**:
   - If the case study file already exists, update only the fields that changed — do not overwrite sections with content.
   - If it doesn't exist yet, follow the `/new-case-study` flow using the extracted data.
   - Keep `draft: true` until the user confirms it's ready.

7. **Report back** with:
   - What was extracted and mapped
   - Any fields that couldn't be filled (missing copy, unlinked images, etc.)
   - Next steps (e.g. "Add the hero image to public/images/ as `my-project-hero.jpg`")

## Notes

- Never use `Read` or `Grep` on `.pen` files — always use Pencil MCP tools.
- If the design has multiple frames (e.g. mobile + desktop), focus on the primary/desktop frame unless the user specifies otherwise.
- Images in Pencil are design assets — they still need to be exported and placed in `public/images/` manually. Flag any images that need to be exported.
- Colors in Pencil may be in different formats — convert to `rgb()` or hex before writing to frontmatter.
