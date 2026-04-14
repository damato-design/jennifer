---
description: Publish a draft case study or unpublish a live one
argument-hint: "[case-study-slug] [--unpublish]"
allowed-tools: Read, Edit, Glob, Bash
---

Toggles a case study from draft to published (or back to draft).

## Steps

1. **Identify the target case study** from $ARGUMENTS (e.g. `/publish-case-study offer-hub`).
   - If no argument given, list all case studies and their current draft status, then ask which to publish.
   - Find the file at `src/content/work/[slug].mdx`.

2. **Show a pre-publish checklist** and confirm each item with the user before changing `draft`:

   - [ ] `title` — is it final?
   - [ ] `desc` — one clean sentence, no placeholder text?
   - [ ] `accent` — does it look correct in `npm run dev`?
   - [ ] `img` — does the image exist in `public/images/` and load correctly?
   - [ ] `roles` — accurate list?
   - [ ] `date` — correct year?
   - [ ] Body content — no `TODO` comments or placeholder sections remaining?
   - [ ] Run `npm run build` — does it succeed with no errors?

3. **Set `draft: false`** in the frontmatter once the user confirms ready.

4. **Confirm** the change and remind the user:
   - The case study will appear on the home page after pushing to `main`
   - Netlify auto-deploys from `main` — the site will update within a few minutes of pushing
   - To unpublish, run `/publish-case-study [slug] --unpublish`

## Unpublish

If $ARGUMENTS contains `--unpublish`, set `draft: true` instead and confirm with the user before making the change.

## Notes

- Always confirm with the user before toggling `draft` status — do not do it silently.
- Never set `draft: false` on multiple case studies at once without explicit instruction.
