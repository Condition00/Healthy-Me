import z from 'zod';

export const RemediesSchema = z.object({
    description: z.string(),
});