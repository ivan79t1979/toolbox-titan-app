import {z} from 'genkit';

export const ColorPaletteExtractorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the image to extract colors from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  numberOfColors: z
    .number()
    .min(3)
    .max(10)
    .describe('The number of colors to extract from the image, between 3 and 10.'),
});
export type ColorPaletteExtractorInput = z.infer<
  typeof ColorPaletteExtractorInputSchema
>;

export const ColorPaletteExtractorOutputSchema = z.object({
  colors: z
    .array(
      z.object({
        hex: z
          .string()
          .describe('The hex code of the extracted color (e.g., "#RRGGBB").'),
        rgb: z
          .string()
          .describe('The RGB value of the color (e.g., "rgb(255, 99, 71)").'),
        hsl: z
          .string()
          .describe('The HSL value of the color (e.g., "hsl(9, 100%, 64%)").'),
        name: z.string().describe('A common, descriptive name for the color.'),
      })
    )
    .describe('An array of dominant colors extracted from the image.'),
});
export type ColorPaletteExtractorOutput = z.infer<
  typeof ColorPaletteExtractorOutputSchema
>;
