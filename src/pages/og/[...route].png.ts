import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { clip, renderOgImage, type OgContent } from '@lib/og';

const yearRange = (data: CollectionEntry<'work'>['data']) => {
    const start = new Date(data.date).getUTCFullYear();
    const end = data.endDate ? new Date(data.endDate).getUTCFullYear() : null;
    return end && end !== start ? `${start}–${end}` : `${start}`;
};

export async function getStaticPaths() {
    const about = await getEntry('other', 'about');
    const other = await getCollection('other');
    const work = await getCollection('work');

    const paths: { params: { route: string }; props: { content: OgContent } }[] = [
        {
            // The home page header is rendered from the about entry
            params: { route: 'home' },
            props: {
                content: {
                    label: 'Portfolio',
                    title: about.data.title,
                    desc: 'I tame chaos for a living.',
                    accent: about.data.accent,
                    tags: ['Design Systems', 'Accessibility', 'Product Design'],
                },
            },
        },
        {
            params: { route: 'resume' },
            props: {
                content: {
                    label: 'Résumé',
                    title: 'Jennifer D’Amato',
                    desc: 'Lead Experience Designer specialising in design systems and accessibility.',
                    accent: '#CC0000',
                    tags: ['Design Systems', 'Accessibility'],
                },
            },
        },
    ];

    for (const entry of other) {
        paths.push({
            params: { route: entry.slug },
            props: {
                content: {
                    label: entry.slug,
                    title: entry.data.title,
                    desc: clip(entry.data.desc),
                    accent: entry.data.accent,
                },
            },
        });
    }

    // Drafts included: src/pages/work/[id].astro builds a page for them too,
    // and that page references its card by route.
    for (const entry of work) {
        paths.push({
            params: { route: `work/${entry.slug}` },
            props: {
                content: {
                    label: `${entry.data.project} · ${yearRange(entry.data)}`,
                    title: entry.data.title,
                    desc: clip(entry.data.desc),
                    accent: entry.data.accent,
                    tags: entry.data.roles,
                },
            },
        });
    }

    return paths;
}

export const GET: APIRoute = async ({ props }) => {
    const png = await renderOgImage(props.content as OgContent);
    return new Response(png as unknown as BodyInit, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
};
