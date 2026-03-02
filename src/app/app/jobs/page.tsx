"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Briefcase, MapPin, Building, Clock, ChevronRight, X, Filter, Sparkles } from "lucide-react";

export default function JobMatcher() {
  const [showFilters, setShowFilters] = useState(false);
  
  const jobs = [
    { title: "Senior Product Manager", company: "Google", location: "Remote", type: "Full-Time", exp: "Senior", industry: "Tech", match: 94, date: "2d ago" },
    { title: "Technical Project Lead", company: "Stripe", location: "New York, NY", type: "Full-Time", exp: "Senior", industry: "Fintech", match: 88, date: "3d ago" },
    { title: "Growth Marketing Manager", company: "Meta", location: "Menlo Park, CA", type: "Contract", exp: "Mid", industry: "Tech", match: 81, date: "5d ago" },
    { title: "Strategy Consultant", company: "McKinsey", location: "London, UK", type: "Full-Time", exp: "Mid", industry: "Consulting", match: 79, date: "1w ago" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#07070D]">
      <header className="p-8 border-b border-[#1E1E30] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold">Job Matcher</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-[#34D399] font-bold">✓</span>
             <span className="text-xs text-[#8A8AA0]">Resume: <span className="text-[#EEEEF5]">JohnDoe_Resume_2025.pdf</span></span>
             <button className="text-[10px] text-[#6C63FF] font-bold hover:underline ml-2">Change</button>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="flex items-center bg-[#0F0F1A] border border-[#1E1E30] px-3 h-10 rounded-lg flex-1 md:w-[320px]">
              <Search size={16} className="text-[#44445A]" />
              <input className="bg-transparent border-none outline-none text-sm px-2 text-[#EEEEF5] placeholder-[#44445A] w-full" placeholder="Search by title, company, or skills..." />
           </div>
           <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className={`border-[#1E1E30] bg-[#0F0F1A] md:hidden`}>
              <Filter size={18} />
           </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <aside className={`fixed md:static inset-0 z-50 md:z-0 bg-[#07070D] md:bg-transparent md:block w-72 border-r border-[#1E1E30] overflow-y-auto p-8 transform transition-transform duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
           <div className="flex justify-between items-center md:hidden mb-8">
             <h3 className="font-bold">Filters</h3>
             <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X size={20} /></Button>
           </div>
           
           <div className="space-y-10">
              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#44445A]">AI Match Score</h4>
                <div className="space-y-4">
                   <div className="flex justify-between text-xs font-medium">
                      <span>Minimum 70%</span>
                      <span className="text-[#6C63FF]">Optimal</span>
                   </div>
                   <Slider defaultValue={[70]} max={100} step={1} className="[&_[role=slider]]:bg-[#6C63FF]" />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#44445A]">Job Type</h4>
                <div className="space-y-3">
                   {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'].map((type) => (
                     <div key={type} className="flex items-center gap-2 group cursor-pointer">
                        <Checkbox id={type} className="border-[#1E1E30] data-[state=checked]:bg-[#6C63FF]" />
                        <label htmlFor={type} className="text-sm text-[#8A8AA0] group-hover:text-[#EEEEF5] cursor-pointer transition-colors">{type}</label>
                     </div>
                   ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#44445A]">Industry</h4>
                <div className="flex flex-wrap gap-2">
                   {['Tech', 'Finance', 'Health', 'Design', 'Marketing', 'Legal'].map((ind) => (
                     <Badge key={ind} variant="outline" className="bg-[#161624] border-[#1E1E30] text-[10px] hover:border-[#6C63FF] cursor-pointer transition-colors">
                        {ind}
                     </Badge>
                   ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#44445A]">Experience</h4>
                <div className="space-y-3">
                   {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
                     <div key={level} className="flex items-center gap-2 group">
                        <input type="radio" name="exp" id={level} className="accent-[#6C63FF] w-4 h-4" />
                        <label htmlFor={level} className="text-sm text-[#8A8AA0] group-hover:text-[#EEEEF5]">{level}</label>
                     </div>
                   ))}
                </div>
              </section>

              <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-xs font-bold h-10">
                 Apply Filters
              </Button>
              <button className="w-full text-center text-[10px] font-bold text-[#44445A] hover:text-[#EEEEF5] transition-colors">RESET ALL</button>
           </div>
        </aside>

        {/* Main Jobs Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#07070D]">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-2 text-xs font-bold text-[#44445A]">
                <span>24 jobs found</span>
                <span className="w-1 h-1 rounded-full bg-[#1E1E30]" />
                <span>Sorted by Match</span>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-[#0F0F1A] border-[#1E1E30] text-[11px] h-8">List</Button>
                <Button variant="outline" size="sm" className="bg-[#0F0F1A] border-[#1E1E30] text-[11px] h-8 opacity-50">Grid</Button>
             </div>
          </div>

          <div className="space-y-4">
             {jobs.map((job, i) => (
               <Card key={i} className="bg-[#0F0F1A] border-[#1E1E30] card-hover-effect group relative overflow-hidden">
                 {/* Match Sparkle background */}
                 {job.match > 90 && (
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={120} className="text-[#6C63FF]" />
                   </div>
                 )}
                 <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                       <div className="flex gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                            ['#6C63FF', '#34D399', '#FBBF24', '#F87171'][i % 4]
                          }`} style={{backgroundColor: ['#6C63FF', '#34D399', '#FBBF24', '#F87171'][i % 4]}}>
                             {job.company[0]}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <p className="text-sm font-bold text-[#8A8AA0]">{job.company}</p>
                               <span className="w-1 h-1 rounded-full bg-[#44445A]" />
                               <p className="text-xs text-[#44445A]">{job.date}</p>
                             </div>
                             <h4 className="text-xl font-bold group-hover:text-[#6C63FF] transition-colors">{job.title}</h4>
                             <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="secondary" className="bg-[#1E1E30] text-[#EEEEF5] text-[10px] font-medium h-6">
                                   <MapPin size={10} className="mr-1" /> {job.location}
                                </Badge>
                                <Badge variant="secondary" className="bg-[#1E1E30] text-[#EEEEF5] text-[10px] font-medium h-6">
                                   <Briefcase size={10} className="mr-1" /> {job.type}
                                </Badge>
                                <Badge variant="secondary" className="bg-[#1E1E30] text-[#EEEEF5] text-[10px] font-medium h-6">
                                   <Building size={10} className="mr-1" /> {job.industry}
                                </Badge>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-row md:flex-col justify-between items-end gap-2">
                          <div className="bg-[#6C63FF]/10 border border-[#6C63FF]/20 px-4 py-2 rounded-xl text-center">
                             <p className="text-[10px] font-bold text-[#9B94FF] uppercase tracking-tighter">AI Match</p>
                             <p className="text-2xl font-black text-[#EEEEF5]">{job.match}%</p>
                          </div>
                          <Button variant="ghost" className="h-10 text-[#6C63FF] hover:bg-[#6C63FF]/10 text-xs font-bold group">
                             View Details <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                       </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-[#1E1E30]">
                       <p className="text-sm text-[#8A8AA0] line-clamp-2 leading-relaxed">
                         We are looking for a visionary {job.title} to join our growing team. You will be responsible for defining the product roadmap, 
                         executing on our core strategy, and leading a cross-functional team of world-class engineers and designers...
                       </p>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          <div className="mt-12 text-center">
             <Button variant="outline" className="border-[#1E1E30] bg-[#0F0F1A] text-[#8A8AA0] px-8 h-12">Load 20 More Jobs</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
