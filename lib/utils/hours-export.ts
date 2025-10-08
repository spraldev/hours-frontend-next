import { exportToCSV } from './csv-export'
import toast from 'react-hot-toast'

export function exportHoursToCSV(hours: any[]) {
  if (hours.length === 0) {
    toast.error('No data to export')
    return
  }

  const headers = ['Date', 'Organization', 'Hours', 'Status', 'Supervisor', 'Description']

  exportToCSV(
    hours,
    headers,
    `service-hours-${new Date().toISOString().split('T')[0]}.csv`,
    (entry) => {
      const orgName =
        typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || 'Unknown'
      const supervisorName =
        typeof entry.supervisor === 'string'
          ? entry.supervisor
          : entry.supervisor
            ? `${entry.supervisor.firstName} ${entry.supervisor.lastName}`
            : 'Unknown'
      const date = new Date(entry.date).toLocaleDateString()

      return [date, orgName, entry.hours, entry.status, supervisorName, entry.description]
    }
  )

  toast.success('CSV exported successfully')
}
