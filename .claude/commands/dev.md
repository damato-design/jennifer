---
description: Start the Astro dev server and open the portfolio in the browser
argument-hint: "[case-study-slug]"
allowed-tools: Bash
---

Starts the Astro dev server and opens the portfolio in the browser.

## Steps

1. Run `npm run dev` in the background from the project root.

2. Wait for the server to be ready — Astro prints `Local: http://localhost:4321/` when it's up.

3. Open `http://localhost:4321` in the default browser using:
   ```
   open http://localhost:4321
   ```

4. If $ARGUMENTS contains a slug (e.g. `/dev offer-hub`), open that page directly:
   ```
   open http://localhost:4321/work/offer-hub
   ```

5. Let the user know the server is running and remind them:
   - Changes to MDX files and `.astro` components hot-reload automatically
   - Stop the server with `Ctrl+C` in the terminal
   - Production build is `npm run build` — run it before pushing to catch any errors
