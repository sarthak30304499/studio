import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Layout, Sparkles } from "lucide-react";

const features = [
  {
    num: "01",
    title: "Resume Analyzer & ATS Intelligence",
    desc: "Get an enterprise-grade analysis of your resume. Our AI tool provides ATS compatibility scores and personalized improvement suggestions tailored to specific target roles.",
    caps: ["Keyword density checks", "Structural formatting audit", "Impact & metrics analysis", "Industry benchmarking", "Missing skills identification", "Actionable editing tips"],
  },
  {
    num: "02",
    title: "AI Job & Internship Matcher",
    desc: "Stop hunting. Start finding. Our matcher uses advanced semantic search to link your unique profile with high-relevance opportunities across the globe.",
    caps: ["Role-fit probability scoring", "Automated skill alignment", "Remote/Hybrid opportunity filtering", "Company culture matching", "Daily alert digests", "One-click analysis"],
  },
  {
    num: "03",
    title: "Interview Intelligence System",
    desc: "Walk into every interview with unshakeable confidence. Generate realistic questions, get model answers, and receive detailed feedback on your practice responses.",
    caps: ["STAR framework guidance", "Technical coding challenges", "Behavioral analysis", "HR common questions", "Real-time feedback loops", "Session history tracking"],
  },
  {
    num: "04",
    title: "Higher Education Pathway Assistant",
    desc: "Whether it's an MBA, MS Abroad, or PhD, we help you map the entire journey. From exams to university shortlists, it's all in one roadmap.",
    caps: ["Personalized timelines", "Exam prep resources", "Eligibility tracking", "University shortlisting", "Application milestone tracking", "Cost & ROI estimates"],
  },
  {
    num: "05",
    title: "Career Intel & Skill Gap Analyzer",
    desc: "Understand exactly where you stand in the market. Visualize your skills against industry benchmarks and get a roadmap to close the gaps.",
    caps: ["Skill radar charts", "Target role benchmarking", "Learning recommendations", "Projected career paths", "Salary trend analysis", "90-day action plans"],
  }
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#07070D]">
      <Navbar />
      
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6 border-b border-[#1E1E30]">
         <span className="text-[#6C63FF] text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-top-4 duration-700">The Supernova Core</span>
         <h1 className="text-5xl md:text-7xl font-extrabold gradient-text mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">Every Tool. One Platform.</h1>
         <p className="text-[#8A8AA0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-700 delay-300">
           Zero fragmentation. Zero compromise. We've unified the most critical career tools into a single, intelligent workspace.
         </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-32 space-y-32">
        {features.map((f, i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-24 items-center group`}>
             <div className="flex-1 space-y-8">
                <div className="relative">
                   <span className="absolute -top-12 -left-8 text-9xl font-black text-[#1E1E30]/30 select-none group-hover:text-[#6C63FF]/5 transition-colors">{f.num}</span>
                   <h2 className="text-4xl font-bold relative">{f.title}</h2>
                </div>
                <p className="text-[#8A8AA0] text-lg leading-relaxed">{f.desc}</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                   {f.caps.map((cap, j) => (
                     <div key={j} className="flex items-center gap-3 text-sm text-[#EEEEF5]">
                        <CheckCircle2 size={16} className="text-[#6C63FF] shrink-0" />
                        {cap}
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="flex-1 w-full relative">
                <div className="absolute -inset-8 bg-[#6C63FF]/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative aspect-[4/3] bg-[#0F0F1A] border border-[#1E1E30] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-12">
                   <div className="w-full h-full border border-[#1E1E30] bg-[#161624] rounded-xl flex flex-col items-center justify-center text-[#44445A]">
                      <Sparkles size={48} className="mb-4 opacity-20" />
                      <p className="text-xs font-bold tracking-widest uppercase">Live UI Preview</p>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
