"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/supabase/auth-provider"
import { getDashboardStats, getActivity, getTopJobMatches, relativeTime, getAvatarColor, type ActivityItem, type JobMatch } from "@/lib/supabase/db"
import { Bell, Zap, Target, Users, TrendingUp, FileText, Briefcase, MessageSquare, GraduationCap, LineChart, ArrowRight } from "lucide-react"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function getLiveDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

function TrendChip({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null) return null
  const positive = value >= 0
  return (
    <span
      className="text-[11px] font-black px-2 py-0.5 rounded-full"
      style={{ background: positive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: positive ? "var(--dash-green)" : "var(--dash-red)" }}
    >
      {positive ? "↑" : "↓"} {Math.abs(value)}{suffix}
    </span>
  )
}

const TOOL_CONFIG = [
  { name: "Resume Analyzer", desc: "ATS scoring & keyword analysis", icon: FileText, url: "/app/resume", color: "#6C63FF", statKey: "ats" },
  { name: "Job Matcher", desc: "Semantic job discovery", icon: Briefcase, url: "/app/jobs", color: "#10B981", statKey: "jobs" },
  { name: "Interview Prep", desc: "AI interview coaching", icon: MessageSquare, url: "/app/interview", color: "#F59E0B", statKey: "attempts" },
  { name: "Higher Education", desc: "Exam & university roadmaps", icon: GraduationCap, url: "/app/higher-ed", color: "#3B82F6", statKey: "higher" },
  { name: "Career Intelligence", desc: "Skill gaps & market radar", icon: LineChart, url: "/app/career", color: "#8B5CF6", statKey: "career" },
]

