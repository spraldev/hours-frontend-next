'use client'

import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GradientCard } from '@/components/ui/gradient-card'

interface SupervisorHeroProps {
  name: string
  organization: string
  initials: string
  pendingCount: number
}

export function SupervisorHero({ name, organization, initials, pendingCount }: SupervisorHeroProps) {
  return (
    <div className="mb-8">
      <GradientCard variant="hero" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-balance">Welcome, {name}</h1>
              <p className="text-muted-foreground">{organization} • Supervisor</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#0084ff]">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">pending approvals</p>
          </div>
        </div>
      </GradientCard>
    </div>
  )
}
