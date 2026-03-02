'use server';
/**
 * @fileOverview An AI agent that analyzes a user's resume against a target job description,
 * providing an ATS compatibility score and actionable improvement suggestions.
 *
 * - analyzeResumeForJob - A function that handles the resume analysis process.
 * - AnalyzeResumeForJobInput - The input type for the analyzeResumeForJob function.
 * - AnalyzeResumeForJobOutput - The return type for the analyzeResumeForJob function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestionSchema = z.object({
  severity: z.enum(['Critical', 'Important', 'Suggested']).describe('The severity of the suggestion: Critical, Important, or Suggested.'),
  headline: z.string().describe('A concise summary of the suggestion.'),
  explanation: z.string().describe('A detailed explanation of how to implement the suggestion and why it is important.'),
  estimatedImpact: z.string().describe('An estimated impact on the ATS score, e.g., "Could improve score by +5 pts".'),
});

const AnalyzeResumeForJobInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The user's resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().describe('The full text of the target job description.'),
  targetRole: z.string().describe('The specific role the user is targeting, e.g., "Product Manager" or "Software Engineer".'),
});
export type AnalyzeResumeForJobInput = z.infer<typeof AnalyzeResumeForJobInputSchema>;

const AnalyzeResumeForJobOutputSchema = z.object({
  atsScore: z.number().min(0).max(100).describe('An ATS (Applicant Tracking System) compatibility score for the resume against the job description (0-100).'),
  suggestions: z.array(SuggestionSchema).describe('A list of actionable suggestions to improve the resume for the target role.'),
});
export type AnalyzeResumeForJobOutput = z.infer<typeof AnalyzeResumeForJobOutputSchema>;

export async function analyzeResumeForJob(input: AnalyzeResumeForJobInput): Promise<AnalyzeResumeForJobOutput> {
  return analyzeResumeForJobFlow(input);
}

const analyzeResumeForJobPrompt = ai.definePrompt({
  name: 'analyzeResumeForJobPrompt',
  input: { schema: AnalyzeResumeForJobInputSchema },
  output: { schema: AnalyzeResumeForJobOutputSchema },
  prompt: `You are an expert ATS (Applicant Tracking System) and career coach. Your task is to analyze a given resume against a specific job description and target role.

Your goal is to provide a comprehensive ATS compatibility score (out of 100) and actionable, highly specific suggestions to improve the resume for that particular role.

Analyze the resume carefully for keywords, formatting, structure, and relevance to the job description. Identify what is missing or could be better articulated to maximize ATS parsability and recruiter appeal.

Provide the ATS compatibility score as a number between 0 and 100. Then, generate a list of suggestions. Each suggestion must include a 'severity' (Critical, Important, or Suggested), a 'headline' summarizing the suggestion, a detailed 'explanation' of what to do and why, and an 'estimatedImpact' on the score if implemented.

Target Role: {{{targetRole}}}
Job Description: {{{jobDescription}}}
Resume: {{media url=resumeDataUri}}
`,
});

const analyzeResumeForJobFlow = ai.defineFlow(
  {
    name: 'analyzeResumeForJobFlow',
    inputSchema: AnalyzeResumeForJobInputSchema,
    outputSchema: AnalyzeResumeForJobOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeResumeForJobPrompt(input);
    return output!;
  }
);
