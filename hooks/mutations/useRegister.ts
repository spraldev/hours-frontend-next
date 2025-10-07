import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/endpoints'
import toast from 'react-hot-toast'
import type { StudentRegistrationInput, SupervisorRegistrationInput } from '@/lib/api/schemas/auth'

export function useStudentRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: StudentRegistrationInput) => authApi.studentRegister(data),
    onSuccess: () => {
      toast.success("Registration successful. Please check your email to verify your account before logging in.")
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    },
  })
}

export function useStaffRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SupervisorRegistrationInput) => authApi.supervisorRegister(data),
    onSuccess: () => {
      toast.success("Registration submitted. Your account will be reviewed by an administrator. You'll receive an email once approved.")
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    },
  })
}
