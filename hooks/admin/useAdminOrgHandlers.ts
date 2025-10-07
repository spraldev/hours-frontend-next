'use client'

import toast from 'react-hot-toast'

export function useAdminOrgHandlers(state: any) {
  const handleCreateOrganization = async () => {
    if (!state.newOrgName.trim()) {
      toast.error('Organization name is required')
      return
    }

    state.setIsProcessing(true)
    try {
      const success = await state.createOrganization({
        name: state.newOrgName.trim(),
        description: state.newOrgDescription.trim() || undefined,
      })
      if (success) {
        toast.success('Organization created successfully')
        state.setIsCreateOrgDialogOpen(false)
        state.setNewOrgName('')
        state.setNewOrgDescription('')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleEditOrganization = (org: any) => {
    state.setEditingOrganization({ ...org })
    state.setIsOrgDialogOpen(true)
  }

  const handleSaveOrganization = async () => {
    if (!state.editingOrganization || !state.editingOrganization.name.trim()) {
      toast.error('Organization name is required')
      return
    }

    state.setIsProcessing(true)
    try {
      const success = await state.updateOrganization(state.editingOrganization._id, {
        name: state.editingOrganization.name.trim(),
        description: state.editingOrganization.description?.trim() || undefined,
        isActive: state.editingOrganization.isActive,
      })
      if (success) {
        toast.success('Organization updated successfully')
        state.setIsOrgDialogOpen(false)
        state.setEditingOrganization(null)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleDeleteOrganization = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return
    }

    state.setIsProcessing(true)
    try {
      await state.deleteOrganization(id)
      toast.success('Organization deleted successfully')
      await state.refetch()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  return {
    handleCreateOrganization,
    handleEditOrganization,
    handleSaveOrganization,
    handleDeleteOrganization,
  }
}
