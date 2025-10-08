'use server';

/**
 * @fileOverview An AI-powered tool to find rhyming words.
 *
 * - findRhymes - A function that suggests words that rhyme with a given word.
 */

import { ai } from '@/ai/genkit';
import {
  RhymeFinderInputSchema,
  RhymeFinderOutputSchema,
  type RhymeFinderInput,
  type RhymeFinderOutput,
} from './rhyme-finder-types';

export async function findRhymes(input: RhymeFinderInput): Promise<RhymeFinderOutput> {
  return rhymeFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rhymeFinderPrompt',
  input: { schema: RhymeFinderInputSchema },
  output: { schema: RhymeFinderOutputSchema },
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
    const { output } = await prompt(input);
    return output!;
  }
);
