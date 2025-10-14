'use client'

import toast from 'react-hot-toast'

export function useAdminUserHandlers(state: any) {
  const handleEditUser = (user: any, type: 'student' | 'supervisor') => {
    state.setEditingUser({ ...user, type })
    state.setIsEditDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!state.editingUser) return
    state.setIsProcessing(true)

    try {
      if (state.editingUser.type === 'student') {
        const success = await state.updateStudent(state.editingUser._id, {
          firstName: state.editingUser.firstName,
          lastName: state.editingUser.lastName,
          email: state.editingUser.email,
          graduatingYear: state.editingUser.graduatingYear,
          grade: state.editingUser.grade,
          isActive: state.editingUser.isActive,
        })
        if (success) {
          toast.success('Student updated successfully')
          state.setIsEditDialogOpen(false)
          state.setEditingUser(null)
        }
      } else {
        const success = await state.updateSupervisor(state.editingUser._id, {
          firstName: state.editingUser.firstName,
          lastName: state.editingUser.lastName,
          email: state.editingUser.email,
          isActive: state.editingUser.isActive,
        })
        if (success) {
          toast.success('Supervisor updated successfully')
          state.setIsEditDialogOpen(false)
          state.setEditingUser(null)
        }
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      state.setIsProcessing(false)
    }
  }

  const handleResetPassword = () => {
    if (!state.editingUser) return
    state.setIsResetPasswordDialogOpen(true)
  }

  const handleConfirmPasswordReset = async () => {
    if (!state.editingUser || !state.newPassword.trim()) {
      toast.error('Please enter a new password')
      return
    }

    if (state.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    state.setIsProcessing(true)

    try {
      let success = false
      if (state.editingUser.type === 'student') {
        success = await state.resetStudentPassword(state.editingUser.studentId || state.editingUser._id, state.newPassword)
      } else {
        success = await state.resetSupervisorPassword(state.editingUser.email, state.newPassword)
      }

      if (success) {
        toast.success(
          state.editingUser.type === 'student'
            ? 'Student password has been reset successfully'
            : 'Supervisor password has been reset successfully'
        )
        state.setIsResetPasswordDialogOpen(false)
        state.setNewPassword('')
      } else {
        toast.error('Failed to reset password. Please check if the user exists and try again.')
      }
    } catch (err: any) {
      toast.error('Password reset failed. Please try again.')
    } finally {
      state.setIsProcessing(false)
    }
  }

  return {
    handleEditUser,
    handleSaveUser,
    handleResetPassword,
    handleConfirmPasswordReset,
  }
}
