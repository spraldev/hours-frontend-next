import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Supervisor, Hour } from '@/types/api'

export function useSupervisorDashboard() {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null)
  const [pendingHours, setPendingHours] = useState<Hour[]>([])
  const [allHours, setAllHours] = useState<Hour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [supervisorRes, pendingRes, hoursRes] = await Promise.all([
        apiClient.get<Supervisor>('/supervisor/profile'),
        apiClient.get<Hour[]>('/supervisor/pending-hours'),
        apiClient.get<Hour[]>('/supervisor/hours'),
      ])

      if (supervisorRes.success && supervisorRes.data) {
        setSupervisor(supervisorRes.data)
      }

      if (pendingRes.success && pendingRes.data) {
        setPendingHours(pendingRes.data)
      }

      if (hoursRes.success && hoursRes.data) {
        setAllHours(hoursRes.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const updateHourStatus = async (hourId: string, status: 'approved' | 'rejected' | 'pending', rejectionReason?: string) => {
    try {
      const response = await apiClient.post('/supervisor/update-hour-status', {
        hourId,
        status,
        rejectionReason,
      })

      if (response.success) {
        await fetchDashboardData()
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Failed to update hour status')
      return false
    }
  }

  const deleteHour = async (hourId: string) => {
    try {
      const response = await apiClient.post('/supervisor/delete-hour', { hourId })

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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    supervisor,
    pendingHours,
    allHours,
    loading,
    error,
    refetch: fetchDashboardData,
    updateHourStatus,
    deleteHour,
  }
}
