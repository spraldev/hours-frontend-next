'use client'

import toast from 'react-hot-toast'

export function useAdminSupervHandlers(state: any) {
  const handleApproveSupervisor = async (id: string) => {
    state.setIsProcessing(true)
    try {
      await state.approveSupervisor(id)
      toast.success('Supervisor approved successfully')
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleRejectSupervisor = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    state.setIsProcessing(true)
    try {
      await state.rejectSupervisor(id, reason)
      toast.success('Supervisor rejected successfully')
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleViewActivity = (supervisor: any) => {
    state.setSelectedSupervisorForActivity(supervisor)
    state.setIsSupervisorActivityDialogOpen(true)
  }

  return {
    handleApproveSupervisor,
    handleRejectSupervisor,
    handleViewActivity,
  }
}
