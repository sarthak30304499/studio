import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Shield, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center px-6 overflow-hidden hero-glow">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span>✦</span>
          AI Career Intelligence
          <ArrowRight size={14} className="ml-1" />
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-center max-w-5xl tracking-tighter gradient-text leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          The AI Platform That Gets You Hired.
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground text-center max-w-2xl leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300">
          Resume analysis. Intelligent job matching. Interview mastery. Higher education roadmaps. 
          One platform — built for every job seeker, in every field.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-in fade-in duration-1000 delay-500">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Start for Free
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline" className="h-14 px-10 border-border bg-background/50 hover:border-primary hover:bg-primary/5 text-base font-bold group">
              <Play size={18} className="mr-2 fill-current" />
              See Demo
            </Button>
          </Link>
        </div>

        <div className="text-[11px] md:text-xs text-muted-foreground font-bold flex flex-wrap justify-center gap-6 items-center animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-1.5">
            <span className="text-accent">★★★★★</span> 4.9 Global Rating
          </div>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div>50,000+ Profiles Optimized</div>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div>Used in 120+ Countries</div>
        </div>

        {/* Hero Mockup */}
        <div className="mt-24 w-full max-w-6xl mx-auto rounded-2xl border border-border bg-card shadow-2xl p-4 md:p-6 relative animate-in fade-in zoom-in-95 duration-1000 delay-1000 overflow-hidden">
           <div className="flex items-center gap-2 mb-6 border-b border-border pb-4 px-2">
             <div className="w-3 h-3 rounded-full bg-destructive/40" />
             <div className="w-3 h-3 rounded-full bg-accent/40" />
             <div className="w-3 h-3 rounded-full bg-primary/40" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 bg-background rounded-xl p-8 border border-border flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 82) / 100} className="text-primary" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">82%</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <h3 className="mt-6 font-bold text-lg">ATS Performance</h3>
                <p className="text-sm text-muted-foreground mt-2">Significantly above industry average (71%)</p>
              </div>
              <div className="md:col-span-7 space-y-4 flex flex-col justify-center">
                {[
                  { title: "Senior Product Manager", company: "Google • Remote", match: "94%" },
                  { title: "Technical Lead", company: "Meta • Menlo Park", match: "88%" },
                  { title: "Growth Analyst", company: "Stripe • Dublin", match: "81%" }
                ].map((job, idx) => (
                  <div key={idx} className={`bg-background rounded-xl p-5 border border-border flex justify-between items-center transition-opacity ${idx === 1 ? 'opacity-80' : idx === 2 ? 'opacity-50' : 'opacity-100'}`}>
                     <div>
                       <p className="font-bold text-sm md:text-base">{job.title}</p>
                       <p className="text-xs text-muted-foreground mt-1">{job.company}</p>
                     </div>
                     <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-black ring-1 ring-primary/20">{job.match} Match</div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">The Platform</span>
            <h2 className="text-4xl md:text-5xl font-black mt-6 tracking-tight">Built for modern job seeking.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-10 rounded-2xl card-hover-effect">
              <Zap className="text-primary mb-8" size={36} />
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">AI Semantic Engine</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Beyond keywords. Our LLM-powered engine reads between the lines of your experience to find the perfect professional fit.
              </p>
            </div>
            <div className="bg-card border border-border p-10 rounded-2xl card-hover-effect">
              <Shield className="text-primary mb-8" size={36} />
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Unified Workspace</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Stop tool-hopping. Manage your resume, applications, interview prep, and career roadmaps in one high-performance dashboard.
              </p>
            </div>
            <div className="bg-card border border-border p-10 rounded-2xl card-hover-effect">
              <Target className="text-primary mb-8" size={36} />
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Strategic Outcomes</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Data-driven guidance that doesn't just suggest changes—it builds a roadmap to your next salary milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}