import toast from 'react-hot-toast'
import { Hour } from '@/types/api'

export function useSupervisorEditActions(
  editingHour: Hour | null,
  setEditingHour: (hour: Hour | null) => void,
  editStatus: 'approved' | 'pending' | 'rejected',
  editRejectionReason: string,
  setEditRejectionReason: (reason: string) => void,
  deleteConfirmHour: Hour | null,
  setDeleteConfirmHour: (hour: Hour | null) => void,
  setIsSubmitting: (submitting: boolean) => void,
  updateHourStatus: (id: string, status: string, reason?: string) => Promise<void>,
  deleteHour: (id: string) => Promise<void>,
  refetch: () => Promise<void>
) {
  const handleEditSubmit = async () => {
    if (!editingHour) return
    if (editStatus === 'rejected' && !editRejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    setIsSubmitting(true)
    try {
      await updateHourStatus(editingHour._id, editStatus, editStatus === 'rejected' ? editRejectionReason : undefined)
      toast.success('Hour status updated successfully')
      setEditingHour(null)
      setEditRejectionReason('')
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update hour status')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmHour) return
    setIsSubmitting(true)
    try {
      await deleteHour(deleteConfirmHour._id)
      toast.success('Hour entry deleted successfully')
      setDeleteConfirmHour(null)
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete hour entry')
    } finally {
      setIsSubmitting(false)
    }
  }
  return { handleEditSubmit, handleDeleteConfirm }
}
