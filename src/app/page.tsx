import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Shield, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Video Background Layer */}
      <div className="fixed inset-0 -z-20 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              width: '177.77vh', 
              height: '56.25vw', 
              minWidth: '100%', 
              minHeight: '100%', 
              transform: 'translate(-50%, -50%) scale(1.1)', 
              border: '0',
              opacity: '0.25',
              filter: 'grayscale(40%) contrast(110%)'
            }}
            src="https://go.screenpal.com/player/cOenIMnZhpP?ff=1&ahc=1&dcc=1&tl=1&bg=transparent&share=0&download=0&embed=1&cl=1&autoplay=1&mute=1&loop=1" 
            allow="autoplay; fullscreen"
            scrolling="no"
            title="Supernova Background Video"
          />
        </div>
        {/* Thematic Gradients for Symmetry & Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
      </div>

      <Navbar />
      
      {/* Hero Section - Optimized Symmetry */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 flex flex-col items-center justify-center px-6 text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Zap size={12} className="fill-current" />
          Next-Gen Career Intelligence
          <ArrowRight size={12} className="ml-1" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter gradient-text leading-[1.05] mb-8 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          The AI Platform That Gets You Hired.
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-14 font-medium animate-in fade-in duration-1000 delay-300">
          Enterprise-grade resume analysis. Intelligent job matching. Interview mastery. 
          One platform built for every professional, in every field.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-20 animate-in fade-in duration-1000 delay-500">
          <Link href="/signup">
            <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Start for Free
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline" className="h-16 px-12 border-border bg-background/50 hover:border-primary hover:bg-primary/5 text-xs font-black uppercase tracking-widest group">
              <Play size={16} className="mr-2 fill-current" />
              See Demo
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-2">
            <span className="text-accent">★★★★★</span> 4.9 Global Rating
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
          <div>50k+ Profiles Optimized</div>
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
          <div>120+ Countries Active</div>
        </div>

        {/* Hero Mockup - Symmetrical Design */}
        <div className="mt-24 w-full rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-1000 delay-1000 overflow-hidden text-left">
           <div className="flex items-center gap-2 mb-8 border-b border-border pb-6">
             <div className="w-3 h-3 rounded-full bg-destructive/30" />
             <div className="w-3 h-3 rounded-full bg-accent/30" />
             <div className="w-3 h-3 rounded-full bg-primary/30" />
             <div className="ml-4 h-5 w-32 bg-border/20 rounded-full" />
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-background/50 rounded-2xl p-10 border border-border flex flex-col items-center justify-center text-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/10" />
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={527} strokeDashoffset={527 - (527 * 82) / 100} className="text-primary" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-tighter">82%</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>
                <h3 className="mt-8 font-black text-xl uppercase tracking-tight">ATS Performance</h3>
                <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">Significantly Above Industry Average</p>
              </div>
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-center">
                {[
                  { title: "Senior Product Manager", company: "Google • Remote", match: "94%" },
                  { title: "Technical Lead", company: "Meta • Menlo Park", match: "88%" },
                  { title: "Growth Analyst", company: "Stripe • Dublin", match: "81%" }
                ].map((job, idx) => (
                  <div key={idx} className={`bg-background/40 rounded-xl p-6 border border-border flex justify-between items-center transition-all hover:border-primary/50 ${idx === 1 ? 'opacity-80' : idx === 2 ? 'opacity-60' : 'opacity-100'}`}>
                     <div className="space-y-1">
                       <p className="font-black text-sm uppercase tracking-tight">{job.title}</p>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{job.company}</p>
                     </div>
                     <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] border border-primary/20">{job.match} MATCH</div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-32 px-6 border-y border-border bg-card/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center">
            <span className="bg-primary/10 text-primary px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">The Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-black mt-8 tracking-tighter uppercase">Intelligent Workflow.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: "AI Semantic Engine", desc: "Beyond keywords. Our engine reads between the lines of your experience to find the perfect professional fit." },
              { icon: Shield, title: "Unified Workspace", desc: "Manage your resume, applications, interview prep, and career roadmaps in one high-performance dashboard." },
              { icon: Target, title: "Strategic Outcomes", desc: "Data-driven guidance that doesn't just suggest changes—it builds a roadmap to your next salary milestone." }
            ].map((pillar, i) => (
              <div key={i} className="bg-card/50 border border-border p-12 rounded-[32px] card-hover-effect flex flex-col items-center text-center group">
                <div className="p-5 bg-primary/10 rounded-2xl mb-8 group-hover:bg-primary transition-colors">
                  <pillar.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
