import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-resume-for-job-description.ts';
import '@/ai/flows/match-jobs-to-user-profile.ts';
import '@/ai/flows/analyze-skill-gaps-and-recommend-learning-flow.ts';
import '@/ai/flows/generate-higher-ed-roadmap.ts';
import '@/ai/flows/practice-interview-with-ai-flow.ts';