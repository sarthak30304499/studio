import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Zap, ArrowRight, TrendingUp, Users, Target, Clock } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "ATS Score", value: "82", trend: "+4%", icon: Zap },
    { label: "Jobs Matched", value: "24", trend: "+12", icon: Target },
    { label: "Practiced", value: "15", trend: "+3", icon: Users },
    { label: "Completion", value: "90%", trend: "+5%", icon: TrendingUp },
  ];

  const tools = [
    { name: "Resume Analyzer", desc: "Get detailed ATS feedback", status: "Active" },
    { name: "Job Matcher", desc: "Discover personalized roles", status: "Active" },
    { name: "Interview Prep", desc: "Practice with AI feedback", status: "Active" },
    { name: "Education Roadmaps", desc: "Plan your higher ed", status: "New" },
    { name: "Career Radar", desc: "Skill gap analysis", status: "Active" },
    { name: "Action Plan", desc: "Your 90-day strategy", status: "Coming Soon" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Top Bar */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Good morning, John.</h2>
          <p className="text-[#8A8AA0] text-sm mt-1">Monday, October 27, 2025</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center bg-[#0F0F1A] border border-[#1E1E30] px-3 h-10 rounded-lg min-w-[240px]">
              <Search size={16} className="text-[#44445A]" />
              <input className="bg-transparent border-none outline-none text-sm px-2 text-[#EEEEF5] placeholder-[#44445A] w-full" placeholder="Search resources..." />
           </div>
           <Button size="icon" variant="outline" className="border-[#1E1E30] bg-[#0F0F1A] relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#6C63FF] rounded-full" />
           </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#0F0F1A] border-[#1E1E30] card-hover-effect">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#6C63FF]/10 rounded-lg">
                  <stat.icon size={20} className="text-[#6C63FF]" />
                </div>
                <span className="text-[11px] font-bold text-[#34D399]">{stat.trend}</span>
              </div>
              <p className="text-[#8A8AA0] text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tools Grid */}
          <section>
             <h3 className="text-lg font-bold mb-6">Active Tools</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool, i) => (
                  <Card key={i} className="bg-[#0F0F1A] border-[#1E1E30] group card-hover-effect">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-[#1E1E30] rounded-lg group-hover:bg-[#6C63FF]/20 group-hover:text-[#6C63FF] transition-colors">
                           <Zap size={20} />
                         </div>
                         <Badge variant="secondary" className={`${tool.status === 'New' ? 'bg-[#6C63FF]/10 text-[#9B94FF]' : 'bg-[#1E1E30] text-[#8A8AA0]'} text-[10px]`}>
                           {tool.status}
                         </Badge>
                      </div>
                      <h4 className="font-bold text-[#EEEEF5]">{tool.name}</h4>
                      <p className="text-sm text-[#8A8AA0] mt-1 mb-6">{tool.desc}</p>
                      <Button variant="ghost" className="p-0 h-auto text-[#6C63FF] hover:bg-transparent text-xs font-bold group">
                         Open Tool <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>

          {/* AI Insight Card */}
          <Card className="bg-[#0F0F1A] border border-[#1E1E30] border-l-[4px] border-l-[#6C63FF] overflow-hidden">
            <CardContent className="p-8">
               <h3 className="text-lg font-bold mb-3">Your AI Insight for Today.</h3>
               <p className="text-[#8A8AA0] leading-relaxed max-w-2xl">
                 "Based on your recent resume scan, highlighting your experience with 'Distributed Systems' and 'Cloud Architecture' would increase your match percentage for the Senior Engineering roles at Stripe by roughly 12%."
               </p>
               <Button className="mt-6 bg-[#6C63FF] hover:bg-[#5A52E0] text-white">
                 Take Action
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Recent Activity */}
        <div className="space-y-8">
           <Card className="bg-[#0F0F1A] border-[#1E1E30]">
             <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                {[
                  { action: "Resume Scanned", time: "2h ago", icon: FileText },
                  { action: "Job Matched: Senior Dev", time: "5h ago", icon: Briefcase },
                  { action: "Practiced Q&A", time: "1d ago", icon: MessageSquare },
                  { action: "Profile Updated", time: "2d ago", icon: LayoutDashboard },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                     <div className="p-2 bg-[#1E1E30] rounded-lg">
                        <item.icon size={16} className="text-[#8A8AA0]" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-semibold">{item.action}</p>
                        <p className="text-xs text-[#44445A]">{item.time}</p>
                     </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-[#6C63FF] text-xs hover:bg-transparent">View All Activity</Button>
             </CardContent>
           </Card>

           <Card className="bg-[#0F0F1A] border-[#1E1E30] bg-[radial-gradient(circle_at_100%_0%,rgba(108,99,255,0.1),transparent_50%)]">
             <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mx-auto mb-4">
                   <Clock className="text-[#6C63FF]" size={24} />
                </div>
                <h4 className="font-bold mb-2">Practice Streak</h4>
                <p className="text-3xl font-bold mb-1">5 Days</p>
                <p className="text-xs text-[#8A8AA0]">Keep it up! 2 more days to reach your goal.</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

// Re-using these icons for Dashboard
import { FileText, Briefcase, MessageSquare, LayoutDashboard } from "lucide-react";
