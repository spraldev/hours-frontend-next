import { apiClient, type ApiResponse } from '@/lib/api-client'
import type { 
  User, 
  Student, 
  Supervisor, 
  Hour, 
  Organization, 
  AdminOverview, 
  StudentStatistics,
  SupervisorStatistics
} from '@/types/api'
import type { 
  LoginInput, 
  StudentRegistrationInput, 
  SupervisorRegistrationInput,
  ResetPasswordInput,
  ForgotPasswordInput
} from './schemas/auth'
import type { StudentUpdateInput, SupervisorUpdateInput, AdminCreateInput } from './schemas/users'
import type { HourCreateInput, HourUpdateInput, HourBulkUpdateInput } from './schemas/hours'

export const authApi = {
  login: (credentials: LoginInput) => 
    apiClient.post<{ token: string; user: User }>('/auth/student/login', credentials),
  
  privilegedLogin: (credentials: LoginInput) => 
    apiClient.post<{ token: string; user: User }>('/auth/privileged/login', credentials),
  
  studentRegister: (data: StudentRegistrationInput) =>
    apiClient.post('/auth/student/register', data),
  
  supervisorRegister: (data: SupervisorRegistrationInput) =>
    apiClient.post('/auth/supervisor/register', data),
  
  checkAuth: () => apiClient.get<User>('/auth/check-auth'),
  
  resendVerification: (studentId: string) =>
    apiClient.post('/auth/resend-verification', { studentId }),
  
  forgotPassword: (data: ForgotPasswordInput) =>
    apiClient.post('/auth/forgot-password', data),
  
  resetPassword: (token: string, password: string, userType: 'student' | 'supervisor') =>
    apiClient.post('/auth/reset-password', { token, password, userType }),
}

export const adminApi = {
  getOverview: () => apiClient.get<AdminOverview>('/admin/overview'),
  getStudents: () => apiClient.get<Student[]>('/admin/students'),
  getSupervisors: () => apiClient.get<Supervisor[]>('/admin/supervisors'),
  getPendingSupervisors: () => apiClient.get<Supervisor[]>('/admin/supervisors/pending'),
  getHours: () => apiClient.get<Hour[]>('/admin/hours'),
  getOrganizations: () => apiClient.get<Organization[]>('/admin/organizations'),
  getAdmins: () => apiClient.get<any[]>('/admin/admins'),
  
  approveSupervisor: (id: string) => apiClient.post(`/admin/supervisors/${id}/approve`),
  rejectSupervisor: (id: string, reason: string) => 
    apiClient.post(`/admin/supervisors/${id}/reject`, { reason }),
  
  updateStudent: (id: string, updates: StudentUpdateInput) =>
    apiClient.put(`/admin/students/${id}`, updates),
  deleteStudent: (id: string) => apiClient.delete(`/admin/students/${id}`),
  resetStudentPassword: (studentId: string, newPassword: string) =>
    apiClient.post('/admin/students/reset-password', { studentId, newPassword }),
  
  updateSupervisor: (id: string, updates: SupervisorUpdateInput) =>
    apiClient.put(`/admin/supervisors/${id}`, updates),
  deleteSupervisor: (id: string) => apiClient.delete(`/admin/supervisors/${id}`),
  
  updateHour: (id: string, updates: HourUpdateInput) =>
    apiClient.put(`/admin/hours/${id}`, updates),
  bulkUpdateHours: (data: HourBulkUpdateInput) =>
    apiClient.post('/admin/hours/bulk-update', data),
  deleteHour: (id: string) => apiClient.delete(`/admin/hours/${id}`),
  
  createOrganization: (data: { name: string; description?: string }) =>
    apiClient.post('/admin/organizations', data),
  updateOrganization: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/admin/organizations/${id}`, data),
  deleteOrganization: (id: string) => apiClient.delete(`/admin/organizations/${id}`),
  
  createAdmin: (data: AdminCreateInput) =>
    apiClient.post('/admin/admins', data),
  deleteAdmin: (id: string) => apiClient.delete(`/admin/admins/${id}`),
}

export const studentApi = {
  getProfile: () => apiClient.get<Student>('/student/student'),
  getStatistics: () => apiClient.get<StudentStatistics>('/student/statistics'),
  getHours: () => apiClient.get<Hour[]>('/student/hours'),
  
  createHour: (data: HourCreateInput) => apiClient.post('/student/hours', data),
  updateHour: (id: string, data: HourUpdateInput) => apiClient.put(`/student/hours/${id}`, data),
  deleteHour: (id: string) => apiClient.delete(`/student/hours/${id}`),
  
  getSupervisors: () => apiClient.get<Supervisor[]>('/student/supervisors'),
}

export const supervisorApi = {
  getProfile: () => apiClient.get<Supervisor>('/supervisor/supervisor'),
  getStatistics: () => apiClient.get<SupervisorStatistics>('/supervisor/statistics'),
  getPendingHours: () => apiClient.get<Hour[]>('/supervisor/hours/pending'),
  getHours: () => apiClient.get<Hour[]>('/supervisor/hours'),
  
  updateHourStatus: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
    apiClient.put(`/supervisor/hours/${id}/status`, { status, rejectionReason }),
  bulkUpdateHours: (data: HourBulkUpdateInput) =>
    apiClient.post('/supervisor/hours/bulk-update', data),
}
