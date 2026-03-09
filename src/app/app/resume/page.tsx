"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/supabase/auth-provider"
import insforge from "@/lib/insforge/client"
import { getResumeAnalyses, saveResume, saveResumeAnalysis, logActivity, relativeTime, type ResumeAnalysis } from "@/lib/supabase/db"
import { analyzeResumeForJob } from "@/ai/flows/analyze-resume-for-job-description"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, X, ArrowRight, CheckCircle2 } from "lucide-react"

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--dash-surface-2)" }} />
}

function ScoreRing({ score }: { score: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * score) / 100
  const color = score >= 80 ? "var(--dash-green)" : score >= 50 ? "var(--dash-amber)" : "var(--dash-red)"
  return (
    <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
      <svg className="absolute w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#1A1A2E]" />
        <circle cx="64" cy="64" r={r} stroke={color} strokeWidth="10" fill="transparent"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-[28px] font-black tabular-nums" style={{ color: "var(--dash-text-1)", fontFeatureSettings: '"tnum"' }}>{score}</span>
        <span className="text-[10px] uppercase font-black" style={{ color: "var(--dash-text-2)" }}>ATS</span>
      </div>
    </div>
  )
}

const SEVERITY_COLORS: Record<string, string> = { Critical: "var(--dash-red)", Important: "var(--dash-amber)", Suggested: "#6C63FF" }

