'use client'
import { useState, useCallback } from 'react'
import { usePagination } from '@/hooks/usePagination'
import { adminApi } from '@/lib/api/endpoints'
import { Hour, PaginationInfo } from '@/types/api'

export function useUserHoursPagination() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userType, setUserType] = useState<'student' | 'supervisor' | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Create a dynamic fetch function that uses the selected user ID
  const fetchUserHours = useCallback(async (params: any) => {
    if (!selectedUserId) {
      // Return empty response when no user is selected
      return { 
        success: true,
        data: [], 
        pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false } 
      }
    }
    
    try {
      // Use the correct endpoint that now exists in the backend
      const result = await adminApi.getUserHours(selectedUserId, params)
      return result
    } catch (error) {
      console.error('Error fetching user hours for', selectedUserId, ':', error)
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 25, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }
  }, [selectedUserId])

  const userHoursPagination = usePagination<Hour>(fetchUserHours, {
    initialPage: 1,
    initialLimit: 25
  })

  const openUserHours = useCallback((userId: string, type: 'student' | 'supervisor') => {
    setSelectedUserId(userId)
    setUserType(type)
    setSearchTerm('')
    setStatusFilter('all')
    // Reset pagination when opening a new user
    userHoursPagination.setPage(1)
    userHoursPagination.setLimit(25)
  }, [userHoursPagination.setPage, userHoursPagination.setLimit])

  const closeUserHours = useCallback(() => {
    setSelectedUserId(null)
    setUserType(null)
    setSearchTerm('')
    setStatusFilter('all')
  }, [])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    userHoursPagination.setSearch(term)
  }, [userHoursPagination.setSearch])

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status)
    userHoursPagination.setFilters({ status: status === 'all' ? undefined : status })
  }, [userHoursPagination.setFilters])

  // The API now returns filtered hours for the selected user, so use the data directly
  const filteredUserHours = userHoursPagination.data

  // Calculate user stats from filtered hours
  const userStats = selectedUserId && userType ? {
    totalHours: filteredUserHours.reduce((sum: number, h: Hour) => sum + (h.status === 'approved' ? h.hours : 0), 0),
    pendingHours: filteredUserHours.filter((h: Hour) => h.status === 'pending').length,
    approvedHours: filteredUserHours.filter((h: Hour) => h.status === 'approved').length,
    rejectedHours: filteredUserHours.filter((h: Hour) => h.status === 'rejected').length,
  } : null

  return {
    selectedUserId,
    userType,
    searchTerm,
    statusFilter,
    userHours: userHoursPagination.data,
    userHoursPagination: userHoursPagination.pagination,
    userHoursLoading: userHoursPagination.loading,
    userHoursError: userHoursPagination.error,
    filteredUserHours,
    userStats,
    openUserHours,
    closeUserHours,
    handleSearch,
    handleStatusFilter,
    setPage: userHoursPagination.setPage,
    setLimit: userHoursPagination.setLimit,
    refetch: userHoursPagination.refetch,
  }
}
