import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('GOOGLE_GENAI_API_KEY is not set in production. Please check your Firebase App Hosting secret configuration.');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKey })],
  model: 'googleai/gemini-1.5-flash',
});
