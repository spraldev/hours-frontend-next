import { Student, Hour } from '@/types/api'

export function exportAllStudentsHoursToCSV(students: Student[], hours: Hour[]) {
  if (students.length === 0) {
    throw new Error("No students data available to export")
  }

  // Create a map of student hours for quick lookup
  const studentHoursMap = new Map<string, number>()
  
  // Calculate total approved hours for each student
  hours.forEach(hour => {
    if (hour.status === 'approved') {
      const studentId = typeof hour.student === 'string' ? hour.student : hour.student?._id
      if (studentId && hour.hours) {
        const currentHours = studentHoursMap.get(studentId) || 0
        studentHoursMap.set(studentId, currentHours + hour.hours)
      }
    }
  })

  // CSV Headers
  const headers = ["Student Name", "Student ID", "Email", "Total Approved Hours"]
  
  // CSV Rows - one row per student with their total hours
  const rows = students.map(student => {
    const totalHours = studentHoursMap.get(student._id) || 0
    const fullName = `${student.firstName} ${student.lastName}`
    
    return [
      `"${fullName}"`, // Wrap in quotes to handle commas in names
      student.studentId || student._id || 'N/A',
      `"${student.email}"`, // Wrap in quotes to handle special characters
      totalHours
    ]
  })

  // Sort by total hours (descending) then by name
  rows.sort((a, b) => {
    const hoursA = parseFloat(a[3] as string)
    const hoursB = parseFloat(b[3] as string)
    if (hoursA !== hoursB) {
      return hoursB - hoursA // Descending by hours
    }
    return (a[0] as string).localeCompare(b[0] as string) // Then by name
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", `all-students-hours-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = "hidden"
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  return csvContent
}
