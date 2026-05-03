import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const other = defineCollection({
    loader: glob({ pattern: ['*.mdx?'], base: 'src/content/other' }),
    schema: z.object({
        title: z.string(),
        desc: z.string(),
        accent: z.string(),
        img: z.string().optional(),
        draft: z.boolean().optional(),
    }),
});

const work = defineCollection({
    loader: glob({ pattern: ['*.mdx?'], base: 'src/content/work' }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        endDate: z.date().optional(),
        accent: z.string(),
        desc: z.string(),
        project: z.string(),
        roles: z.array(z.string()),
        img: z.string(),
        draft: z.boolean(),
    }),
});

export const collections = { other, work };
