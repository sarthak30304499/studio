"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/supabase/auth-provider"
import { getJobMatches, toggleSaveJob, toggleApplyJob, logActivity, getAvatarColor, type JobMatch } from "@/lib/supabase/db"
import { Search, Briefcase, MapPin, Building, Bookmark, BookmarkCheck, ExternalLink, X, Filter } from "lucide-react"
import Link from "next/link"

function SkeletonBlock({ className = "" }: { className?: string }) {
   return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

function MatchBadge({ pct }: { pct: number | null }) {
   if (pct == null) return null
   const color = pct >= 85 ? "var(--dash-green)" : pct >= 70 ? "var(--dash-amber)" : "var(--dash-text-2)"
   return (
      <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: `${color}1a`, color }}>
         {pct}%
      </span>
   )
}

export default function JobMatcherPage() {
   const { user } = useAuth()
   const [jobs, setJobs] = useState<JobMatch[]>([])
   const [filtered, setFiltered] = useState<JobMatch[]>([])
   const [loading, setLoading] = useState(true)
   const [selected, setSelected] = useState<JobMatch | null>(null)
   const [search, setSearch] = useState("")
   const [showFilters, setShowFilters] = useState(false)
   const [filters, setFilters] = useState({ types: [] as string[], minMatch: 0 })

   const loadJobs = useCallback(async () => {
      if (!user?.id) return
      setLoading(true)
      try {
         const data = await getJobMatches(user.id, 20)
         setJobs(data)
         setFiltered(data)
      } finally {
         setLoading(false)
      }
   }, [user?.id])

   useEffect(() => { loadJobs() }, [loadJobs])

   useEffect(() => {
      let result = jobs
      if (search.trim()) {
         const q = search.toLowerCase()
         result = result.filter(j => j.job_title.toLowerCase().includes(q) || (j.company_name ?? "").toLowerCase().includes(q))
      }
      if (filters.types.length > 0) result = result.filter(j => filters.types.includes(j.job_type ?? ""))
      if (filters.minMatch > 0) result = result.filter(j => (j.match_percent ?? 0) >= filters.minMatch)
      setFiltered(result)
   }, [search, filters, jobs])

   const handleSave = async (job: JobMatch) => {
      const newSaved = !job.is_saved
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_saved: newSaved } : j))
      try {
         await toggleSaveJob(user!.id, job.id, newSaved)
         if (newSaved) await logActivity(user!.id, "jobs", `Saved job: ${job.job_title} at ${job.company_name}`)
      } catch {
         setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_saved: job.is_saved } : j))
      }
   }

   const handleApply = async (job: JobMatch) => {
      if (job.is_applied) return
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_applied: true } : j))
      try {
         await toggleApplyJob(user!.id, job.id)
         await logActivity(user!.id, "jobs", `Applied to ${job.job_title} at ${job.company_name}`)
      } catch {
         setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_applied: false } : j))
      }
   }

   return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--dash-bg)" }}>
         {/* Header */}
         <header className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ background: "var(--dash-surface-1)", borderBottom: "1px solid var(--dash-border-1)" }}>
            <div>
               <h1 className="text-[24px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>Job Matcher</h1>
               {!loading && (
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--dash-text-2)" }}>
                     {filtered.length} {filtered.length === 1 ? "match" : "matches"} found
                  </p>
               )}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="flex items-center h-10 px-4 rounded-xl flex-1 md:w-72 gap-2" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)" }}>
                  <Search size={15} style={{ color: "var(--dash-text-3)" }} />
                  <input
                     className="bg-transparent outline-none text-[13px] flex-1"
                     style={{ color: "var(--dash-text-1)" }}
                     placeholder="Search role or company..."
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                  />
               </div>
               <button onClick={() => setShowFilters(!showFilters)} className="h-10 w-10 rounded-xl flex items-center justify-center md:hidden" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)" }}>
                  <Filter size={16} style={{ color: "var(--dash-text-2)" }} />
               </button>
            </div>
         </header>

         <div className="flex flex-1 overflow-hidden">
            {/* Filter Panel */}
            <aside className={`w-64 flex-shrink-0 overflow-y-auto p-5 space-y-6 border-r md:block ${showFilters ? "fixed inset-0 z-50 w-full md:static md:w-64" : "hidden md:block"}`}
               style={{ background: "var(--dash-surface-1)", borderColor: "var(--dash-border-1)" }}>
               <div className="flex items-center justify-between">
                  <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Filters</p>
                  <button onClick={() => setShowFilters(false)} className="md:hidden"><X size={18} style={{ color: "var(--dash-text-2)" }} /></button>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: "var(--dash-text-3)" }}>Job Type</p>
                  {["Full-Time", "Part-Time", "Contract", "Remote"].map(t => (
                     <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={filters.types.includes(t)} onChange={e => {
                           setFilters(prev => ({ ...prev, types: e.target.checked ? [...prev.types, t] : prev.types.filter(x => x !== t) }))
                        }} className="w-4 h-4 rounded" style={{ accentColor: "var(--dash-accent)" }} />
                        <span className="text-[13px]" style={{ color: "var(--dash-text-2)" }}>{t}</span>
                     </label>
                  ))}
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: "var(--dash-text-3)" }}>Min Match Score</p>
                  <input type="range" min={0} max={100} step={5} value={filters.minMatch}
                     onChange={e => setFilters(prev => ({ ...prev, minMatch: +e.target.value }))}
                     className="w-full" style={{ accentColor: "var(--dash-accent)" }} />
                  <div className="flex justify-between text-[11px]">
                     <span style={{ color: "var(--dash-text-3)" }}>Any</span>
                     <span style={{ color: "var(--dash-accent)" }}>{filters.minMatch}%+</span>
                  </div>
               </div>

               <button onClick={() => setFilters({ types: [], minMatch: 0 })} className="text-[12px] font-semibold w-full text-center" style={{ color: "var(--dash-accent)" }}>
                  Reset Filters
               </button>
            </aside>

            {/* Job List */}
            <main className="flex-1 overflow-y-auto">
               {loading ? (
                  <div className="p-6 space-y-3">
                     {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} className="h-[88px]" />)}
                  </div>
               ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
                     <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-5 opacity-30">
                        <circle cx="32" cy="32" r="28" stroke="#6C63FF" strokeWidth="2" />
                        <path d="M22 32h20M32 22v20" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" />
                     </svg>
                     <p className="text-[18px] font-black mb-2" style={{ color: "var(--dash-text-1)" }}>No Job Matches Yet</p>
                     <p className="text-[13px] max-w-xs" style={{ color: "var(--dash-text-2)" }}>Upload your resume to unlock AI-powered job matching tailored to your skills and experience.</p>
                     <Link href="/app/resume">
                        <button className="mt-5 h-10 px-6 rounded-xl text-[13px] font-semibold text-white" style={{ background: "var(--dash-accent)" }}>Upload Resume →</button>
                     </Link>
                  </div>
               ) : (
                  <div className="divide-y" style={{ borderColor: "var(--dash-border-1)" }}>
                     {filtered.map((job) => {
                        const initial = (job.company_name ?? "?")[0].toUpperCase()
                        const color = getAvatarColor(job.id)
                        const isActive = selected?.id === job.id
                        return (
                           <div
                              key={job.id}
                              className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all"
                              style={{
                                 background: isActive ? "var(--dash-surface-2)" : "transparent",
                                 borderLeft: isActive ? "2.5px solid var(--dash-accent)" : "2.5px solid transparent"
                              }}
                              onClick={() => setSelected(job)}
                           >
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-black flex-shrink-0" style={{ background: color }}>{initial}</div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-[14px] font-semibold truncate" style={{ color: "var(--dash-text-1)" }}>{job.job_title}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px]" style={{ color: "var(--dash-text-2)" }}>{job.company_name}</span>
                                    {job.location && <span className="text-[12px] flex items-center gap-1" style={{ color: "var(--dash-text-3)" }}><MapPin size={10} />{job.location}</span>}
                                    {job.job_type && <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "var(--dash-surface-2)", color: "var(--dash-text-3)" }}>{job.job_type}</span>}
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                 <MatchBadge pct={job.match_percent} />
                                 <button onClick={e => { e.stopPropagation(); handleSave(job) }} className="p-1.5 rounded-lg transition-colors" style={{ color: job.is_saved ? "var(--dash-accent)" : "var(--dash-text-3)" }}>
                                    {job.is_saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                                 </button>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               )}
            </main>

            {/* Detail Panel */}
            {selected && (
               <aside className="w-[420px] flex-shrink-0 overflow-y-auto border-l" style={{ background: "var(--dash-surface-1)", borderColor: "var(--dash-border-1)" }}>
                  <div className="p-5 space-y-5">
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                           <h2 className="text-[20px] font-black" style={{ color: "var(--dash-text-1)" }}>{selected.job_title}</h2>
                           <p className="text-[14px] mt-0.5" style={{ color: "var(--dash-text-2)" }}>{selected.company_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <MatchBadge pct={selected.match_percent} />
                           <button onClick={() => setSelected(null)} style={{ color: "var(--dash-text-3)" }}><X size={18} /></button>
                        </div>
                     </div>

                     {/* Tags */}
                     <div className="flex flex-wrap gap-2">
                        {[selected.location, selected.job_type, selected.industry, selected.experience_level].filter(Boolean).map((t, i) => (
                           <span key={i} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "var(--dash-surface-2)", color: "var(--dash-text-2)" }}>{t}</span>
                        ))}
                     </div>

                     {/* Match reasons */}
                     {(selected.match_reasons as string[])?.length > 0 && (
                        <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                           <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--dash-green)" }}>Why You Match</p>
                           {(selected.match_reasons as string[]).map((r, i) => (
                              <p key={i} className="text-[12px] flex items-start gap-1.5" style={{ color: "var(--dash-text-2)" }}><span style={{ color: "var(--dash-green)" }}>✓</span>{r}</p>
                           ))}
                        </div>
                     )}

                     {/* Description */}
                     {selected.description && (
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-text-3)" }}>Job Description</p>
                           <p className="text-[13px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>{selected.description}</p>
                        </div>
                     )}

                     {/* Requirements */}
                     {(selected.requirements as string[])?.length > 0 && (
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--dash-text-3)" }}>Requirements</p>
                           {(selected.requirements as string[]).map((r, i) => (
                              <div key={i} className="flex items-start gap-2 mb-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--dash-accent)" }} />
                                 <p className="text-[12px]" style={{ color: "var(--dash-text-2)" }}>{r}</p>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Empty description fallback */}
                     {!selected.description && (selected.requirements as string[])?.length === 0 && (
                        <p className="text-[13px] text-center py-6" style={{ color: "var(--dash-text-3)" }}>No additional details available for this job.</p>
                     )}

                     {/* Actions */}
                     <div className="flex gap-3 pt-2 sticky bottom-0" style={{ background: "var(--dash-surface-1)" }}>
                        <button
                           onClick={() => handleSave(selected)}
                           className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                           style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: selected.is_saved ? "var(--dash-accent)" : "var(--dash-text-2)" }}
                        >
                           {selected.is_saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                           {selected.is_saved ? "Saved" : "Save Job"}
                        </button>
                        {selected.apply_url ? (
                           <a href={selected.apply_url} target="_blank" rel="noreferrer" className="flex-1">
                              <button onClick={() => handleApply(selected)} className="w-full h-11 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: "var(--dash-green)" }}>
                                 Apply Now <ExternalLink size={13} />
                              </button>
                           </a>
                        ) : (
                           <button onClick={() => handleApply(selected)} className="flex-1 h-11 rounded-xl text-[13px] font-semibold text-white" style={{ background: selected.is_applied ? "var(--dash-surface-3)" : "var(--dash-green)", cursor: selected.is_applied ? "default" : "pointer" }}>
                              {selected.is_applied ? "Applied ✓" : "Mark as Applied"}
                           </button>
                        )}
                     </div>
                  </div>
               </aside>
            )}
         </div>
      </div>
   )
}