import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Zap, ArrowRight, TrendingUp, Users, Target, Clock, FileText, Briefcase, MessageSquare, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "ATS Score", value: "82", trend: "+4%", icon: Zap },
    { label: "Jobs Matched", value: "24", trend: "+12", icon: Target },
    { label: "Practice Sessions", value: "15", trend: "+3", icon: Users },
    { label: "Profile Health", value: "90%", trend: "+5%", icon: TrendingUp },
  ];

  const tools = [
    { name: "Resume Analyzer", desc: "Enterprise-grade ATS feedback and scoring.", status: "Active" },
    { name: "Job Matcher", desc: "Personalized semantic matching for global roles.", status: "Active" },
    { name: "Interview Prep", desc: "Realistic AI interview practice and STAR feedback.", status: "Active" },
    { name: "Education Roadmaps", desc: "Plan your higher education and higher-ed journey.", status: "New" },
    { name: "Career Radar", desc: "Skill gap analysis and market intelligence.", status: "Active" },
    { name: "Action Plan", desc: "Your tailored 90-day professional strategy.", status: "Soon" },
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-500">
      {/* Top Bar - Clean Alignment */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter">Good morning, John.</h2>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Monday, October 27, 2025</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex items-center bg-card border border-border px-5 h-12 rounded-2xl flex-1 md:min-w-[340px] focus-within:ring-2 ring-primary/20 transition-all">
              <Search size={16} className="text-muted-foreground" />
              <input className="bg-transparent border-none outline-none text-sm px-3 text-foreground placeholder-muted-foreground w-full font-medium" placeholder="Search tools or resources..." />
           </div>
           <Button size="icon" variant="outline" className="h-12 w-12 border-border bg-card relative group hover:border-primary transition-all">
              <Bell size={18} />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full ring-4 ring-background group-hover:scale-125 transition-transform" />
           </Button>
        </div>
      </header>

      {/* Quick Stats - Symmetrical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border border-outline card-hover-effect overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-tight px-3 py-1">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Workspace Area */}
        <div className="lg:col-span-8 space-y-12">
          <section>
             <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Intelligence Workspace</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tools.map((tool, i) => (
                  <Card key={i} className="bg-card border-border group card-hover-effect relative overflow-hidden">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-8">
                         <div className="p-3.5 bg-muted rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                           <Zap size={20} />
                         </div>
                         <Badge variant="secondary" className={`${tool.status === 'New' ? 'bg-accent text-accent-foreground' : tool.status === 'Soon' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'} text-[9px] font-black border-none uppercase tracking-widest px-2.5 py-1`}>
                           {tool.status}
                         </Badge>
                      </div>
                      <h4 className="text-lg font-black tracking-tight">{tool.name}</h4>
                      <p className="text-xs text-muted-foreground mt-3 mb-10 leading-relaxed font-medium line-clamp-2">{tool.desc}</p>
                      <div className="mt-auto">
                        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-[10px] font-black group items-center uppercase tracking-widest">
                           Launch Tool <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>

          {/* AI Insight Card - Clean Alignment */}
          <Card className="bg-card border-border border-l-[6px] border-l-primary relative overflow-hidden group">
            <CardContent className="p-12">
               <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={200} className="text-primary" />
               </div>
               <h3 className="text-2xl font-black mb-6 tracking-tight uppercase">Deep Career Insight</h3>
               <p className="text-muted-foreground leading-relaxed max-w-2xl text-base font-medium">
                 "Based on current market trends and your recent resume scan, adding <strong>'System Scalability'</strong> and <strong>'Distributed Computing'</strong> could increase your relevance for Top 10 matching roles by roughly <strong>14%</strong>."
               </p>
               <Button className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest h-14 px-10 rounded-2xl shadow-xl shadow-primary/10">
                 Optimize Profile Now
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent & Streak Sidebar */}
        <div className="lg:col-span-4 space-y-12">
           <Card className="bg-card border-border">
             <CardHeader className="p-10 pb-4">
                <CardTitle className="text-xl font-black uppercase tracking-tight">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-10 space-y-10">
                {[
                  { action: "Resume Scanned", time: "2h ago", icon: FileText },
                  { action: "Job Matched: Senior Dev", time: "5h ago", icon: Briefcase },
                  { action: "Practiced Q&A Session", time: "1d ago", icon: MessageSquare },
                  { action: "Profile Updated", time: "2d ago", icon: LayoutDashboard },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                     <div className="p-3.5 bg-muted rounded-2xl border border-border">
                        <item.icon size={16} className="text-muted-foreground" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <p className="text-sm font-black text-foreground truncate">{item.action}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.time}</p>
                     </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-primary hover:bg-primary/5 text-[10px] font-black h-12 uppercase tracking-widest">View All Logged Data</Button>
             </CardContent>
           </Card>

           <Card className="bg-card border-border bg-[radial-gradient(circle_at_100%_0%,rgba(251,191,36,0.05),transparent_50%)]">
             <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8 border border-accent/20">
                   <Clock className="text-accent" size={32} />
                </div>
                <h4 className="text-[10px] font-black mb-3 uppercase tracking-[0.3em] text-muted-foreground">Practice Streak</h4>
                <p className="text-6xl font-black mb-4 tracking-tighter">5 Days</p>
                <p className="text-[11px] text-muted-foreground font-bold leading-relaxed uppercase tracking-widest">Top 5% Global Activity Rank</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
