'use server';
/**
 * @fileOverview An AI-powered tool to generate structured datasets.
 *
 * - generateDataset - A function that generates a dataset based on a description.
 */

import {ai} from '@/ai/genkit';
import {
  DatasetGeneratorInputSchema,
  DatasetGeneratorOutputSchema,
  type DatasetGeneratorInput,
  type DatasetGeneratorOutput,
} from './dataset-generator-types';

export async function generateDataset(
  input: DatasetGeneratorInput
): Promise<DatasetGeneratorOutput> {
  return ai.run('datasetGeneratorFlow', () => datasetGeneratorFlow(input));
}

const prompt = ai.definePrompt({
  name: 'datasetGeneratorPrompt',
  input: {schema: DatasetGeneratorInputSchema},
  output: {schema: DatasetGeneratorOutputSchema},
  prompt: `You are an expert data generator. Your task is to create a structured dataset based on the user's request.

Instructions:
1.  Analyze the user's description: "{{description}}".
2.  Generate exactly {{count}} records.
3.  Format the output as {{format}}.
4.  Do NOT include any explanatory text, notes, or markdown formatting around the data. Only output the raw data string.
5.  For CSV format, ensure the first line is a header row.

Example Request: "A list of 5 users with a name and email"
Example JSON Output:
[
  { "name": "John Doe", "email": "john.doe@example.com" },
  { "name": "Jane Smith", "email": "jane.smith@example.com" },
  ...
]

Example CSV Output:
name,email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
...

Now, generate the data for the user's request.
`,
});

const datasetGeneratorFlow = ai.defineFlow(
  {
    name: 'datasetGeneratorFlow',
    inputSchema: DatasetGeneratorInputSchema,
    outputSchema: DatasetGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
