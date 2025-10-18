import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { studentApi } from '@/lib/api/endpoints'
import { Student, Hour, StudentStatistics } from '@/types/api'
import { usePagination } from '@/hooks/usePagination'

export function useStudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [studentLoading, setStudentLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create a stable fetch function for hours
  const fetchHours = useCallback((params: any) => studentApi.getHours(params), [])
  
  // Use pagination for hours
  const hoursPagination = usePagination<Hour>(fetchHours)

  const fetchStudentData = async () => {
    setStudentLoading(true)
    setError(null)

    try {
      const [studentRes, statsRes] = await Promise.all([
        apiClient.get<Student>('/student/student'),
        apiClient.get<StudentStatistics>('/student/statistics'),
      ])

      if (studentRes.success && studentRes.data) {
        setStudent(studentRes.data)
      }

      if (statsRes.success && statsRes.data) {
        setStatistics(statsRes.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setStudentLoading(false)
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [])

  const refetch = async () => {
    await fetchStudentData()
    hoursPagination.refetch()
  }

  const loading = studentLoading || statsLoading

  return {
    // Non-paginated data
    student,
    statistics,
    loading,
    error,
    
    // Hours with pagination
    hours: hoursPagination.data,
    hoursPagination: hoursPagination.pagination,
    hoursLoading: hoursPagination.loading,
    hoursError: hoursPagination.error,
    hoursActions: {
      setPage: hoursPagination.setPage,
      setLimit: hoursPagination.setLimit,
      setSearch: hoursPagination.setSearch,
      setFilters: hoursPagination.setFilters,
      resetFilters: hoursPagination.resetFilters,
      refetch: hoursPagination.refetch
    },
    
    // General actions
    refetch,
    setError
  }
}
