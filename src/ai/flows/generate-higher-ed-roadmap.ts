'use server';
/**
 * @fileOverview A Genkit flow for generating personalized higher education roadmaps.
 *
 * - generateHigherEdRoadmap - A function that handles the generation of a higher education roadmap.
 * - GenerateHigherEdRoadmapInput - The input type for the generateHigherEdRoadmap function.
 * - GenerateHigherEdRoadmapOutput - The return type for the generateHigherEdRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateHigherEdRoadmapInputSchema = z.object({
  goal: z.string().describe('The higher education goal (e.g., "MS Abroad (USA / UK / Canada / Europe / Australia)", "MBA (CAT / GMAT / Top Business Schools)", "GATE (PSU / M.Tech in India)", "Law School (LLM Abroad / National Law)", "Medical / Healthcare Graduate Programs").'),
  currentAcademicScore: z.string().describe('The user\'s current academic score (e.g., "8.5 CGPA", "90%").'),
  targetProgramsOrUniversities: z.string().describe('Freeform text describing target programs or universities, if any.'),
  preparationTimeline: z.string().describe('The desired preparation timeline (e.g., "3 months", "1 year").'),
});
export type GenerateHigherEdRoadmapInput = z.infer<typeof GenerateHigherEdRoadmapInputSchema>;

// Output Schema
const RoadmapResourceRecommendationSchema = z.object({
  name: z.string().describe('Name of the resource (e.g., "Official GRE Guide").'),
  url: z.string().url().describe('URL to the resource.'),
});

const RoadmapNodeSchema = z.object({
  phaseLabel: z.string().describe('Label for the roadmap phase (e.g., "Month 1-2: Build Foundations").'),
  tasks: z.array(z.string()).describe('List of tasks to complete during this phase.'),
  resourceRecommendations: z.array(RoadmapResourceRecommendationSchema).describe('Recommended resources for this phase.'),
});

const ExamIntelligenceSchema = z.object({
  keyDates: z.array(z.string()).describe('Important dates related to exams or applications.'),
  eligibilityCriteria: z.array(z.string()).describe('Criteria for eligibility for the target program/exam.'),
  fees: z.string().describe('Estimated fees for exams or applications.'),
  scoreValidity: z.string().describe('How long the exam score is valid.'),
  historicalCutoffs: z.array(z.string()).describe('Historical cutoff scores for competitive programs.'),
});

const UniversityShortlistEntrySchema = z.object({
  universityName: z.string().describe('Name of the university.'),
  countryFlagTag: z.string().describe('Country where the university is located (e.g., "USA", "UK").'),
  programName: z.string().describe('Name of the program at the university.'),
  acceptanceRate: z.string().describe('Estimated acceptance rate (e.g., "15%").'),
  minScoreRequirement: z.string().describe('Minimum score requirement for the program (e.g., "320 GRE", "7.0 IELTS").'),
  learnMoreUrl: z.string().url().describe('URL for more information about the program.'),
});

const GenerateHigherEdRoadmapOutputSchema = z.object({
  roadmap: z.array(RoadmapNodeSchema).describe('A vertical timeline roadmap with phases, tasks, and resources.'),
  examIntelligence: ExamIntelligenceSchema.describe('Key dates, eligibility, fees, score validity, and historical cutoffs for relevant exams/programs.'),
  universityShortlist: z.array(UniversityShortlistEntrySchema).describe('A shortlist of suitable universities with program details.'),
});
export type GenerateHigherEdRoadmapOutput = z.infer<typeof GenerateHigherEdRoadmapOutputSchema>;

export async function generateHigherEdRoadmap(
  input: GenerateHigherEdRoadmapInput
): Promise<GenerateHigherEdRoadmapOutput> {
  return generateHigherEdRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'higherEdRoadmapPrompt',
  input: { schema: GenerateHigherEdRoadmapInputSchema },
  output: { schema: GenerateHigherEdRoadmapOutputSchema },
  prompt: `You are an expert higher education counselor and career strategist. Your goal is to provide a detailed, actionable, and personalized roadmap for a student aiming for higher education.\n\nBased on the user's specific goals, current academic standing, target preferences, and desired timeline, generate a comprehensive higher education roadmap.\n\n**User Information:**\n- Higher Education Goal: {{{goal}}}\n- Current Academic Score: {{{currentAcademicScore}}}\n- Target Programs or Universities: {{{targetProgramsOrUniversities}}}\n- Desired Preparation Timeline: {{{preparationTimeline}}}\n\n**Instructions:**\n1.  **Roadmap (Timeline):** Create a vertical timeline divided into logical phases based on the 'Desired Preparation Timeline'. For each phase, list 4-6 specific tasks and 2-3 relevant resource recommendations with URLs.\n2.  **Exam Intelligence:** Provide crucial information about relevant standardized tests or application processes, including key dates, eligibility criteria, estimated fees, score validity, and historical cutoff scores for competitive programs, if applicable to the user's goal. If not applicable, provide a short "N/A" for these fields.\n3.  **University Shortlist:** Suggest 3-5 suitable universities or programs based on the user's goal and preferences. For each, include its name, country, specific program name, estimated acceptance rate, minimum score requirements (e.g., GRE, IELTS, GPA), and a 'Learn More' URL. Ensure the universities are realistic given typical profiles for the stated goal.\n\nEnsure all URLs are valid and functional, pointing to official or highly reputable sources (e.g., university websites, official exam bodies, well-known educational platforms). Prioritize accuracy and relevance.\n`
});

const generateHigherEdRoadmapFlow = ai.defineFlow(
  {
    name: 'generateHigherEdRoadmapFlow',
    inputSchema: GenerateHigherEdRoadmapInputSchema,
    outputSchema: GenerateHigherEdRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate higher education roadmap.');
    }
    return output;
  }
);
