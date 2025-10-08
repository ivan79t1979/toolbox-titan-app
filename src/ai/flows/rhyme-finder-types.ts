import { z } from 'zod';

export const RhymeFinderInputSchema = z.object({
  word: z.string().min(1, 'Please enter a word.').describe('The word to find rhymes for.'),
});
export type RhymeFinderInput = z.infer<typeof RhymeFinderInputSchema>;

export const RhymeFinderOutputSchema = z.object({
  rhymes: z.array(z.string()).describe('An array of words that rhyme with the input word.'),
});
export type RhymeFinderOutput = z.infer<typeof RhymeFinderOutputSchema>;
