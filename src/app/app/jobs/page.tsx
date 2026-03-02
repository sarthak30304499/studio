"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Briefcase, MapPin, Building, ChevronRight, X, Filter, Sparkles } from "lucide-react";

export default function JobMatcher() {
  const [showFilters, setShowFilters] = useState(false);
  
  const jobs = [
    { title: "Senior Product Manager", company: "Google", location: "Remote", type: "Full-Time", exp: "Senior", industry: "Tech", match: 94, date: "2d ago" },
    { title: "Technical Project Lead", company: "Stripe", location: "New York, NY", type: "Full-Time", exp: "Senior", industry: "Fintech", match: 88, date: "3d ago" },
    { title: "Growth Marketing Manager", company: "Meta", location: "Menlo Park, CA", type: "Contract", exp: "Mid", industry: "Tech", match: 81, date: "5d ago" },
    { title: "Strategy Consultant", company: "McKinsey", location: "London, UK", type: "Full-Time", exp: "Mid", industry: "Consulting", match: 79, date: "1w ago" },
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="p-6 md:p-8 border-b border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Job Matcher</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-primary font-black">✓</span>
             <span className="text-xs text-muted-foreground font-medium">Resume Active: <span className="text-foreground">JohnDoe_Senior_Dev.pdf</span></span>
             <button className="text-[10px] text-primary font-black hover:underline uppercase tracking-widest ml-4 transition-all">Change</button>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="flex items-center bg-background border border-border px-4 h-11 rounded-xl flex-1 md:w-[360px] focus-within:ring-2 ring-primary/20 transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input className="bg-transparent border-none outline-none text-sm px-3 text-foreground placeholder-muted-foreground w-full" placeholder="Keywords, company, or role..." />
           </div>
           <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className={`h-11 w-11 p-0 border-border bg-background md:hidden`}>
              <Filter size={20} />
           </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Filters */}
        <aside className={`fixed md:static inset-0 z-50 md:z-0 bg-card md:bg-transparent md:block w-full md:w-80 border-r border-border overflow-y-auto p-8 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
           <div className="flex justify-between items-center md:hidden mb-10">
             <h3 className="text-xl font-black uppercase tracking-tight">Filters</h3>
             <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="h-10 w-10"><X size={24} /></Button>
           </div>
           
           <div className="space-y-12">
              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">AI Match Sensitivity</h4>
                <div className="space-y-4">
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Min 70%</span>
                      <span className="text-primary">Optimized</span>
                   </div>
                   <Slider defaultValue={[70]} max={100} step={1} className="py-2" />
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Job Modality</h4>
                <div className="space-y-4">
                   {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'].map((type) => (
                     <div key={type} className="flex items-center gap-3 group cursor-pointer">
                        <Checkbox id={type} className="border-border data-[state=checked]:bg-primary h-5 w-5 rounded-md" />
                        <label htmlFor={type} className="text-sm font-medium text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors">{type}</label>
                     </div>
                   ))}
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Industry Verticals</h4>
                <div className="flex flex-wrap gap-2.5">
                   {['Tech', 'Finance', 'Health', 'Design', 'Marketing', 'Legal'].map((ind) => (
                     <Badge key={ind} variant="outline" className="bg-muted border-border text-[10px] px-3 py-1 font-bold hover:border-primary hover:text-primary cursor-pointer transition-all">
                        {ind}
                     </Badge>
                   ))}
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Experience Level</h4>
                <div className="space-y-4">
                   {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
                     <div key={level} className="flex items-center gap-3 group">
                        <input type="radio" name="exp" id={level} className="accent-primary w-4 h-4" />
                        <label htmlFor={level} className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-all">{level}</label>
                     </div>
                   ))}
                </div>
              </section>

              <div className="pt-6 space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/10">
                   Apply Filters
                </Button>
                <button className="w-full text-center text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Reset All Parameters</button>
              </div>
           </div>
        </aside>

        {/* Main Jobs Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="flex justify-between items-center mb-10">
             <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="text-primary">24 matches</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>Sort: Best Fit</span>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-card border-border text-[11px] font-bold h-9 px-4">List</Button>
                <Button variant="outline" size="sm" className="bg-card border-border text-[11px] font-bold h-9 px-4 opacity-40">Grid</Button>
             </div>
          </div>

          <div className="space-y-6">
             {jobs.map((job, i) => (
               <Card key={i} className="bg-card border-border card-hover-effect group relative overflow-hidden">
                 {job.match > 90 && (
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Sparkles size={120} className="text-primary" />
                   </div>
                 )}
                 <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                       <div className="flex gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ${
                            ['bg-primary', 'bg-accent', 'bg-destructive', 'bg-primary/80'][i % 4]
                          }`}>
                             {job.company[0]}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2 mb-1">
                               <p className="text-sm font-bold text-muted-foreground">{job.company}</p>
                               <span className="w-1 h-1 rounded-full bg-border" />
                               <p className="text-[11px] font-bold text-muted-foreground uppercase">{job.date}</p>
                             </div>
                             <h4 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{job.title}</h4>
                             <div className="flex flex-wrap gap-2.5 mt-5">
                                <Badge variant="secondary" className="bg-muted text-foreground border-border text-[10px] font-bold h-7 px-3">
                                   <MapPin size={12} className="mr-1.5 opacity-50" /> {job.location}
                                </Badge>
                                <Badge variant="secondary" className="bg-muted text-foreground border-border text-[10px] font-bold h-7 px-3">
                                   <Briefcase size={12} className="mr-1.5 opacity-50" /> {job.type}
                                </Badge>
                                <Badge variant="secondary" className="bg-muted text-foreground border-border text-[10px] font-bold h-7 px-3">
                                   <Building size={12} className="mr-1.5 opacity-50" /> {job.industry}
                                </Badge>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-row md:flex-col justify-between items-end gap-3 min-w-[120px]">
                          <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl text-center shadow-sm">
                             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">AI Rank</p>
                             <p className="text-3xl font-black text-foreground tracking-tighter">{job.match}%</p>
                          </div>
                          <Button variant="ghost" className="h-11 text-primary hover:bg-primary/10 text-xs font-black group uppercase tracking-widest">
                             Explore <ChevronRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                          </Button>
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-border">
                       <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                         Strategic role for a visionary {job.title}. You will lead multi-disciplinary teams to define product roadmaps, 
                         execute scaling strategies, and drive innovation within our core technology architecture...
                       </p>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          <div className="mt-16 text-center">
             <Button variant="outline" className="border-border bg-card text-muted-foreground font-black px-10 h-14 hover:border-primary hover:text-primary uppercase tracking-[0.2em]">Load More Opportunities</Button>
          </div>
        </main>
      </div>
    </div>
  );
}