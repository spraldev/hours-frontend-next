import toast from 'react-hot-toast'

export function useSupervisorBulkActions(
  selectedEntries: string[],
  setSelectedEntries: (entries: string[]) => void,
  rejectionReason: string,
  setRejectionReason: (reason: string) => void,
  setBulkAction: (action: 'approve' | 'reject' | null) => void,
  setIsSubmitting: (submitting: boolean) => void,
  updateHourStatus: (id: string, status: string, reason?: string) => Promise<void>,
  refetch: () => Promise<void>
) {
  const handleBulkApprove = async () => {
    setIsSubmitting(true)
    try {
      await Promise.all(selectedEntries.map((id) => updateHourStatus(id, 'approved')))
      toast.success(`${selectedEntries.length} entries approved`)
      setSelectedEntries([])
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve entries')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleBulkReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    setIsSubmitting(true)
    try {
      await Promise.all(selectedEntries.map((id) => updateHourStatus(id, 'rejected', rejectionReason)))
      toast.success(`${selectedEntries.length} entries rejected`)
      setSelectedEntries([])
      setRejectionReason('')
      setBulkAction(null)
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject entries')
    } finally {
      setIsSubmitting(false)
    }
  }
  return { handleBulkApprove, handleBulkReject }
}
