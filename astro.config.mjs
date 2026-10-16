// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

/**
 * The origin the build is being published to.
 *
 * Pages are prerendered, so there is no request to read an origin from:
 * Astro.url resolves against this value. Netlify sets DEPLOY_PRIME_URL to the
 * branch or deploy-preview URL and URL to the production one, so cards on a
 * preview point at that preview's own images instead of the live site.
 * Falls back to the dev server origin for a plain local build.
 */
const site =
  (process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL) ??
  process.env.URL ??
  'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [mdx()],
  experimental: {
    svg: true,
  },
});