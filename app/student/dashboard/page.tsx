'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { PageTransition } from '@/components/ui/page-transition'
import { LoadingSpinner, ErrorState } from '@/components/feedback'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { useHoursFilter } from '@/hooks/useHoursFilter'
import { DashboardHero, StatsCards, HoursFilters, HoursTable } from './components'
import { getStudentInitials, getStudentName, getStudentGrade } from '@/lib/utils/student-helpers'
import { exportHoursToCSV } from '@/lib/utils/hours-export'
export default function StudentDashboard() {
  const { user } = useAuth()
  const { student, statistics, hours, loading, error } = useStudentDashboard()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const filteredData = useHoursFilter(hours, searchTerm, statusFilter)
  if (loading) return <AppShell userRole="student"><LoadingSpinner size="lg" /></AppShell>
  if (error) return <AppShell userRole="student"><ErrorState message={error} /></AppShell>
  const stats = {
    totalHours: statistics?.approvedHours || 0,
    pendingHours: statistics?.pendingHours || 0,
    thisMonth: statistics?.hoursThisMonth || 0,
    organizations: new Set(hours.map((h) => (typeof h.organization === 'string' ? h.organization : h.organization?._id)).filter(Boolean)).size,
  }

  return (
    <AppShell userRole="student">
      <PageTransition>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <DashboardHero name={getStudentName(user, student)} grade={getStudentGrade(student)} initials={getStudentInitials(user, student)} />
          <StatsCards {...stats} />
          <HoursFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} onExport={() => exportHoursToCSV(filteredData)} hasData={filteredData.length > 0} />
          <HoursTable hours={filteredData} searchTerm={searchTerm} statusFilter={statusFilter} />
        </div>
      </PageTransition>
    </AppShell>
  )
}
