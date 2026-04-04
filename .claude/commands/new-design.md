---
description: Create a new Pencil design file in the project's /design directory
argument-hint: "[filename]"
allowed-tools: Bash, mcp__pencil__open_document, mcp__pencil__get_editor_state
---

Creates a new `.pen` design file and organizes it in the project's `/design` directory.

## Steps

1. **Determine the filename** from $ARGUMENTS (e.g. `/new-design offer-hub` → `offer-hub.pen`).
   - If no argument is given, ask the user what the design is for and suggest a kebab-case filename.
   - The filename should match the related case study slug when applicable (e.g. `offer-hub.pen` for `src/content/work/offer-hub.mdx`).

2. **Ensure the `/design` directory exists** at the project root:
   ```
   mkdir -p design
   ```

3. **Open a new Pencil document** using `open_document('new')`.

4. **Instruct the user to save** the file to the correct location:
   - Use **File → Save As** in Pencil
   - Save to: `[project-root]/design/[filename].pen`
   - Example: `design/offer-hub.pen`

5. **Confirm the file exists** after the user saves using `get_editor_state` to verify the active file path matches `design/[filename].pen`.

6. **Let the user know** the file is ready and suggest next steps:
   - Use `/design-sync [slug]` to pull content from this design into a case study once layouts are ready
   - All `.pen` files in `design/` are tracked in git — commit them alongside the case study MDX they relate to

## Notes

- The `design/` directory is the single source of truth for all Pencil files in this project. Never save `.pen` files elsewhere in the project.
- Filename should be descriptive and kebab-case: `offer-hub.pen`, `about-redesign.pen`, `homepage-v2.pen`.
- If a `.pen` file for this case study already exists in `design/`, open it with `open_document('[absolute-path]/design/[filename].pen')` instead of creating a new one.
