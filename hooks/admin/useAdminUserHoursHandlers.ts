'use client'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useAdminUserHoursHandlers(state: any) {
  const handleOpenUserHours = (user: any, userType: 'student' | 'supervisor') => {
    state.openUserHours(user._id, userType)
    state.setIsUserHoursDialogOpen(true)
    state.setSelectedUser({ ...user, userType })
    state.setSelectedUserHours([])
  }

  const handleCloseUserHours = () => {
    state.closeUserHours()
    state.setIsUserHoursDialogOpen(false)
    state.setSelectedUser(null)
    state.setSelectedUserHours([])
  }

  const handleUserHoursSearch = (term: string) => {
    state.handleSearch(term)
  }

  const handleUserHoursStatusFilter = (status: string) => {
    state.handleStatusFilter(status)
  }

  const handleSelectUserHour = (hourId: string, checked: boolean) => {
    if (checked) {
      state.setSelectedUserHours([...state.selectedUserHours, hourId])
    } else {
      state.setSelectedUserHours(state.selectedUserHours.filter((id: string) => id !== hourId))
    }
  }

  const handleSelectAllUserHours = (checked: boolean, filteredHours: any[]) => {
    if (checked) {
      state.setSelectedUserHours(filteredHours.map((h: any) => h._id))
    } else {
      state.setSelectedUserHours([])
    }
  }

  const handleApproveUserHours = async () => {
    state.setIsProcessing(true)
    try {
      for (const hourId of state.selectedUserHours) {
        await state.approveHour(hourId)
      }
      toast.success(`${state.selectedUserHours.length} hour entries have been approved.`)
      state.setSelectedUserHours([])
      await state.refetch()
      // Refetch user hours specifically
      if (state.selectedUserId) {
        await state.refetch()
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleRejectUserHours = async (reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    state.setIsProcessing(true)
    try {
      for (const hourId of state.selectedUserHours) {
        await state.rejectHour(hourId, reason)
      }
      toast.success(`${state.selectedUserHours.length} hour entries have been rejected.`)
      state.setSelectedUserHours([])
      await state.refetch()
      // Refetch user hours specifically
      if (state.selectedUserId) {
        await state.refetch()
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleEditUserHour = (hour: any) => {
    state.setEditingHour(hour)
    state.setEditHourStatus(hour.status)
    state.setEditRejectionReason(hour.rejectionReason || '')
  }

  const handleDeleteUserHour = (hour: any) => {
    state.setDeleteConfirmHour(hour)
  }

  // Use the paginated user hours data
  const filteredUserHours = state.filteredUserHours || []
  const userStats = state.userStats

  return {
    handleOpenUserHours,
    handleCloseUserHours,
    handleUserHoursSearch,
    handleUserHoursStatusFilter,
    handleSelectUserHour,
    handleSelectAllUserHours,
    handleApproveUserHours,
    handleRejectUserHours,
    handleEditUserHour,
    handleDeleteUserHour,
    filteredUserHours,
    userStats,
  }
}

