import insforge from '@/lib/insforge/client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string | null
    industry: string | null
    experience_level: string | null
    location: string | null
    linkedin_url: string | null
    plan: 'free' | 'pro' | 'enterprise'
    onboarding_done: boolean
    created_at: string
    updated_at: string
}

export interface ResumeAnalysis {
    id: string
    user_id: string
    resume_id: string | null
    ats_score: number | null
    keywords_score: number | null
    formatting_score: number | null
    experience_score: number | null
    skills_score: number | null
    ai_suggestions: AISuggestion[]
    role_feedback: string | null
    industry_average: number | null
    target_role: string | null
    job_description: string | null
    created_at: string
    // joined
    file_name?: string
}

export interface AISuggestion {
    severity: 'Critical' | 'Important' | 'Suggested'
    headline: string
    explanation: string
    estimatedImpact: string
}

export interface JobMatch {
    id: string
    user_id: string
    job_title: string
    company_name: string | null
    location: string | null
    job_type: string | null
    industry: string | null
    experience_level: string | null
    match_percent: number | null
    description: string | null
    requirements: string[]
    match_reasons: string[]
    apply_url: string | null
    is_saved: boolean
    is_applied: boolean
    applied_at: string | null
    created_at: string
}

export interface InterviewAttempt {
    id: string
    user_id: string
    question_id: string
    user_answer: string | null
    clarity_score: number | null
    relevance_score: number | null
    depth_score: number | null
    overall_score: number | null
    feedback: string | null
    created_at: string
}

export interface InterviewSession {
    id: string
    user_id: string
    target_role: string | null
    industry: string | null
    interview_type: string | null
    difficulty: string | null
    question_count: number
    created_at: string
}

export interface InterviewQuestion {
    id: string
    user_id: string
    session_id: string | null
    question_text: string
    model_answer: string | null
    category: string | null
    difficulty: string | null
    is_saved: boolean
    created_at: string
}

export interface ActivityItem {
    id: string
    user_id: string
    tool: string
    action: string
    metadata: Record<string, unknown>
    seen: boolean
    created_at: string
}

export interface EducationRoadmap {
    id: string
    user_id: string
    program_id: string
    program_label: string | null
    timeline_months: number | null
    roadmap_data: RoadmapPhase[]
    exam_info: Record<string, string>
    university_shortlist: University[]
    created_at: string
    updated_at: string
}

export interface RoadmapPhase {
    month: string
    phase: string
    tasks: Array<{ text: string; done: boolean }>
    color: string
}

export interface University {
    name: string
    country: string
    program: string
    acceptance: string
    minScore: string
    tuition: string
}

export interface CareerAnalysis {
    id: string
    user_id: string
    target_role: string | null
    skill_radar: SkillRadarItem[]
    skill_gaps: SkillGap[]
    career_paths: CareerPath[]
    learning_recs: LearningRec[]
    action_plan: ActionPlan
    created_at: string
}

export interface SkillRadarItem { skill: string; value: number; benchmark: number }
export interface SkillGap { skill: string; current: number; target: number; severity: 'high' | 'medium' | 'low' }
export interface CareerPath { title: string; timeline: string; match_percent: number; required_skills: string[] }
export interface LearningRec { platform: string; course: string; duration: string; skill: string; url: string }
export interface ActionPlan { week1_2: string[]; month1: string[]; day90: string[] }

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(userId: string) {
    const db = insforge.database

    const [latestAnalysis, prevAnalysis, jobCount, weekJobCount, prevWeekJobCount, attemptCount, weekAttemptCount, prevWeekAttemptCount, profile] = await Promise.all([
        db.from('resume_analyses').select('ats_score, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        db.from('resume_analyses').select('ats_score').eq('user_id', userId).order('created_at', { ascending: false }).limit(2),
        db.from('job_matches').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        db.from('job_matches').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        db.from('job_matches').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date(Date.now() - 14 * 86400000).toISOString()).lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        db.from('interview_attempts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        db.from('interview_attempts').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        db.from('interview_attempts').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date(Date.now() - 14 * 86400000).toISOString()).lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        db.from('profiles').select('*').eq('id', userId).maybeSingle(),
    ])

    // Profile completion
    const p = profile.data as Profile | null
    const profileFields = ['full_name', 'avatar_url', 'role', 'industry', 'experience_level', 'location', 'linkedin_url', 'onboarding_done'] as const
    const filled = p ? profileFields.filter(f => p[f] !== null && p[f] !== false && p[f] !== '').length : 0
    const profileCompletion = Math.round((filled / 8) * 100)

    // ATS trend
    const analyses = (prevAnalysis.data as any[]) || []
    const atsScore = (latestAnalysis.data as any)?.ats_score ?? null
    const atsTrend = analyses.length >= 2 ? (analyses[0].ats_score ?? 0) - (analyses[1].ats_score ?? 0) : null

    // Job trend
    const jobTotal = jobCount.count ?? 0
    const jobThisWeek = weekJobCount.count ?? 0
    const jobLastWeek = prevWeekJobCount.count ?? 0
    const jobTrend = jobThisWeek - jobLastWeek

    // Attempt trend
    const attemptTotal = attemptCount.count ?? 0
    const attemptThisWeek = weekAttemptCount.count ?? 0
    const attemptLastWeek = prevWeekAttemptCount.count ?? 0
    const attemptTrend = attemptThisWeek - attemptLastWeek

    return { atsScore, atsTrend, jobTotal, jobTrend, attemptTotal, attemptTrend, profileCompletion, profile: p }
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
    const db = insforge.database
    const { data, error } = await db.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) {
        // Auto-create profile if missing (no data returned)
        if (!data) {
            await db.from('profiles').insert({ id: userId })
            const { data: newProfile } = await db.from('profiles').select('*').eq('id', userId).single()
            return (newProfile as Profile) ?? null
        }
        return null
    }
    return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    return insforge.database.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId)
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function getActivity(userId: string, limit = 20): Promise<ActivityItem[]> {
    const { data } = await insforge.database.from('user_activity').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
    return (data as ActivityItem[]) ?? []
}

