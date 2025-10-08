import toast from 'react-hot-toast'

export function exportSupervisedHoursToCSV(hours: any[]) {
  const headers = ['Date', 'Student', 'Organization', 'Hours', 'Status', 'Description']

  const rows = hours.map((entry) => {
    const student = typeof entry.student === 'string' ? null : entry.student
    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown'
    const orgName = typeof entry.organization === 'string' ? entry.organization : entry.organization?.name || 'Unknown'
    const date = new Date(entry.date).toLocaleDateString()

    return [
      date,
      `"${studentName}"`,
      `"${orgName}"`,
      entry.hours,
      entry.status,
      `"${entry.description.replace(/"/g, '""')}"`,
    ]
  })

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `supervised-hours-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast.success('CSV exported successfully')
}
