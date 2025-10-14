import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { AdminOverview, Student, Supervisor, Hour, Organization } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'

export function useAdminData() {
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
      
      const responses = await Promise.all(requests)
      
      if (responses[0]?.success && responses[0]?.data) setOverview(responses[0].data as AdminOverview)
      if (responses[1]?.success && responses[1]?.data) setStudents(responses[1].data as Student[])
      if (responses[2]?.success && responses[2]?.data) setSupervisors(responses[2].data as Supervisor[])
      if (responses[3]?.success && responses[3]?.data) setPendingSupervisors(responses[3].data as Supervisor[])
      if (responses[4]?.success && responses[4]?.data) setHours(responses[4].data as Hour[])
      if (responses[5]?.success && responses[5]?.data) setOrganizations(responses[5].data as Organization[])
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchAdmins = async () => {
    try {
      const adminsResponse = await apiClient.get<any[]>('/admin/admins')
      if (adminsResponse?.success && adminsResponse?.data) {
        setAdmins(adminsResponse.data as any[])
      }
    } catch (err: any) {
      console.error('Failed to fetch admins:', err)
    }
  }
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  useEffect(() => {
    if (user?.role === 'superadmin') {
      fetchAdmins()
    }
  }, [user?.role])
  
  const refetch = async () => {
    await fetchDashboardData()
    if (user?.role === 'superadmin') {
      await fetchAdmins()
    }
  }
  
  return {
    overview, students, supervisors, pendingSupervisors, hours, organizations, admins,
    loading, error, refetch, setError,
  }
}
