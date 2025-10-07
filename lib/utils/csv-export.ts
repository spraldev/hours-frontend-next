export function exportToCSV(
  data: any[],
  headers: string[],
  filename: string,
  rowMapper: (item: any) => any[]
) {
  const rows = data.map(rowMapper)
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      const cellStr = String(cell ?? '')
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
