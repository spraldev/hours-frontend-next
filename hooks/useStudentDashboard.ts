import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Student, Hour, StudentStatistics } from '@/types/api'

export function useStudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [hours, setHours] = useState<Hour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [studentRes, statsRes, hoursRes] = await Promise.all([
        apiClient.get<Student>('/student/student'),
        apiClient.get<StudentStatistics>('/student/statistics'),
        apiClient.get<Hour[]>('/student/hours'),
      ])

      if (studentRes.success && studentRes.data) {
        setStudent(studentRes.data)
      }

      if (statsRes.success && statsRes.data) {
        setStatistics(statsRes.data)
      }

      if (hoursRes.success && hoursRes.data) {
        setHours(hoursRes.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    student,
    statistics,
    hours,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}
