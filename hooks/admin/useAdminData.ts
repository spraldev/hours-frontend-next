import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiClient } from '@/lib/api-client'
import { adminApi } from '@/lib/api/endpoints'
import { AdminOverview, Student, Supervisor, Hour, Organization } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'
import { usePagination } from '@/hooks/usePagination'

export function useAdminData() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  // Create stable fetch functions for each data type
  const fetchStudents = useCallback((params: any) => adminApi.getStudents(params), [])
  const fetchSupervisors = useCallback((params: any) => adminApi.getSupervisors(params), [])
  const fetchPendingSupervisors = useCallback((params: any) => adminApi.getPendingSupervisors(params), [])
  const fetchHours = useCallback((params: any) => adminApi.getHours(params), [])
  const fetchOrganizations = useCallback((params: any) => adminApi.getOrganizations(params), [])
  const fetchAdmins = useCallback((params: any) => adminApi.getAdmins(params), [])
  
  // Use pagination hooks for each data type
  const studentsPagination = usePagination<Student>(fetchStudents)
  const supervisorsPagination = usePagination<Supervisor>(fetchSupervisors)
  const pendingSupervisorsPagination = usePagination<Supervisor>(fetchPendingSupervisors)
  const hoursPagination = usePagination<Hour>(fetchHours)
  const organizationsPagination = usePagination<Organization>(fetchOrganizations)
  
  // Always initialize admins pagination, but conditionally use it
  // This endpoint requires superadmin role according to backend routes
  const adminsPagination = usePagination<any>(fetchAdmins)

  // Additional methods for graduated students and other non-paginated operations
  const getGraduatedStudents = useCallback(async () => {
    try {
      const response = await apiClient.get<Student[]>('/admin/students/graduated')
      if (response.success && response.data) return response.data
      return []
    } catch (err: any) {
      setOverviewError(err.message || 'Failed to fetch graduated students')
      return []
    }
  }, [])

  const deleteGraduatedStudents = useCallback(async () => {
    try {
      const response = await apiClient.delete('/admin/students/graduated')
      return response.success
    } catch (err: any) {
      setOverviewError(err.message || 'Failed to delete graduated students')
      return false
    }
  }, [])

  // Fetch overview data (non-paginated)
  const fetchOverview = async () => {
    setOverviewLoading(true)
    setOverviewError(null)
    try {
      const response = await apiClient.get<AdminOverview>('/admin/overview')
      if (response?.success && response?.data) {
        setOverview(response.data as AdminOverview)
      }
    } catch (err: any) {
      setOverviewError(err.message || 'Failed to load overview data')
    } finally {
      setOverviewLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const refetch = async () => {
    await fetchOverview()
    studentsPagination.refetch()
    supervisorsPagination.refetch()
    pendingSupervisorsPagination.refetch()
    hoursPagination.refetch()
    organizationsPagination.refetch()
    // Only refetch admins if user is superadmin
    if (user?.role === 'superadmin') {
      adminsPagination.refetch()
    }
  }

  // Compute overall loading state - true if any data is still loading
  const isAnyDataLoading = studentsPagination.loading || 
    supervisorsPagination.loading || 
    pendingSupervisorsPagination.loading || 
    hoursPagination.loading || 
    organizationsPagination.loading || 
    (user?.role === 'superadmin' && adminsPagination.loading)

  // Set initial loading to false once all data has loaded at least once
  useEffect(() => {
    if (!isAnyDataLoading && !initialLoading) {
      setInitialLoading(false)
    }
  }, [isAnyDataLoading, initialLoading])

  // Memoize action objects to prevent infinite re-renders
  const studentsActions = useMemo(() => ({
    setPage: studentsPagination.setPage,
    setLimit: studentsPagination.setLimit,
    setSearch: studentsPagination.setSearch,
    setFilters: studentsPagination.setFilters,
    resetFilters: studentsPagination.resetFilters,
    refetch: studentsPagination.refetch
  }), [studentsPagination.setPage, studentsPagination.setLimit, studentsPagination.setSearch, studentsPagination.setFilters, studentsPagination.resetFilters, studentsPagination.refetch])

  const supervisorsActions = useMemo(() => ({
    setPage: supervisorsPagination.setPage,
    setLimit: supervisorsPagination.setLimit,
    setSearch: supervisorsPagination.setSearch,
    setFilters: supervisorsPagination.setFilters,
    resetFilters: supervisorsPagination.resetFilters,
    refetch: supervisorsPagination.refetch
  }), [supervisorsPagination.setPage, supervisorsPagination.setLimit, supervisorsPagination.setSearch, supervisorsPagination.setFilters, supervisorsPagination.resetFilters, supervisorsPagination.refetch])

  const pendingSupervisorsActions = useMemo(() => ({
    setPage: pendingSupervisorsPagination.setPage,
    setLimit: pendingSupervisorsPagination.setLimit,
    setSearch: pendingSupervisorsPagination.setSearch,
    setFilters: pendingSupervisorsPagination.setFilters,
    resetFilters: pendingSupervisorsPagination.resetFilters,
    refetch: pendingSupervisorsPagination.refetch
  }), [pendingSupervisorsPagination.setPage, pendingSupervisorsPagination.setLimit, pendingSupervisorsPagination.setSearch, pendingSupervisorsPagination.setFilters, pendingSupervisorsPagination.resetFilters, pendingSupervisorsPagination.refetch])

  const hoursActions = useMemo(() => ({
    setPage: hoursPagination.setPage,
    setLimit: hoursPagination.setLimit,
    setSearch: hoursPagination.setSearch,
    setFilters: hoursPagination.setFilters,
    resetFilters: hoursPagination.resetFilters,
    refetch: hoursPagination.refetch
  }), [hoursPagination.setPage, hoursPagination.setLimit, hoursPagination.setSearch, hoursPagination.setFilters, hoursPagination.resetFilters, hoursPagination.refetch])

  const organizationsActions = useMemo(() => ({
    setPage: organizationsPagination.setPage,
    setLimit: organizationsPagination.setLimit,
    setSearch: organizationsPagination.setSearch,
    setFilters: organizationsPagination.setFilters,
    resetFilters: organizationsPagination.resetFilters,
    refetch: organizationsPagination.refetch
  }), [organizationsPagination.setPage, organizationsPagination.setLimit, organizationsPagination.setSearch, organizationsPagination.setFilters, organizationsPagination.resetFilters, organizationsPagination.refetch])

  const adminsActions = useMemo(() => ({
    setPage: adminsPagination.setPage,
    setLimit: adminsPagination.setLimit,
    setSearch: adminsPagination.setSearch,
    setFilters: adminsPagination.setFilters,
    resetFilters: adminsPagination.resetFilters,
    refetch: adminsPagination.refetch
  }), [adminsPagination.setPage, adminsPagination.setLimit, adminsPagination.setSearch, adminsPagination.setFilters, adminsPagination.resetFilters, adminsPagination.refetch])

  return {
    // Overview data (non-paginated)
    overview,
    overviewLoading,
    overviewError,
    initialLoading,
    isAnyDataLoading,
    
    // Students with pagination
    students: studentsPagination.data,
    studentsPagination: studentsPagination.pagination,
    studentsLoading: studentsPagination.loading,
    studentsError: studentsPagination.error,
    studentsActions,
    
    // Supervisors with pagination
    supervisors: supervisorsPagination.data,
    supervisorsPagination: supervisorsPagination.pagination,
    supervisorsLoading: supervisorsPagination.loading,
    supervisorsError: supervisorsPagination.error,
    supervisorsActions,
    
    // Pending Supervisors with pagination
    pendingSupervisors: pendingSupervisorsPagination.data,
    pendingSupervisorsPagination: pendingSupervisorsPagination.pagination,
    pendingSupervisorsLoading: pendingSupervisorsPagination.loading,
    pendingSupervisorsError: pendingSupervisorsPagination.error,
    pendingSupervisorsActions,
    
    // Hours with pagination
    hours: hoursPagination.data,
    hoursPagination: hoursPagination.pagination,
    hoursLoading: hoursPagination.loading,
    hoursError: hoursPagination.error,
    hoursActions,
    
    // Organizations with pagination
    organizations: organizationsPagination.data,
    organizationsPagination: organizationsPagination.pagination,
    organizationsLoading: organizationsPagination.loading,
    organizationsError: organizationsPagination.error,
    organizationsActions,
    
    // Admins with pagination (only for superadmin)
    admins: user?.role === 'superadmin' ? adminsPagination.data : [],
    adminsPagination: adminsPagination.pagination,
    adminsLoading: adminsPagination.loading,
    adminsError: adminsPagination.error,
    adminsActions,
    
    // General actions
    refetch,
    setOverviewError,
    
    // Computed loading state for the entire dashboard
    loading: overviewLoading || isAnyDataLoading,
    
    // Additional methods
    getGraduatedStudents,
    deleteGraduatedStudents
  }
}
