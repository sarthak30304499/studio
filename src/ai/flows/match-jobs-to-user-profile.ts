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
  jobUrl: z.string().url().describe('The URL to the full job posting (MUST BE A REAL URL).').optional(),
  jobType: z.string().describe('e.g., Full-Time, Internship, Contract.').optional(),
  requirements: z.array(z.string()).describe('List of key requirements or qualifications for the job.').optional(),
  matchReasons: z.array(z.string()).describe('List of reasons why the user matches this job well based on their resume.').optional(),
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

CRITICAL INSTRUCTIONS:
1. Identify the user's skills and their target roles from the provided resume text.
2. Search and discover REAL, LIVE job or internship opportunities online that match the user's profile.
3. For each job, return a realistic 'jobUrl' pointing to an application page or the company's careers site. DO NOT hallucinate fake URLs.
4. Extracted descriptions, requirements, and match reasons must be realistic and tailored to the actual user's resume strengths.
5. Provide around 5-10 strong matches.

Based on this information, provide a list of highly relevant job opportunities.`,
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
