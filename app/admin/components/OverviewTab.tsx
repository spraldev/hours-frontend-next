'use client'

import { AdminStatsCards } from './AdminStatsCards'
import { DeleteGraduatedButton } from './DeleteGraduatedButton'
import { PendingSupervisorApprovals } from './PendingSupervisorApprovals'
import { RecentActivityCard } from './RecentActivityCard'
import { TopStudentsCard } from './TopStudentsCard'
import { SystemStatusCard } from './SystemStatusCard'

interface OverviewTabProps {
  overview: any
  students: any[]
  supervisors: any[]
  pendingSupervisors: any[]
  hours: any[]
  organizations: any[]
  isProcessing: boolean
  onApproveSupervisor: (id: string) => void
  onRejectSupervisor: (id: string) => void
  onOpenDeleteGraduatedDialog: () => void
  userRole?: string
  hasGraduatedStudents?: boolean
}

export function OverviewTab({
  overview,
  students,
  supervisors,
  pendingSupervisors,
  hours,
  organizations,
  isProcessing,
  onApproveSupervisor,
  onRejectSupervisor,
  onOpenDeleteGraduatedDialog,
  userRole,
  hasGraduatedStudents,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <AdminStatsCards overview={overview} students={students} supervisors={supervisors} hours={hours} organizations={organizations} />
      {userRole === 'superadmin' && hasGraduatedStudents && (
        <DeleteGraduatedButton onOpenDialog={onOpenDeleteGraduatedDialog} isLoading={isProcessing} />
      )}
      <PendingSupervisorApprovals
        pendingSupervisors={pendingSupervisors}
        onApprove={onApproveSupervisor}
        onReject={onRejectSupervisor}
        isProcessing={isProcessing}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard hours={hours} />
        <TopStudentsCard students={students} hours={hours} />
      </div>
      <SystemStatusCard hours={hours} students={students} supervisors={supervisors} />
    </div>
  )
}
