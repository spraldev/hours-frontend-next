'use client'

import { GradientCard } from '@/components/ui/gradient-card'
import { Badge } from '@/components/ui/badge'
import { Server } from 'lucide-react'

export function AdminHeader() {
  return (
    <div className="mb-8">
      <GradientCard variant="hero" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">CVHS Community Service Hours Administration</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Server className="mr-1 h-3 w-3" />
              System Online
            </Badge>
          </div>
        </div>
      </GradientCard>
    </div>
  )
}
