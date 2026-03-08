"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/supabase/auth-provider"
import { getLatestCareerAnalysis, saveCareerAnalysis, getProfile, logActivity, type CareerAnalysis, type SkillRadarItem, type CareerPath } from "@/lib/supabase/db"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, Zap, Target, BookOpen, Calendar, ArrowRight, CheckCircle2, Circle, ExternalLink, BarChart2, Sparkles, AlertCircle } from "lucide-react"

function SkeletonBlock({ className = "" }: { className?: string }) {
    return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

function HexagonRadar({ skills }: { skills: SkillRadarItem[] }) {
    if (!skills.length) return null
    const cx = 120; const cy = 120; const r = 90
    const n = skills.length
    const pts = (v: number) => skills.map((_, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2
        const rr = (v / 100) * r
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
    })
    const toPath = (pts: number[][]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z"
    const textPositions = skills.map((s, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2
        return { x: cx + (r + 22) * Math.cos(a), y: cy + (r + 22) * Math.sin(a), skill: s.skill, value: s.value }
    })
    return (
        <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto">
            {/* Grid rings */}
            {[25, 50, 75, 100].map(v => (
                <path key={v} d={toPath(pts(v))} fill="none" stroke="var(--dash-border-2)" strokeWidth="0.8" />
            ))}
            {/* Axes */}
            {skills.map((_, i) => {
                const a = (Math.PI * 2 * i) / n - Math.PI / 2
                return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="var(--dash-border-2)" strokeWidth="0.8" />
            })}
            {/* Benchmark area */}
            <path d={toPath(pts(80))} fill="rgba(108,99,255,0.07)" stroke="rgba(108,99,255,0.3)" strokeWidth="1" strokeDasharray="4,3" />
            {/* User area */}
            <path d={toPath(skills.map(s => [0, s.value]))} fill="rgba(16,185,129,0.15)" stroke="var(--dash-green)" strokeWidth="2" />
            <path d={toPath(skills.map((s, i) => pts(s.value)[i]))} fill="rgba(16,185,129,0.15)" stroke="var(--dash-green)" strokeWidth="2" />
            {/* Dots */}
            {skills.map((s, i) => {
                const [x, y] = pts(s.value)[i]
                return <circle key={i} cx={x} cy={y} r="4" fill="var(--dash-green)" />
            })}
            {/* Labels */}
            {textPositions.map((t, i) => (
                <text key={i} x={t.x} y={t.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="var(--dash-text-2)" fontFamily="Inter">{t.skill}</text>
            ))}
        </svg>
    )
}

const GAP_COLORS: Record<string, string> = { high: "var(--dash-red)", medium: "var(--dash-amber)", low: "var(--dash-green)" }

// Placeholder generation config
function buildMockAnalysis(targetRole: string): Omit<CareerAnalysis, 'id' | 'created_at'> & { user_id: string } {
    return {
        user_id: "",
        target_role: targetRole,
        skill_radar: [
            { skill: "Technical", value: 72, benchmark: 80 }, { skill: "Communication", value: 68, benchmark: 80 },
            { skill: "Leadership", value: 54, benchmark: 80 }, { skill: "Strategy", value: 58, benchmark: 80 },
            { skill: "Analytics", value: 80, benchmark: 80 }, { skill: "Domain", value: 65, benchmark: 80 },
        ],
        skill_gaps: [
            { skill: "System Design", current: 50, target: 85, severity: "high" },
            { skill: "Leadership", current: 54, target: 80, severity: "high" },
            { skill: "Machine Learning", current: 60, target: 80, severity: "medium" },
            { skill: "Product Strategy", current: 65, target: 78, severity: "medium" },
            { skill: "Data Visualization", current: 70, target: 80, severity: "low" },
        ],
        career_paths: [
            { title: `Senior ${targetRole}`, timeline: "12–18 months", match_percent: 88, required_skills: ["System Design", "Team Leadership", "Stakeholder Management"] },
            { title: "Engineering Manager", timeline: "24–36 months", match_percent: 71, required_skills: ["Leadership", "OKR Planning", "People Management"] },
            { title: "Principal Engineer", timeline: "36–48 months", match_percent: 65, required_skills: ["Architecture", "Cross-team Influence", "Tech Vision"] },
        ],
        learning_recs: [
            { platform: "Coursera", course: "System Design for LLDs & HLDs", duration: "8 weeks", skill: "System Design", url: "https://coursera.org" },
            { platform: "LinkedIn Learning", course: "Leadership Foundations", duration: "6 hours", skill: "Leadership", url: "https://linkedin.com/learning" },
            { platform: "fast.ai", course: "Practical Deep Learning for Coders", duration: "6 weeks", skill: "Machine Learning", url: "https://fast.ai" },
            { platform: "Reforge", course: "Product Strategy", duration: "10 weeks", skill: "Product Strategy", url: "https://reforge.com" },
        ],
        action_plan: {
            week1_2: ["Take a System Design diagnostic assessment", "Book a mentorship call on ADPList.org", "Audit LinkedIn profile for ATS keyword alignment"],
            month1: ["Complete one module of a leadership course", "Contribute to one open-source project", "Request feedback from manager on 3 key competencies"],
            day90: ["Complete 2 certifications in gap areas", "Lead a cross-functional project", "Reach STAR-method fluency in all behavioral answers"],
        },
    }
}

export default function CareerIntelligencePage() {
    const { user, profile } = useAuth()
    const { toast } = useToast()
    const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [targetRole, setTargetRole] = useState(profile?.role ?? "Software Engineer")
    const [activeTab, setActiveTab] = useState<"radar" | "gaps" | "paths" | "recs" | "plan">("radar")

    useEffect(() => { if (profile?.role) setTargetRole(profile.role) }, [profile])

    const loadAnalysis = useCallback(async () => {
        if (!user?.id) return
        setLoading(true)
        try {
            const data = await getLatestCareerAnalysis(user.id)
            setAnalysis(data)
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => { loadAnalysis() }, [loadAnalysis])

    const handleGenerate = async () => {
        if (!user?.id) return
        setGenerating(true)
        try {
            const mock = buildMockAnalysis(targetRole)
            mock.user_id = user.id
            const saved = await saveCareerAnalysis(mock)
            setAnalysis(saved)
            await logActivity(user.id, "career", `Generated Career Intelligence Report for ${targetRole}`)
            toast({ title: "Career report ready!", description: `Personalized insights for ${targetRole} generated.` })
        } catch (err: any) {
            toast({ title: "Generation failed", description: err?.message ?? "Please try again.", variant: "destructive" })
        } finally {
            setGenerating(false)
        }
    }

    const TABS = [
        { key: "radar", label: "Skill Radar", icon: Target },
        { key: "gaps", label: "Skill Gaps", icon: AlertCircle },
        { key: "paths", label: "Career Paths", icon: TrendingUp },
        { key: "recs", label: "Learning", icon: BookOpen },
        { key: "plan", label: "90-Day Plan", icon: Calendar },
    ] as const

    return (
        <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="mb-8 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4" style={{ borderBottom: "1px solid var(--dash-border-1)" }}>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: "var(--dash-text-3)" }}>Workspace / Tools</p>
                        <h1 className="text-[32px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>Career Intelligence</h1>
                    </div>
                    {analysis && !loading && (
                        <button onClick={handleGenerate} disabled={generating}
                            className="h-10 px-5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2"
                            style={{ background: generating ? "var(--dash-surface-3)" : "var(--dash-accent)" }}>
                            <Sparkles size={14} /> Regenerate Report
                        </button>
                    )}
                </header>

                {/* Loading */}
                {loading && (
                    <div className="space-y-5">
                        <SkeletonBlock className="h-36 rounded-[20px]" />
                        <div className="grid lg:grid-cols-12 gap-6">
                            <SkeletonBlock className="lg:col-span-4 h-[400px] rounded-[16px]" />
                            <SkeletonBlock className="lg:col-span-8 h-[400px] rounded-[16px]" />
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !analysis && (
                    <div className="max-w-xl mx-auto text-center py-24">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-6 opacity-25">
                            <circle cx="40" cy="40" r="36" stroke="#6C63FF" strokeWidth="2" />
                            <path d="M14 52l13-14 9 10 13-18 17 22" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2 className="text-[24px] font-black mb-3" style={{ color: "var(--dash-text-1)" }}>Generate Your Career Intelligence Report</h2>
                        <p className="text-[13px] leading-relaxed max-w-sm mx-auto mb-8" style={{ color: "var(--dash-text-2)" }}>
                            SUPERNOVA analyzes your profile, generates a skill radar vs. industry benchmarks, identifies gaps, and builds a personalized 90-day action plan.
                        </p>
                        <div className="flex items-center gap-3 justify-center mb-6">
                            <label className="text-[12px] font-semibold" style={{ color: "var(--dash-text-2)" }}>Target Role</label>
                            <input value={targetRole} onChange={e => setTargetRole(e.target.value)} className="h-10 px-4 rounded-xl text-[13px] outline-none"
                                style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-1)" }} />
                        </div>
                        <button onClick={handleGenerate} disabled={generating}
                            className="h-12 px-8 rounded-xl font-semibold text-[14px] text-white flex items-center gap-2 mx-auto"
                            style={{ background: "var(--dash-accent)" }}>
                            <Sparkles size={16} />
                            {generating ? "Generating your report..." : "Generate Career Intelligence Report"}
                        </button>
                    </div>
                )}

                {/* Analysis Results */}
                {!loading && analysis && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Hero stats */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { label: "Target Role", value: analysis.target_role ?? "—", icon: Target, color: "#6C63FF" },
                                { label: "Skill Gaps", value: analysis.skill_gaps.length, icon: AlertCircle, color: "var(--dash-red)" },
                                { label: "Career Paths", value: analysis.career_paths.length, icon: TrendingUp, color: "var(--dash-green)" },
                            ].map((s, i) => (
                                <div key={i} className="rounded-[14px] p-5 flex items-center gap-4" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                                        <s.icon size={18} style={{ color: s.color }} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>{s.label}</p>
                                        <p className="text-[18px] font-black" style={{ color: "var(--dash-text-1)" }}>{s.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabs + Content */}
                        <div className="rounded-[16px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                            {/* Tab bar */}
                            <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid var(--dash-border-1)" }}>
                                {TABS.map(({ key, label, icon: Icon }) => {
                                    const active = activeTab === key
                                    return (
                                        <button key={key} onClick={() => setActiveTab(key)}
                                            className="flex items-center gap-2 px-5 py-4 text-[12px] font-semibold flex-shrink-0 transition-all relative"
                                            style={{
                                                color: active ? "var(--dash-accent)" : "var(--dash-text-2)",
                                                borderBottom: active ? "2px solid var(--dash-accent)" : "2px solid transparent",
                                            }}>
                                            <Icon size={14} />{label}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="p-6">
                                {/* Skill Radar */}
                                {activeTab === "radar" && (
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-shrink-0">
                                            <HexagonRadar skills={analysis.skill_radar as SkillRadarItem[]} />
                                            <div className="flex gap-4 justify-center mt-2">
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded-full" style={{ background: "var(--dash-green)" }} /><span className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>You</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded-full border-dashed border" style={{ borderColor: "rgba(108,99,255,0.5)" }} /><span className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>Industry Avg</span></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3 w-full">
                                            {(analysis.skill_radar as SkillRadarItem[]).map((s, i) => (
                                                <div key={i} className="space-y-1.5">
                                                    <div className="flex justify-between text-[12px]">
                                                        <span style={{ color: "var(--dash-text-2)" }}>{s.skill}</span>
                                                        <div className="flex gap-3">
                                                            <span className="font-black tabular-nums" style={{ color: "var(--dash-green)", fontFeatureSettings: '"tnum"' }}>{s.value}%</span>
                                                            <span className="text-[11px]" style={{ color: "var(--dash-text-3)" }}>avg {s.benchmark}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 rounded-full overflow-hidden relative" style={{ background: "var(--dash-surface-3)" }}>
                                                        <div className="absolute h-full rounded-full" style={{ width: `${s.benchmark}%`, background: "rgba(108,99,255,0.2)" }} />
                                                        <div className="h-full rounded-full relative" style={{ width: `${s.value}%`, background: s.value >= s.benchmark ? "var(--dash-green)" : "var(--dash-accent)", transition: "width 1s ease-out" }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skill Gaps */}
                                {activeTab === "gaps" && (
                                    <div className="space-y-4">
                                        {analysis.skill_gaps.map((gap, i) => {
                                            const col = GAP_COLORS[gap.severity]
                                            const deficit = gap.target - gap.current
                                            return (
                                                <div key={i} className="rounded-[14px] p-5 flex gap-4" style={{ background: "var(--dash-surface-2)", border: `1px solid ${col}25` }}>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[15px] font-semibold" style={{ color: "var(--dash-text-1)" }}>{gap.skill}</h4>
                                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded" style={{ background: `${col}18`, color: col }}>{gap.severity}</span>
                                                        </div>
                                                        <div className="flex gap-3 text-[11px]">
                                                            <span style={{ color: "var(--dash-text-2)" }}>Current: <strong style={{ color: "var(--dash-text-1)" }}>{gap.current}%</strong></span>
                                                            <span style={{ color: "var(--dash-text-3)" }}>Target: <strong style={{ color: col }}>{gap.target}%</strong></span>
                                                            <span style={{ color: "var(--dash-text-3)" }}>Gap: <strong style={{ color: col }}>+{deficit}%</strong></span>
                                                        </div>
                                                        <div className="h-2 rounded-full overflow-hidden relative" style={{ background: "var(--dash-surface-3)" }}>
                                                            <div className="h-full rounded-full" style={{ width: `${gap.target}%`, background: `${col}30` }} />
                                                            <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${gap.current}%`, background: col, transition: "width 0.8s ease-out" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Career Paths */}
                                {activeTab === "paths" && (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {(analysis.career_paths as CareerPath[]).map((p, i) => {
                                            const col = i === 0 ? "var(--dash-green)" : i === 1 ? "var(--dash-accent)" : "var(--dash-amber)"
                                            return (
                                                <div key={i} className="rounded-[14px] p-5 flex flex-col gap-4" style={{ background: "var(--dash-surface-2)", border: `1px solid ${col}25` }}>
                                                    <div>
                                                        <span className="text-[28px] font-black tabular-nums" style={{ color: col, fontFeatureSettings: '"tnum"' }}>{p.match_percent}%</span>
                                                        <p className="text-[10px] uppercase font-black mt-0.5" style={{ color: "var(--dash-text-3)" }}>match</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[15px] font-black" style={{ color: "var(--dash-text-1)" }}>{p.title}</h4>
                                                        <p className="text-[12px] mt-1" style={{ color: "var(--dash-text-2)" }}>{p.timeline}</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {p.required_skills.map(s => (
                                                            <div key={s} className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col }} />
                                                                <span className="text-[12px]" style={{ color: "var(--dash-text-2)" }}>{s}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Learning Recs */}
                                {activeTab === "recs" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {analysis.learning_recs.map((r, i) => (
                                            <div key={i} className="rounded-[14px] p-5 space-y-3 transition-all cursor-pointer" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)" }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--dash-border-2)" }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--dash-border-1)" }}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full" style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}>{r.platform}</span>
                                                        <h4 className="text-[14px] font-semibold mt-2" style={{ color: "var(--dash-text-1)" }}>{r.course}</h4>
                                                    </div>
                                                    <a href={r.url} target="_blank" rel="noreferrer">
                                                        <ExternalLink size={14} style={{ color: "var(--dash-text-3)", flexShrink: 0 }} />
                                                    </a>
                                                </div>
                                                <div className="flex gap-4 text-[11px]">
                                                    <span style={{ color: "var(--dash-text-2)" }}>⏱ {r.duration}</span>
                                                    <span style={{ color: "var(--dash-text-2)" }}>🎯 {r.skill}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 90-Day Plan */}
                                {activeTab === "plan" && (
                                    <div className="grid md:grid-cols-3 gap-5">
                                        {[
                                            { title: "Week 1–2", color: "var(--dash-green)", items: analysis.action_plan.week1_2 ?? [] },
                                            { title: "Month 1", color: "var(--dash-accent)", items: analysis.action_plan.month1 ?? [] },
                                            { title: "Day 90", color: "var(--dash-amber)", items: analysis.action_plan.day90 ?? [] },
                                        ].map(({ title, color, items }) => (
                                            <div key={title} className="rounded-[14px] p-5 space-y-4" style={{ background: "var(--dash-surface-2)", border: `1px solid ${color}25` }}>
                                                <h4 className="text-[14px] font-black" style={{ color }}>{title}</h4>
                                                <div className="space-y-3">
                                                    {(items as string[]).map((item, j) => (
                                                        <div key={j} className="flex items-start gap-3">
                                                            <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5" style={{ borderColor: color }}>
                                                                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                                            </div>
                                                            <p className="text-[12px] leading-snug" style={{ color: "var(--dash-text-2)" }}>{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
