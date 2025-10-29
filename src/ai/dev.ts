import { config } from 'dotenv';
config();

import '@/ai/flows/generate-treatment-recommendations.ts';
import '@/ai/flows/identify-plant-disease.ts';