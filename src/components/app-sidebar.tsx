
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  GraduationCap,
  LineChart,
  Settings,
  ChevronDown
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/firebase"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Resume Analyzer", url: "/app/resume", icon: FileText },
  { title: "Job Matcher", url: "/app/jobs", icon: Briefcase },
  { title: "Interview Prep", url: "/app/interview", icon: MessageSquare },
  { title: "Higher Education", url: "/app/higher-ed", icon: GraduationCap },
  { title: "Career Intel", url: "/app/career", icon: LineChart },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <Sidebar className="bg-[#0F0F1A] border-r border-[#1E1E30] w-[220px]">
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
           <span className="text-xl font-bold tracking-tighter gradient-text">SUPERNOVA</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.url}
                className={`flex items-center gap-3 h-10 px-3 rounded-md transition-all duration-200 ${
                  pathname === item.url 
                    ? "bg-[#10B981]/10 text-[#EEEEF5] border-l-[3px] border-l-[#10B981]" 
                    : "text-[#8A8AA0] hover:bg-[#1E1E30] hover:text-[#EEEEF5]"
                }`}
              >
                <Link href={item.url}>
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator className="my-6 opacity-20" />
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-md text-[#8A8AA0] hover:bg-[#1E1E30] hover:text-[#EEEEF5]">
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="flex flex-col gap-4">
          <Link href="/pricing" className="bg-gradient-to-r from-[#10B981] via-[#FBBF24] to-[#EF4444] text-white text-[11px] font-bold py-2 rounded-lg text-center shadow-[0_0_16px_rgba(16,185,129,0.20)]">
             UPGRADE TO PRO
          </Link>
          <div className="flex items-center gap-3 px-2 py-3 border border-[#1E1E30] bg-[#161624] rounded-xl overflow-hidden">
             <Avatar className="h-8 w-8 ring-2 ring-[#10B981]/20">
               <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200`} />
               <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
             </Avatar>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#EEEEF5] truncate">{user?.displayName || "User"}</p>
                <p className="text-[10px] text-[#8A8AA0] uppercase tracking-wider">Free Plan</p>
             </div>
             <ChevronDown size={14} className="text-[#44445A]" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
