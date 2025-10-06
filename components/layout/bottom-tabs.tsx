"use client"

import { Button } from "@/components/ui/button"
import { Home, Clock, QrCode, User, BarChart3, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomTabsProps {
  userRole?: "student" | "supervisor" | "admin" | "superadmin"
  activeTab?: string
}

export function BottomTabs({ userRole = "student", activeTab = "dashboard" }: BottomTabsProps) {
  const getTabsForRole = () => {
    switch (userRole) {
      case "student":
        return [
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "hours", label: "Hours", icon: Clock },
          { id: "scan", label: "Scan", icon: QrCode },
          { id: "profile", label: "Profile", icon: User },
        ]
      case "supervisor":
        return [
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "approvals", label: "Approvals", icon: Clock },
          { id: "scan", label: "Scan", icon: QrCode },
          { id: "stats", label: "Stats", icon: BarChart3 },
        ]
      case "admin":
      case "superadmin":
        return [
          { id: "overview", label: "Overview", icon: Home },
          { id: "manage", label: "Manage", icon: Users },
          { id: "stats", label: "Stats", icon: BarChart3 },
          { id: "debug", label: "Debug", icon: User },
        ]
      default:
        return []
    }
  }

  const tabs = getTabsForRole()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t border-border">
      <div className="grid grid-cols-4 gap-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-16 space-y-1 rounded-xl transition-all duration-200",
                isActive && "bg-[#0084ff]/10 text-[#0084ff]",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-[#0084ff]")} />
              <span className={cn("text-xs font-medium", isActive && "text-[#0084ff]")}>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0084ff] rounded-full" />
              )}
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
