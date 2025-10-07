'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Server } from 'lucide-react'

interface SystemStatusCardProps {
  hours: any[]
  students: any[]
  supervisors: any[]
}

export function SystemStatusCard({ hours, students, supervisors }: SystemStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-green-500" />
          System Status
        </CardTitle>
        <CardDescription>Current system health and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{hours.filter((h) => h.status === 'approved').length}</div>
            <div className="text-sm text-muted-foreground">Approved Hours</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <div className="text-2xl font-bold text-orange-600">{hours.filter((h) => h.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{students.filter((s) => s.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600">{supervisors.filter((s) => s.isApproved).length}</div>
            <div className="text-sm text-muted-foreground">Approved Supervisors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