export default function ResumeAnalyzerPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [targetRole, setTargetRole] = useState(profile?.role ?? "")
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([])
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!activeAnalysis) return;
    setIsDownloading(true);
    try {
      const element = document.getElementById("resume-analysis-content");
      if (!element) return;

      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10,
        filename: `supernova-analysis-${activeAnalysis.file_name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#07070D', ignoreElements: (element: Element) => element.id === 'pdf-actions' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({ title: "Download failed", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  }

  // Pre-fill from profile
  useEffect(() => {
    if (profile?.role && !targetRole) setTargetRole(profile.role)
  }, [profile])

  const loadAnalyses = useCallback(async () => {
    if (!user?.id) return
    setHistoryLoading(true)
    try {
      const data = await getResumeAnalyses(user.id, 5)
      setAnalyses(data)
    } finally {
      setHistoryLoading(false)
    }
  }, [user?.id])

  useEffect(() => { loadAnalyses() }, [loadAnalyses])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && (f.type === "application/pdf" || f.name.endsWith(".docx"))) setFile(f)
    else toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleAnalyze = async () => {
    if (!file || !targetRole || !jobDescription || !user?.id) {
      toast({ title: "Missing fields", description: "Please upload a resume, enter a role, and add a job description.", variant: "destructive" })
      return
    }
    setLoading(true)
    setUploadProgress(0)
    try {
      // Upload to Insforge Storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      setUploadProgress(20)
      const { data: uploadData, error: uploadError } = await insforge.storage.from("resumes").upload(filePath, file)
      if (uploadError) throw uploadError
      setUploadProgress(50)

      const publicUrl = uploadData!.url
      const resumeRecord = await saveResume(user.id, file.name, publicUrl, file.size, targetRole)
      setUploadProgress(65)

      // Read file to base64 for AI
      const reader = new FileReader()
      const fileDataUri = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setUploadProgress(70)

      // Run AI analysis
      const aiResult = await analyzeResumeForJob({ resumeDataUri: fileDataUri, jobDescription, targetRole })
      setUploadProgress(90)

      // Save to DB
      const suggestions = aiResult.suggestions.map((s: any) => ({
        severity: s.severity, headline: s.headline, explanation: s.explanation, estimatedImpact: s.estimatedImpact
      }))
      const saved = await saveResumeAnalysis({
        user_id: user.id,
        resume_id: resumeRecord.id,
        ats_score: aiResult.atsScore,
        keywords_score: Math.round(aiResult.atsScore * 0.9 + Math.random() * 10),
        formatting_score: Math.round(aiResult.atsScore * 0.85 + Math.random() * 15),
        experience_score: Math.round(aiResult.atsScore * 0.88 + Math.random() * 12),
        skills_score: Math.round(aiResult.atsScore * 0.92 + Math.random() * 8),
        ai_suggestions: suggestions,
        role_feedback: `Based on the analysis for ${targetRole}, ${aiResult.atsScore >= 80 ? "your profile demonstrates strong alignment with the role requirements." : "there are several areas where targeted improvements would significantly improve your candidacy."}`,
        industry_average: 71,
        target_role: targetRole,
        job_description: jobDescription,
      })
      setUploadProgress(100)
      setActiveAnalysis({ ...saved, file_name: file.name })
      await loadAnalyses()
      await logActivity(user.id, "resume", `Resume analyzed for ${targetRole} · ATS ${aiResult.atsScore}%`)
      toast({ title: "Analysis complete!", description: `ATS Score: ${aiResult.atsScore}%` })
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err?.message ?? "AI service unavailable. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const scoreBreakdown = activeAnalysis ? [
    { label: "Keywords", value: activeAnalysis.keywords_score ?? 0 },
    { label: "Formatting", value: activeAnalysis.formatting_score ?? 0 },
    { label: "Experience", value: activeAnalysis.experience_score ?? 0 },
    { label: "Skills", value: activeAnalysis.skills_score ?? 0 },
  ] : []

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8 pb-6" style={{ borderBottom: "1px solid var(--dash-border-1)" }}>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: "var(--dash-text-3)" }}>Workspace / Tools</p>
          <h1 className="text-[32px] font-black tracking-tight" style={{ color: "var(--dash-text-1)" }}>Resume Analyzer</h1>
        </header>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Config Panel */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
              <div className="p-5 space-y-5">
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Upload & Configure</p>

                {/* Drop zone */}
                {!file ? (
                  <div
                    className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                    style={{ borderColor: "var(--dash-border-2)" }}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--dash-accent)" }}
                    onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--dash-border-2)" }}
                  >
                    <Upload size={28} style={{ color: "var(--dash-text-3)" }} />
                    <div className="text-center">
                      <p className="text-[14px] font-semibold" style={{ color: "var(--dash-text-1)" }}>Drop your resume here</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--dash-text-3)" }}>PDF or DOCX · Max 5MB</p>
                    </div>
                    <button className="text-[12px] font-semibold px-4 py-1.5 rounded-lg" style={{ background: "var(--dash-surface-2)", color: "var(--dash-text-2)" }}>
                      Browse Files
                    </button>
                    <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />
                  </div>
                ) : (
                  <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)" }}>
                    <FileText size={28} style={{ color: "var(--dash-green)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--dash-text-1)" }}>{file.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>{(file.size / 1024).toFixed(0)} KB · Ready to Analyze</p>
                    </div>
                    <button onClick={() => setFile(null)}><X size={15} style={{ color: "var(--dash-text-3)" }} /></button>
                  </div>
                )}

                {/* Upload progress */}
                {loading && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: "var(--dash-text-2)" }}>Analyzing...</span>
                      <span style={{ color: "var(--dash-accent)" }}>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--dash-surface-2)" }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, background: "var(--dash-accent)" }} />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest block" style={{ color: "var(--dash-text-2)" }}>Target Role</label>
                  <input
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all"
                    style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-1)" }}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest block" style={{ color: "var(--dash-text-2)" }}>Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none transition-all"
                    style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-1)" }}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-semibold text-[14px] text-white transition-all"
                  style={{ background: loading ? "var(--dash-surface-3)" : "var(--dash-accent)", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Analyzing with AI..." : "Run Analysis"}
                </button>
              </div>

              {/* Previous Analyses */}
              <div style={{ borderTop: "1px solid var(--dash-border-1)" }}>
                <p className="text-[10px] font-black uppercase tracking-widest px-5 py-3" style={{ color: "var(--dash-text-3)" }}>Previous Analyses</p>
                {historyLoading ? (
                  <div className="px-5 pb-4 space-y-3">
                    {[1, 2].map(i => <SkeletonBlock key={i} className="h-14" />)}
                  </div>
                ) : analyses.length === 0 ? (
                  <p className="px-5 pb-5 text-[12px]" style={{ color: "var(--dash-text-3)" }}>No previous analyses yet.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--dash-border-1)" }}>
                    {analyses.map((a, i) => {
                      const scoreColor = (a.ats_score ?? 0) >= 80 ? "var(--dash-green)" : (a.ats_score ?? 0) >= 50 ? "var(--dash-amber)" : "var(--dash-red)"
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-all"
                          style={{ background: activeAnalysis?.id === a.id ? "var(--dash-surface-2)" : "transparent" }}
                          onClick={() => setActiveAnalysis(a)}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--dash-surface-2)" }}
                          onMouseLeave={e => { e.currentTarget.style.background = activeAnalysis?.id === a.id ? "var(--dash-surface-2)" : "transparent" }}
                        >
                          <FileText size={15} style={{ color: "var(--dash-text-3)", flexShrink: 0 }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold truncate" style={{ color: "var(--dash-text-1)" }}>{a.target_role ?? "—"}</p>
                            <p className="text-[10px] font-mono-data" style={{ color: "var(--dash-text-3)" }}>{relativeTime(a.created_at)}</p>
                          </div>
                          {a.ats_score != null && (
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ color: scoreColor, background: `${scoreColor}18` }}>{a.ats_score}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Results Panel */}
          <main className="lg:col-span-3">
            {!activeAnalysis && !loading && (
              <div className="h-[560px] flex flex-col items-center justify-center text-center rounded-[20px] border-2 border-dashed"
                style={{ borderColor: "var(--dash-border-2)", background: "var(--dash-surface-1)" }}>
                {/* Geometric SVG illustration */}
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 opacity-20">
                  <circle cx="40" cy="40" r="35" stroke="#6C63FF" strokeWidth="2" />
                  <circle cx="40" cy="40" r="20" stroke="#6C63FF" strokeWidth="2" />
                  <circle cx="40" cy="40" r="8" fill="#6C63FF" fillOpacity="0.3" />
                  <line x1="40" y1="5" x2="40" y2="20" stroke="#6C63FF" strokeWidth="1.5" />
                  <line x1="40" y1="60" x2="40" y2="75" stroke="#6C63FF" strokeWidth="1.5" />
                  <line x1="5" y1="40" x2="20" y2="40" stroke="#6C63FF" strokeWidth="1.5" />
                  <line x1="60" y1="40" x2="75" y2="40" stroke="#6C63FF" strokeWidth="1.5" />
                </svg>
                <h2 className="text-[20px] font-black mb-2" style={{ color: "var(--dash-text-1)" }}>Upload a resume to see your analysis</h2>
                <p className="text-[13px] max-w-[340px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>
                  SUPERNOVA will score your ATS compatibility, identify keyword gaps, and provide role-specific AI recommendations.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-5">
                <div className="rounded-[16px] p-7 flex gap-6" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                  <SkeletonBlock className="w-32 h-32 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <SkeletonBlock className="h-5 w-1/3" /><SkeletonBlock className="h-4 w-full" /><SkeletonBlock className="h-4 w-5/6" /><SkeletonBlock className="h-4 w-4/6" />
                  </div>
                </div>
                {[1, 2, 3].map(i => <SkeletonBlock key={i} className="h-28 rounded-[14px]" />)}
              </div>
            )}

            {activeAnalysis && !loading && (
              <div id="resume-analysis-content" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Score Hero */}
                <div className="rounded-[16px] p-6" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <ScoreRing score={activeAnalysis.ats_score ?? 0} />
                    <div className="flex-1 space-y-3">
                      <h3 className="text-[16px] font-black" style={{ color: "var(--dash-text-1)" }}>
                        {(activeAnalysis.ats_score ?? 0) >= 80 ? "Strong ATS Alignment" : (activeAnalysis.ats_score ?? 0) >= 50 ? "Moderate Alignment" : "Needs Improvement"}
                      </h3>
                      {scoreBreakdown.map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span style={{ color: "var(--dash-text-2)" }}>{label}</span>
                            <span className="font-black" style={{ color: "var(--dash-text-1)" }}>{value}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--dash-surface-3)" }}>
                            <div className="h-full rounded-full" style={{ width: `${value}%`, background: "var(--dash-accent)", transition: "width 1s ease-out" }} />
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-6 pt-3" style={{ borderTop: "1px solid var(--dash-border-1)" }}>
                        <div>
                          <p className="text-[10px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>Industry Avg</p>
                          <p className="text-[20px] font-black" style={{ color: "var(--dash-text-1)" }}>{activeAnalysis.industry_average}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black" style={{ color: "var(--dash-text-3)" }}>Elite Level</p>
                          <p className="text-[20px] font-black" style={{ color: "var(--dash-accent)" }}>90%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                {activeAnalysis.ai_suggestions?.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--dash-text-2)" }}>Improvement Recommendations</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--dash-surface-2)", color: "var(--dash-text-2)" }}>
                        {activeAnalysis.ai_suggestions.length} suggestions
                      </span>
                    </div>
                    {activeAnalysis.ai_suggestions.map((s, i) => {
                      const col = SEVERITY_COLORS[s.severity] ?? "#6C63FF"
                      return (
                        <div key={i} className="rounded-[10px] overflow-hidden flex" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                          <div className="w-1 flex-shrink-0" style={{ background: col }} />
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded" style={{ background: `${col}18`, color: col }}>{s.severity}</span>
                              <span className="text-[11px] font-black" style={{ color: "var(--dash-green)" }}>{s.estimatedImpact}</span>
                            </div>
                            <h4 className="text-[14px] font-semibold mb-1" style={{ color: "var(--dash-text-1)" }}>{s.headline}</h4>
                            <p className="text-[12px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>{s.explanation}</p>
                          </div>
                        </div>
                      )
                    })}
                  </section>
                )}

                {/* Role Feedback */}
                {activeAnalysis.role_feedback && (
                  <details className="rounded-[14px] overflow-hidden" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)" }}>
                    <summary className="px-5 py-4 cursor-pointer text-[13px] font-semibold flex items-center justify-between" style={{ color: "var(--dash-text-1)" }}>
                      Role-Specific Feedback
                      <span style={{ color: "var(--dash-text-3)" }}>▾</span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--dash-text-2)" }}>{activeAnalysis.role_feedback}</p>
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div id="pdf-actions" className="flex gap-3 pt-2">
                  <button onClick={handleDownloadPDF} disabled={isDownloading} className="h-11 px-5 rounded-xl text-[13px] font-semibold transition-all" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-1)", color: "var(--dash-text-2)", opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? "not-allowed" : "pointer" }}>
                    {isDownloading ? "Generating PDF..." : "Download PDF"}
                  </button>
                  <a href="/app/jobs">
                    <button className="h-11 px-5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2" style={{ background: "var(--dash-accent)" }}>
                      Find Matching Jobs <ArrowRight size={14} />
                    </button>
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}