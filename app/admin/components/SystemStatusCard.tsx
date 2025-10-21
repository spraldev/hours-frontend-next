'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface SystemStatusCardProps {
  overview?: any
  hours: any[]
  students: any[]
  supervisors: any[]
}

export function SystemStatusCard({ overview, hours, students, supervisors }: SystemStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Data Overview
        </CardTitle>
        <CardDescription>Current statistics for hours, students, and supervisors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{overview?.approvedHours ?? 0}</div>
            <div className="text-sm text-muted-foreground">Approved Hours</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <div className="text-2xl font-bold text-orange-600">{overview?.pendingHours ?? 0}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600">{overview?.rejectedHours ?? 0}</div>
            <div className="text-sm text-muted-foreground">Rejected Hours</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{overview?.totalStudents ?? 0}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
