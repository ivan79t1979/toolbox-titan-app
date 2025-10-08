'use server';

/**
 * @fileOverview An AI-powered tool to find rhyming words.
 *
 * - findRhymes - A function that suggests words that rhyme with a given word.
 * - RhymeFinderInput - The input type for the findRhymes function.
 * - RhymeFinderOutput - The return type for the findRhymes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const RhymeFinderInputSchema = z.object({
  word: z.string().min(1, 'Please enter a word.').describe('The word to find rhymes for.'),
});
export type RhymeFinderInput = z.infer<typeof RhymeFinderInputSchema>;

export const RhymeFinderOutputSchema = z.object({
  rhymes: z.array(z.string()).describe('An array of words that rhyme with the input word.'),
});
export type RhymeFinderOutput = z.infer<typeof RhymeFinderOutputSchema>;

export async function findRhymes(input: RhymeFinderInput): Promise<RhymeFinderOutput> {
  return rhymeFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rhymeFinderPrompt',
  input: {schema: RhymeFinderInputSchema},
  output: {schema: RhymeFinderOutputSchema},
  prompt: `You are a rhyming expert. Find a list of words that rhyme with the following word: "{{word}}". 
  
  Return a diverse list of rhymes, from simple to more complex. Only return the rhyming words.`,
});

const rhymeFinderFlow = ai.defineFlow(
  {
    name: 'rhymeFinderFlow',
    inputSchema: RhymeFinderInputSchema,
    outputSchema: RhymeFinderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
