'use server';

/**
 * @fileOverview An AI-powered tool to suggest font pairings from Google Fonts.
 *
 * - fontPairing - A function that suggests font pairings based on a style.
 */

import {ai} from '@/ai/genkit';
import {
  FontPairingInputSchema,
  FontPairingOutputSchema,
  type FontPairingInput,
  type FontPairingOutput,
} from './font-pairing-types';

export async function fontPairing(
  input: FontPairingInput
): Promise<FontPairingOutput> {
  return fontPairingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fontPairingPrompt',
  input: {schema: FontPairingInputSchema},
  output: {schema: FontPairingOutputSchema},
  prompt: `You are a typography expert specializing in web font pairings. Generate 3 distinct font pairings from Google Fonts based on the user's desired style: "{{style}}".

For each pairing, provide:
1.  A 'headlineFont' (e.g., a display, serif, or sans-serif font suitable for titles).
2.  A 'bodyFont' (e.g., a serif or sans-serif font that is highly readable for paragraphs).
3.  A short 'reason' explaining why the two fonts complement each other (e.g., "Roboto Slab's strong serifs contrast well with Roboto's clean, neutral look, creating a clear hierarchy.").

Ensure the font names are exactly as they appear on Google Fonts to be used in an API call. Do not include weights or styles in the name.`,
});

const fontPairingFlow = ai.defineFlow(
  {
    name: 'fontPairingFlow',
    inputSchema: FontPairingInputSchema,
    outputSchema: FontPairingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
