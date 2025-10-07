import { useAdminData } from './admin/useAdminData'
import { useAdminStudentActions } from './admin/useAdminStudentActions'
import { useAdminSupervisorActions } from './admin/useAdminSupervisorActions'
import { useAdminHourActions } from './admin/useAdminHourActions'
import { useAdminOrganizationActions } from './admin/useAdminOrganizationActions'
import { useAdminAdminActions } from './admin/useAdminAdminActions'

export function useAdminDashboard() {
  const data = useAdminData()
  const studentActions = useAdminStudentActions(data.refetch, data.setError)
  const supervisorActions = useAdminSupervisorActions(data.refetch, data.setError)
  const hourActions = useAdminHourActions(data.refetch, data.setError)
  const organizationActions = useAdminOrganizationActions(data.refetch, data.setError)
  const adminActions = useAdminAdminActions(data.refetch, data.setError)
  return { ...data, ...studentActions, ...supervisorActions, ...hourActions, ...organizationActions, ...adminActions }
}
