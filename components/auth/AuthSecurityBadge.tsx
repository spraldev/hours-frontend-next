'use client'

import { Shield } from 'lucide-react'

interface AuthSecurityBadgeProps {
  text: string
}

export function AuthSecurityBadge({ text }: AuthSecurityBadgeProps) {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>{text}</span>
      </div>
    </div>
  )
}
