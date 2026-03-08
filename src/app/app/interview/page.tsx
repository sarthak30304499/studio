"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/supabase/auth-provider"
import {
  saveInterviewSession, saveInterviewQuestion, saveInterviewAttempt,
  updateQuestionModelAnswer, toggleSaveQuestion, getInterviewStats,
  getInterviewSessions, logActivity, relativeTime,
  type InterviewSession, type InterviewQuestion, type InterviewAttempt
} from "@/lib/supabase/db"
import { practiceInterviewWithAI } from "@/ai/flows/practice-interview-with-ai-flow"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Send, RotateCcw, Lightbulb, Flame, BookmarkCheck, Bookmark, ChevronDown, ChevronUp } from "lucide-react"

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Foundational: "var(--dash-green)", Intermediate: "var(--dash-amber)",
  Advanced: "var(--dash-red)", Expert: "#8B5CF6"
}

export default function InterviewPrepPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()

  const [role, setRole] = useState(profile?.role ?? "Software Engineer")
  const [industry, setIndustry] = useState(profile?.industry ?? "Technology")
  const [type, setType] = useState("Technical")
  const [difficulty, setDifficulty] = useState("Intermediate")

  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [questionText, setQuestionText] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [attempt, setAttempt] = useState<InterviewAttempt | null>(null)
  const [modelAnswer, setModelAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)

  const [stage, setStage] = useState<"config" | "practice" | "feedback">("config")
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [showStats, setShowStats] = useState(true)

  useEffect(() => {
    if (profile?.role) setRole(profile.role)
    if (profile?.industry) setIndustry(profile.industry)
  }, [profile])

  const loadStats = useCallback(async () => {
    if (!user?.id) return
    setStatsLoading(true)
    try {
      const [s, sess] = await Promise.all([getInterviewStats(user.id), getInterviewSessions(user.id, 5)])
      setStats(s)
      setSessions(sess)
    } finally {
      setStatsLoading(false)
    }
  }, [user?.id])

  useEffect(() => { loadStats() }, [loadStats])

  const handleGenerate = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const session = await saveInterviewSession(user.id, role, industry, type, difficulty)
      setCurrentSession(session)

      const res = await practiceInterviewWithAI({ action: "generateQuestion", targetRole: role, industry, interviewType: type, difficulty })
      const qText = res.generatedQuestion ?? ""
      const question = await saveInterviewQuestion(user.id, session.id, qText, type, difficulty)
      setCurrentQuestion(question)
      setQuestionText(qText)
      setStage("practice")
      setUserAnswer("")
      setAttempt(null)
      setModelAnswer("")
      setShowAnswer(false)
      await logActivity(user.id, "interview", `Started ${difficulty} ${type} session for ${role}`)
      await loadStats()
    } catch {
      toast({ title: "Generation failed", description: "Could not generate a question. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleGetFeedback = async () => {
    if (!userAnswer.trim() || !user?.id || !currentQuestion) return
    setLoading(true)
    try {
      const res = await practiceInterviewWithAI({ action: "getFeedback", targetRole: role, industry, interviewType: type, difficulty, question: questionText, userAnswer })
      const overall = Math.round(((res.clarityScore ?? 0) + (res.relevanceScore ?? 0) + (res.depthScore ?? 0)) / 3)
      const saved = await saveInterviewAttempt({
        user_id: user.id, question_id: currentQuestion.id,
        user_answer: userAnswer,
        clarity_score: res.clarityScore ?? 0,
        relevance_score: res.relevanceScore ?? 0,
        depth_score: res.depthScore ?? 0,
        overall_score: overall,
        feedback: res.feedback ?? "",
      })
      setAttempt(saved)
      setStage("feedback")
      await loadStats()
    } catch {
      toast({ title: "Feedback failed", description: "AI feedback service unavailable.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleGetModel = async () => {
    if (!currentQuestion) return
    setLoading(true)
    try {
      const res = await practiceInterviewWithAI({ action: "getModelAnswer", targetRole: role, industry, interviewType: type, difficulty, question: questionText })
      const answer = res.modelAnswer ?? ""
      setModelAnswer(answer)
      setShowAnswer(true)
      await updateQuestionModelAnswer(currentQuestion.id, answer)
    } catch {
      toast({ title: "Could not retrieve model answer", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuestion = async () => {
    if (!currentQuestion || !user?.id) return
    const newSaved = !currentQuestion.is_saved
    setCurrentQuestion(prev => prev ? { ...prev, is_saved: newSaved } : null)
    await toggleSaveQuestion(user.id, currentQuestion.id, newSaved)
  }

  const handleReset = () => {
    setStage("config")
    setCurrentSession(null)
    setCurrentQuestion(null)
    setQuestionText("")
    setUserAnswer("")
    setAttempt(null)
    setModelAnswer("")
    setShowAnswer(false)
  }

  const SCORE_ITEMS = attempt ? [
    { label: "Clarity", value: attempt.clarity_score ?? 0, color: "var(--dash-accent)" },
    { label: "Relevance", value: attempt.relevance_score ?? 0, color: "var(--dash-green)" },
    { label: "Depth", value: attempt.depth_score ?? 0, color: "var(--dash-amber)" },
  ] : []

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between pb-6" style={{ borderBottom: "1px solid var(--dash-border-1)" }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: "var(--dash-text-3)" }}>Workspace / Tools</p>
            <h1 className="text-[32px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>Interview Prep</h1>
          </div>
          {stage !== "config" && (
            <button onClick={handleReset} className="h-10 px-5 rounded-xl text-[13px] font-semibold" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-2)" }}>
              Reset Session
            </button>
          )}
        </header>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Settings */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Config Card */}
            <div className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
              <div className="p-5 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Interview Settings</p>
                {[
                  { label: "Target Role", value: role, setValue: setRole, options: ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Marketing Manager", "Data Analyst"] },
                  { label: "Industry", value: industry, setValue: setIndustry, options: ["Technology", "Finance", "Healthcare", "Consulting", "E-commerce", "Education"] },
                  { label: "Type", value: type, setValue: setType, options: ["Technical", "Behavioral", "HR", "Case Study"] },
                  { label: "Difficulty", value: difficulty, setValue: setDifficulty, options: ["Foundational", "Intermediate", "Advanced", "Expert"] },
                ].map(({ label, value, setValue, options }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-black" style={{ color: "var(--dash-text-3)" }}>{label}</label>
                    <select
                      value={value} onChange={e => setValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl text-[13px] outline-none"
                      style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-1)" }}
                    >
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: loading ? "var(--dash-surface-3)" : "var(--dash-accent)", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Generating..." : <><Sparkles size={16} /> Generate Question</>}
                </button>
              </div>
            </div>

            {/* AI Tip */}
            <div className="rounded-[14px] p-5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.20)" }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-amber)" }}>AI Tip</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>
                For Behavioral questions, use the <strong style={{ color: "var(--dash-text-1)" }}>STAR method</strong>: Situation, Task, Action, Result. This ensures clarity and impact in every answer.
              </p>
            </div>

            {/* Session Stats */}
            <div className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
              <button className="w-full flex items-center justify-between px-5 py-4" onClick={() => setShowStats(!showStats)}>
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Session Stats</p>
                {showStats ? <ChevronUp size={14} style={{ color: "var(--dash-text-3)" }} /> : <ChevronDown size={14} style={{ color: "var(--dash-text-3)" }} />}
              </button>
              {showStats && (
                <div className="px-5 pb-5 space-y-4">
                  {statsLoading ? (
                    <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonBlock key={i} className="h-10" />)}</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Generated", value: stats?.generated ?? 0 },
                          { label: "Answered", value: stats?.answered ?? 0 },
                          { label: "Avg Score", value: stats?.avgScore != null ? `${stats.avgScore}%` : "—" },
                          { label: "Saved", value: stats?.savedCount ?? 0 },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-3" style={{ background: "var(--dash-surface-2)" }}>
                            <p className="text-[11px]" style={{ color: "var(--dash-text-3)" }}>{label}</p>
                            <p className="text-[18px] font-black tabular-nums" style={{ color: "var(--dash-text-1)", fontFeatureSettings: '"tnum"' }}>{value}</p>
                          </div>
                        ))}
                      </div>
                      {/* Streak */}
                      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                        <Flame size={22} style={{ color: "var(--dash-amber)" }} />
                        <div>
                          <p className="text-[24px] font-black" style={{ color: "var(--dash-text-1)" }}>{stats?.streak ?? 0} day{stats?.streak !== 1 ? "s" : ""}</p>
                          <p className="text-[11px]" style={{ color: "var(--dash-amber)" }}>Practice streak</p>
                        </div>
                      </div>
                      {/* Weak areas */}
                      {stats?.weakAreas?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-text-3)" }}>Weak Areas</p>
                          {stats.weakAreas.map((w: any) => (
                            <div key={w.category} className="flex items-center justify-between py-1.5">
                              <span className="text-[12px]" style={{ color: "var(--dash-text-2)" }}>{w.category}</span>
                              <span className="text-[11px] font-black" style={{ color: "var(--dash-red)" }}>{w.avgScore}% avg</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Recent sessions */}
                      {sessions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-text-3)" }}>Recent Sessions</p>
                          {sessions.slice(0, 3).map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5">
                              <span className="text-[12px] truncate" style={{ color: "var(--dash-text-2)" }}>{s.target_role} · {s.difficulty}</span>
                              <span className="text-[10px] font-mono-data ml-2 flex-shrink-0" style={{ color: "var(--dash-text-3)" }}>{relativeTime(s.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Right: Practice Panel */}
          <main className="lg:col-span-8 space-y-5">
            {/* Empty state */}
            {stage === "config" && !loading && (
              <div className="h-[540px] flex flex-col items-center justify-center text-center rounded-[20px] border-2 border-dashed"
                style={{ borderColor: "var(--dash-border-2)", background: "var(--dash-surface-1)" }}>
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mb-6 opacity-20">
                  <path d="M36 8L62 24V48L36 64L10 48V24L36 8Z" stroke="#6C63FF" strokeWidth="2" />
                  <circle cx="36" cy="36" r="12" stroke="#6C63FF" strokeWidth="2" />
                  <circle cx="36" cy="36" r="4" fill="#6C63FF" fillOpacity="0.4" />
                </svg>
                <h2 className="text-[20px] font-black mb-2" style={{ color: "var(--dash-text-1)" }}>Ready to Level Up?</h2>
                <p className="text-[13px] max-w-[300px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>
                  Configure your target role and interview type to start a high-performance AI-powered practice session.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-5">
                <SkeletonBlock className="h-36 rounded-[16px]" />
                <SkeletonBlock className="h-[300px] rounded-[16px]" />
              </div>
            )}

            {/* Question + practice */}
            {stage !== "config" && !loading && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Question card */}
                <div className="rounded-[16px] p-6" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full" style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}>{type}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full" style={{ background: `${DIFFICULTY_COLORS[difficulty]}1a`, color: DIFFICULTY_COLORS[difficulty] }}>{difficulty}</span>
                    </div>
                    <button onClick={handleSaveQuestion} className="p-1.5 rounded-lg" style={{ color: currentQuestion?.is_saved ? "var(--dash-accent)" : "var(--dash-text-3)" }}>
                      {currentQuestion?.is_saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                  <h3 className="text-[18px] font-black leading-snug" style={{ color: "var(--dash-text-1)" }}>"{questionText}"</h3>
                </div>

                {/* Answer area */}
                <div className="rounded-[16px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Your Response</p>
                      <span className="text-[11px] font-mono-data" style={{ color: "var(--dash-text-3)" }}>{userAnswer.length} chars</span>
                    </div>
                    <textarea
                      rows={8}
                      placeholder="Type your answer here... Be as detailed as possible."
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      disabled={stage === "feedback"}
                      className="w-full outline-none resize-none text-[14px] leading-relaxed bg-transparent"
                      style={{ color: "var(--dash-text-1)" }}
                    />
                  </div>
                  {stage === "practice" && (
                    <div className="px-5 pb-5">
                      <button onClick={handleGetFeedback} disabled={loading}
                        className="w-full h-12 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2"
                        style={{ background: "var(--dash-accent)" }}>
                        <Send size={15} /> Analyze & Score
                      </button>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {attempt && stage === "feedback" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {/* Score cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {SCORE_ITEMS.map(({ label, value, color }) => (
                        <div key={label} className="rounded-[12px] p-4" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>{label}</span>
                            <span className="text-[20px] font-black" style={{ color }}>{value}%</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ background: "var(--dash-surface-3)" }}>
                            <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, transition: "width 0.8s ease-out" }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feedback text */}
                    <div className="rounded-[14px] p-5" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                      <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "var(--dash-text-2)" }}>AI Intelligence Report</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>{attempt.feedback}</p>
                      <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--dash-border-1)" }}>
                        <button onClick={handleGetModel} disabled={loading || showAnswer}
                          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[12px] font-semibold"
                          style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: "var(--dash-amber)" }}>
                          <Lightbulb size={14} /> Show Model Answer
                        </button>
                        <button onClick={handleGenerate} disabled={loading}
                          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[12px] font-semibold text-white ml-auto"
                          style={{ background: "var(--dash-accent)" }}>
                          <RotateCcw size={14} /> Next Question
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Model answer */}
                {showAnswer && modelAnswer && (
                  <div className="rounded-[14px] p-5 animate-in slide-in-from-top-3 duration-400" style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.20)" }}>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "var(--dash-accent)" }}>◆ Professional Reference Answer</p>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--dash-text-2)" }}>{modelAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
