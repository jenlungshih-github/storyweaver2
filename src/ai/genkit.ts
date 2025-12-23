import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GOOGLE_GENAI_API_KEY } from '@/lib/apiKey';

export const ai = genkit({
  plugins: [googleAI({ apiKey: GOOGLE_GENAI_API_KEY })],
  model: 'googleai/gemini-2.5-flash',
});
