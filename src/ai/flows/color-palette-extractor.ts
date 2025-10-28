'use server';
/**
 * @fileOverview An AI-powered tool to extract a color palette from an image.
 *
 * - extractColorPalette - A function that analyzes an image and returns its dominant colors.
 */

import {ai} from '@/ai/genkit';
import {
  ColorPaletteExtractorInputSchema,
  ColorPaletteExtractorOutputSchema,
  type ColorPaletteExtractorInput,
  type ColorPaletteExtractorOutput,
} from './color-palette-extractor-types';

export async function extractColorPalette(
  input: ColorPaletteExtractorInput
): Promise<ColorPaletteExtractorOutput> {
  return colorPaletteExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'colorPaletteExtractorPrompt',
  input: {schema: ColorPaletteExtractorInputSchema},
  output: {schema: ColorPaletteExtractorOutputSchema},
  prompt: `You are a color expert. Analyze the provided image and extract a palette of the {{numberOfColors}} most dominant and representative colors.

For each color, provide its HEX code, its RGB value, its HSL value, and a simple, common name for that color (e.g., "Deep Sky Blue", "Forest Green", "Warm Sand").

Image: {{media url=photoDataUri}}`,
});

const colorPaletteExtractorFlow = ai.defineFlow(
  {
    name: 'colorPaletteExtractorFlow',
    inputSchema: ColorPaletteExtractorInputSchema,
    outputSchema: ColorPaletteExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
