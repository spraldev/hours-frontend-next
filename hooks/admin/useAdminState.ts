'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminDashboard } from '../useAdminDashboard'
import { useAdminFilterState } from './useAdminFilterState'
import { useAdminDialogState } from './useAdminDialogState'
import { useAdminFiltering } from './useAdminFiltering'

export function useAdminState() {
  const { user } = useAuth()
  const adminData = useAdminDashboard()
  const filterState = useAdminFilterState()
  const dialogState = useAdminDialogState()
  const { filteredStudents, filteredSupervisors, filteredHours } = useAdminFiltering(
    adminData.students,
    adminData.supervisors,
    adminData.hours,
    filterState.searchTerm,
    filterState.statusFilter,
    filterState.hoursSearchTerm,
    filterState.hoursStatusFilter
  )
  useEffect(() => {
    if (filterState.activeTab === 'admins' && user?.role !== 'superadmin') {
      filterState.setActiveTab('overview')
    }
  }, [filterState.activeTab, user?.role, filterState.setActiveTab])
  return {
    user,
    ...adminData,
    ...filterState,
    ...dialogState,
    filteredStudents,
    filteredSupervisors,
    filteredHours,
  }
}
