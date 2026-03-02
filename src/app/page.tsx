
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Shield, Zap, Target, BarChart3, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden hero-glow">
        <div className="absolute top-24 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-1000">
          <span>✦</span>
          Introducing AI Career Intelligence
          <ArrowRight size={12} />
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold text-center max-w-4xl tracking-tighter gradient-text leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          The AI Platform That Gets You Hired.
        </h1>
        
        <p className="text-lg md:text-xl text-[#8A8AA0] text-center max-w-xl mt-8 leading-relaxed animate-in fade-in duration-1000 delay-300">
          Resume analysis. Intelligent job matching. Interview mastery. Higher education roadmaps. 
          One platform — built for every job seeker, in every field.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-in fade-in duration-1000 delay-500">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-base shadow-[0_0_32px_rgba(16,185,129,0.30)]">
              Start for Free — No Credit Card
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline" className="h-14 px-8 border-[#1E1E30] text-[#EEEEF5] hover:border-[#10B981] hover:bg-[#10B981]/5 text-base font-semibold group">
              <Play size={16} className="mr-2 fill-current" />
              See How It Works
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-[12px] text-[#44445A] font-medium flex gap-6 items-center animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-1">
            <span className="text-[#FBBF24]">★★★★★</span> 4.9 Rating
          </div>
          <div>Trusted by 50,000+ job seekers</div>
          <div>Used in 120+ countries</div>
        </div>

        {/* Hero Mockup */}
        <div className="mt-20 w-full max-w-5xl mx-auto rounded-xl border border-[#1E1E30] bg-[#0F0F1A] shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-4 relative animate-in fade-in zoom-in-95 duration-1000 delay-1000">
           <div className="flex items-center gap-2 mb-4 border-b border-[#1E1E30] pb-4 px-2">
             <div className="w-3 h-3 rounded-full bg-[#F87171]/50" />
             <div className="w-3 h-3 rounded-full bg-[#FBBF24]/50" />
             <div className="w-3 h-3 rounded-full bg-[#34D399]/50" />
           </div>
           <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 bg-[#161624] rounded-lg p-6 border border-[#1E1E30]">
                <div className="w-32 h-32 rounded-full border-[8px] border-[#34D399] flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold">82%</span>
                </div>
                <p className="text-center mt-4 font-semibold">ATS Score</p>
                <div className="space-y-2 mt-6">
                  <div className="h-2 bg-[#1E1E30] rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-gradient-to-r from-[#10B981] to-[#FBBF24]" />
                  </div>
                  <div className="h-2 bg-[#1E1E30] rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[#10B981] to-[#FBBF24]" />
                  </div>
                </div>
              </div>
              <div className="col-span-8 space-y-4">
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center">
                   <div>
                     <p className="font-semibold">Senior Product Manager</p>
                     <p className="text-xs text-[#8A8AA0]">Google • Remote</p>
                   </div>
                   <div className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded text-xs font-bold">94% Match</div>
                </div>
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center opacity-70">
                   <div>
                     <p className="font-semibold">Technical Lead</p>
                     <p className="text-xs text-[#8A8AA0]">Meta • Menlo Park</p>
                   </div>
                   <div className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded text-xs font-bold">88% Match</div>
                </div>
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center opacity-50">
                   <div>
                     <p className="font-semibold">Growth Analyst</p>
                     <p className="text-xs text-[#8A8AA0]">Stripe • Dublin</p>
                   </div>
                   <div className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded text-xs font-bold">81% Match</div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-24 bg-[#07070D] border-y border-[#1E1E30]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] font-medium tracking-[0.15em] text-[#44445A] uppercase mb-12">
            TRUSTED BY JOB SEEKERS FROM
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 items-center grayscale opacity-30">
            <span className="text-2xl font-bold font-headline">Google</span>
            <span className="text-2xl font-bold font-headline">McKinsey</span>
            <span className="text-2xl font-bold font-headline">Deloitte</span>
            <span className="text-2xl font-bold font-headline">MIT</span>
            <span className="text-2xl font-bold font-headline">IIT Delhi</span>
            <span className="text-2xl font-bold font-headline">Oxford</span>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Why Supernova</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">Everything you need to land your next role.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Zap className="text-[#10B981] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">AI That Understands You</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Not just keywords. SUPERNOVA reads your experience, skills, and goals to deliver guidance that's uniquely yours.
              </p>
            </div>
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Shield className="text-[#10B981] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">One Platform, Zero Fragmentation</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Stop juggling five tools. Resume, jobs, interview prep, and education guidance — unified in one workspace.
              </p>
            </div>
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Target className="text-[#10B981] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">Built for Every Career Path</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Whether you're in tech, finance, healthcare, design, or law — SUPERNOVA adapts to your industry and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
