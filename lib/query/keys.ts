export const queryKeys = {
  auth: {
    checkAuth: ['auth', 'check'] as const,
  },
  admin: {
    overview: ['admin', 'overview'] as const,
    students: ['admin', 'students'] as const,
    supervisors: ['admin', 'supervisors'] as const,
    pendingSupervisors: ['admin', 'supervisors', 'pending'] as const,
    hours: ['admin', 'hours'] as const,
    organizations: ['admin', 'organizations'] as const,
    admins: ['admin', 'admins'] as const,
  },
  student: {
    profile: ['student', 'profile'] as const,
    statistics: ['student', 'statistics'] as const,
    hours: ['student', 'hours'] as const,
  },
  supervisor: {
    profile: ['supervisor', 'profile'] as const,
    pendingHours: ['supervisor', 'hours', 'pending'] as const,
    hours: ['supervisor', 'hours'] as const,
  },
} as const
