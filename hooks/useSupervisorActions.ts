import { useSupervisorState } from './supervisor/useSupervisorState'
import { useSupervisorSelection } from './supervisor/useSupervisorSelection'
import { useSupervisorBulkActions } from './supervisor/useSupervisorBulkActions'
import { useSupervisorIndividualActions } from './supervisor/useSupervisorIndividualActions'
import { useSupervisorEditActions } from './supervisor/useSupervisorEditActions'

interface UseSupervisorActionsProps {
  updateHourStatus: (id: string, status: string, reason?: string) => Promise<void>
  deleteHour: (id: string) => Promise<void>
  refetch: () => Promise<void>
  pendingHours: any[]
}

export function useSupervisorActions({ updateHourStatus, deleteHour, refetch, pendingHours }: UseSupervisorActionsProps) {
  const state = useSupervisorState()
  const selection = useSupervisorSelection(state.selectedEntries, state.setSelectedEntries, pendingHours)
  const bulkActions = useSupervisorBulkActions(
    state.selectedEntries, state.setSelectedEntries, state.rejectionReason, state.setRejectionReason,
    state.setBulkAction, state.setIsSubmitting, updateHourStatus, refetch
  )
  const individualActions = useSupervisorIndividualActions(state.setIsSubmitting, updateHourStatus, refetch)
  const editActions = useSupervisorEditActions(
    state.editingHour, state.setEditingHour, state.editStatus, state.editRejectionReason,
    state.setEditRejectionReason, state.deleteConfirmHour, state.setDeleteConfirmHour,
    state.setIsSubmitting, updateHourStatus, deleteHour, refetch
  )
  return { ...state, ...selection, ...bulkActions, ...individualActions, ...editActions }
}
