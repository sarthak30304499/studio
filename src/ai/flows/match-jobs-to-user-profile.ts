'use server';
/**
 * @fileOverview A Genkit flow for matching job seekers to relevant job opportunities.
 *
 * - matchJobsToUserProfile - A function that handles the job matching process.
 * - MatchJobsToUserProfileInput - The input type for the matchJobsToUserProfile function.
 * - MatchJobsToUserProfileOutput - The return type for the matchJobsToUserProfile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MatchJobsToUserProfileInputSchema = z.object({
  resumeText: z
    .string()
    .describe("The user's resume content as plain text."),
  targetRoles: z
    .array(z.string())
    .describe("A list of job roles the user is targeting.")
    .default([]),
  industryPreferences: z
    .array(z.string())
    .describe("A list of preferred industries for job opportunities.")
    .default([]),
  experienceLevel: z
    .string()
    .describe("The user's experience level (e.g., 'Entry Level', 'Mid Level', 'Senior')."),
  jobTypePreferences: z
    .array(z.string())
    .describe("A list of preferred job types (e.g., 'Full-Time', 'Part-Time', 'Internship', 'Remote').")
    .default([]),
});
export type MatchJobsToUserProfileInput = z.infer<
  typeof MatchJobsToUserProfileInputSchema
>;

const JobMatchSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The company offering the job.'),
  location: z.string().describe('The job location (e.g., city, state, remote).'),
  description: z.string().describe('A brief description of the job.'),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A percentage indicating how well the job matches the user profile.'),
  jobUrl: z.string().url().describe('The URL to the full job posting.').optional(),
});

const MatchJobsToUserProfileOutputSchema = z.object({
  jobs: z.array(JobMatchSchema).describe('A list of matched job opportunities. Can be empty if no jobs are found.'),
});
export type MatchJobsToUserProfileOutput = z.infer<
  typeof MatchJobsToUserProfileOutputSchema
>;

export async function matchJobsToUserProfile(
  input: MatchJobsToUserProfileInput,
): Promise<MatchJobsToUserProfileOutput> {
  return matchJobsToUserProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchJobsToUserProfilePrompt',
  input: { schema: MatchJobsToUserProfileInputSchema },
  output: { schema: MatchJobsToUserProfileOutputSchema },
  prompt: `You are an expert career advisor and job matching AI.
Your task is to analyze a user's resume, their target roles, industry preferences, experience level, and preferred job types to suggest highly relevant job and internship opportunities.

Critically evaluate the user's profile against potential job requirements and provide a match score for each suggested job.
Ensure that the suggested jobs are diverse in terms of companies and roles, but all are highly relevant to the user's input criteria.

If no highly relevant jobs are found, return an empty array for 'jobs'.

User's Resume:
"""
{{{resumeText}}}
"""

User's Target Roles: {{{targetRoles.join(', ')}}
User's Industry Preferences: {{{industryPreferences.join(', ')}}
User's Experience Level: {{{experienceLevel}}}
User's Job Type Preferences: {{{jobTypePreferences.join(', ')}}

Based on this information, provide a list of highly relevant job opportunities, including a title, company, location, a brief description, a match score (0-100), and an optional job URL.`,
});

const matchJobsToUserProfileFlow = ai.defineFlow(
  {
    name: 'matchJobsToUserProfileFlow',
    inputSchema: MatchJobsToUserProfileInputSchema,
    outputSchema: MatchJobsToUserProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
