import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    investigationId: z.string().optional(),
    signalCategory: z.string().optional(),
    archiveState: z.string().optional(),
    signalState: z.enum(['ACTIVE', 'ARCHIVED', 'UNRESOLVED', 'RECENT', 'DRIFTING']).default('ACTIVE'),
    isDraft: z.boolean().optional(),
    relatedTraces: z.array(z.string()).optional(),
  }),
});

const signals = defineCollection({
  schema: z.object({
    observation: z.string(),
    category: z.string(),
    timestamp: z.date(),
    status: z.enum(['TRACKING', 'DRIFTING', 'STABILIZED']).default('TRACKING'),
    coordinates: z.string().optional(),
  }),
});

const fieldNotes = defineCollection({
  schema: z.object({
    title: z.string(),
    observation: z.string(),
    insight: z.string(),
    unresolvedSignal: z.string(),
    pattern: z.string(),
    signalState: z.enum(['ACTIVE', 'ARCHIVED', 'UNRESOLVED', 'RECENT', 'DRIFTING', 'DECAYING']).default('UNRESOLVED'),
    category: z.string(),
    date: z.date(),
    coordinates: z.string().optional(),
  }),
});

export const collections = { blog, signals, fieldNotes };
