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
  confidenceScore: z.number().describe('The confidence score (0-1) of the identification.'),
  plantType: z.string().describe('The type of plant the leaf belongs to. Supported cash crops are: Beans, Cotton, Maize, Potatoes, Sunflower, Tobacco, Tomato, Wheat. If the plant is not in this list, return "Unknown".'),
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
  prompt: `You are an expert in plant pathology, using a model fine-tuned on a comprehensive dataset for Zimbabwean cash crops. You will analyze the image of a plant leaf and identify potential diseases.

  Analyze the following plant leaf image and provide the disease name and a confidence score (0-1) of your identification.
  The identification must be from within the supported dataset of Zimbabwean cash crops.

  Here are the supported plants and their diseases:
  - **Beans:** Angular leaf spot, Anthracnose, Rust, Mosaic.
  - **Cotton:** Bacterial blight, Curl virus, Fusarium wilt.
  - **Maize:** Blight, Common rust, Downy mildew, Gray leaf spot, Streak virus, Lethal necrosis.
  - **Potatoes:** Early blight, Late blight.
  - **Sunflower:** Downy Mildew, Gray Mold, Leaf scars.
  - **Tobacco:** Target Leaf spot, Brown Spot 3, Alternaria Tabac, Alternaria Zimbabwe.
  - **Tomato:** Bacterial spot, Early blight, Late blight, Leaf Mold, Mosaic virus, Septoria leaf spot, Spider mite, Target spot, Yellow leaf curl virus.
  - **Wheat:** Septoria, Stripe rust.

  If the image is not a plant leaf, or the plant is not one of the supported types (Beans, Cotton, Maize, Potatoes, Sunflower, Tobacco, Tomato, Wheat), return "Unknown" for plantType, "Unknown" for diseaseName, and 0 for confidenceScore.
  If no disease is found on a supported plant, return "Healthy" for diseaseName and 1 for confidenceScore.

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
