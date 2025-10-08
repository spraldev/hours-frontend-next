'use client'
import toast from 'react-hot-toast'

export function useAdminAdminManagement(state: any) {
  const handleCreateAdmin = async () => {
    if (!state.newAdminUsername.trim() || !state.newAdminPassword.trim()) {
      toast.error('Username and password are required')
      return
    }
    if (state.newAdminPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    state.setIsProcessing(true)
    try {
      const success = await state.createAdmin({
        username: state.newAdminUsername.trim(),
        password: state.newAdminPassword,
        email: state.newAdminEmail.trim() || undefined,
        role: state.newAdminRole,
      })
      if (success) {
        toast.success('Administrator created successfully')
        state.setIsCreateAdminDialogOpen(false)
        state.setNewAdminUsername('')
        state.setNewAdminPassword('')
        state.setNewAdminEmail('')
        state.setNewAdminRole('admin')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  const handleEditAdmin = (admin: any) => {
    state.setEditingAdmin({ ...admin })
    state.setIsAdminDialogOpen(true)
  }
  const handleSaveAdmin = async () => {
    if (!state.editingAdmin || !state.editingAdmin.username.trim()) {
      toast.error('Username is required')
      return
    }
    state.setIsProcessing(true)
    try {
      const success = await state.updateAdmin(state.editingAdmin._id, {
        username: state.editingAdmin.username.trim(),
        email: state.editingAdmin.email?.trim() || undefined,
        role: state.editingAdmin.role,
      })
      if (success) {
        toast.success('Administrator updated successfully')
        state.setIsAdminDialogOpen(false)
        state.setEditingAdmin(null)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }
  return { handleCreateAdmin, handleEditAdmin, handleSaveAdmin }
}
