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
        <div className="absolute top-24 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#9B94FF] text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-1000">
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
            <Button size="lg" className="h-14 px-8 bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-semibold text-base shadow-[0_0_32px_rgba(108,99,255,0.30)]">
              Start for Free — No Credit Card
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline" className="h-14 px-8 border-[#1E1E30] text-[#EEEEF5] hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 text-base font-semibold group">
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
                    <div className="h-full w-[82%] bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]" />
                  </div>
                  <div className="h-2 bg-[#1E1E30] rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]" />
                  </div>
                </div>
              </div>
              <div className="col-span-8 space-y-4">
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center">
                   <div>
                     <p className="font-semibold">Senior Product Manager</p>
                     <p className="text-xs text-[#8A8AA0]">Google • Remote</p>
                   </div>
                   <div className="bg-[#6C63FF]/10 text-[#9B94FF] px-2 py-1 rounded text-xs font-bold">94% Match</div>
                </div>
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center opacity-70">
                   <div>
                     <p className="font-semibold">Technical Lead</p>
                     <p className="text-xs text-[#8A8AA0]">Meta • Menlo Park</p>
                   </div>
                   <div className="bg-[#6C63FF]/10 text-[#9B94FF] px-2 py-1 rounded text-xs font-bold">88% Match</div>
                </div>
                <div className="bg-[#161624] rounded-lg p-4 border border-[#1E1E30] flex justify-between items-center opacity-50">
                   <div>
                     <p className="font-semibold">Growth Analyst</p>
                     <p className="text-xs text-[#8A8AA0]">Stripe • Dublin</p>
                   </div>
                   <div className="bg-[#6C63FF]/10 text-[#9B94FF] px-2 py-1 rounded text-xs font-bold">81% Match</div>
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
            <span className="bg-[#6C63FF]/10 text-[#9B94FF] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Why Supernova</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">Everything you need to land your next role.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Zap className="text-[#6C63FF] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">AI That Understands You</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Not just keywords. SUPERNOVA reads your experience, skills, and goals to deliver guidance that's uniquely yours.
              </p>
            </div>
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Shield className="text-[#6C63FF] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">One Platform, Zero Fragmentation</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Stop juggling five tools. Resume, jobs, interview prep, and education guidance — unified in one workspace.
              </p>
            </div>
            <div className="bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl card-hover-effect">
              <Target className="text-[#6C63FF] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">Built for Every Career Path</h3>
              <p className="text-[#8A8AA0] leading-relaxed">
                Whether you're in tech, finance, healthcare, design, or law — SUPERNOVA adapts to your industry and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-32 px-6 space-y-48">
        {/* Resume Analyzer */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#6C63FF]/20 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl shadow-2xl">
               <div className="flex items-center justify-between mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-[#FBBF24] flex items-center justify-center">
                    <span className="text-2xl font-bold">79%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-[#FBBF24]/10 text-[#FBBF24] px-2 py-1 rounded text-[10px] font-bold uppercase">Important</div>
                    <p className="text-sm font-semibold">Missing Keywords</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-12 bg-[#161624] border border-[#1E1E30] rounded-lg" />
                  <div className="h-12 bg-[#161624] border border-[#1E1E30] rounded-lg" />
                  <div className="h-12 bg-[#161624] border border-[#1E1E30] rounded-lg" />
               </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6">ATS Score in Under 30 Seconds.</h3>
            <ul className="space-y-4">
              {[
                "Deep keyword analysis for specific roles",
                "Formatting and layout structure checks",
                "Experience impact & quantification analyzer",
                "Actionable suggestions to boost your score"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#8A8AA0]">
                  <CheckCircle2 size={18} className="text-[#34D399]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Job Matcher */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="md:order-2 relative group">
            <div className="absolute -inset-4 bg-[#6C63FF]/20 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-2xl shadow-2xl space-y-4">
               {[94, 88, 81].map((score, i) => (
                 <div key={i} className="bg-[#161624] p-4 rounded-xl border border-[#1E1E30] flex items-center justify-between">
                   <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/20" />
                   <div className="flex-1 ml-4 h-4 bg-[#1E1E30] rounded-full max-w-[120px]" />
                   <div className="text-[#6C63FF] font-bold text-sm">{score}%</div>
                 </div>
               ))}
            </div>
          </div>
          <div className="md:order-1">
            <h3 className="text-3xl font-bold mb-6">Jobs That Actually Fit Your Profile.</h3>
            <p className="text-[#8A8AA0] leading-relaxed mb-8">
              Stop blind-applying. Our AI scans thousands of listings daily to find the ones 
              where your unique skills make you a top-tier candidate.
            </p>
            <Button variant="ghost" className="text-[#6C63FF] p-0 hover:bg-transparent hover:underline group">
              Explore Job Matcher <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0F0F1A] border-t-2 border-t-[#6C63FF] border border-[#1E1E30] rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6C63FF]/10 blur-[120px] -z-10" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Your Next Career Move Starts Here.</h2>
            <p className="text-[#8A8AA0] text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Join 50,000+ professionals using SUPERNOVA to navigate their careers with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold text-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 border-[#1E1E30] text-[#EEEEF5] hover:border-[#6C63FF] font-bold text-lg">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
