import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const other = defineCollection({
    loader: glob({ pattern: ['*.mdx?'], base: 'src/content/other' }),
    schema: z.object({
        title: z.string(),
        accent: z.string(),
    }),
});

const work = defineCollection({
    loader: glob({ pattern: ['*.mdx?'], base: 'src/content/work' }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        accent: z.string(),
        desc: z.string(),
        project: z.string(),
        roles: z.array(z.string()),
        img: z.string()
    }),
});

export const collections = { other, work };
