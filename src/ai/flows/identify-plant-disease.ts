'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying plant diseases from an image of a plant leaf.
 *
 * It exports:
 * - `identifyPlantDisease` - The main function to call to identify a plant disease.
 * - `IdentifyPlantDiseaseInput` - The input type for the `identifyPlantdisease` function.
 * - `IdentifyPlantDiseaseOutput` - The output type for the `identifyPlantdisease` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPlantDiseaseInput = z.infer<typeof IdentifyPlantDiseaseInputSchema>;

const IdentifyPlantDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The common name of the identified disease, if any.'),
  scientificName: z.string().describe('The scientific name of the identified disease, if any.'),
  confidenceScore: z.number().describe('The confidence score (0-1) of the identification.'),
  plantType: z.string().describe('The type of plant the leaf belongs to (e.g. Beans, Cotton, Maize/Corn, Potatoes, Sunflower, Tobacco, Tomato, Wheat). If the plant is not in this list, return "Unknown".'),
});
export type IdentifyPlantDiseaseOutput = z.infer<typeof IdentifyPlantDiseaseOutputSchema>;

export async function identifyPlantDisease(
  input: IdentifyPlantDiseaseInput
): Promise<IdentifyPlantDiseaseOutput> {
  return identifyPlantDiseaseFlow(input);
}

const identifyPlantDiseasePrompt = ai.definePrompt({
  name: 'identifyPlantDiseasePrompt',
  input: {schema: IdentifyPlantDiseaseInputSchema},
  output: {schema: IdentifyPlantDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology. You will analyze the image of a plant leaf and identify potential diseases.

  Analyze the following plant leaf image and provide the disease name, scientific name and confidence score (0-1) of your identification.
  The identification should be from within the supported dataset.
  Also, tell me the type of plant this leaf belongs to. The supported plants are: Beans, Cotton, Maize/Corn, Potatoes, Sunflower, Tobacco, Tomato, Wheat.
  If the image is not a plant leaf, or the plant is not one of the supported types, return "Unknown" for plantType, "Unknown" for diseaseName, "Unknown" for scientificName and 0 for confidenceScore.
  If no disease is found on a supported plant, return "No disease found" for diseaseName and scientificName, and 1 for confidenceScore.

  Here is the plant leaf image: {{media url=photoDataUri}}
`,
});

const identifyPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'identifyPlantDiseaseFlow',
    inputSchema: IdentifyPlantDiseaseInputSchema,
    outputSchema: IdentifyPlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await identifyPlantDiseasePrompt(input);
    return output!;
  }
);
