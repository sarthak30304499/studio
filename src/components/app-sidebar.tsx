"use client"

import * as React from "react"
import {
  LayoutDashboard, FileText, Briefcase, MessageSquare,
  GraduationCap, LineChart, Settings, ChevronDown, Zap
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth-provider"
import { getAvatarColor } from "@/lib/supabase/db"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar"

const NAV_GROUPS = [
  {
    label: "WORKSPACE",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "TOOLS",
    items: [
      { title: "Resume Analyzer", url: "/app/resume", icon: FileText },
      { title: "Job Matcher", url: "/app/jobs", icon: Briefcase },
      { title: "Interview Prep", url: "/app/interview", icon: MessageSquare },
      { title: "Higher Education", url: "/app/higher-ed", icon: GraduationCap },
      { title: "Career Intel", url: "/app/career", icon: LineChart },
    ],
  },
  {
    label: "ACCOUNT",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
]

const PLAN_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "Free", color: "#8888A8", bg: "rgba(108,99,255,0.08)" },
  pro: { label: "Pro", color: "#6C63FF", bg: "rgba(108,99,255,0.18)" },
  enterprise: { label: "Enterprise", color: "#F59E0B", bg: "rgba(245,158,11,0.18)" },
}

function InitialsAvatar({ name, userId, size = 32 }: { name: string; userId: string; size?: number }) {
  const parts = name.trim().split(" ").filter(Boolean)
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] ?? "?").toUpperCase()
  const bg = getAvatarColor(userId)
  return (
    <div
      style={{ width: size, height: size, background: bg, borderRadius: "50%", flexShrink: 0 }}
      className="flex items-center justify-center text-white font-black"
    >
      <span style={{ fontSize: size * 0.38 }}>{initials}</span>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, profile } = useAuth()

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const email = user?.email ?? ""
  const plan = profile?.plan ?? "free"
  const planInfo = PLAN_BADGE[plan] ?? PLAN_BADGE.free

  return (
    <Sidebar className="border-r" style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border-1)", width: 240 }}>
      {/* Header */}
      <SidebarHeader className="px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span style={{ color: "var(--dash-accent)", fontSize: 18 }}>◆</span>
          <span className="text-[18px] font-black tracking-tighter" style={{ color: "var(--dash-text-1)" }}>
            SUPERNOVA
          </span>
        </Link>
        <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: "var(--dash-text-2)" }}>
          Personal Workspace <ChevronDown size={10} />
        </p>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-3 flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest px-3 py-2" style={{ color: "var(--dash-text-3)" }}>
              {group.label}
            </p>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 h-10 px-3 rounded-md transition-all duration-150 text-sm font-medium relative"
                        style={{
                          background: active ? "var(--dash-accent-soft)" : "transparent",
                          color: active ? "var(--dash-text-1)" : "var(--dash-text-2)",
                          borderLeft: active ? "2.5px solid var(--dash-accent)" : "2.5px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = "var(--dash-surface-3)"
                            e.currentTarget.style.color = "var(--dash-text-1)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.color = "var(--dash-text-2)"
                          }
                        }}
                      >
                        <item.icon size={17} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 mt-auto space-y-3">
        {/* Upgrade card — only for free plan */}
        {plan === "free" && (
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(167,139,250,0.08))",
              border: "1px solid rgba(108,99,255,0.25)",
            }}
          >
            <p className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--dash-text-1)" }}>
              <Zap size={13} style={{ color: "var(--dash-accent)" }} /> Upgrade to Pro
            </p>
            <p className="text-[11px]" style={{ color: "var(--dash-text-2)" }}>Unlimited AI tools + reports</p>
            <Link href="/pricing" className="text-[12px] font-semibold inline-block" style={{ color: "var(--dash-accent)" }}>
              Upgrade →
            </Link>
          </div>
        )}

        {/* User card */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all"
          style={{ border: "1px solid var(--dash-border-1)", background: "var(--dash-surface-1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--dash-border-2)" }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dash-border-1)" }}
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <InitialsAvatar name={displayName} userId={user?.id ?? "anon"} size={32} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--dash-text-1)" }}>{displayName}</p>
            <p className="text-[11px] truncate" style={{ color: "var(--dash-text-2)" }}>{email}</p>
          </div>
          {/* Plan badge */}
          <span
            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ color: planInfo.color, background: planInfo.bg }}
          >
            {planInfo.label}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
