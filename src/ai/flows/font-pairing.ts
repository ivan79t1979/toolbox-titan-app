'use server';

/**
 * @fileOverview An AI-powered tool to suggest font pairings from Google Fonts.
 *
 * - fontPairing - A function that suggests font pairings based on a style.
 * - FontPairingInput - The input type for the fontPairing function.
 * - FontPairingOutput - The return type for the fontPairing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const FontPairingInputSchema = z.object({
  style: z
    .string()
    .describe(
      'The desired style for the font pairing (e.g., "modern", "elegant", "playful").'
    ),
});
export type FontPairingInput = z.infer<typeof FontPairingInputSchema>;

const FontPairingSuggestionSchema = z.object({
  headlineFont: z.string().describe('The name of the suggested headline font from Google Fonts (e.g., "Roboto Slab").'),
  bodyFont: z.string().describe('The name of the suggested body font from Google Fonts (e.g., "Roboto").'),
  reason: z.string().describe('A brief explanation of why this pairing works well.'),
});

export const FontPairingOutputSchema = z.object({
  pairings: z.array(FontPairingSuggestionSchema).describe('An array of suggested font pairings.'),
});
export type FontPairingOutput = z.infer<typeof FontPairingOutputSchema>;

export async function fontPairing(
  input: FontPairingInput
): Promise<FontPairingOutput> {
  return fontPairingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fontPairingPrompt',
  input: { schema: FontPairingInputSchema },
  output: { schema: FontPairingOutputSchema },
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
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
