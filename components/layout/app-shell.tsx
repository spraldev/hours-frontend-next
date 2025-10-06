"use client"

import type { ReactNode } from "react"
import { TopNav } from "./top-nav"

interface AppShellProps {
  children: ReactNode
  userRole?: "student" | "supervisor" | "admin" | "superadmin"
}

export function AppShell({ children, userRole }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav userRole={userRole} />
      <main className="pb-safe">{children}</main>
    </div>
  )
}
