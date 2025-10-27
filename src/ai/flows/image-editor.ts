'use server';
/**
 * @fileOverview An AI-powered image editing flow.
 *
 * - editImage - A function that edits an image based on a text prompt.
 */

import {ai} from '@/ai/genkit';
import {
  ImageEditorInputSchema,
  ImageEditorOutputSchema,
  type ImageEditorInput,
  type ImageEditorOutput,
} from './image-editor-types';

export async function editImage(
  input: ImageEditorInput
): Promise<ImageEditorOutput> {
  return imageEditorFlow(input);
}

const imageEditorFlow = ai.defineFlow(
  {
    name: 'imageEditorFlow',
    inputSchema: ImageEditorInputSchema,
    outputSchema: ImageEditorOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            {media: {url: input.photoDataUri}},
            {text: input.prompt},
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media || !media.url) {
      throw new Error('AI did not return an edited image.');
    }

    return { editedPhotoDataUri: media.url };
  }
);
