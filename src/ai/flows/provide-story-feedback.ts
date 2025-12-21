'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing feedback on a story draft.
 *
 * - provideStoryFeedback - A function that analyzes a story and provides feedback.
 * - ProvideStoryFeedbackInput - The input type for the provideStoryFeedback function.
 * - ProvideStoryFeedbackOutput - The return type for the provideStoryFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideStoryFeedbackInputSchema = z.object({
  storyDraft: z.string().describe('The draft of the story to be reviewed.'),
});
export type ProvideStoryFeedbackInput = z.infer<typeof ProvideStoryFeedbackInputSchema>;

const ProvideStoryFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe('Constructive feedback on the story draft, focusing on elements like character development, plot, pacing, and age-appropriateness. Provide actionable suggestions and concrete examples for improvement.'),
});
export type ProvideStoryFeedbackOutput = z.infer<typeof ProvideStoryFeedbackOutputSchema>;


export async function provideStoryFeedback(
  input: ProvideStoryFeedbackInput
): Promise<ProvideStoryFeedbackOutput> {
  return provideStoryFeedbackFlow(input);
}

const feedbackPrompt = ai.definePrompt({
  name: 'provideStoryFeedbackPrompt',
  input: {schema: ProvideStoryFeedbackInputSchema},
  output: {schema: ProvideStoryFeedbackOutputSchema},
  prompt: `You are an expert editor specializing in children's literature.
Review the following story draft and provide constructive feedback. Focus on:
1.  **Clarity and Simplicity**: Is the language easy for a child to understand?
2.  **Engagement**: Is the plot interesting? Is the pacing good?
3.  **Character**: Are the characters relatable and consistent?
4.  **Moral/Theme**: Is the message clear and positive?
5.  **Show, Don't Tell**: Does the author describe actions and feelings instead of just stating them?

Provide specific examples from the text to support your points and offer actionable suggestions for improvement.

Story Draft:
{{{storyDraft}}}
`,
});

const provideStoryFeedbackFlow = ai.defineFlow(
  {
    name: 'provideStoryFeedbackFlow',
    inputSchema: ProvideStoryFeedbackInputSchema,
    outputSchema: ProvideStoryFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await feedbackPrompt(input);
    if (!output) {
        throw new Error("Failed to get feedback from the AI model.");
    }
    return output;
  }
);
