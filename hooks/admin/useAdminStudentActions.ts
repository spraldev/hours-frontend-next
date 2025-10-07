import { apiClient } from '@/lib/api-client'
import { Student } from '@/types/api'

export function useAdminStudentActions(refetch: () => Promise<void>, setError: (error: string | null) => void) {
  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const response = await apiClient.put(`/admin/students/${studentId}`, updates)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update student')
      return false
    }
  }
  const deleteStudent = async (studentId: string) => {
    try {
      const response = await apiClient.delete(`/admin/students/${studentId}`)
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete student')
      return false
    }
  }
  const resetStudentPassword = async (studentId: string, newPassword: string) => {
    try {
      const response = await apiClient.post(`/admin/students/reset-password`, { studentId, newPassword })
      if (response.success) return true
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
      return false
    }
  }
  const getGraduatedStudents = async () => {
    try {
      const response = await apiClient.get<Student[]>('/admin/students/graduated')
      if (response.success && response.data) return response.data
      return []
    } catch (err: any) {
      setError(err.message || 'Failed to fetch graduated students')
      return []
    }
  }
  const deleteGraduatedStudents = async () => {
    try {
      const response = await apiClient.delete('/admin/students/graduated')
      if (response.success) {
        await refetch()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete graduated students')
      return false
    }
  }
  return { updateStudent, deleteStudent, resetStudentPassword, getGraduatedStudents, deleteGraduatedStudents }
}
