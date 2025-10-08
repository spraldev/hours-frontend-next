import { useMemo } from 'react'

export function useSupervisorFilter(hours: any[], searchTerm: string, statusFilter: string) {
  return useMemo(() => {
    return hours.filter((entry) => {
      const student = typeof entry.student === 'string' ? null : entry.student
      const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : ''
      const orgName = typeof entry.organization === 'string' ? entry.organization.toLowerCase() : entry.organization?.name?.toLowerCase() || ''
      const description = entry.description.toLowerCase()
      const searchLower = searchTerm.toLowerCase()

      const matchesSearch = studentName.includes(searchLower) || orgName.includes(searchLower) || description.includes(searchLower)
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [hours, searchTerm, statusFilter])
}
