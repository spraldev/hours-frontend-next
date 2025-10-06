"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  showBack?: boolean
  onBack?: () => void
}

export function PageHeader({ title, subtitle, action, showBack, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between py-6 px-4 border-b border-border/40">
      <div className="flex items-center space-x-4">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-pretty">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
