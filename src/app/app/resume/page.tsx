"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { analyzeResumeForJob, type AnalyzeResumeForJobOutput } from "@/ai/flows/analyze-resume-for-job-description";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ResumeAnalyzer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeResumeForJobOutput | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = async () => {
    if (!targetRole || !jobDescription) {
      toast({ title: "Please provide both a target role and job description.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Dummy data URI for demo since we can't easily process actual files in this environment without a full backend setup
      const dummyResumeData = "data:text/plain;base64,TXkgUmVzdW1lIENvbnRlbnQ=";
      const response = await analyzeResumeForJob({
        resumeDataUri: dummyResumeData,
        jobDescription: jobDescription,
        targetRole: targetRole
      });
      setResults(response);
    } catch (error) {
      toast({ title: "Analysis failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b border-[#1E1E30] pb-8">
        <div>
          <nav className="text-xs text-[#44445A] mb-2 uppercase tracking-widest font-bold">App / Resume Analyzer</nav>
          <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        </div>
        <Button onClick={() => setResults(null)} variant="outline" className="border-[#1E1E30] bg-[#0F0F1A] text-[#EEEEF5] hover:border-[#6C63FF]">
           New Analysis
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Panel: Config */}
        <aside className="lg:col-span-4 space-y-8 sticky top-8 h-fit">
          <Card className="bg-[#0F0F1A] border-[#1E1E30]">
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                 <Label className="text-sm font-bold text-[#8A8AA0]">Upload Resume (PDF/DOCX)</Label>
                 <div className="border-2 border-dashed border-[#1E1E30] rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all cursor-pointer">
                    <Upload className="text-[#44445A]" />
                    <p className="text-xs text-[#8A8AA0] font-medium text-center">Drag and drop or click to upload</p>
                    <p className="text-[10px] text-[#44445A]">Max 5MB • PDF, DOCX</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <Label className="text-sm font-bold text-[#8A8AA0]">Target Role</Label>
                 <Input 
                   placeholder="e.g. Product Manager" 
                   className="bg-[#161624] border-[#1E1E30]" 
                   value={targetRole}
                   onChange={(e) => setTargetRole(e.target.value)}
                 />
               </div>

               <div className="space-y-4">
                 <Label className="text-sm font-bold text-[#8A8AA0]">Target Job Description</Label>
                 <textarea 
                   rows={6}
                   placeholder="Paste the job description here..."
                   className="w-full bg-[#161624] border border-[#1E1E30] rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#6C63FF] outline-none"
                   value={jobDescription}
                   onChange={(e) => setJobDescription(e.target.value)}
                 />
               </div>

               <Button 
                 onClick={handleAnalyze} 
                 disabled={loading}
                 className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white h-12 font-bold"
                >
                 {loading ? "Analyzing..." : "Analyze Now"}
               </Button>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#44445A] uppercase tracking-widest">Previous Analyses</h3>
            {[
              { role: "Software Engineer", score: 82, date: "2 days ago" },
              { role: "Product Designer", score: 65, date: "1 week ago" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0F0F1A] border border-[#1E1E30] rounded-xl text-sm">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[#1E1E30] rounded-lg"><FileText size={14} /></div>
                   <div>
                     <p className="font-semibold">{p.role}</p>
                     <p className="text-xs text-[#44445A]">{p.date}</p>
                   </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.score > 75 ? 'bg-[#34D399]/10 text-[#34D399]' : 'bg-[#FBBF24]/10 text-[#FBBF24]'}`}>{p.score}%</div>
              </div>
            ))}
          </section>
        </aside>

        {/* Right Panel: Results */}
        <main className="lg:col-span-8">
           {!results && !loading && (
             <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 border border-[#1E1E30] border-dashed rounded-3xl opacity-50">
                <FileText size={64} className="text-[#1E1E30] mb-6" />
                <h2 className="text-2xl font-bold mb-2">Ready to optimize?</h2>
                <p className="text-[#8A8AA0] max-w-sm">Upload your resume and paste a job description to see how you rank against the competition.</p>
             </div>
           )}

           {loading && (
             <div className="space-y-12">
                <div className="flex gap-8 items-center">
                   <Skeleton className="w-32 h-32 rounded-full" />
                   <div className="flex-1 space-y-4">
                     <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="h-4 w-full" />
                   </div>
                </div>
                <div className="space-y-4">
                   <Skeleton className="h-24 w-full rounded-xl" />
                   <Skeleton className="h-24 w-full rounded-xl" />
                   <Skeleton className="h-24 w-full rounded-xl" />
                </div>
             </div>
           )}

           {results && (
             <div className="space-y-12 animate-in fade-in duration-500">
               {/* Score Header */}
               <section className="flex flex-col md:flex-row gap-12 items-center bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-3xl">
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#1E1E30]" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * results.atsScore) / 100} className={`${results.atsScore >= 80 ? 'text-[#34D399]' : results.atsScore >= 50 ? 'text-[#FBBF24]' : 'text-[#F87171]'} transition-all duration-1000 ease-out`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-bold">{results.atsScore}%</span>
                       <span className="text-[10px] uppercase font-bold text-[#8A8AA0]">ATS Score</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold">Good Match.</h2>
                    <p className="text-[#8A8AA0] leading-relaxed">
                      Your profile matches many key requirements. Improving specific keyword alignment and formatting structure could push your score above 90%.
                    </p>
                    <div className="flex gap-6 pt-4 border-t border-[#1E1E30]">
                       <div>
                         <p className="text-[10px] text-[#44445A] uppercase font-bold mb-1">Industry Avg</p>
                         <p className="text-xl font-bold">71%</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-[#44445A] uppercase font-bold mb-1">Next Milestone</p>
                         <p className="text-xl font-bold text-[#6C63FF]">90%</p>
                       </div>
                    </div>
                  </div>
               </section>

               {/* Suggestions List */}
               <section className="space-y-6">
                 <h3 className="text-lg font-bold">Actionable Improvements</h3>
                 <div className="space-y-4">
                    {results.suggestions.map((s, i) => (
                      <Card key={i} className="bg-[#0F0F1A] border-[#1E1E30] overflow-hidden group">
                        <CardContent className="p-0">
                           <div className="flex">
                              <div className={`w-1 transition-all group-hover:w-2 ${s.severity === 'Critical' ? 'bg-[#F87171]' : s.severity === 'Important' ? 'bg-[#FBBF24]' : 'bg-[#6C63FF]'}`} />
                              <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                   <Badge variant="secondary" className={`text-[10px] font-bold ${s.severity === 'Critical' ? 'bg-[#F87171]/10 text-[#F87171]' : s.severity === 'Important' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' : 'bg-[#6C63FF]/10 text-[#9B94FF]'}`}>
                                      {s.severity}
                                   </Badge>
                                   <span className="text-[10px] font-bold text-[#34D399]">{s.estimatedImpact}</span>
                                </div>
                                <h4 className="font-bold mb-2">{s.headline}</h4>
                                <p className="text-sm text-[#8A8AA0] leading-relaxed">{s.explanation}</p>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
               </section>

               <div className="flex flex-wrap gap-4 pt-8 border-t border-[#1E1E30]">
                 <Button variant="outline" className="border-[#1E1E30] text-[#8A8AA0]">Download Full Report</Button>
                 <Button variant="outline" className="border-[#1E1E30] text-[#8A8AA0]">Re-analyze with Edits</Button>
                 <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white">Find Matching Jobs <ArrowRight size={16} className="ml-2" /></Button>
               </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
