'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientCard } from '@/components/ui/gradient-card'
import { Users, Clock, AlertTriangle, Building2 } from 'lucide-react'

interface AdminStatsCardsProps {
  overview: any
  students: any[]
  supervisors: any[]
  hours: any[]
  organizations: any[]
}

export function AdminStatsCards({ overview, students, supervisors, hours, organizations }: AdminStatsCardsProps) {
  const totalStudents = overview?.totalStudents || students.length
  const totalHours = overview?.totalHours || hours.reduce((sum, h) => (h.status === 'approved' ? sum + h.hours : sum), 0)
  const pendingHours = overview?.pendingHours || hours.filter((h) => h.status === 'pending').length
  const activeSupervisors = overview?.totalSupervisors || supervisors.filter((s) => s.isApproved).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <GradientCard variant="stat" className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-[#0084ff]">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">registered students</p>
            </div>
            <Users className="h-8 w-8 text-[#0084ff]/60" />
          </div>
        </CardContent>
      </GradientCard>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{totalHours}</div>
              <p className="text-xs text-muted-foreground">community service</p>
            </div>
            <Clock className="h-8 w-8 text-green-500/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-500">{pendingHours}</div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Supervisors</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{activeSupervisors}</div>
              <p className="text-xs text-muted-foreground">{organizations.length} organizations</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-500/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
