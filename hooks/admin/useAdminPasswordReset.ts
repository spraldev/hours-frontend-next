'use client'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api/endpoints'

export function useAdminPasswordReset(state: any) {
  const handleOpenResetPassword = useCallback((admin: any) => {
    state.setResetPasswordAdmin(admin)
    state.setIsResetAdminPasswordDialogOpen(true)
  }, [state.setResetPasswordAdmin, state.setIsResetAdminPasswordDialogOpen])

  const handleResetAdminPassword = useCallback(async (username: string, newPassword: string) => {
    try {
      const response = await adminApi.resetAdminPassword(username, newPassword)
      
      if (response.success) {
        toast.success('Admin password reset successfully')
        state.setIsResetAdminPasswordDialogOpen(false)
        state.setResetPasswordAdmin(null)
      } else {
        toast.error(response.message || 'Failed to reset admin password')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while resetting the password')
    }
  }, [state.setIsResetAdminPasswordDialogOpen, state.setResetPasswordAdmin])

  return { 
    handleOpenResetPassword, 
    handleResetAdminPassword 
  }
}
