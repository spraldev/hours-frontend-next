import { apiClient } from '@/lib/api-client'
import { Supervisor } from '@/types/api'

export function useAdminSupervisorActions(refetch: () => Promise<void>, setError: (error: string | null) => void) {
  const approveSupervisor = async (supervisorId: string) => {
    try {
      const response = await apiClient.post(`/admin/supervisors/${supervisorId}/approve`)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to approve supervisor')
      return false
    }
  }
  const rejectSupervisor = async (supervisorId: string, reason: string) => {
    try {
      const response = await apiClient.post(`/admin/supervisors/${supervisorId}/reject`, { reason })
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reject supervisor')
      return false
    }
  }
  const updateSupervisor = async (supervisorId: string, updates: Partial<Supervisor>) => {
    try {
      const response = await apiClient.put(`/admin/supervisors/${supervisorId}`, updates)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update supervisor')
      return false
    }
  }
  const deleteSupervisor = async (supervisorId: string) => {
    try {
      const response = await apiClient.delete(`/admin/supervisors/${supervisorId}`)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete supervisor')
      return false
    }
  }
  const resetSupervisorPassword = async (email: string, newPassword: string) => {
    try {
      const response = await apiClient.post(`/admin/supervisors/reset-password`, { email, newPassword })
      if (response.success) return true
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reset supervisor password')
      return false
    }
  }

  const updateSupervisorOrganizations = async (supervisorId: string, organizationIds: string[]) => {
    try {
      const response = await apiClient.put(`/admin/supervisors/${supervisorId}/organizations`, { organizationIds })
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update supervisor organizations')
      return false
    }
  }

  const getSupervisorActivity = async (limit: number = 50) => {
    try {
      const response = await apiClient.get(`/admin/supervisors/activity?limit=${limit}`)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err: any) {
      setError(err.message || 'Failed to fetch supervisor activity')
      return null
    }
  }

  return { approveSupervisor, rejectSupervisor, updateSupervisor, deleteSupervisor, resetSupervisorPassword, updateSupervisorOrganizations, getSupervisorActivity }
}
