export function getGraduationYears(): number[] {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const schoolYearEndingYear = currentMonth >= 8 ? currentYear + 1 : currentYear
  return Array.from({ length: 4 }, (_, i) => schoolYearEndingYear + i)
}