const TOOL_ACTIVITY_COLORS: Record<string, string> = {
  resume: "#6C63FF", jobs: "#10B981", interview: "#F59E0B", "higher-ed": "#3B82F6", career: "#8B5CF6"
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [topJobs, setTopJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [unseenCount, setUnseenCount] = useState(0)

  const firstName = profile?.full_name?.split(" ")[0]
    ?? user?.user_metadata?.full_name?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "there"

  const loadData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const [s, a, j] = await Promise.all([
        getDashboardStats(user.id),
        getActivity(user.id, 20),
        getTopJobMatches(user.id, 3),
      ])
      setStats(s)
      setActivity(a)
      setTopJobs(j)
      setUnseenCount(a.filter(x => !x.seen).length)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { loadData() }, [loadData])

  const STAT_CARDS = [
    {
      label: "Latest ATS Score",
      value: stats?.atsScore != null ? `${stats.atsScore}` : "—",
      subtext: stats?.atsScore != null ? "ATS compatibility" : "No resume analyzed yet",
      icon: Zap,
      color: "#6C63FF",
      trend: stats?.atsTrend,
      trendSuffix: " pts",
      scoreColor: stats?.atsScore != null
        ? stats.atsScore >= 80 ? "var(--dash-green)" : stats.atsScore >= 50 ? "var(--dash-amber)" : "var(--dash-red)"
        : "var(--dash-text-2)"
    },
    {
      label: "Jobs Matched",
      value: stats?.jobTotal ?? "—",
      subtext: stats?.jobTotal === 0 ? "Upload resume to match jobs" : "Total matches found",
      icon: Target,
      color: "#10B981",
      trend: stats?.jobTrend,
      trendSuffix: " this week",
    },
    {
      label: "Questions Practiced",
      value: stats?.attemptTotal ?? "—",
      subtext: stats?.attemptTotal === 0 ? "Start your first session" : "Interview attempts",
      icon: Users,
      color: "#F59E0B",
      trend: stats?.attemptTrend,
      trendSuffix: " this week",
    },
    {
      label: "Profile Completion",
      value: stats?.profileCompletion != null ? `${stats.profileCompletion}%` : "—",
      subtext: "Complete for better matches",
      icon: TrendingUp,
      color: "#8B5CF6",
      trend: null,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[26px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>
              {getGreeting()}, {firstName}.
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--dash-text-2)" }}>{getLiveDate()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}
            >
              <Bell size={17} style={{ color: "var(--dash-text-2)" }} />
              {unseenCount > 0 && (
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--dash-accent)" }} />
              )}
            </button>
            <Link href="/app/resume">
              <button
                className="h-10 px-5 rounded-xl text-[13px] font-semibold text-white transition-all"
                style={{ background: "var(--dash-accent)" }}
              >
                New Analysis
              </button>
            </Link>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-[14px] p-6 transition-all duration-200"
              style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--dash-border-2)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--dash-border-1)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {loading ? (
                <div className="space-y-3">
                  <SkeletonBlock className="h-8 w-8" />
                  <SkeletonBlock className="h-10 w-3/4" />
                  <SkeletonBlock className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${card.color}18` }}>
                      <card.icon size={17} style={{ color: card.color }} />
                    </div>
                    <TrendChip value={card.trend} suffix={card.trendSuffix} />
                  </div>
                  <p
                    className="text-[42px] font-black leading-none tabular-nums"
                    style={{ color: (card as any).scoreColor ?? "var(--dash-text-1)", fontFeatureSettings: '"tnum"' }}
                  >
                    {card.value}
                  </p>
                  <p className="text-[12px] mt-1.5" style={{ color: "var(--dash-text-2)" }}>{card.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--dash-text-3)" }}>{card.subtext}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Tools + Jobs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tool Cards Grid */}
            <section>
              <h2 className="text-[12px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--dash-text-2)" }}>
                Intelligence Suite
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOOL_CONFIG.map((tool, i) => {
                  let miniStat = ""
                  if (tool.statKey === "ats") miniStat = stats?.atsScore != null ? `Last score: ${stats.atsScore}` : "No analysis yet"
                  else if (tool.statKey === "jobs") miniStat = stats?.jobTotal != null ? `${stats.jobTotal} matches found` : "No matches yet"
                  else if (tool.statKey === "attempts") miniStat = stats?.attemptTotal != null ? `${stats.attemptTotal} questions practiced` : "No sessions yet"
                  else if (tool.statKey === "higher") miniStat = "Build your roadmap"
                  else if (tool.statKey === "career") miniStat = "Generate career report"
                  return (
                    <Link href={tool.url} key={i}>
                      <div
                        className="rounded-[16px] p-6 cursor-pointer transition-all duration-200 group"
                        style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--dash-border-accent)"
                          e.currentTarget.style.transform = "translateY(-3px)"
                          e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.12)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--dash-border-1)"
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        <div className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-4" style={{ background: `${tool.color}1a` }}>
                          <tool.icon size={20} style={{ color: tool.color }} />
                        </div>
                        <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--dash-text-1)" }}>{tool.name}</h3>
                        <p className="text-[12px] mb-3" style={{ color: "var(--dash-text-2)" }}>{tool.desc}</p>
                        {loading ? (
                          <SkeletonBlock className="h-4 w-2/3" />
                        ) : (
                          <p className="text-[12px] font-semibold" style={{ color: tool.color }}>{miniStat}</p>
                        )}
                        <div className="flex items-center gap-1 mt-3 text-[12px] font-semibold" style={{ color: "var(--dash-accent)" }}>
                          Open Tool <ArrowRight size={12} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Top Job Matches */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>
                  Your Top Job Matches
                </h2>
                <Link href="/app/jobs" className="text-[12px] font-semibold" style={{ color: "var(--dash-accent)" }}>View all →</Link>
              </div>
              <div
                className="rounded-[14px] overflow-hidden divide-y"
                style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)", divideColor: "var(--dash-border-1)" }}
              >
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="p-4 flex items-center gap-3">
                      <SkeletonBlock className="w-9 h-9 rounded-full" />
                      <div className="flex-1 space-y-2"><SkeletonBlock className="h-4 w-1/2" /><SkeletonBlock className="h-3 w-1/3" /></div>
                      <SkeletonBlock className="h-6 w-12 rounded-full" />
                    </div>
                  ))
                ) : topJobs.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-[13px] font-medium mb-2" style={{ color: "var(--dash-text-2)" }}>No job matches yet</p>
                    <Link href="/app/resume">
                      <button className="text-[12px] font-semibold" style={{ color: "var(--dash-accent)" }}>Upload resume to generate matches →</button>
                    </Link>
                  </div>
                ) : (
                  topJobs.map((job, i) => {
                    const initLetter = (job.company_name ?? "?")[0].toUpperCase()
                    const color = getAvatarColor(job.id)
                    return (
                      <div key={i} className="p-4 flex items-center gap-3 hover:bg-[var(--dash-surface-3)] transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-black flex-shrink-0" style={{ background: color }}>
                          {initLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold truncate" style={{ color: "var(--dash-text-1)" }}>{job.job_title}</p>
                          <p className="text-[12px] truncate" style={{ color: "var(--dash-text-2)" }}>{job.company_name}{job.location ? ` · ${job.location}` : ""}</p>
                        </div>
                        {job.match_percent != null && (
                          <span className="text-[11px] font-black px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "var(--dash-green)" }}>
                            {job.match_percent}%
                          </span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </section>
          </div>

          {/* Right: Activity + AI Insight */}
          <div className="lg:col-span-4 space-y-5">
            {/* Activity Feed */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Recent Activity</h2>
              </div>
              <div className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-start gap-3">
                        <SkeletonBlock className="w-2.5 h-2.5 rounded-full mt-1" />
                        <div className="flex-1 space-y-1.5"><SkeletonBlock className="h-3 w-4/5" /><SkeletonBlock className="h-2.5 w-1/3" /></div>
                      </div>
                    ))}
                  </div>
                ) : activity.length === 0 ? (
                  <div className="py-12 px-6 text-center">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "var(--dash-surface-2)" }}>
                      <Zap size={18} style={{ color: "var(--dash-text-3)" }} />
                    </div>
                    <p className="text-[13px] font-medium mb-1" style={{ color: "var(--dash-text-2)" }}>No activity yet</p>
                    <p className="text-[11px]" style={{ color: "var(--dash-text-3)" }}>Your activity will appear here as you use SUPERNOVA's tools.</p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--dash-border-1)" }}>
                    {activity.slice(0, 12).map((item, i) => {
                      const dotColor = TOOL_ACTIVITY_COLORS[item.tool] ?? "var(--dash-accent)"
                      return (
                        <div key={i} className="flex items-start gap-3 px-4 py-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] leading-snug" style={{ color: "var(--dash-text-1)" }}>{item.action}</p>
                            <p className="text-[11px] mt-0.5 font-mono-data" style={{ color: "var(--dash-text-3)" }}>{relativeTime(item.created_at)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* AI Insight Card */}
            <div
              className="rounded-[14px] p-5"
              style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.10), rgba(167,139,250,0.05))", border: "1px solid rgba(108,99,255,0.20)" }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-accent)" }}>◆ AI Insight</p>
              {loading ? (
                <div className="space-y-2"><SkeletonBlock className="h-3 w-full" /><SkeletonBlock className="h-3 w-5/6" /><SkeletonBlock className="h-3 w-4/5" /></div>
              ) : (
                <>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>
                    {stats?.atsScore != null
                      ? `Your current ATS score of ${stats.atsScore} puts you ${stats.atsScore >= 80 ? "in the top tier" : "below the competitive threshold"}. ${stats.atsScore < 80 ? "Improving keyword alignment and formatting could push you past 80 — the threshold for most ATS systems." : "Focus on quantifying achievements with metrics to stand out further."}`
                      : stats?.jobTotal > 0
                        ? `You have ${stats.jobTotal} job matches ready to review. Apply to your top 3 matches this week to maximize your response rate.`
                        : "Upload your resume to unlock AI-powered ATS scoring, job matching, and personalized career insights tailored to your profile."}
                  </p>
                  <Link href={stats?.atsScore != null ? "/app/resume" : "/app/resume"}>
                    <button className="text-[12px] font-semibold mt-3" style={{ color: "var(--dash-accent)" }}>
                      Take Action →
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