export async function logActivity(userId: string, tool: string, action: string, metadata: Record<string, unknown> = {}) {
    await insforge.database.from('user_activity').insert({ user_id: userId, tool, action, metadata })
}

export async function getUnseenActivityCount(userId: string): Promise<number> {
    const { count } = await insforge.database.from('user_activity').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('seen', false)
    return count ?? 0
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export async function getResumeAnalyses(userId: string, limit = 5): Promise<ResumeAnalysis[]> {
    const { data } = await insforge.database
        .from('resume_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
    if (!data) return []

    // Fetch resume file names separately to avoid join compatibility issues
    const resumeIds = (data as any[]).map((d: any) => d.resume_id).filter(Boolean)
    let resumeMap: Record<string, string> = {}
    if (resumeIds.length > 0) {
        const { data: resumes } = await insforge.database
            .from('resumes')
            .select('id, file_name')
            .in('id', resumeIds)
        if (resumes) {
            resumeMap = Object.fromEntries((resumes as any[]).map((r: any) => [r.id, r.file_name]))
        }
    }

    return (data as any[]).map((d: any) => ({ ...d, file_name: resumeMap[d.resume_id] ?? null })) as ResumeAnalysis[]
}

export async function saveResumeAnalysis(analysis: Omit<ResumeAnalysis, 'id' | 'created_at'>) {
    const { data, error } = await insforge.database.from('resume_analyses').insert(analysis).select()
    if (error) throw error
    return (data as any[])[0] as ResumeAnalysis
}

export async function saveResume(userId: string, fileName: string, fileUrl: string, fileSize: number, targetRole: string) {
    const { data, error } = await insforge.database.from('resumes').insert({ user_id: userId, file_name: fileName, file_url: fileUrl, file_size: fileSize, target_role: targetRole }).select()
    if (error) throw error
    return (data as any[])[0]
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function getJobMatches(userId: string, limit = 20): Promise<JobMatch[]> {
    const { data } = await insforge.database.from('job_matches').select('*').eq('user_id', userId).order('match_percent', { ascending: false }).limit(limit)
    return (data as JobMatch[]) ?? []
}

export async function toggleSaveJob(userId: string, jobId: string, saved: boolean) {
    return insforge.database.from('job_matches').update({ is_saved: saved }).eq('id', jobId).eq('user_id', userId)
}

export async function toggleApplyJob(userId: string, jobId: string) {
    return insforge.database.from('job_matches').update({ is_applied: true, applied_at: new Date().toISOString() }).eq('id', jobId).eq('user_id', userId)
}

export async function getTopJobMatches(userId: string, limit = 3): Promise<JobMatch[]> {
    const { data } = await insforge.database.from('job_matches').select('*').eq('user_id', userId).order('match_percent', { ascending: false }).limit(limit)
    return (data as JobMatch[]) ?? []
}

// ─── Interview ────────────────────────────────────────────────────────────────

export async function saveInterviewSession(userId: string, role: string, industry: string, type: string, difficulty: string): Promise<InterviewSession> {
    const { data, error } = await insforge.database.from('interview_sessions').insert({ user_id: userId, target_role: role, industry, interview_type: type, difficulty }).select()
    if (error) throw error
    return (data as any[])[0] as InterviewSession
}

export async function saveInterviewQuestion(userId: string, sessionId: string, text: string, category: string, difficulty: string): Promise<InterviewQuestion> {
    const { data, error } = await insforge.database.from('interview_questions').insert({ user_id: userId, session_id: sessionId, question_text: text, category, difficulty }).select()
    if (error) throw error
    return (data as any[])[0] as InterviewQuestion
}

export async function saveInterviewAttempt(attempt: Omit<InterviewAttempt, 'id' | 'created_at'>): Promise<InterviewAttempt> {
    const { data, error } = await insforge.database.from('interview_attempts').insert(attempt).select()
    if (error) throw error
    return (data as any[])[0] as InterviewAttempt
}

export async function updateQuestionModelAnswer(questionId: string, answer: string) {
    return insforge.database.from('interview_questions').update({ model_answer: answer }).eq('id', questionId)
}

export async function toggleSaveQuestion(userId: string, questionId: string, saved: boolean) {
    return insforge.database.from('interview_questions').update({ is_saved: saved }).eq('id', questionId).eq('user_id', userId)
}

export async function getInterviewSessions(userId: string, limit = 10): Promise<InterviewSession[]> {
    const { data } = await insforge.database.from('interview_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
    return (data as InterviewSession[]) ?? []
}

export async function computeStreak(userId: string): Promise<number> {
    const { data } = await insforge.database.from('interview_attempts').select('created_at').eq('user_id', userId).order('created_at', { ascending: false })
    if (!data || data.length === 0) return 0
    const days = [...new Set((data as any[]).map(d => new Date(d.created_at).toDateString()))]
    let streak = 0
    const today = new Date()
    for (let i = 0; i < days.length; i++) {
        const d = new Date(days[i])
        const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
        if (diff === i) streak++
        else break
    }
    return streak
}

export async function getWeakAreas(userId: string): Promise<{ category: string; avgScore: number }[]> {
    const { data } = await insforge.database.from('interview_attempts').select('overall_score, question_id').eq('user_id', userId).lt('overall_score', 60)
    if (!data) return []
    // Simplified — category grouping without join
    return []
}

export async function getSavedQuestionsCount(userId: string): Promise<number> {
    const { count } = await insforge.database.from('interview_questions').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_saved', true)
    return count ?? 0
}

export async function getInterviewStats(userId: string) {
    const db = insforge.database
    const [generated, attempts, streak, savedCount] = await Promise.all([
        db.from('interview_questions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        db.from('interview_attempts').select('overall_score').eq('user_id', userId),
        computeStreak(userId),
        getSavedQuestionsCount(userId),
    ])
    const attemptsData = (attempts.data as any[]) ?? []
    const avg = attemptsData.length > 0 ? Math.round(attemptsData.reduce((s: number, a: any) => s + (a.overall_score ?? 0), 0) / attemptsData.length) : null
    const weakAreas = await getWeakAreas(userId)
    return { generated: generated.count ?? 0, answered: attemptsData.length, avgScore: avg, streak, weakAreas, savedCount }
}

// ─── Higher Education ──────────────────────────────────────────────────────────

export async function getLatestRoadmap(userId: string): Promise<EducationRoadmap | null> {
    const { data } = await insforge.database.from('education_roadmaps').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle()
    return (data as EducationRoadmap) ?? null
}

export async function getUserRoadmaps(userId: string): Promise<EducationRoadmap[]> {
    const { data } = await insforge.database.from('education_roadmaps').select('id, program_label, timeline_months, created_at').eq('user_id', userId).order('created_at', { ascending: false })
    return (data as EducationRoadmap[]) ?? []
}

export async function saveRoadmap(roadmap: Omit<EducationRoadmap, 'id' | 'created_at' | 'updated_at'>): Promise<EducationRoadmap> {
    const { data, error } = await insforge.database.from('education_roadmaps').insert(roadmap).select()
    if (error) throw error
    return (data as any[])[0] as EducationRoadmap
}

export async function updateRoadmapTasks(roadmapId: string, roadmapData: RoadmapPhase[]) {
    return insforge.database.from('education_roadmaps').update({ roadmap_data: roadmapData, updated_at: new Date().toISOString() }).eq('id', roadmapId)
}

// ─── Career Intelligence ───────────────────────────────────────────────────────

export async function getLatestCareerAnalysis(userId: string): Promise<CareerAnalysis | null> {
    const { data } = await insforge.database.from('career_analyses').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle()
    return (data as CareerAnalysis) ?? null
}

export async function saveCareerAnalysis(analysis: Omit<CareerAnalysis, 'id' | 'created_at'>): Promise<CareerAnalysis> {
    const { data, error } = await insforge.database.from('career_analyses').insert(analysis).select()
    if (error) throw error
    return (data as any[])[0] as CareerAnalysis
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Deterministic color from UUID — always same color per user */
export function getAvatarColor(uuid: string): string {
    const colors = [
        '#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6',
        '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6', '#F97316',
    ]
    let hash = 0
    for (let i = 0; i < uuid.length; i++) {
        hash = uuid.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

/** Relative timestamp formatter */
export function relativeTime(iso: string): string {
    const now = Date.now()
    const then = new Date(iso).getTime()
    const diff = now - then
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
