import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api/endpoints'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'
import type { LoginInput } from '@/lib/api/schemas/auth'

async function handleLoginSuccess(token: string, login: any, defaultPath: string) {
  localStorage.setItem('auth_token', token)
  apiClient.login(token)

  try {
    const userResponse = await authApi.checkAuth()
    if (userResponse.success && userResponse.data) {
      const role = userResponse.data.role as 'student' | 'supervisor' | 'admin' | 'superadmin'
      const user = {
        id: userResponse.data.id,
        email: userResponse.data.email,
        role: role,
        firstName: userResponse.data.firstName,
        lastName: userResponse.data.lastName,
      }
      login(token, user)
      toast.success('Welcome back!')

      const roleRedirects: Record<string, string> = {
        admin: '/admin',
        superadmin: '/admin',
        supervisor: '/supervisor/dashboard',
        student: '/student/dashboard',
      }
      window.location.href = roleRedirects[role] || defaultPath
    } else {
      toast.success('Welcome back!')
      window.location.href = defaultPath
    }
  } catch {
    toast.success('Welcome back!')
    window.location.href = defaultPath
  }
}

export function useStudentLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: async (response) => {
      if (response.success && response.token) {
        await handleLoginSuccess(response.token, login, '/student/dashboard')
      } else {
        console.log('Invalid login response from server', response)
        throw new Error('Invalid login response from server')
      }
    },
  })
}

export function useStaffLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.privilegedLogin(credentials),
    onSuccess: async (response) => {
      if (response.success && response.token) {
        await handleLoginSuccess(response.token, login, '/admin')
      } else {
        throw new Error('Invalid login response from server')
      }
    },
  })
}
