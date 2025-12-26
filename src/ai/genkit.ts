import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

let apiKey = process.env.GOOGLE_GENAI_API_KEY;

// Robust key parsing: handle potential accidental duplication/concatenation
if (apiKey && apiKey.length === 78) {
  const half = apiKey.length / 2;
  const firstHalf = apiKey.substring(0, half);
  const secondHalf = apiKey.substring(half);
  if (firstHalf === secondHalf) {
    console.warn('GOOGLE_GENAI_API_KEY duplication detected. Using the single-instance key.');
    apiKey = firstHalf;
  }
}

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('GOOGLE_GENAI_API_KEY is not set in production. Please check your Firebase App Hosting secret configuration.');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKey })],
  model: 'googleai/gemini-1.5-flash',
});
