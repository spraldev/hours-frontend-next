export function useSupervisorStats(allHours: any[], pendingHours: any[]) {
  const approvedThisWeek = allHours
    .filter((h) => h.status === 'approved' && h.approvedAt && new Date(h.approvedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, h) => sum + h.hours, 0)

  const uniqueStudents = new Set(
    allHours.map((h) => (typeof h.student === 'string' ? h.student : h.student?._id)).filter(Boolean)
  ).size

  return {
    pendingCount: pendingHours.length,
    approvedThisWeek,
    uniqueStudents,
    totalHours: allHours.reduce((sum, h) => sum + h.hours, 0),
  }
}
