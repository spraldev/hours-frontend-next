'use client'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/lib/utils/csv-export'

export function useAdminHoursSelection(state: any) {
  const handleSelectHour = (hourId: string, checked: boolean) => {
    if (checked) {
      state.setSelectedHours([...state.selectedHours, hourId])
    } else {
      state.setSelectedHours(state.selectedHours.filter((id: string) => id !== hourId))
    }
  }
  const handleSelectAllHours = (checked: boolean) => {
    if (checked) {
      state.setSelectedHours(state.filteredHours.map((h: any) => h._id))
    } else {
      state.setSelectedHours([])
    }
  }
  const exportHoursToCSV = () => {
    exportToCSV(
      state.filteredHours,
      ['Student', 'Supervisor', 'Organization', 'Date', 'Hours', 'Description', 'Status'],
      `hours-export-${new Date().toISOString().split('T')[0]}.csv`,
      (entry: any) => {
        const student = typeof entry.student === 'string' ? 'Unknown' : entry.student
        const supervisor = typeof entry.supervisor === 'string' ? 'Unknown' : entry.supervisor
        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown'
        const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Unknown'
        const orgName = typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || 'Unknown'
        return [studentName, supervisorName, orgName, new Date(entry.date).toLocaleDateString(), entry.hours, entry.description, entry.status]
      }
    )
    toast.success('CSV exported successfully')
  }
  return { handleSelectHour, handleSelectAllHours, exportHoursToCSV }
}
