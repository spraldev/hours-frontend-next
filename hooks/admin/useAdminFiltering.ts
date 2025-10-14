'use client'
import { useMemo } from 'react'

export function useAdminFiltering(
  students: any[],
  supervisors: any[],
  hours: any[],
  searchTerm: string,
  statusFilter: string,
  supervisorSearchTerm: string,
  supervisorStatusFilter: string,
  hoursSearchTerm: string,
  hoursStatusFilter: string
) {
  const filteredStudents = useMemo(() => students.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, searchTerm])
  const filteredSupervisors = useMemo(() => supervisors.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(supervisorSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(supervisorSearchTerm.toLowerCase())
    const matchesStatus =
      supervisorStatusFilter === 'all' ||
      (supervisorStatusFilter === 'approved' && u.isActive) ||
      (supervisorStatusFilter === 'pending' && !u.isActive)
    return matchesSearch && matchesStatus
  }), [supervisors, supervisorSearchTerm, supervisorStatusFilter])
  const filteredHours = useMemo(() => hours.filter((entry) => {
    const student = typeof entry.student === 'string' ? null : entry.student
    const studentName = student ? `${student.firstName} ${student.lastName}` : ''
    const matchesSearch =
      studentName.toLowerCase().includes(hoursSearchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(hoursSearchTerm.toLowerCase())
    const matchesStatus = hoursStatusFilter === 'all' || entry.status === hoursStatusFilter
    return matchesSearch && matchesStatus
  }), [hours, hoursSearchTerm, hoursStatusFilter])
  return { filteredStudents, filteredSupervisors, filteredHours }
}
