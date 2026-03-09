import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Shield, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30">
      {/* Spline 3D Background Model - Interaction Disabled */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[50vw] h-[50vh] scale-[2.2]">
          <iframe
            src="https://my.spline.design/blackhole-KZLxtxV49QP6rjCCgFCMUiNB/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="w-full h-full opacity-60"
          ></iframe>
        </div>
        {/* Thematic Overlays for Symmetry and Contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,95,70,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section - Symmetrical & High Performance */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 flex flex-col items-center justify-center px-6 text-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-white text-[11px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Zap size={12} className="fill-current text-primary" />
            Next-Gen Career Intelligence
            <ArrowRight size={12} className="ml-1 text-primary" />
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter gradient-text leading-[0.9] mb-8 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 uppercase drop-shadow-2xl">
            The AI Platform <br /> That Gets You Hired.
          </h1>

          <p className="text-lg md:text-2xl text-foreground max-w-2xl leading-relaxed mb-14 font-black animate-in fade-in duration-1000 delay-300 drop-shadow-md">
            Enterprise-grade resume analysis. Intelligent job matching. Interview mastery.
            One unified workspace built for the modern professional.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-24 animate-in fade-in duration-1000 delay-500">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(6,95,70,0.4)] rounded-xl">
                Start for Free
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="h-16 px-12 border-border bg-background/50 backdrop-blur-sm hover:border-primary hover:bg-primary/5 text-xs font-black uppercase tracking-widest group rounded-xl">
                <Play size={16} className="mr-2 fill-current" />
                See Demo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 animate-in fade-in duration-1000 delay-700">
            <div className="flex items-center gap-2">
              <span className="text-accent text-sm">★★★★★</span> 4.9 Global Rating
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <div>50k+ Profiles Optimized</div>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <div>120+ Countries Active</div>
          </div>

          {/* Symmetrical Mockup */}
          <div className="mt-32 w-full rounded-[32px] border border-border bg-card/40 backdrop-blur-2xl shadow-2xl p-8 md:p-12 relative animate-in fade-in zoom-in-95 duration-1000 delay-1000 overflow-hidden text-left border-t-primary/20">
            <div className="flex items-center gap-2 mb-10 border-b border-border pb-8">
              <div className="w-3.5 h-3.5 rounded-full bg-destructive/60" />
              <div className="w-3.5 h-3.5 rounded-full bg-accent/60" />
              <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
              <div className="ml-6 h-4 w-48 bg-border/30 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 bg-background/30 rounded-[24px] p-12 border border-border flex flex-col items-center justify-center text-center">
                <div className="relative w-56 h-56">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="98" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-muted/10" />
                    <circle cx="112" cy="112" r="98" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={615} strokeDashoffset={615 - (615 * 82) / 100} className="text-primary transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black tracking-tighter">82%</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">ATS Score</span>
                  </div>
                </div>
                <h3 className="mt-10 font-black text-2xl uppercase tracking-tight">Enterprise Scan</h3>
                <p className="text-[11px] font-black text-primary mt-3 uppercase tracking-[0.2em]">Ranked Top 5% Globally</p>
              </div>
              <div className="lg:col-span-7 space-y-5 flex flex-col justify-center">
                {[
                  { title: "Senior Product Manager", company: "Google • Remote", match: "94%" },
                  { title: "Technical Lead", company: "Meta • Menlo Park", match: "88%" },
                  { title: "Growth Analyst", company: "Stripe • Dublin", match: "81%" }
                ].map((job, idx) => (
                  <div key={idx} className={`bg-background/40 rounded-2xl p-8 border border-border flex justify-between items-center transition-all hover:border-primary/50 group ${idx === 1 ? 'opacity-80' : idx === 2 ? 'opacity-60' : 'opacity-100'}`}>
                    <div className="space-y-1">
                      <p className="font-black text-base uppercase tracking-tight group-hover:text-primary transition-colors">{job.title}</p>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{job.company}</p>
                    </div>
                    <div className="bg-primary/5 text-primary px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] border border-primary/20">
                      {job.match} MATCH
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="py-40 px-6 border-y border-border bg-card/5 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 text-center">
              <h2 className="text-4xl md:text-6xl font-black mt-10 tracking-tighter uppercase text-3d-yellow">Intelligent Workflow.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Zap, title: "AI Semantic Engine", desc: "Beyond keywords. Our engine reads between the lines of your experience to find the perfect professional fit." },
                { icon: Shield, title: "Unified Workspace", desc: "Manage your resume, applications, interview prep, and career roadmaps in one high-performance dashboard." },
                { icon: Target, title: "Strategic Outcomes", desc: "Data-driven guidance that doesn't just suggest changes—it builds a roadmap to your next salary milestone." }
              ].map((pillar, i) => (
                <div key={i} className="bg-card/30 border border-border p-14 rounded-[40px] card-hover-effect flex flex-col items-center text-center group">
                  <div className="p-6 bg-primary/10 rounded-[20px] mb-10 group-hover:bg-primary transition-all duration-300">
                    <pillar.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={40} />
                  </div>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">{pillar.title}</h3>
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
    </div>
  );
}
