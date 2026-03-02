'use server';
/**
 * @fileOverview An AI agent that analyzes a user's current skills against a desired career path,
 * identifying skill gaps and recommending learning resources.
 *
 * - analyzeSkillGapsAndRecommendLearning - A function that handles the skill gap analysis and learning recommendation process.
 * - AnalyzeSkillGapsAndRecommendLearningInput - The input type for the analyzeSkillGapsAndRecommendLearning function.
 * - AnalyzeSkillGapsAndRecommendLearningOutput - The return type for the analyzeSkillGapsAndRecommendLearning function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSkillGapsAndRecommendLearningInputSchema = z.object({
  currentSkills: z
    .string()
    .describe("A detailed description of the user's current skills and experience."),
  desiredCareerPath: z
    .string()
    .describe("A detailed description of the user's desired career path, including target roles and industry."),
});
export type AnalyzeSkillGapsAndRecommendLearningInput = z.infer<
  typeof AnalyzeSkillGapsAndRecommendLearningInputSchema
>;

const AnalyzeSkillGapsAndRecommendLearningOutputSchema = z.object({
  skillGaps: z
    .array(
      z.object({
        skillName: z.string().describe('The name of the skill.'),
        currentLevel: z
          .string()
          .describe("A string describing the user's current proficiency."),
        requiredLevel: z
          .string()
          .describe(
            'A string describing the proficiency needed for the desired career path.'
          ),
        gapSeverity: z
          .enum(['Critical', 'Moderate', 'Low'])
          .describe("The severity of the skill gap (e.g., 'Critical', 'Moderate', 'Low')."),
      })
    )
    .describe('A list of identified skill gaps.'),
  learningRecommendations: z
    .array(
      z.object({
        resourceName: z
          .string()
          .describe('The name of the learning resource (e.g., course, book, platform).'),
        resourceLink: z.string().url().describe('A URL to the learning resource.'),
        skillsAddressed: z
          .array(z.string())
          .describe('A list of skills the resource helps develop.'),
        type: z
          .string()
          .describe(
            "The type of resource (e.g., 'Course', 'Book', 'Certification', 'Platform', 'Article')."
          ),
      })
    )
    .describe('A list of recommended learning resources.'),
});
export type AnalyzeSkillGapsAndRecommendLearningOutput = z.infer<
  typeof AnalyzeSkillGapsAndRecommendLearningOutputSchema
>;

export async function analyzeSkillGapsAndRecommendLearning(
  input: AnalyzeSkillGapsAndRecommendLearningInput
): Promise<AnalyzeSkillGapsAndRecommendLearningOutput> {
  return analyzeSkillGapsAndRecommendLearningFlow(input);
}

const analyzeSkillGapsAndRecommendLearningPrompt = ai.definePrompt({
  name: 'analyzeSkillGapsAndRecommendLearningPrompt',
  input: { schema: AnalyzeSkillGapsAndRecommendLearningInputSchema },
  output: { schema: AnalyzeSkillGapsAndRecommendLearningOutputSchema },
  prompt: `You are an expert career intelligence AI assistant. Your task is to analyze a professional's current skills and compare them against their desired career path to identify skill gaps and recommend relevant learning resources.\n\nUser's current skills:\n{{{currentSkills}}}\n\nUser's desired career path:\n{{{desiredCareerPath}}}\n\nBased on the information provided, perform the following:\n1. Identify specific skill gaps by comparing the user's current skills with the requirements of their desired career path. For each gap, state the skill name, the user's current proficiency level, the required proficiency level, and categorize the gap severity as 'Critical', 'Moderate', or 'Low'.\n2. Provide a list of actionable learning recommendations, including the resource name, a direct URL link to the resource, a list of skills it helps address, and the type of resource (e.g., 'Course', 'Book', 'Certification', 'Platform', 'Article'). Focus on high-quality and relevant resources that directly help close the identified skill gaps.`,
});

const analyzeSkillGapsAndRecommendLearningFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapsAndRecommendLearningFlow',
    inputSchema: AnalyzeSkillGapsAndRecommendLearningInputSchema,
    outputSchema: AnalyzeSkillGapsAndRecommendLearningOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeSkillGapsAndRecommendLearningPrompt(input);
    if (!output) {
      throw new Error('No output received from the prompt.');
    }
    return output;
  }
);
