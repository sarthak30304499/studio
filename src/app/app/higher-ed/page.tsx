"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/supabase/auth-provider"
import { getLatestRoadmap, getUserRoadmaps, saveRoadmap, updateRoadmapTasks, logActivity, relativeTime, type EducationRoadmap, type RoadmapPhase } from "@/lib/supabase/db"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Globe, Trophy, BookOpen, Flame, Target, GraduationCap, CheckCircle2, MapPin, Sparkles, ExternalLink, CalendarDays } from "lucide-react"

function SkeletonBlock({ className = "" }: { className?: string }) {
    return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

const PROGRAMS = [
    { id: "gate", label: "GATE / PSU", icon: BarChart3, color: "#10B981", desc: "Engineering PG & PSU jobs" },
    { id: "ms_abroad", label: "MS Abroad", icon: Globe, color: "#3B82F6", desc: "Masters in USA, UK, Canada & EU" },
    { id: "mba", label: "MBA", icon: Trophy, color: "#F59E0B", desc: "CAT / GMAT / GRE" },
    { id: "law", label: "Law School", icon: BookOpen, color: "#8B5CF6", desc: "CLAT / LSAT" },
    { id: "healthcare", label: "Healthcare / USMLE", icon: Flame, color: "#EF4444", desc: "NEET-PG / USMLE / PLAB" },
]

const PHASE_COLORS = ["#6C63FF", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"]

// Static content for roadmap (tasks populated as JSONB)
const PROGRAM_CONTENT: Record<string, { timeline: RoadmapPhase[]; examInfo: Record<string, string>; universities: any[] }> = {
    ms_abroad: {
        timeline: [
            { month: "Month 1–2", phase: "Foundation & Diagnostics", tasks: [{ text: "Take a GRE diagnostic test", done: false }, { text: "Identify target universities & research fit", done: false }, { text: "Build a master university list (10–15 schools)", done: false }], color: "#6C63FF" },
            { month: "Month 3–4", phase: "Core Preparation", tasks: [{ text: "GRE Quant: 165+ target (daily practice)", done: false }, { text: "GRE Verbal: 160+ target", done: false }, { text: "Begin SOP brainstorming & draft outlines", done: false }], color: "#10B981" },
            { month: "Month 5–6", phase: "Application Build", tasks: [{ text: "Finalize SOP drafts (3 iterations min)", done: false }, { text: "Request 3 strong LORs from professors/managers", done: false }, { text: "Complete all university applications", done: false }], color: "#F59E0B" },
            { month: "Month 7–9", phase: "Submission & Follow-up", tasks: [{ text: "Submit applications ahead of deadlines", done: false }, { text: "Apply for scholarships & fellowships", done: false }, { text: "Prepare for possible video interviews", done: false }], color: "#3B82F6" },
        ],
        examInfo: { name: "GRE General", dates: "Year-round (online) — book 3 months ahead", eligibility: "Any bachelor's degree", fee: "~₹22,500 ($213 USD)", validity: "5 years" },
        universities: [
            { name: "Carnegie Mellon University", country: "USA 🇺🇸", program: "MS Computer Science", acceptance: "8%", minScore: "325+", tuition: "$58k/yr" },
            { name: "University of Toronto", country: "Canada 🇨🇦", program: "MEng Software Engineering", acceptance: "22%", minScore: "310+", tuition: "$32k/yr" },
            { name: "TU Munich", country: "Germany 🇩🇪", program: "MSc Informatics", acceptance: "35%", minScore: "N/A", tuition: "€1.5k/yr" },
            { name: "University of Edinburgh", country: "UK 🇬🇧", program: "MSc AI & Data Science", acceptance: "28%", minScore: "315+", tuition: "£32k/yr" },
        ]
    },
    gate: {
        timeline: [
            { month: "Month 1–3", phase: "Fundamentals", tasks: [{ text: "Complete core subjects: Maths, Engineering basics", done: false }, { text: "Solve GATE PYQs for last 5 years", done: false }], color: "#10B981" },
            { month: "Month 4–6", phase: "Mock Test Series", tasks: [{ text: "Join a GATE mock test series (MADE Easy/ACE)", done: false }, { text: "Analyze mistakes and revise weak areas", done: false }], color: "#6C63FF" },
        ],
        examInfo: { name: "GATE", dates: "February (annual) — registration opens September", eligibility: "BE/BTech or final year students", fee: "₹1,800 (General)", validity: "3 years for PSU applications" },
        universities: [{ name: "IIT Bombay", country: "India 🇮🇳", program: "MTech CSE", acceptance: "~2%", minScore: "GATE 700+", tuition: "₹2L/yr" }, { name: "IIT Delhi", country: "India 🇮🇳", program: "MTech EE", acceptance: "~3%", minScore: "GATE 650+", tuition: "₹2L/yr" }]
    },
    mba: {
        timeline: [
            { month: "Month 1–3", phase: "GMAT/CAT Prep", tasks: [{ text: "Diagnostic test to assess baseline score", done: false }, { text: "Set daily 2-hour study schedule", done: false }, { text: "Target GMAT 700+ / CAT 95+ percentile", done: false }], color: "#F59E0B" },
            { month: "Month 4–6", phase: "Application Prep", tasks: [{ text: "Research schools and programs", done: false }, { text: "Begin essays and personal statement drafts", done: false }], color: "#6C63FF" },
        ],
        examInfo: { name: "GMAT / CAT", dates: "GMAT: Year-round | CAT: November (annual)", eligibility: "Any bachelor's degree", fee: "GMAT: $275 | CAT: ₹2,400", validity: "GMAT: 5 years" },
        universities: [{ name: "IIM Ahmedabad", country: "India 🇮🇳", program: "PGP MBA", acceptance: "<1%", minScore: "CAT 99.5+", tuition: "₹24L" }, { name: "Harvard Business School", country: "USA 🇺🇸", program: "MBA", acceptance: "9%", minScore: "GMAT 730+", tuition: "$112k" }]
    },
    law: {
        timeline: [
            { month: "Month 1–4", phase: "CLAT/LSAT Prep", tasks: [{ text: "Complete English & Legal Reasoning modules", done: false }, { text: "Solve 10 CLAT mock tests", done: false }], color: "#8B5CF6" },
        ],
        examInfo: { name: "CLAT / LSAT India", dates: "CLAT: May | LSAT India: January", eligibility: "Class 12 (min 45%)", fee: "₹4,000 (CLAT)", validity: "Single attempt basis" },
        universities: [{ name: "NLSIU Bengaluru", country: "India 🇮🇳", program: "BA LLB (Hons)", acceptance: "~2%", minScore: "CLAT 100+", tuition: "₹2.4L/yr" }, { name: "NLU Delhi", country: "India 🇮🇳", program: "BA LLB (Hons)", acceptance: "~3%", minScore: "CLAT 95+", tuition: "₹2L/yr" }]
    },
    healthcare: {
        timeline: [
            { month: "Month 1–6", phase: "USMLE/NEET-PG Foundations", tasks: [{ text: "Complete First Aid for USMLE Step 1", done: false }, { text: "Solve 20 UWorld questions daily", done: false }], color: "#EF4444" },
        ],
        examInfo: { name: "USMLE Step 1 / NEET-PG", dates: "USMLE: Year-round | NEET-PG: Annual", eligibility: "MBBS degree", fee: "USMLE: $660 | NEET-PG: ₹4,250", validity: "Unlimited attempts" },
        universities: [{ name: "Johns Hopkins Hospital", country: "USA 🇺🇸", program: "Internal Medicine Residency", acceptance: "<5%", minScore: "Step 1: 240+", tuition: "Stipend paid" }, { name: "AIIMS Delhi", country: "India 🇮🇳", program: "MD/MS", acceptance: "<1%", minScore: "NEET-PG 98%+", tuition: "₹1.5k/yr" }]
    }
}

export default function HigherEdPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
    const [timeline, setTimeline] = useState("12")
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [roadmap, setRoadmap] = useState<EducationRoadmap | null>(null)
    const [pastRoadmaps, setPastRoadmaps] = useState<EducationRoadmap[]>([])

    const loadData = useCallback(async () => {
        if (!user?.id) return
        setPageLoading(true)
        try {
            const [latest, list] = await Promise.all([getLatestRoadmap(user.id), getUserRoadmaps(user.id)])
            setRoadmap(latest)
            setPastRoadmaps(list)
            if (latest?.program_id) setSelectedProgram(latest.program_id)
        } finally {
            setPageLoading(false)
        }
    }, [user?.id])

    useEffect(() => { loadData() }, [loadData])

    const handleGenerate = async () => {
        if (!selectedProgram || !user?.id) {
            toast({ title: "Select a program", description: "Choose your target program to continue.", variant: "destructive" })
            return
        }
        setLoading(true)
        try {
            const prog = PROGRAMS.find(p => p.id === selectedProgram)!
            const content = PROGRAM_CONTENT[selectedProgram] ?? PROGRAM_CONTENT.ms_abroad
            const newRoadmap = await saveRoadmap({
                user_id: user.id,
                program_id: selectedProgram,
                program_label: prog.label,
                timeline_months: parseInt(timeline),
                roadmap_data: content.timeline,
                exam_info: content.examInfo,
                university_shortlist: content.universities,
            })
            setRoadmap(newRoadmap)
            await loadData()
            await logActivity(user.id, "higher-ed", `Generated ${prog.label} roadmap (${timeline}-month plan)`)
            toast({ title: "Roadmap generated!", description: `Your ${prog.label} roadmap is ready.` })
        } catch (err: any) {
            toast({ title: "Failed to generate", description: err?.message ?? "Please try again.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleTaskToggle = async (phaseIdx: number, taskIdx: number) => {
        if (!roadmap) return
        const updated = roadmap.roadmap_data.map((phase, i) =>
            i === phaseIdx ? { ...phase, tasks: phase.tasks.map((t, j) => j === taskIdx ? { ...t, done: !t.done } : t) } : phase
        )
        setRoadmap(prev => prev ? { ...prev, roadmap_data: updated } : null)
        await updateRoadmapTasks(roadmap.id, updated)
    }

    const programInfo = selectedProgram ? PROGRAMS.find(p => p.id === selectedProgram) : null

    return (
        <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <header className="mb-8 pb-6 flex items-end justify-between" style={{ borderBottom: "1px solid var(--dash-border-1)" }}>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: "var(--dash-text-3)" }}>Workspace / Education</p>
                        <h1 className="text-[32px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>Higher Education</h1>
                    </div>
                    {roadmap && (
                        <button onClick={() => setRoadmap(null)} className="h-10 px-5 rounded-xl text-[13px] font-semibold" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-2)" }}>
                            New Roadmap
                        </button>
                    )}
                </header>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left: Config */}
                    <aside className="lg:col-span-4 space-y-5">
                        <div className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                            <div className="p-5 space-y-5">
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Pathway Builder</p>

                                {/* Program selector */}
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: "var(--dash-text-3)" }}>Choose Program</p>
                                    {PROGRAMS.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedProgram(p.id)}
                                            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                                            style={{
                                                background: selectedProgram === p.id ? `${p.color}0f` : "var(--dash-surface-2)",
                                                border: `1px solid ${selectedProgram === p.id ? `${p.color}40` : "var(--dash-border-1)"}`,
                                            }}
                                        >
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}1a` }}>
                                                <p.icon size={17} style={{ color: p.color }} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-[13px] font-semibold" style={{ color: "var(--dash-text-1)" }}>{p.label}</p>
                                                <p className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>{p.desc}</p>
                                            </div>
                                            {selectedProgram === p.id && <CheckCircle2 size={15} style={{ color: p.color, flexShrink: 0 }} />}
                                        </button>
                                    ))}
                                </div>

                                {/* Timeline select */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider font-black" style={{ color: "var(--dash-text-3)" }}>Timeline (months)</label>
                                    <select value={timeline} onChange={e => setTimeline(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl text-[13px] outline-none"
                                        style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-1)" }}>
                                        {["6", "9", "12", "18", "24"].map(m => <option key={m} value={m}>{m} months</option>)}
                                    </select>
                                </div>

                                <button onClick={handleGenerate} disabled={loading}
                                    className="w-full h-12 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2"
                                    style={{ background: loading ? "var(--dash-surface-3)" : "var(--dash-accent)", cursor: loading ? "not-allowed" : "pointer" }}>
                                    {loading ? <><Sparkles size={16} className="animate-pulse" /> Generating...</> : <><Target size={16} /> Build My Roadmap</>}
                                </button>
                            </div>

                            {/* Past roadmaps */}
                            {pastRoadmaps.length > 0 && (
                                <div style={{ borderTop: "1px solid var(--dash-border-1)" }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest px-5 py-3" style={{ color: "var(--dash-text-3)" }}>Existing Roadmaps</p>
                                    {pastRoadmaps.map((r, i) => (
                                        <button key={i} onClick={() => setRoadmap(r)} className="w-full flex items-center justify-between px-5 py-3 text-left transition-all" style={{ background: roadmap?.id === r.id ? "var(--dash-surface-2)" : "transparent" }}>
                                            <div>
                                                <p className="text-[12px] font-semibold" style={{ color: "var(--dash-text-1)" }}>{r.program_label}</p>
                                                <p className="text-[10px] font-mono-data" style={{ color: "var(--dash-text-3)" }}>{relativeTime(r.created_at)}</p>
                                            </div>
                                            <span className="text-[10px] font-black" style={{ color: "var(--dash-text-3)" }}>{r.timeline_months}mo</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right: Roadmap */}
                    <main className="lg:col-span-8 space-y-6">
                        {/* Empty state */}
                        {!roadmap && !loading && !pageLoading && (
                            <div className="h-[560px] flex flex-col items-center justify-center text-center rounded-[20px] border-2 border-dashed"
                                style={{ borderColor: "var(--dash-border-2)", background: "var(--dash-surface-1)" }}>
                                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mb-6 opacity-20">
                                    <rect x="12" y="12" width="48" height="48" rx="8" stroke="#6C63FF" strokeWidth="2" />
                                    <path d="M24 36h24M36 24v24" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <h2 className="text-[20px] font-black mb-2" style={{ color: "var(--dash-text-1)" }}>Your Roadmap Awaits</h2>
                                <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: "var(--dash-text-2)" }}>Select a program on the left to generate a precision timeline with exam dates, tasks, and university shortlists.</p>
                            </div>
                        )}

                        {/* Page loading */}
                        {pageLoading && (
                            <div className="space-y-5">
                                <SkeletonBlock className="h-28 rounded-[16px]" />
                                {[1, 2, 3].map(i => <SkeletonBlock key={i} className="h-36 rounded-[16px]" />)}
                            </div>
                        )}

                        {/* Roadmap content */}
                        {roadmap && !pageLoading && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                {/* Hero banner */}
                                <div className="rounded-[20px] p-7 overflow-hidden relative" style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(108,99,255,0.04))", border: "1px solid rgba(108,99,255,0.25)" }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}>AI Generated</span>
                                            <h2 className="text-[22px] font-black" style={{ color: "var(--dash-text-1)" }}>{roadmap.program_label} Roadmap</h2>
                                            <p className="text-[13px] mt-1" style={{ color: "var(--dash-text-2)" }}>{roadmap.timeline_months}-month plan · {(roadmap.university_shortlist as any[]).length} curated universities</p>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="text-center">
                                                <p className="text-[24px] font-black" style={{ color: "var(--dash-accent)" }}>{roadmap.timeline_months}mo</p>
                                                <p className="text-[10px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>Timeline</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[24px] font-black" style={{ color: "var(--dash-amber)" }}>{(roadmap.university_shortlist as any[]).length}</p>
                                                <p className="text-[10px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>Universities</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays size={16} style={{ color: "var(--dash-accent)" }} />
                                        <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Phase Timeline</p>
                                    </div>
                                    <div className="space-y-3">
                                        {(roadmap.roadmap_data as RoadmapPhase[]).map((phase, pi) => {
                                            const done = (phase.tasks as any[]).filter(t => t.done).length
                                            const total = (phase.tasks as any[]).length
                                            return (
                                                <div key={pi} className="rounded-[14px] p-5" style={{ background: "var(--dash-surface-1)", border: `1px solid ${phase.color}30` }}>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full" style={{ background: `${phase.color}1a`, color: phase.color }}>{phase.month}</span>
                                                        <h4 className="text-[14px] font-semibold" style={{ color: "var(--dash-text-1)" }}>{phase.phase}</h4>
                                                        <span className="ml-auto text-[11px] font-mono-data" style={{ color: "var(--dash-text-3)" }}>{done}/{total}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(phase.tasks as any[]).map((task, ti) => (
                                                            <label key={ti} className="flex items-center gap-3 cursor-pointer group">
                                                                <input type="checkbox" checked={task.done} onChange={() => handleTaskToggle(pi, ti)}
                                                                    className="w-4 h-4 rounded" style={{ accentColor: phase.color }} />
                                                                <span className="text-[13px]" style={{ color: task.done ? "var(--dash-text-3)" : "var(--dash-text-2)", textDecoration: task.done ? "line-through" : "none" }}>
                                                                    {task.text}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>

                                {/* University Shortlist */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin size={16} style={{ color: "#3B82F6" }} />
                                        <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>University Shortlist</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {(roadmap.university_shortlist as any[]).map((uni, i) => (
                                            <div key={i} className="rounded-[14px] p-5 transition-all cursor-pointer" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--dash-border-2)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--dash-border-1)"; e.currentTarget.style.transform = "translateY(0)" }}>
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <div>
                                                        <p className="text-[14px] font-semibold leading-tight" style={{ color: "var(--dash-text-1)" }}>{uni.name}</p>
                                                        <p className="text-[11px] mt-0.5" style={{ color: "var(--dash-text-2)" }}>{uni.country}</p>
                                                    </div>
                                                    <ExternalLink size={13} style={{ color: "var(--dash-text-3)", flexShrink: 0 }} />
                                                </div>
                                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}>{uni.program}</span>
                                                <div className="grid grid-cols-3 gap-2 mt-4 pt-3" style={{ borderTop: "1px solid var(--dash-border-1)" }}>
                                                    {[["Acceptance", uni.acceptance], ["Min Score", uni.minScore], ["Tuition", uni.tuition]].map(([l, v]) => (
                                                        <div key={l}>
                                                            <p className="text-[9px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>{l}</p>
                                                            <p className="text-[12px] font-black mt-0.5" style={{ color: "var(--dash-text-1)" }}>{v}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Exam Info */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen size={16} style={{ color: "var(--dash-amber)" }} />
                                        <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Exam Details</p>
                                    </div>
                                    <div className="rounded-[14px] p-6" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                                        <h4 className="text-[18px] font-black mb-5" style={{ color: "var(--dash-text-1)" }}>{(roadmap.exam_info as any).name}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                            {[["Test Dates", (roadmap.exam_info as any).dates], ["Eligibility", (roadmap.exam_info as any).eligibility], ["Fee", (roadmap.exam_info as any).fee], ["Validity", (roadmap.exam_info as any).validity]].map(([l, v]) => (
                                                <div key={l}>
                                                    <p className="text-[10px] uppercase font-black mb-1" style={{ color: "var(--dash-text-3)" }}>{l}</p>
                                                    <p className="text-[13px] font-semibold" style={{ color: "var(--dash-text-1)" }}>{v}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
