"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, ArrowRight, Skeleton } from "lucide-react";
import { analyzeResumeForJob, type AnalyzeResumeForJobOutput } from "@/ai/flows/analyze-resume-for-job-description";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ResumeAnalyzer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeResumeForJobOutput | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = async () => {
    if (!targetRole || !jobDescription) {
      toast({ title: "Configuration incomplete", description: "Please provide both a role and job description.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const dummyResumeData = "data:text/plain;base64,TXkgUmVzdW1lIENvbnRlbnQ=";
      const response = await analyzeResumeForJob({
        resumeDataUri: dummyResumeData,
        jobDescription: jobDescription,
        targetRole: targetRole
      });
      setResults(response);
    } catch (error) {
      toast({ title: "Analysis failed", description: "AI service is temporarily unavailable.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-10 gap-6">
        <div>
          <nav className="text-[10px] text-muted-foreground mb-3 uppercase tracking-[0.3em] font-black">Workspace / Intelligence</nav>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Resume Analyzer</h1>
        </div>
        <Button onClick={() => setResults(null)} variant="outline" className="h-12 px-8 border-border bg-card text-foreground font-black hover:border-primary uppercase tracking-widest text-xs">
           New Analysis
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10 md:gap-16">
        {/* Left Panel: Config */}
        <aside className="lg:col-span-4 space-y-10">
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-8 space-y-8">
               <div className="space-y-4">
                 <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">1. Document Upload</Label>
                 <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                    <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={28} />
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">Click to upload resume</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">PDF, DOCX • MAX 5MB</p>
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">2. Target Parameters</Label>
                 <Input 
                   placeholder="Target Role (e.g. Senior Product Manager)" 
                   className="h-12 bg-background border-border focus:ring-primary/20" 
                   value={targetRole}
                   onChange={(e) => setTargetRole(e.target.value)}
                 />
               </div>

               <div className="space-y-4">
                 <textarea 
                   rows={6}
                   placeholder="Paste the full job description here for deep analysis..."
                   className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
                   value={jobDescription}
                   onChange={(e) => setJobDescription(e.target.value)}
                 />
               </div>

               <Button 
                 onClick={handleAnalyze} 
                 disabled={loading}
                 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/10"
                >
                 {loading ? "Optimizing Profile..." : "Run Analysis"}
               </Button>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Session History</h3>
            {[
              { role: "Software Engineer", score: 82, date: "2 days ago" },
              { role: "Product Designer", score: 65, date: "1 week ago" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-card border border-border rounded-xl group hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-muted rounded-xl text-muted-foreground group-hover:text-primary transition-all"><FileText size={18} /></div>
                   <div>
                     <p className="font-bold text-sm">{p.role}</p>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{p.date}</p>
                   </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-black tracking-tight ${p.score > 75 ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>{p.score}%</div>
              </div>
            ))}
          </section>
        </aside>

        {/* Right Panel: Results */}
        <main className="lg:col-span-8">
           {!results && !loading && (
             <div className="h-[640px] flex flex-col items-center justify-center text-center p-16 border border-border border-dashed rounded-[32px] bg-card/30">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8">
                  <FileText size={40} className="text-muted-foreground opacity-30" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tight">Intelligence Ready.</h2>
                <p className="text-muted-foreground max-w-sm leading-relaxed font-medium">Upload your profile and target job description to generate a high-precision ATS compatibility report.</p>
             </div>
           )}

           {loading && (
             <div className="space-y-12">
                <div className="flex gap-10 items-center bg-card border border-border p-10 rounded-[32px]">
                   <Skeleton className="w-40 h-40 rounded-full" />
                   <div className="flex-1 space-y-6">
                     <Skeleton className="h-6 w-1/3" />
                     <Skeleton className="h-20 w-full" />
                   </div>
                </div>
                <div className="space-y-6">
                   <Skeleton className="h-32 w-full rounded-2xl" />
                   <Skeleton className="h-32 w-full rounded-2xl" />
                   <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
             </div>
           )}

           {results && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
               {/* Score Header */}
               <section className="flex flex-col md:flex-row gap-12 items-center bg-card border border-border p-12 rounded-[32px] relative overflow-hidden group">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-muted/10" />
                      <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={527} strokeDashoffset={527 - (527 * results.atsScore) / 100} className={`${results.atsScore >= 80 ? 'text-primary' : results.atsScore >= 50 ? 'text-accent' : 'text-destructive'} transition-all duration-1000 ease-out`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black tracking-tighter">{results.atsScore}%</span>
                       <span className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.2em] mt-1">ATS Match</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-5 text-center md:text-left">
                    <h2 className="text-3xl font-black tracking-tight">Strong Alignment.</h2>
                    <p className="text-muted-foreground leading-relaxed text-base font-medium">
                      Your professional profile demonstrates high keyword overlap. To reach elite status (90%+), prioritize quantifying your impacts using metrics and refining your structural headers.
                    </p>
                    <div className="flex justify-center md:justify-start gap-10 pt-6 border-t border-border">
                       <div>
                         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Market Avg</p>
                         <p className="text-2xl font-black">71%</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Elite Level</p>
                         <p className="text-2xl font-black text-primary">90%</p>
                       </div>
                    </div>
                  </div>
               </section>

               {/* Suggestions List */}
               <section className="space-y-8">
                 <h3 className="text-xl font-black uppercase tracking-tight">Strategic Improvements</h3>
                 <div className="space-y-6">
                    {results.suggestions.map((s, i) => (
                      <Card key={i} className="bg-card border-border overflow-hidden group card-hover-effect">
                        <CardContent className="p-0">
                           <div className="flex">
                              <div className={`w-2 transition-all group-hover:w-3 ${s.severity === 'Critical' ? 'bg-destructive' : s.severity === 'Important' ? 'bg-accent' : 'bg-primary'}`} />
                              <div className="p-8 flex-1">
                                <div className="flex items-center justify-between mb-5">
                                   <Badge variant="secondary" className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-none ${s.severity === 'Critical' ? 'bg-destructive/10 text-destructive' : s.severity === 'Important' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                                      {s.severity}
                                   </Badge>
                                   <span className="text-[11px] font-black text-primary uppercase tracking-widest">{s.estimatedImpact}</span>
                                </div>
                                <h4 className="text-xl font-black tracking-tight mb-3">{s.headline}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{s.explanation}</p>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
               </section>

               <div className="flex flex-wrap gap-4 pt-10 border-t border-border">
                 <Button variant="outline" className="h-12 border-border text-muted-foreground font-black px-8 uppercase tracking-widest text-xs hover:text-foreground">Export PDF Report</Button>
                 <Button variant="outline" className="h-12 border-border text-muted-foreground font-black px-8 uppercase tracking-widest text-xs hover:text-foreground">History Log</Button>
                 <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 uppercase tracking-widest text-xs ml-auto shadow-lg shadow-primary/20">Find Matching Roles <ArrowRight size={16} className="ml-2" /></Button>
               </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}