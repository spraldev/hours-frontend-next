'use client'
import toast from 'react-hot-toast'

export function useAdminHoursActions(state: any) {
  const handleApproveHours = async () => {
    state.setIsProcessing(true)
    try {
      for (const hourId of state.selectedHours) {
        await state.approveHour(hourId)
      }
      toast.success(`${state.selectedHours.length} hour entries have been approved.`)
      state.setSelectedHours([])
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  const handleBulkReject = async () => {
    if (!state.bulkRejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    state.setIsProcessing(true)
    try {
      for (const hourId of state.selectedHours) {
        await state.rejectHour(hourId, state.bulkRejectionReason)
      }
      toast.success(`${state.selectedHours.length} hour entries have been rejected.`)
      state.setSelectedHours([])
      state.setBulkRejectionReason('')
      state.setBulkRejectDialogOpen(false)
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  const handleEditHour = (hour: any) => {
    state.setEditingHour(hour)
    state.setEditHourStatus(hour.status)
    state.setEditRejectionReason(hour.rejectionReason || '')
  }
  const handleSaveHourEdit = async () => {
    if (!state.editingHour) return
    if (state.editHourStatus === 'rejected' && !state.editRejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    state.setIsProcessing(true)
    try {
      if (state.editHourStatus === 'approved') {
        await state.approveHour(state.editingHour._id)
      } else if (state.editHourStatus === 'rejected') {
        await state.rejectHour(state.editingHour._id, state.editRejectionReason)
      }
      toast.success('Hour entry updated successfully')
      state.setEditingHour(null)
      state.setEditRejectionReason('')
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  const handleDeleteHour = async () => {
    if (!state.deleteConfirmHour) return
    state.setIsProcessing(true)
    try {
      await state.deleteHour(state.deleteConfirmHour._id)
      toast.success('Hour entry deleted successfully')
      state.setDeleteConfirmHour(null)
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  return { handleApproveHours, handleBulkReject, handleEditHour, handleSaveHourEdit, handleDeleteHour }
}
