import { z } from 'zod';

export const TextSummarizerInputSchema = z.object({
  text: z.string().describe('The text to be summarized.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .describe(
      'The desired length of the summary (short: 1-2 sentences, medium: a paragraph, long: multiple paragraphs).'
    ),
});
export type TextSummarizerInput = z.infer<typeof TextSummarizerInputSchema>;

export const TextSummarizerOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the text.'),
});
export type TextSummarizerOutput = z.infer<typeof TextSummarizerOutputSchema>;
