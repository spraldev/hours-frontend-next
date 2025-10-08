'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientCard } from '@/components/ui/gradient-card'
import { AlertTriangle, CheckCircle, Users, TrendingUp } from 'lucide-react'

interface SupervisorStatsCardsProps {
  pendingCount: number
  approvedThisWeek: number
  uniqueStudents: number
  totalHours: number
}

export function SupervisorStatsCards({
  pendingCount,
  approvedThisWeek,
  uniqueStudents,
  totalHours,
}: SupervisorStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <GradientCard variant="stat" className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-500">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500/60" />
          </div>
        </CardContent>
      </GradientCard>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Approved This Week</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-500">{approvedThisWeek}</div>
              <p className="text-xs text-muted-foreground">hours approved</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{uniqueStudents}</div>
              <p className="text-xs text-muted-foreground">volunteering</p>
            </div>
            <Users className="h-8 w-8 text-blue-500/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-[#0084ff]">{totalHours}</div>
              <p className="text-xs text-muted-foreground">supervised</p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#0084ff]/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
