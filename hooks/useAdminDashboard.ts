import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { AdminOverview, Student, Supervisor, Hour, Organization } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'

export function useAdminDashboard() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [supervisors, setSupervisors] = useState<Supervisor[]>([])
  const [pendingSupervisors, setPendingSupervisors] = useState<Supervisor[]>([])
  const [hours, setHours] = useState<Hour[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      const requests = [
        apiClient.get<AdminOverview>('/admin/overview'),
        apiClient.get<Student[]>('/admin/students'),
        apiClient.get<Supervisor[]>('/admin/supervisors'),
        apiClient.get<Supervisor[]>('/admin/supervisors/pending'),
        apiClient.get<Hour[]>('/admin/hours'),
        apiClient.get<Organization[]>('/admin/organizations'),
      ]

      // Only fetch admins for superadmins
      if (user?.role === 'superadmin') {
        requests.push(apiClient.get<any[]>('/admin/admins'))
      }

      const responses = await Promise.all(requests)
      
      if (responses[0]?.success && responses[0]?.data) {
        setOverview(responses[0].data as AdminOverview)
      }

      if (responses[1]?.success && responses[1]?.data) {
        setStudents(responses[1].data as Student[])
      }

      if (responses[2]?.success && responses[2]?.data) {
        setSupervisors(responses[2].data as Supervisor[])
      }

      if (responses[3]?.success && responses[3]?.data) {
        setPendingSupervisors(responses[3].data as Supervisor[])
      }

      if (responses[4]?.success && responses[4]?.data) {
        setHours(responses[4].data as Hour[])
      }

      if (responses[5]?.success && responses[5]?.data) {
        setOrganizations(responses[5].data as Organization[])
      }

      // Admins response is optional (only for superadmins)
      if (responses[6]?.success && responses[6]?.data) {
        setAdmins(responses[6].data as any[])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const approveSupervisor = async (supervisorId: string) => {
    try {
      const response = await apiClient.post(`/admin/supervisors/${supervisorId}/approve`)
      if (response.success) {
        await fetchDashboardData()
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
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reject supervisor')
      return false
    }
  }

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const response = await apiClient.put(`/admin/students/${studentId}`, updates)
      if (response.success) {
        await fetchDashboardData()
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
        await fetchDashboardData()
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
      const response = await apiClient.post(`/admin/students/reset-password`, {
        studentId,
        newPassword
      })
      if (response.success) {
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
      return false
    }
  }

  const updateSupervisor = async (supervisorId: string, updates: Partial<Supervisor>) => {
    try {
      const response = await apiClient.put(`/admin/supervisors/${supervisorId}`, updates)
      if (response.success) {
        await fetchDashboardData()
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
        await fetchDashboardData()
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
      const response = await apiClient.post(`/admin/supervisors/reset-password`, {
        email,
        newPassword
      })
      if (response.success) {
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to reset supervisor password')
      return false
    }
  }

  const createHourForStudent = async (hourData: any) => {
    try {
      const response = await apiClient.post('/admin/hours', hourData)
      if (response.success) {
        await fetchDashboardData()
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
        await fetchDashboardData()
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
        await fetchDashboardData()
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
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete hour')
      return false
    }
  }

  const createOrganization = async (orgData: any) => {
    try {
      const response = await apiClient.post('/admin/organizations', orgData)
      if (response.success) {
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to create organization')
      return false
    }
  }

  const updateOrganization = async (organizationId: string, updates: Partial<Organization>) => {
    try {
      const response = await apiClient.put(`/admin/organizations/${organizationId}`, updates)
      if (response.success) {
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update organization')
      return false
    }
  }

  const deleteOrganization = async (organizationId: string) => {
    try {
      const response = await apiClient.delete(`/admin/organizations/${organizationId}`)
      if (response.success) {
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete organization')
      return false
    }
  }

  const createAdmin = async (adminData: any) => {
    try {
      const response = await apiClient.post('/admin/admins', adminData)
      if (response.success) {
        await fetchDashboardData()
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
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update admin')
      return false
    }
  }

  const getGraduatedStudents = async () => {
    try {
      const response = await apiClient.get<Student[]>('/admin/students/graduated')
      if (response.success && response.data) {
        return response.data
      }
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
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to delete graduated students')
      return false
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    overview,
    students,
    supervisors,
    pendingSupervisors,
    hours,
    organizations,
    admins,
    loading,
    error,
    refetch: fetchDashboardData,
    approveSupervisor,
    rejectSupervisor,
    updateStudent,
    deleteStudent,
    resetStudentPassword,
    updateSupervisor,
    deleteSupervisor,
    resetSupervisorPassword,
    createHourForStudent,
    approveHour,
    rejectHour,
    deleteHour,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createAdmin,
    updateAdmin,
    getGraduatedStudents,
    deleteGraduatedStudents,
  }
}
