'use server';
/**
 * @fileOverview An AI-powered interview intelligence system that can generate practice questions,
 * provide model answers, and offer feedback on user responses.
 *
 * - practiceInterviewWithAI - A function that orchestrates the interview practice process.
 * - PracticeInterviewInput - The input type for the practiceInterviewWithAI function.
 * - PracticeInterviewOutput - The return type for the practiceInterviewWithAI function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Defines the possible interview types.
 */
const InterviewTypeSchema = z.enum(['Technical', 'Behavioral', 'HR', 'Case Study', 'All']);

/**
 * Defines the possible difficulty levels for interview questions.
 */
const DifficultySchema = z.enum(['Foundational', 'Intermediate', 'Advanced', 'Expert']);

/**
 * Input schema for the main practiceInterviewWithAI flow.
 * It includes parameters for generating questions, model answers, and user feedback.
 */
const PracticeInterviewInputSchema = z.object({
  action: z
    .enum(['generateQuestion', 'getModelAnswer', 'getFeedback'])
    .describe('The action to perform: generate a question, get a model answer, or get feedback on a user answer.'),
  targetRole: z
    .string()
    .describe('The target role for the interview (e.g., "Software Engineer", "Product Manager").'),
  industry: z
    .string()
    .describe('The industry for the interview (e.g., "Technology", "Finance").'),
  interviewType: InterviewTypeSchema.describe('The type of interview.'),
  difficulty: DifficultySchema.describe('The difficulty level for questions.'),

  // Optional: Required for getModelAnswer and getFeedback actions
  question: z.string().optional().describe('The interview question if the action is to get a model answer or feedback.'),
  // Optional: Required for getFeedback action
  userAnswer: z.string().optional().describe('The user\'s response to the interview question if the action is to get feedback.'),
});
export type PracticeInterviewInput = z.infer<typeof PracticeInterviewInputSchema>;

/**
 * Output schema for the main practiceInterviewWithAI flow.
 * Fields are optional as they depend on the 'actionPerformed' field.
 */
const PracticeInterviewOutputSchema = z.object({
  actionPerformed: z
    .enum(['questionGenerated', 'modelAnswerProvided', 'feedbackProvided'])
    .describe('The action that was performed by the AI.'),

  // Fields specific to 'generateQuestion' action
  generatedQuestion: z.string().optional().describe('A generated interview question.'),
  generatedQuestionType: InterviewTypeSchema.optional().describe('The type of the generated question.'),
  generatedQuestionDifficulty: DifficultySchema.optional().describe('The difficulty of the generated question.'),

  // Fields specific to 'getModelAnswer' action
  modelAnswer: z
    .string()
    .optional()
    .describe('A model answer for the given question. For behavioral questions, use the STAR format (Situation, Task, Action, Result).'),

  // Fields specific to 'getFeedback' action
  feedback: z
    .string()
    .optional()
    .describe('Detailed AI feedback on the user\'s response, focusing on clarity, relevance, and depth. Provide actionable advice.'),
  clarityScore: z.number().optional().describe('A score for clarity of the user\'s answer (0-100).'),
  relevanceScore: z.number().optional().describe('A score for relevance of the user\'s answer to the question (0-100).'),
  depthScore: z.number().optional().describe('A score for depth and insight of the user\'s answer (0-100).'),
});
export type PracticeInterviewOutput = z.infer<typeof PracticeInterviewOutputSchema>;

// --- Schemas for generateQuestionPrompt --- //
const GenerateQuestionInputSchema = z.object({
  targetRole: z.string().describe('The target role for the interview.'),
  industry: z.string().describe('The industry for the interview.'),
  interviewType: InterviewTypeSchema.describe('The type of interview.'),
  difficulty: DifficultySchema.describe('The difficulty level for questions.'),
});
const GenerateQuestionOutputSchema = z.object({
  generatedQuestion: z.string().describe('A generated interview question.'),
  generatedQuestionType: InterviewTypeSchema.describe('The type of the generated question.'),
  generatedQuestionDifficulty: DifficultySchema.describe('The difficulty of the generated question.'),
});

// --- Schemas for generateModelAnswerPrompt --- //
const GenerateModelAnswerInputSchema = z.object({
  question: z.string().describe('The interview question for which to generate a model answer.'),
  targetRole: z.string().describe('The target role for the interview.'),
  industry: z.string().describe('The industry for the interview.'),
  interviewType: InterviewTypeSchema.describe('The type of interview.'),
  difficulty: DifficultySchema.describe('The difficulty level of the question.'),
});
const GenerateModelAnswerOutputSchema = z.object({
  modelAnswer: z.string().describe('A model answer for the given question. For behavioral questions, use the STAR format (Situation, Task, Action, Result).'),
});

// --- Schemas for getFeedbackPrompt --- //
const GetFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question the user responded to.'),
  userAnswer: z.string().describe('The user\'s response to the interview question.'),
  targetRole: z.string().describe('The target role for the interview.'),
  industry: z.string().describe('The industry for the interview.'),
  interviewType: InterviewTypeSchema.describe('The type of interview.'),
  difficulty: DifficultySchema.describe('The difficulty level of the question.'),
});
const GetFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed AI feedback on the user\'s response, focusing on clarity, relevance, and depth. Provide actionable advice.'),
  clarityScore: z.number().describe('A score for clarity of the user\'s answer (0-100).'),
  relevanceScore: z.number().describe('A score for relevance of the user\'s answer to the question (0-100).'),
  depthScore: z.number().describe('A score for depth and insight of the user\'s answer (0-100).'),
});

