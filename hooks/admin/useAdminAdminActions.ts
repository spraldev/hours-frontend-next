import { apiClient } from '@/lib/api-client'

export function useAdminAdminActions(refetch: () => Promise<void>, setError: (error: string | null) => void) {
  const createAdmin = async (adminData: any) => {
    try {
      const response = await apiClient.post('/admin/admins', adminData)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to create admin')
      return false
    }
  }
  const updateAdmin = async (adminId: string, updates: any) => {
    try {
      const response = await apiClient.put(`/admin/admins/${adminId}`, updates)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update admin')
      return false
    }
  }
  return { createAdmin, updateAdmin }
}
