import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		year: z.number(),
		client: z.string(),
		sector: z.string(),
		services: z.array(z.string()),
		stack: z.array(z.string()),
		tags: z.array(z.string()).max(3),
		excerpt: z.string(),
		featured: z.boolean().default(false),
		externalUrl: z.string().url().optional(),
		cover: z.string().optional(),
	}),
});

export const collections = {
	'case-studies': caseStudies,
};
