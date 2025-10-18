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
  
  // Lazy loading states - only load when tab is accessed
  const [studentsLoaded, setStudentsLoaded] = useState(false)
  const [supervisorsLoaded, setSupervisorsLoaded] = useState(false)
  const [hoursLoaded, setHoursLoaded] = useState(false)
  const [organizationsLoaded, setOrganizationsLoaded] = useState(false)
  const [adminsLoaded, setAdminsLoaded] = useState(false)

  // Create stable fetch functions for each data type
  const fetchStudents = useCallback((params: any) => adminApi.getStudents(params), [])
  const fetchSupervisors = useCallback((params: any) => adminApi.getSupervisors(params), [])
  const fetchPendingSupervisors = useCallback((params: any) => adminApi.getPendingSupervisors(params), [])
  const fetchHours = useCallback((params: any) => adminApi.getHours(params), [])
  const fetchOrganizations = useCallback((params: any) => adminApi.getOrganizations(params), [])
  const fetchAdmins = useCallback((params: any) => adminApi.getAdmins(params), [])
  
  // Use pagination hooks for each data type - but only initialize when needed
  const studentsPagination = usePagination<Student>(studentsLoaded ? fetchStudents : () => Promise.resolve({ success: true, data: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }))
  const supervisorsPagination = usePagination<Supervisor>(supervisorsLoaded ? fetchSupervisors : () => Promise.resolve({ success: true, data: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }))
  const pendingSupervisorsPagination = usePagination<Supervisor>(fetchPendingSupervisors) // Always load pending supervisors for overview
  const hoursPagination = usePagination<Hour>(hoursLoaded ? fetchHours : () => Promise.resolve({ success: true, data: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }))
  const organizationsPagination = usePagination<Organization>(organizationsLoaded ? fetchOrganizations : () => Promise.resolve({ success: true, data: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }))
  
  // Always initialize admins pagination, but conditionally use it
  const adminsPagination = usePagination<any>(adminsLoaded ? fetchAdmins : () => Promise.resolve({ success: true, data: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }))

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

  // Lazy loading functions - only load data when tab is accessed
  const loadStudents = useCallback(() => {
    if (!studentsLoaded) {
      setStudentsLoaded(true)
    }
  }, [studentsLoaded])

  const loadSupervisors = useCallback(() => {
    if (!supervisorsLoaded) {
      setSupervisorsLoaded(true)
    }
  }, [supervisorsLoaded])

  const loadHours = useCallback(() => {
    if (!hoursLoaded) {
      setHoursLoaded(true)
    }
  }, [hoursLoaded])

  const loadOrganizations = useCallback(() => {
    if (!organizationsLoaded) {
      setOrganizationsLoaded(true)
    }
  }, [organizationsLoaded])

  const loadAdmins = useCallback(() => {
    if (!adminsLoaded) {
      setAdminsLoaded(true)
    }
  }, [adminsLoaded])

  const refetch = async () => {
    await fetchOverview()
    // Only refetch loaded data
    if (studentsLoaded) studentsPagination.refetch()
    if (supervisorsLoaded) supervisorsPagination.refetch()
    pendingSupervisorsPagination.refetch() // Always refetch pending supervisors
    if (hoursLoaded) hoursPagination.refetch()
    if (organizationsLoaded) organizationsPagination.refetch()
    if (user?.role === 'superadmin' && adminsLoaded) {
      adminsPagination.refetch()
    }
  }

  // Compute overall loading state - only check loaded data
  const isAnyDataLoading = (studentsLoaded && studentsPagination.loading) || 
    (supervisorsLoaded && supervisorsPagination.loading) || 
    pendingSupervisorsPagination.loading || 
    (hoursLoaded && hoursPagination.loading) || 
    (organizationsLoaded && organizationsPagination.loading) || 
    (user?.role === 'superadmin' && adminsLoaded && adminsPagination.loading)

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
    isAnyDataLoading,
    
    // Lazy loading functions
    loadStudents,
    loadSupervisors,
    loadHours,
    loadOrganizations,
    loadAdmins,
    
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
