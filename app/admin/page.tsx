'use client'
import { AppShell } from '@/components/layout/app-shell'
import { LoadingSpinner, ErrorState } from '@/components/feedback'
import { useAdminState } from '@/hooks/admin/useAdminState'
import { useAdminUserHandlers } from '@/hooks/admin/useAdminUserHandlers'
import { useAdminHoursHandlers } from '@/hooks/admin/useAdminHoursHandlers'
import { useAdminOrgHandlers } from '@/hooks/admin/useAdminOrgHandlers'
import { useAdminSupervHandlers } from '@/hooks/admin/useAdminSupervHandlers'
import { useAdminAdminHandlers } from '@/hooks/admin/useAdminAdminHandlers'
import { useAdminUserHoursHandlers } from '@/hooks/admin/useAdminUserHoursHandlers'
import { AdminHeader, TabsContainer, DialogsContainer } from './components'
export default function AdminDashboard() {
  const state = useAdminState()
  const userHandlers = useAdminUserHandlers(state)
  const hoursHandlers = useAdminHoursHandlers(state)
  const orgHandlers = useAdminOrgHandlers(state)
  const supervHandlers = useAdminSupervHandlers(state)
  const adminHandlers = useAdminAdminHandlers(state)
  const userHoursHandlers = useAdminUserHoursHandlers(state)
  if (state.loading) return (
    <AppShell userRole="admin">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <LoadingSpinner size="lg" />
      </div>
    </AppShell>
  )
  if (state.error) return (
    <AppShell userRole="admin">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ErrorState message={state.error} onRetry={state.refetch} />
      </div>
    </AppShell>
  )
  return (
    <AppShell userRole="admin">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AdminHeader />
        <TabsContainer
          state={state}
          userHandlers={userHandlers}
          hoursHandlers={hoursHandlers}
          orgHandlers={orgHandlers}
          supervHandlers={supervHandlers}
          adminHandlers={adminHandlers}
          userHoursHandlers={userHoursHandlers}
        />
        <DialogsContainer
          state={state}
          userHandlers={userHandlers}
          hoursHandlers={hoursHandlers}
          orgHandlers={orgHandlers}
          adminHandlers={adminHandlers}
          userHoursHandlers={userHoursHandlers}
        />
      </div>
    </AppShell>
  )
}
