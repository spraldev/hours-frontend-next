'use client'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useAdminUserHoursHandlers(state: any) {
  const handleOpenUserHours = (user: any, userType: 'student' | 'supervisor') => {
    state.setSelectedUser({ ...user, userType })
    state.setIsUserHoursDialogOpen(true)
    state.setUserHoursSearchTerm('')
    state.setUserHoursStatusFilter('all')
    state.setSelectedUserHours([])
  }

  const handleCloseUserHours = () => {
    state.setIsUserHoursDialogOpen(false)
    state.setSelectedUser(null)
    state.setUserHoursSearchTerm('')
    state.setUserHoursStatusFilter('all')
    state.setSelectedUserHours([])
  }

  const handleUserHoursSearch = (term: string) => {
    state.setUserHoursSearchTerm(term)
  }

  const handleUserHoursStatusFilter = (status: string) => {
    state.setUserHoursStatusFilter(status)
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

  // Get filtered hours for the selected user
  const filteredUserHours = useMemo(() => {
    if (!state.selectedUser || !state.hours) return []
    
    let userHours = state.hours.filter((hour: any) => {
      const student = typeof hour.student === 'string' ? hour.student : hour.student?._id
      const supervisor = typeof hour.supervisor === 'string' ? hour.supervisor : hour.supervisor?._id
      
      if (state.selectedUser.userType === 'student') {
        return student === state.selectedUser._id
      } else {
        return supervisor === state.selectedUser._id
      }
    })

    // Apply search filter
    if (state.userHoursSearchTerm) {
      const term = state.userHoursSearchTerm.toLowerCase()
      userHours = userHours.filter((hour: any) => {
        const description = hour.description?.toLowerCase() || ''
        const orgName = typeof hour.organization === 'string' 
          ? hour.organization.toLowerCase() 
          : hour.organization?.name?.toLowerCase() || ''
        return description.includes(term) || orgName.includes(term)
      })
    }

    // Apply status filter
    if (state.userHoursStatusFilter !== 'all') {
      userHours = userHours.filter((hour: any) => hour.status === state.userHoursStatusFilter)
    }

    return userHours
  }, [state.hours, state.selectedUser, state.userHoursSearchTerm, state.userHoursStatusFilter])

  // Calculate user stats
  const userStats = useMemo(() => {
    if (!state.selectedUser || !state.hours) return null
    
    const userHours = state.hours.filter((hour: any) => {
      const student = typeof hour.student === 'string' ? hour.student : hour.student?._id
      const supervisor = typeof hour.supervisor === 'string' ? hour.supervisor : hour.supervisor?._id
      
      if (state.selectedUser.userType === 'student') {
        return student === state.selectedUser._id
      } else {
        return supervisor === state.selectedUser._id
      }
    })

    const totalHours = userHours.reduce((sum: number, h: any) => sum + (h.status === 'approved' ? h.hours : 0), 0)
    const pendingHours = userHours.filter((h: any) => h.status === 'pending').length
    const approvedHours = userHours.filter((h: any) => h.status === 'approved').length
    const rejectedHours = userHours.filter((h: any) => h.status === 'rejected').length

    return { totalHours, pendingHours, approvedHours, rejectedHours }
  }, [state.hours, state.selectedUser])

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

