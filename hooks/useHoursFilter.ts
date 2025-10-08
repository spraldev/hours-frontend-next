import { useMemo } from 'react'

export function useHoursFilter(hours: any[], searchTerm: string, statusFilter: string) {
  return useMemo(() => {
    return hours.filter((entry) => {
      const orgName = typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || ''
      const matchesSearch =
        orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [hours, searchTerm, statusFilter])
}
