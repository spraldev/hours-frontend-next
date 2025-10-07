'use client'
import { useAdminHoursSelection } from './useAdminHoursSelection'
import { useAdminHoursActions } from './useAdminHoursActions'

export function useAdminHoursHandlers(state: any) {
  const selection = useAdminHoursSelection(state)
  const actions = useAdminHoursActions(state)
  return { ...selection, ...actions }
}
