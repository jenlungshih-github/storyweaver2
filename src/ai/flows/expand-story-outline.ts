'use server';

/**
 * @fileOverview A story expansion AI agent.
 *
 * - expandStoryOutline - A function that handles the story expansion process.
 * - ExpandStoryOutlineInput - The input type for the expandStoryOutline function.
 * - ExpandStoryOutlineOutput - The return type for the expandStoryOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandStoryOutlineInputSchema = z.object({
  outline: z
    .string()
    .describe("The story outline to expand, with key plot points, characters, and setting."),
});
export type ExpandStoryOutlineInput = z.infer<typeof ExpandStoryOutlineInputSchema>;

const ExpandStoryOutlineOutputSchema = z.object({
  title: z.string().describe("An engaging title for the children's story, in Traditional Chinese."),
  fullStoryChinese: z.string().describe("The full, engaging children's story with vivid descriptions, in Traditional Chinese."),
  fullStoryEnglish: z.string().describe("The full, engaging children's story with vivid descriptions, in English."),
});
export type ExpandStoryOutlineOutput = z.infer<typeof ExpandStoryOutlineOutputSchema>;

export async function expandStoryOutline(input: ExpandStoryOutlineInput): Promise<ExpandStoryOutlineOutput> {
  return expandStoryOutlineFlow(input);
}

const expandAndTranslatePrompt = ai.definePrompt({
  name: 'expandAndTranslateStoryPrompt',
  input: {schema: ExpandStoryOutlineInputSchema},
  output: {schema: ExpandStoryOutlineOutputSchema},
  prompt: `You are a children's story writer. 
  1. Read the Story Outline below.
  2. Generate a creative title for the story in Traditional Chinese.
  3. Expand the outline into a full children's story in Traditional Chinese.
  4. Translate the story you just wrote into English.
  
Story Outline:
{{{outline}}}
`,
});


const expandStoryOutlineFlow = ai.defineFlow(
  {
    name: 'expandStoryOutlineFlow',
    inputSchema: ExpandStoryOutlineInputSchema,
    outputSchema: ExpandStoryOutlineOutputSchema,
  },
  async input => {
    const { output } = await expandAndTranslatePrompt(input);

    if (!output?.title || !output?.fullStoryChinese || !output?.fullStoryEnglish) {
        throw new Error("Failed to generate or translate the story.");
    }

    return {
        title: output.title,
        fullStoryChinese: output.fullStoryChinese,
        fullStoryEnglish: output.fullStoryEnglish
    };
  }
);
