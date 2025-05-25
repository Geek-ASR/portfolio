// 'use server';

/**
 * @fileOverview AI-powered resume enhancement flow.
 *
 * This file defines a Genkit flow that analyzes resume content and provides suggestions for improvements.
 * It includes functionalities for identifying missing skills, suggesting better phrasing, and optimizing
 * the resume for specific job roles.
 *
 * @exports resumeEnhancement - A function that triggers the resume enhancement flow.
 * @exports ResumeEnhancementInput - The input type for the resumeEnhancement function.
 * @exports ResumeEnhancementOutput - The output type for the resumeEnhancement function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeEnhancementInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  jobDescription: z
    .string()
    .optional()
    .describe('Optional job description to tailor the resume towards.'),
});
export type ResumeEnhancementInput = z.infer<typeof ResumeEnhancementInputSchema>;

const ResumeEnhancementOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions for improving the resume.'),
});
export type ResumeEnhancementOutput = z.infer<typeof ResumeEnhancementOutputSchema>;

export async function resumeEnhancement(input: ResumeEnhancementInput): Promise<ResumeEnhancementOutput> {
  return resumeEnhancementFlow(input);
}

const resumeEnhancementPrompt = ai.definePrompt({
  name: 'resumeEnhancementPrompt',
  input: {schema: ResumeEnhancementInputSchema},
  output: {schema: ResumeEnhancementOutputSchema},
  prompt: `You are an AI resume expert. Analyze the provided resume content and provide specific, actionable suggestions for improvement.

Resume Content:
{{resumeContent}}

Job Description (if available):
{{#if jobDescription}}
{{jobDescription}}
{{else}}
No specific job description provided. Provide general suggestions.
{{/if}}

Suggestions should include:
- Identifying missing skills relevant to the resume content or job description.
- Suggesting better phrasing for existing content.
- Optimizing the resume for the provided job role, if applicable.

Return your suggestions as a list of strings.
`,
});

const resumeEnhancementFlow = ai.defineFlow(
  {
    name: 'resumeEnhancementFlow',
    inputSchema: ResumeEnhancementInputSchema,
    outputSchema: ResumeEnhancementOutputSchema,
  },
  async input => {
    const {output} = await resumeEnhancementPrompt(input);
    return output!;
  }
);
