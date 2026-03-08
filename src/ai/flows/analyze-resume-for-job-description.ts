'use server';

import insforge from '@/lib/insforge/client'

export interface AnalyzeResumeForJobInput {
  resumeDataUri: string
  jobDescription: string
  targetRole: string
}

export interface AnalyzeResumeForJobOutput {
  atsScore: number
  suggestions: Array<{
    severity: 'Critical' | 'Important' | 'Suggested'
    headline: string
    explanation: string
    estimatedImpact: string
  }>
}

export async function analyzeResumeForJob(input: AnalyzeResumeForJobInput): Promise<AnalyzeResumeForJobOutput> {
  const { resumeDataUri, jobDescription, targetRole } = input

  const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the provided resume against the job description and target role.

Provide:
1. An ATS compatibility score (0-100)
2. A list of specific, actionable suggestions

Target Role: ${targetRole}
Job Description: ${jobDescription}

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "atsScore": <number 0-100>,
  "suggestions": [
    {
      "severity": "Critical" | "Important" | "Suggested",
      "headline": "<concise summary>",
      "explanation": "<detailed explanation of what to do and why>",
      "estimatedImpact": "<e.g. Could improve score by +5 pts>"
    }
  ]
}`

  const completion = await insforge.ai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'file',
            file: {
              filename: 'resume.pdf',
              file_data: resumeDataUri,
            },
          } as any,
        ],
      },
    ],
    fileParser: { enabled: true },
  })

  const content = completion.choices[0].message.content

  // Parse JSON response
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('AI returned invalid response format')
  }

  const result = JSON.parse(jsonMatch[0]) as AnalyzeResumeForJobOutput

  // Validate and clamp score
  result.atsScore = Math.max(0, Math.min(100, Math.round(result.atsScore)))
  if (!Array.isArray(result.suggestions)) result.suggestions = []

  return result
}
