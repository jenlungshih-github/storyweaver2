
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating unique children's story ideas
 * and summarizing them into a structured outline.
 *
 * The flow takes themes and keywords as input, generates a story idea in both
 * Traditional Chinese and English, and extracts the key story elements.
 * - generateStoryIdeas - A function that generates story ideas and an outline.
 * - GenerateStoryIdeasInput - The input type for the generateStoryIdeas function.
 * - GenerateStoryIdeasOutput - The return type for the generateStoryIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { StoryOutline } from '@/lib/types';


const GenerateStoryIdeasInputSchema = z.object({
  themes: z
    .string()
    .describe('Themes for the story, such as friendship, courage, or honesty.'),
  keywords: z
    .string()
    .describe(
      'Keywords related to the story, such as dragons, castles, or forests.'
    ),
  language: z.enum(['en', 'zh']).describe('The language to generate the outline in.'),
});
export type GenerateStoryIdeasInput = z.infer<typeof GenerateStoryIdeasInputSchema>;


const StoryOutlineSchema = z.object({
    characters: z.string().describe("The main characters in the story."),
    setting: z.string().describe("The setting or location of the story."),
    plot: z.string().describe("The main plot, problem, or goal of the story."),
    moral: z.string().describe("The moral or ending of the story."),
});

const GenerateStoryIdeasOutputSchema = z.object({
  storyIdeaChinese: z
    .string()
    .describe("A unique children's story idea in Traditional Chinese, based on the provided themes and keywords, drawing inspiration from diverse cultural elements in global folk tales."),
  storyIdeaEnglish: z
    .string()
    .describe("The English translation of the story idea."),
  outline: StoryOutlineSchema.describe("The summarized outline of the generated story idea, in the requested language.")
});
export type GenerateStoryIdeasOutput = z.infer<typeof GenerateStoryIdeasOutputSchema>;

export async function generateStoryIdeas(input: GenerateStoryIdeasInput): Promise<GenerateStoryIdeasOutput> {
  return generateStoryIdeasFlow(input);
}

const generationPrompt = ai.definePrompt({
  name: 'generateAndSummarizeStoryIdeaPrompt',
  input: {schema: GenerateStoryIdeasInputSchema},
  output: {schema: GenerateStoryIdeasOutputSchema},
  prompt: `You are an expert in children's stories, familiar with folk tales from around the world.
  1. Generate a unique children's story idea in Traditional Chinese based on the provided themes and keywords.
  2. Translate the story idea you just wrote into English.
  3. Based on the story idea you generated, summarize it into a structured outline in the requested language ({{language}}). Fill out all fields of the outline.

Themes: {{{themes}}}
Keywords: {{{keywords}}}
`,
});


const generateStoryIdeasFlow = ai.defineFlow(
  {
    name: 'generateStoryIdeasFlow',
    inputSchema: GenerateStoryIdeasInputSchema,
    outputSchema: GenerateStoryIdeasOutputSchema,
  },
  async input => {
    const { output } = await generationPrompt(input);

    if (
        !output?.storyIdeaChinese ||
        !output?.storyIdeaEnglish ||
        !output?.outline
    ) {
        throw new Error("Failed to generate the story idea and outline.");
    }

    return output;
  }
);
