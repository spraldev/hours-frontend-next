import { apiClient } from '@/lib/api-client'

export function useAdminHourActions(refetch: () => Promise<void>, setError: (error: string | null) => void) {
  const createHourForStudent = async (hourData: any) => {
    try {
      const response = await apiClient.post('/admin/hours', hourData)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to create hour')
      return false
    }
  }
  const approveHour = async (hourId: string) => {
    try {
      const response = await apiClient.post(`/admin/hours/${hourId}/approve`)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to approve hour')
      return false
    }
  }
  const rejectHour = async (hourId: string, reason: string) => {
    try {
      const response = await apiClient.post(`/admin/hours/${hourId}/reject`, { reason })
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reject hour')
      return false
    }
  }
  const deleteHour = async (hourId: string) => {
    try {
      const response = await apiClient.delete(`/admin/hours/${hourId}`)
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
  return { createHourForStudent, approveHour, rejectHour, deleteHour }
}
