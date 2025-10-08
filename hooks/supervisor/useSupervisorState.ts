import { useState } from 'react'
import { Hour } from '@/types/api'

export function useSupervisorState() {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingHour, setEditingHour] = useState<Hour | null>(null)
  const [deleteConfirmHour, setDeleteConfirmHour] = useState<Hour | null>(null)
  const [editStatus, setEditStatus] = useState<'approved' | 'pending' | 'rejected'>('pending')
  const [editRejectionReason, setEditRejectionReason] = useState('')
  return {
    selectedEntries, setSelectedEntries, bulkAction, setBulkAction,
    rejectionReason, setRejectionReason, isSubmitting, setIsSubmitting,
    editingHour, setEditingHour, deleteConfirmHour, setDeleteConfirmHour,
    editStatus, setEditStatus, editRejectionReason, setEditRejectionReason,
  }
}
