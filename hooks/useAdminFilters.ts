'use client'

import { useState, useMemo } from 'react'

export function useAdminFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hoursSearchTerm, setHoursSearchTerm] = useState('')
  const [hoursStatusFilter, setHoursStatusFilter] = useState('all')

  const filterStudents = useMemo(
    () => (students: any[]) =>
      students.filter((user) => {
        const matchesSearch =
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.studentId.includes(searchTerm)
        return matchesSearch
      }),
    [searchTerm]
  )

  const filterSupervisors = useMemo(
    () => (supervisors: any[]) =>
      supervisors.filter((user) => {
        const matchesSearch =
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
          statusFilter === 'all' || (statusFilter === 'approved' ? user.isActive : !user.isActive)
        return matchesSearch && matchesStatus
      }),
    [searchTerm, statusFilter]
  )

  const filterHours = useMemo(
    () => (hours: any[]) => {
      if (!hours || hours.length === 0) return []

      return hours.filter((entry) => {
        const student = typeof entry.student === 'string' ? null : entry.student
        const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : ''
        const supervisor = typeof entry.supervisor === 'string' ? null : entry.supervisor
        const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}`.toLowerCase() : ''

        const matchesSearch =
          hoursSearchTerm === '' ||
          studentName.includes(hoursSearchTerm.toLowerCase()) ||
          supervisorName.includes(hoursSearchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(hoursSearchTerm.toLowerCase())

        const matchesStatus = hoursStatusFilter === 'all' || entry.status === hoursStatusFilter

        return matchesSearch && matchesStatus
      })
    },
    [hoursSearchTerm, hoursStatusFilter]
  )

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoursSearchTerm,
    setHoursSearchTerm,
    hoursStatusFilter,
    setHoursStatusFilter,
    filterStudents,
    filterSupervisors,
    filterHours,
  }
}