/**
 * Defines a prompt to generate a single interview question based on role, industry, type, and difficulty.
 */
const generateQuestionPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionPrompt',
  input: { schema: GenerateQuestionInputSchema },
  output: { schema: GenerateQuestionOutputSchema },
  prompt: `You are an expert interview coach. Your task is to generate a single interview question.

Based on the following criteria, generate ONE interview question. Ensure the question is relevant to the target role and industry, and matches the specified interview type and difficulty.

Target Role: {{{targetRole}}}
Industry: {{{industry}}}
Interview Type: {{{interviewType}}}
Difficulty: {{{difficulty}}}

Provide only the generated question and its type and difficulty in the specified JSON format. Do not include any conversational text or explanations.`,
});

/**
 * Defines a prompt to generate a model answer for a given interview question.
 */
const generateModelAnswerPrompt = ai.definePrompt({
  name: 'generateModelAnswerPrompt',
  input: { schema: GenerateModelAnswerInputSchema },
  output: { schema: GenerateModelAnswerOutputSchema },
  prompt: `You are an expert interview coach. Your task is to provide a comprehensive model answer for a given interview question.

Provide a model answer for the following question, tailored to the target role and industry. For behavioral questions, structure the answer using the STAR method (Situation, Task, Action, Result). For technical or case study questions, provide a clear, step-by-step solution or explanation.

Target Role: {{{targetRole}}}
Industry: {{{industry}}}
Interview Type: {{{interviewType}}}
Difficulty: {{{difficulty}}}
Question: "{{{question}}}"

Provide only the model answer in the specified JSON format. Do not include any conversational text or explanations.`,
});

/**
 * Defines a prompt to provide feedback on a user's interview answer.
 */
const getFeedbackPrompt = ai.definePrompt({
  name: 'getInterviewFeedbackPrompt',
  input: { schema: GetFeedbackInputSchema },
  output: { schema: GetFeedbackOutputSchema },
  prompt: `You are an expert interview coach providing feedback on a user's answer.

Evaluate the user's response to the interview question based on the following criteria: clarity, relevance, and depth. Provide a detailed feedback summary and assign a score (0-100) for each criterion. Offer constructive advice for improvement.

Target Role: {{{targetRole}}}
Industry: {{{industry}}}
Interview Type: {{{interviewType}}}
Difficulty: {{{difficulty}}}
Question: "{{{question}}}"
User's Answer: "{{{userAnswer}}}"

Provide the feedback and scores in the specified JSON format. Do not include any conversational text or explanations.`,
});

/**
 * Implements the core logic for the interview intelligence system.
 * This flow orchestrates different AI interactions (generating questions, model answers, or feedback)
 * based on the 'action' provided in the input.
 */
const practiceInterviewWithAIFlow = ai.defineFlow(
  {
    name: 'practiceInterviewWithAIFlow',
    inputSchema: PracticeInterviewInputSchema,
    outputSchema: PracticeInterviewOutputSchema,
  },
  async (input) => {
    switch (input.action) {
      case 'generateQuestion': {
        const { output } = await generateQuestionPrompt({
          targetRole: input.targetRole,
          industry: input.industry,
          interviewType: input.interviewType,
          difficulty: input.difficulty,
        });
        if (!output) {
          throw new Error('Failed to generate question.');
        }
        return {
          actionPerformed: 'questionGenerated',
          generatedQuestion: output.generatedQuestion,
          generatedQuestionType: output.generatedQuestionType,
          generatedQuestionDifficulty: output.generatedQuestionDifficulty,
        };
      }
      case 'getModelAnswer': {
        if (!input.question) {
          throw new Error('Question is required for getModelAnswer action.');
        }
        const { output } = await generateModelAnswerPrompt({
          question: input.question,
          targetRole: input.targetRole,
          industry: input.industry,
          interviewType: input.interviewType,
          difficulty: input.difficulty,
        });
        if (!output) {
          throw new Error('Failed to generate model answer.');
        }
        return {
          actionPerformed: 'modelAnswerProvided',
          modelAnswer: output.modelAnswer,
        };
      }
      case 'getFeedback': {
        if (!input.question || !input.userAnswer) {
          throw new Error('Question and userAnswer are required for getFeedback action.');
        }
        const { output } = await getFeedbackPrompt({
          question: input.question,
          userAnswer: input.userAnswer,
          targetRole: input.targetRole,
          industry: input.industry,
          interviewType: input.interviewType,
          difficulty: input.difficulty,
        });
        if (!output) {
          throw new Error('Failed to get feedback.');
        }
        return {
          actionPerformed: 'feedbackProvided',
          feedback: output.feedback,
          clarityScore: output.clarityScore,
          relevanceScore: output.relevanceScore,
          depthScore: output.depthScore,
        };
      }
      default:
        throw new Error(`Unknown action: ${input.action}`);
    }
  }
);

/**
 * Wrapper function to call the practiceInterviewWithAIFlow.
 * @param input - The input for the interview practice, including the desired action and context.
 * @returns The output of the AI interaction based on the action performed.
 */
export async function practiceInterviewWithAI(
  input: PracticeInterviewInput
): Promise<PracticeInterviewOutput> {
  return practiceInterviewWithAIFlow(input);
}
