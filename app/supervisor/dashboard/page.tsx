'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSpinner, ErrorState } from '@/components/feedback'
import { useAuth } from '@/contexts/AuthContext'
import { useSupervisorDashboard } from '@/hooks/useSupervisorDashboard'
import { useSupervisorFilter } from '@/hooks/useSupervisorFilter'
import { useSupervisorActions } from '@/hooks/useSupervisorActions'
import { useSupervisorStats } from '@/hooks/useSupervisorStats'
import { SupervisorHero, SupervisorStatsCards, ApprovalQueueTab, AllHoursFilters, AllHoursTable, EditHourDialog, DeleteHourDialog } from './components'
import { getSupervisorInitials, getSupervisorName, getOrganizationName, getTimeAgo } from '@/lib/utils/supervisor-helpers'
import { exportSupervisedHoursToCSV } from '@/lib/utils/supervisor-export'
export default function SupervisorDashboard() {
  const { user } = useAuth()
  const { supervisor, pendingHours, allHours, loading, error, updateHourStatus, deleteHour, refetch } = useSupervisorDashboard()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const filteredAllHours = useSupervisorFilter(allHours, searchTerm, statusFilter)
  const actions = useSupervisorActions({ updateHourStatus, deleteHour, refetch, pendingHours })
  const stats = useSupervisorStats(allHours, pendingHours)

  if (loading) return <AppShell userRole="supervisor"><LoadingSpinner size="lg" /></AppShell>
  if (error) return <AppShell userRole="supervisor"><ErrorState message={error} /></AppShell>

  return (
    <AppShell userRole="supervisor">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <SupervisorHero name={getSupervisorName(user, supervisor)} organization={getOrganizationName(supervisor)} initials={getSupervisorInitials(user, supervisor)} pendingCount={pendingHours.length} />
        <SupervisorStatsCards {...stats} />
        <Tabs defaultValue="queue" className="w-full"><TabsList><TabsTrigger value="queue">Approval Queue</TabsTrigger><TabsTrigger value="all">All Hours</TabsTrigger></TabsList><TabsContent value="queue"><ApprovalQueueTab pendingHours={pendingHours} selectedEntries={actions.selectedEntries} isSubmitting={actions.isSubmitting} bulkAction={actions.bulkAction} rejectionReason={actions.rejectionReason} onSelectEntry={actions.handleSelectEntry} onSelectAll={actions.handleSelectAll} onBulkApprove={actions.handleBulkApprove} onBulkReject={actions.handleBulkReject} onIndividualApprove={actions.handleIndividualApprove} onIndividualReject={actions.handleIndividualReject} setBulkAction={actions.setBulkAction} setRejectionReason={actions.setRejectionReason} getTimeAgo={getTimeAgo} /></TabsContent><TabsContent value="all"><AllHoursFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} onExport={() => exportSupervisedHoursToCSV(filteredAllHours)} hasData={filteredAllHours.length > 0} /><AllHoursTable hours={filteredAllHours} searchTerm={searchTerm} statusFilter={statusFilter} onEditClick={(hour) => { actions.setEditingHour(hour); actions.setEditStatus(hour.status); actions.setEditRejectionReason('') }} onDeleteClick={actions.setDeleteConfirmHour} /></TabsContent></Tabs>
        <EditHourDialog hour={actions.editingHour} status={actions.editStatus} rejectionReason={actions.editRejectionReason} isSubmitting={actions.isSubmitting} onClose={() => actions.setEditingHour(null)} onStatusChange={actions.setEditStatus} onReasonChange={actions.setEditRejectionReason} onSubmit={actions.handleEditSubmit} />
        <DeleteHourDialog hour={actions.deleteConfirmHour} isSubmitting={actions.isSubmitting} onClose={() => actions.setDeleteConfirmHour(null)} onConfirm={actions.handleDeleteConfirm} />
      </div>
    </AppShell>
  )
}
