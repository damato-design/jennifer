# Jennifer D'Amato Portfolio — Claude Guide

This is Jennifer's personal design portfolio site. It is built with **Astro 5** and **MDX**, deployed to Netlify. The audience is design hiring managers and collaborators. Jennifer is a design systems / product designer — the site should always reflect that: clean, intentional, and accessible.

---

## Setup

Before running any dev commands, ensure dependencies are installed:

```
npm install
```

`node_modules/` is not committed — run this whenever it's missing or after cloning the repo.

## Dev Commands

Run from the project root:

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start local dev server at localhost:4321  |
| `npm run build`   | Build production site to `./dist/`        |
| `npm run preview` | Preview the production build locally      |

---

## Project Structure

```
src/
├── components/       # Reusable Astro components
├── content/
│   ├── work/         # Case study MDX files (one per project)
│   └── other/
│       └── about.mdx # Bio shown on the home page header
├── layouts/
│   └── Layout.astro  # Root layout (Navigation + Header + Footer)
└── pages/
    ├── index.astro         # Home page — lists all non-draft work entries
    └── work/[id].astro     # Dynamic case study page

public/
└── images/           # All portfolio images live here

design/
└── *.pen             # Pencil design files — one per case study or design exploration
```

---

## Content Schema

### Work case studies (`src/content/work/*.mdx`)

Every file in `src/content/work/` needs this frontmatter:

```yaml
---
title: string          # Display title of the project
date: YYYY-MM-DD       # Used for sort order — most recent appears first
accent: css-color      # Brand/hero color, e.g. "rgb(71, 47, 145)" or "#3a2e9c"
desc: string           # One-sentence description shown on home card and header
project: string        # Context, e.g. "client", "internal", "personal"
roles:                 # Array of role tags shown on the case study page
  - UX Design
  - Design Systems
img: /images/file.jpg  # Hero/card image — must be in public/images/
draft: boolean         # true = hidden from the site, false = published
---
```

The body is MDX — standard markdown with optional JSX components. Use `##` and `###` headings to structure the case study.

### About page (`src/content/other/about.mdx`)

```yaml
---
title: string    # Shown as the H1 on the home page header
desc: string     # Subtext shown below the title
accent: string   # Background color of the home page header
img: /images/x  # Background image for the home page header
---
```

The body is the bio paragraph shown nowhere currently (reserved for future use).

---

## Adding a New Case Study

1. **Add image(s)** to `public/images/` — use kebab-case filenames, e.g. `my-project-hero.jpg`
2. **Create** `src/content/work/my-project.mdx` using the schema above
3. Set `draft: true` while working; switch to `draft: false` when ready to publish
4. Run `npm run dev` to preview at `localhost:4321/work/my-project`

The file's base name (without `.mdx`) becomes the URL slug: `src/content/work/offer-hub.mdx` → `/work/offer-hub`.

---

## Images

- All images live in `public/images/`
- Reference them in frontmatter and MDX as `/images/filename.jpg` (absolute from `public/`)
- Preferred formats: JPG for photos, PNG for screenshots with transparency, SVG for icons
- No image processing pipeline — images are served as-is, so optimize before adding

---

## Components

| Component           | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `Layout.astro`      | Root shell — wraps every page with nav, header, footer          |
| `Header.astro`      | Full-width hero banner using `accent` + `img` + `title`/`desc`  |
| `PortfolioCard.astro` | Home page card — clipped shape image + title + desc           |
| `Float.astro`       | Floating metadata block on case study pages (year, roles)       |
| `Roles.astro`       | Renders the array of role badges                                |
| `Navigation.astro`  | Sticky top nav with glassmorphism effect                        |
| `Head.astro`        | `<head>` — SEO, fonts, global CSS, analytics                    |
| `Footer.astro`      | Site footer                                                     |

---

## Design System Notes

- **Accent color** drives the hero header background and card drop shadow. Use `rgb()` or hex values. Choose something that reads well with white text on top.
- **Syncopate** (Google Font) is used for headings and the lockup on case study pages.
- **No CSS framework** — all styling is scoped Astro CSS or global rules in `Head.astro`.
- Global layout max-width is applied via the `.max-width` class defined in `Head.astro`.
- The card shape (`clip-path: url(#shape)`) is a custom SVG path defined inline in `PortfolioCard.astro`. Don't change it without reviewing the visual.

---

## Design Files

All Pencil (`.pen`) files live in `design/` at the project root. Filename should match the related case study slug — e.g. `design/offer-hub.pen` pairs with `src/content/work/offer-hub.mdx`. These files are tracked in git and should be committed alongside the case study content they relate to.

Use `/new-design [filename]` to create a new design file in the right place.

## Pencil.dev Integration

Pencil (`.pen` files) is the design tool used to create and review layouts for this site. When working with `.pen` files:

- Use **only the `pencil` MCP tools** (`batch_get`, `batch_design`, etc.) to read or modify `.pen` files — never use `Read` or `Grep` on them, as the contents are encrypted.
- Use `get_editor_state` first to confirm which `.pen` file is active.
- When extracting design specs (colors, copy, image references) from a `.pen` file to update portfolio content, map them to the content schema fields above.
- Use `get_screenshot` to visually verify a design before writing it to MDX.

---

## Deployment

Netlify auto-deploys from the `main` branch. There is no staging environment — use `draft: true` on content that isn't ready to be public. Run `npm run build` locally to catch any errors before pushing.

---

## What Not to Do

- Do not add new npm dependencies without a clear reason — the project is intentionally lean.
- Do not modify `PortfolioCard.astro`'s clip-path or shape SVG unless Jennifer explicitly asks.
- Do not create new components for one-off uses — prefer inline styles or scoped CSS in the relevant `.astro` file.
- Do not commit images that haven't been optimized (large uncompressed files will slow the site).
- Do not change `draft: false` → `draft: true` on a live case study without confirming with Jennifer.
