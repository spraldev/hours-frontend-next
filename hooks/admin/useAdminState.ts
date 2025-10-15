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
  const { filteredStudents, filteredSupervisors, filteredHours, filteredOrganizations } = useAdminFiltering(
    adminData.students,
    adminData.supervisors,
    adminData.hours,
    adminData.organizations,
    filterState.searchTerm,
    filterState.statusFilter,
    filterState.supervisorSearchTerm,
    filterState.supervisorStatusFilter,
    filterState.hoursSearchTerm,
    filterState.hoursStatusFilter,
    filterState.organizationsSearchTerm,
    filterState.organizationsStatusFilter
  )
  useEffect(() => {
    if (filterState.activeTab === 'admins' && user?.role !== 'superadmin') {
      filterState.setActiveTab('overview')
    }
  }, [filterState.activeTab, user?.role, filterState.setActiveTab])
  
  useEffect(() => {
    const checkGraduatedStudents = async () => {
      if (user?.role === 'superadmin') {
        try {
          const students = await adminData.getGraduatedStudents()
          dialogState.setHasGraduatedStudents(students && students.length > 0)
        } catch (err) {
          dialogState.setHasGraduatedStudents(false)
        }
      } else {
        dialogState.setHasGraduatedStudents(false)
      }
    }
    checkGraduatedStudents()
  }, [user?.role, adminData.students])
  
  return {
    user,
    ...adminData,
    ...filterState,
    ...dialogState,
    filteredStudents,
    filteredSupervisors,
    filteredHours,
    filteredOrganizations,
  }
}
