'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminDashboard } from '../useAdminDashboard'
import { useAdminFilterState } from './useAdminFilterState'
import { useAdminDialogState } from './useAdminDialogState'

export function useAdminState() {
  const { user } = useAuth()
  const adminData = useAdminDashboard()
  const filterState = useAdminFilterState()
  const dialogState = useAdminDialogState()
  
  // Connect search terms to pagination actions
  useEffect(() => {
    adminData.studentsActions.setSearch(filterState.searchTerm)
  }, [filterState.searchTerm, adminData.studentsActions.setSearch])
  
  useEffect(() => {
    adminData.supervisorsActions.setFilters({ status: filterState.supervisorStatusFilter })
    adminData.supervisorsActions.setSearch(filterState.supervisorSearchTerm)
  }, [filterState.supervisorSearchTerm, filterState.supervisorStatusFilter, adminData.supervisorsActions.setFilters, adminData.supervisorsActions.setSearch])
  
  useEffect(() => {
    adminData.hoursActions.setFilters({ status: filterState.hoursStatusFilter })
    adminData.hoursActions.setSearch(filterState.hoursSearchTerm)
  }, [filterState.hoursSearchTerm, filterState.hoursStatusFilter, adminData.hoursActions.setFilters, adminData.hoursActions.setSearch])
  
  useEffect(() => {
    adminData.organizationsActions.setSearch(filterState.organizationsSearchTerm)
  }, [filterState.organizationsSearchTerm, adminData.organizationsActions.setSearch])
  
  useEffect(() => {
    if (filterState.activeTab === 'admins' && user?.role !== 'superadmin') {
      filterState.setActiveTab('overview')
    }
  }, [filterState.activeTab, user?.role, filterState.setActiveTab])
  
  useEffect(() => {
    const checkGraduatedStudents = async () => {
      // Only check for graduated students if user is superadmin
      // This endpoint requires superadmin role according to backend routes
      if (user?.role === 'superadmin') {
        try {
          const students = await adminData.getGraduatedStudents()
          dialogState.setHasGraduatedStudents(students && students.length > 0)
        } catch (err) {
          dialogState.setHasGraduatedStudents(false)
        }
      } else {
        // Regular admins don't have access to graduated students endpoint
        dialogState.setHasGraduatedStudents(false)
      }
    }
    checkGraduatedStudents()
  }, [user?.role, dialogState.setHasGraduatedStudents])
  
  return {
    user,
    ...adminData,
    ...filterState,
    ...dialogState,
    // Use paginated data directly (filtering is now server-side)
    filteredStudents: adminData.students,
    filteredSupervisors: adminData.supervisors,
    filteredHours: adminData.hours,
    filteredOrganizations: adminData.organizations,
  }
}
