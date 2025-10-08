import toast from 'react-hot-toast'

export function useSupervisorIndividualActions(
  setIsSubmitting: (submitting: boolean) => void,
  updateHourStatus: (id: string, status: string, reason?: string) => Promise<void>,
  refetch: () => Promise<void>
) {
  const handleIndividualApprove = async (entryId: string) => {
    setIsSubmitting(true)
    try {
      await updateHourStatus(entryId, 'approved')
      toast.success('Entry approved successfully')
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve entry')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleIndividualReject = async (entryId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    setIsSubmitting(true)
    try {
      await updateHourStatus(entryId, 'rejected', reason)
      toast.success('Entry rejected successfully')
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject entry')
    } finally {
      setIsSubmitting(false)
    }
  }
  return { handleIndividualApprove, handleIndividualReject }
}
