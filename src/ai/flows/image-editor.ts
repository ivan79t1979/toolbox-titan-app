
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
    try {
        const { output } = await ai.run('googleai/gemini-2.5-flash-image-preview', {
            prompt: [
                {media: {url: input.photoDataUri}},
                {text: input.prompt},
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        if (output?.content) {
            const imagePart = output.content.find(part => part.media);
            if (imagePart && imagePart.media?.url) {
                return { editedPhotoDataUri: imagePart.media.url };
            }
        }
        throw new Error('AI did not return an edited image.');
    } catch (error: any) {
        if (error.message && error.message.includes('429 Too Many Requests')) {
            throw new Error('AI rate limit exceeded. Please try again later.');
        }
        // Re-throw other unexpected errors
        throw error;
    }
  }
);
