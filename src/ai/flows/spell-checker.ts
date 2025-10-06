'use server';
/**
 * @fileOverview An AI-powered spell and grammar checker.
 *
 * - spellCheck - A function that checks text for errors and provides suggestions.
 */

import {ai} from '@/ai/genkit';
import {
  SpellCheckInputSchema,
  SpellCheckOutputSchema,
  type SpellCheckInput,
  type SpellCheckOutput,
} from './spell-checker-types';

export async function spellCheck(
  input: SpellCheckInput
): Promise<SpellCheckOutput> {
  return spellCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spellCheckPrompt',
  input: {schema: SpellCheckInputSchema},
  output: {schema: SpellCheckOutputSchema},
  prompt: `You are an expert spell checker and grammar editor. Analyze the following text for any spelling mistakes, grammatical errors, or awkward phrasing.

Provide a corrected version of the full text.

Also, provide a list of suggestions detailing each change. For each suggestion, include the original word or phrase, the suggested correction, and a brief explanation for the change (e.g., "Spelling mistake", "Grammar: Subject-verb agreement", "Better word choice").

Text to check:
"{{{text}}}"`,
});

const spellCheckFlow = ai.defineFlow(
  {
    name: 'spellCheckFlow',
    inputSchema: SpellCheckInputSchema,
    outputSchema: SpellCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
