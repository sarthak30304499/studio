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
    { name: "Resume Analyzer", desc: "Enterprise-grade ATS feedback", status: "Active" },
    { name: "Job Matcher", desc: "Personalized semantic matching", status: "Active" },
    { name: "Interview Prep", desc: "Realistic AI interview practice", status: "Active" },
    { name: "Education Roadmaps", desc: "Plan your higher education", status: "New" },
    { name: "Career Radar", desc: "Skill gap & market analysis", status: "Active" },
    { name: "Action Plan", desc: "Your 90-day career strategy", status: "Soon" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Good morning, John.</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">Monday, October 27, 2025</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex items-center bg-card border border-border px-4 h-11 rounded-xl flex-1 md:min-w-[320px] focus-within:ring-2 ring-primary/20 transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input className="bg-transparent border-none outline-none text-sm px-3 text-foreground placeholder-muted-foreground w-full" placeholder="Search your tools or resources..." />
           </div>
           <Button size="icon" variant="outline" className="h-11 w-11 border-border bg-card relative hover:border-primary">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
           </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border card-hover-effect overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <stat.icon size={22} className="text-primary" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-tight">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <section>
             <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Intelligence Workspace</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool, i) => (
                  <Card key={i} className="bg-card border-border group card-hover-effect relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                           <Zap size={22} />
                         </div>
                         <Badge variant="secondary" className={`${tool.status === 'New' ? 'bg-primary text-primary-foreground' : tool.status === 'Soon' ? 'bg-muted text-muted-foreground' : 'bg-primary/5 text-primary'} text-[10px] font-bold border-none`}>
                           {tool.status}
                         </Badge>
                      </div>
                      <h4 className="text-lg font-bold tracking-tight">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground mt-2 mb-8 leading-relaxed">{tool.desc}</p>
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-xs font-black group items-center">
                         Launch Tool <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>

          {/* AI Insight Card */}
          <Card className="bg-card border border-border border-l-4 border-l-primary relative overflow-hidden group">
            <CardContent className="p-10">
               <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={180} className="text-primary" />
               </div>
               <h3 className="text-xl font-black mb-4 tracking-tight">Deep Career Insight</h3>
               <p className="text-muted-foreground leading-relaxed max-w-2xl text-base">
                 "Based on current market trends and your recent resume scan, adding <strong>'System Scalability'</strong> and <strong>'Distributed Computing'</strong> to your profile could increase your relevance for the Top 10 matching roles by roughly <strong>14%</strong>."
               </p>
               <Button className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8">
                 Optimize My Profile
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Recent Activity */}
        <div className="space-y-10">
           <Card className="bg-card border-border">
             <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black uppercase tracking-tight">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-8">
                {[
                  { action: "Resume Scanned", time: "2h ago", icon: FileText },
                  { action: "Job Matched: Senior Dev", time: "5h ago", icon: Briefcase },
                  { action: "Practiced Q&A", time: "1d ago", icon: MessageSquare },
                  { action: "Profile Updated", time: "2d ago", icon: LayoutDashboard },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                     <div className="p-3 bg-muted rounded-xl ring-1 ring-border">
                        <item.icon size={18} className="text-muted-foreground" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                     </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-primary hover:bg-primary/5 text-xs font-bold h-11">View All Activity</Button>
             </CardContent>
           </Card>

           <Card className="bg-card border-border bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.05),transparent_50%)]">
             <CardContent className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                   <Clock className="text-primary" size={28} />
                </div>
                <h4 className="text-lg font-black mb-2 uppercase tracking-tight">Practice Streak</h4>
                <p className="text-5xl font-black mb-2 tracking-tighter">5 Days</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">You're in the top 5% of active users. Keep it up!</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}