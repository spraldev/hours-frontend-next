'use client'
import { useMemo } from 'react'

export function useAdminFiltering(
  students: any[],
  supervisors: any[],
  hours: any[],
  searchTerm: string,
  statusFilter: string,
  hoursSearchTerm: string,
  hoursStatusFilter: string
) {
  const filteredStudents = useMemo(() => students.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, searchTerm])
  const filteredSupervisors = useMemo(() => supervisors.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && u.isApproved) ||
      (statusFilter === 'pending' && !u.isApproved && u.isActive) ||
      (statusFilter === 'rejected' && !u.isApproved && !u.isActive)
    return matchesSearch && matchesStatus
  }), [supervisors, searchTerm, statusFilter])
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
