'use client'
import toast from 'react-hot-toast'

export function useAdminGraduatedStudents(state: any) {
  const checkForGraduatedStudents = async () => {
    try {
      const students = await state.getGraduatedStudents()
      return students && students.length > 0
    } catch (err) {
      return false
    }
  }
  const handleOpenDeleteGraduatedDialog = async () => {
    state.setIsLoadingGraduatedStudents(true)
    try {
      const students = await state.getGraduatedStudents()
      state.setGraduatedStudents(students || [])
      state.setIsDeleteGraduatedDialogOpen(true)
    } catch (err: any) {
      toast.error('Failed to load graduated students')
    } finally {
      state.setIsLoadingGraduatedStudents(false)
    }
  }
  const handleDeleteGraduatedStudents = async () => {
    state.setIsProcessing(true)
    try {
      await state.deleteGraduatedStudents()
      toast.success('Graduated students deleted successfully')
      state.setIsDeleteGraduatedDialogOpen(false)
      state.setGraduatedStudents([])
      await state.refetch()
    } catch (err: any) {
      toast.error('Failed to delete graduated students')
    } finally {
      state.setIsProcessing(false)
    }
  }
  return { checkForGraduatedStudents, handleOpenDeleteGraduatedDialog, handleDeleteGraduatedStudents }
}
