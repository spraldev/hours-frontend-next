import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { supervisorApi } from '@/lib/api/endpoints'
import { Supervisor, Hour } from '@/types/api'
import { usePagination } from '@/hooks/usePagination'

export function useSupervisorDashboard() {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null)
  const [supervisorLoading, setSupervisorLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create stable fetch functions for hours
  const fetchPendingHours = useCallback((params: any) => supervisorApi.getPendingHours(params), [])
  const fetchAllHours = useCallback((params: any) => supervisorApi.getHours(params), [])
  
  // Use pagination for hours
  const pendingHoursPagination = usePagination<Hour>(fetchPendingHours)
  const allHoursPagination = usePagination<Hour>(fetchAllHours)

  const fetchSupervisorData = async () => {
    setSupervisorLoading(true)
    setError(null)

    try {
      const supervisorRes = await apiClient.get<Supervisor>('/supervisor/profile')

      if (supervisorRes.success && supervisorRes.data) {
        setSupervisor(supervisorRes.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setSupervisorLoading(false)
    }
  }

  const updateHourStatus = async (hourId: string, status: 'approved' | 'rejected' | 'pending', rejectionReason?: string) => {
    try {
      const response = await apiClient.post('/supervisor/update-hour-status', {
        hourId,
        status,
        rejectionReason,
      })

      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update hour status')
      return false
    }
  }

  const deleteHour = async (hourId: string) => {
    try {
      const response = await apiClient.post('/supervisor/delete-hour', { hourId })

      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete hour')
      return false
    }
  }

  const refetch = async () => {
    await fetchSupervisorData()
    pendingHoursPagination.refetch()
    allHoursPagination.refetch()
  }

  useEffect(() => {
    fetchSupervisorData()
  }, [])

  const loading = supervisorLoading

  return {
    // Non-paginated data
    supervisor,
    loading,
    error,
    
    // Pending Hours with pagination
    pendingHours: pendingHoursPagination.data,
    pendingHoursPagination: pendingHoursPagination.pagination,
    pendingHoursLoading: pendingHoursPagination.loading,
    pendingHoursError: pendingHoursPagination.error,
    pendingHoursActions: {
      setPage: pendingHoursPagination.setPage,
      setLimit: pendingHoursPagination.setLimit,
      setSearch: pendingHoursPagination.setSearch,
      setFilters: pendingHoursPagination.setFilters,
      resetFilters: pendingHoursPagination.resetFilters,
      refetch: pendingHoursPagination.refetch
    },
    
    // All Hours with pagination
    allHours: allHoursPagination.data,
    allHoursPagination: allHoursPagination.pagination,
    allHoursLoading: allHoursPagination.loading,
    allHoursError: allHoursPagination.error,
    allHoursActions: {
      setPage: allHoursPagination.setPage,
      setLimit: allHoursPagination.setLimit,
      setSearch: allHoursPagination.setSearch,
      setFilters: allHoursPagination.setFilters,
      resetFilters: allHoursPagination.resetFilters,
      refetch: allHoursPagination.refetch
    },
    
    // Actions
    updateHourStatus,
    deleteHour,
    refetch,
    setError
  }
}
