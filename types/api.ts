export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    grade: number;
    graduatingYear: number;
    totalHours: number;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Supervisor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organizations: (string | Organization)[];
    organizationNames: string[];
    proofOfExistence: string;
    proofType: 'email' | 'website' | 'document' | 'other';
    isActive: boolean;
    isApproved: boolean;
    approvedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Hour {
    _id: string;
    student: string | Student;
    supervisor: string | Supervisor;
    organization: string | Organization;
    date: string;
    hours: number;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Organization {
    _id: string;
    name: string;
    description?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive: boolean;
    supervisors: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface StudentStatistics {
    totalHours: number;
    pendingHours: number;
    approvedHours: number;
    rejectedHours: number;
    requiredHours: number;
    hoursThisMonth: number;
    hoursThisYear: number;
    recentActivity: Hour[];
  }
  
  export interface SupervisorStatistics {
    pendingApprovals: number;
    totalApproved: number;
    totalRejected: number;
    studentsSupervised: number;
  }
  
  export interface AdminOverview {
    totalStudents: number;
    totalSupervisors: number;
    totalOrganizations: number;
    totalHours: number;
    pendingHours: number;
    pendingSupervisors: number;
    recentActivity: any[];
  }
  
  export interface User {
    id: string;
    email: string;
    role: 'student' | 'supervisor' | 'admin' | 'superadmin';
    firstName: string;
    lastName: string;
    organizationIds?: string[];
  }
  
  export interface AuthResponse {
    success: boolean;
    token: string;
    message: string;
    user?: User;
  }
  
  export interface LoginCredentials {
    studentId?: string;
    username?: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface StudentRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    studentId: string;
    graduatingYear: number;
  }
  
  export interface SupervisorRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    proofOfExistence: string;
    proofType: 'email' | 'website' | 'document' | 'other';
  }
  
  export interface CreateHourRequest {
    supervisorId: string;
    organizationId: string;
    date: string;
    hours: number;
    description: string;
  }
  
  export interface UpdateHourStatusRequest {
    hourId: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
  }

  // Organization API Response Types
  export interface OrganizationSearchItem {
    id: string;
    name: string;
    verified: boolean;
    memberCount: number;
    description?: string;
    contactEmail?: string;
  }

  export interface PopularOrganizationsResponse {
    success: boolean;
    data: {
      organizations: OrganizationSearchItem[];
      total: number;
    };
  }

  export interface OrganizationSearchResponse {
    success: boolean;
    data: {
      organizations: OrganizationSearchItem[];
      total: number;
      hasMore: boolean;
      query?: string;
      offset: number;
      limit: number;
    };
  }
  