import { apiClient, type ApiResponse } from '@/lib/api-client'
import type { 
  User, 
  Student, 
  Supervisor, 
  Hour, 
  Organization, 
  AdminOverview, 
  StudentStatistics,
  SupervisorStatistics,
  PaginatedResponse,
  PaginationParams
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
  
  resetPassword: (token: string, password: string, userType: 'student' | 'supervisor' | 'admin') =>
    apiClient.post('/auth/reset-password', { token, password, userType }),
}

export const adminApi = {
  getOverview: () => apiClient.get<AdminOverview>('/admin/overview'),
  getStudents: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Student>>('/admin/students', params),
  getSupervisors: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Supervisor>>('/admin/supervisors', params),
  getPendingSupervisors: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Supervisor>>('/admin/supervisors/pending', params),
  getHours: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Hour>>('/admin/hours', params),
  getUserHours: (userId: string, params?: PaginationParams) => apiClient.get<PaginatedResponse<Hour>>(`/admin/users/${userId}/hours`, params),
  getOrganizations: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Organization>>('/admin/organizations', params),
  getAdmins: (params?: PaginationParams) => apiClient.get<PaginatedResponse<any>>('/admin/admins', params),
  
  // Limited endpoints for overview widgets
  getRecentHours: (limit?: number) => apiClient.get<PaginatedResponse<Hour>>(`/admin/hours?recent=true&limit=${limit || 5}`),
  getTopStudents: (limit?: number) => apiClient.get<PaginatedResponse<Student>>(`/admin/students?top=true&limit=${limit || 5}`),
  
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
  updateAdmin: (id: string, data: AdminCreateInput) =>
    apiClient.put(`/admin/admins/${id}`, data),
  deleteAdmin: (id: string) => apiClient.delete(`/admin/admins/${id}`),
  resetAdminPassword: (username: string, newPassword: string) =>
    apiClient.post('/admin/admins/reset-password', { username, newPassword }),
}

export const studentApi = {
  getProfile: () => apiClient.get<Student>('/student/student'),
  getStatistics: () => apiClient.get<StudentStatistics>('/student/statistics'),
  getHours: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Hour>>('/student/hours', params),
  
  createHour: (data: HourCreateInput) => apiClient.post('/student/hours', data),
  updateHour: (id: string, data: HourUpdateInput) => apiClient.put(`/student/hours/${id}`, data),
  deleteHour: (id: string) => apiClient.delete(`/student/hours/${id}`),
  
  getSupervisors: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Supervisor>>('/student/supervisors', params),
}

export const supervisorApi = {
  getProfile: () => apiClient.get<Supervisor>('/supervisor/supervisor'),
  getStatistics: () => apiClient.get<SupervisorStatistics>('/supervisor/statistics'),
  getPendingHours: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Hour>>('/supervisor/hours/pending', params),
  getHours: (params?: PaginationParams) => apiClient.get<PaginatedResponse<Hour>>('/supervisor/hours', params),
  
  updateHourStatus: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
    apiClient.put(`/supervisor/hours/${id}/status`, { status, rejectionReason }),
  bulkUpdateHours: (data: HourBulkUpdateInput) =>
    apiClient.post('/supervisor/hours/bulk-update', data),
}
