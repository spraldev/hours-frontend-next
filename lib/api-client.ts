const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    // Also set as HTTP-only cookie for middleware access
    document.cookie = `auth_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    // Also remove the cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check for unauthorized responses BEFORE parsing JSON
      const isAuthEndpoint = endpoint.includes('/auth/check-auth') || 
                            endpoint.includes('/auth/verify-email') ||
                            endpoint.includes('/auth/resend-verification') ||
                            endpoint.includes('/auth/student/login') ||
                            endpoint.includes('/auth/privileged/login') ||
                            endpoint.includes('/auth/request-password-reset') ||
                            endpoint.includes('/auth/reset-password');
      
      if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
        this.removeToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        throw {
          success: false,
          message: 'Session expired. Please login again.',
          statusCode: response.status,
        } as ApiError;
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, get text
          const text = await response.text();
          if (!response.ok) {
            throw {
              success: false,
              message: text || 'An error occurred',
              statusCode: response.status,
            } as ApiError;
          }
          // Try to parse as JSON anyway
          try {
            data = JSON.parse(text);
          } catch {
            data = { success: true, data: text };
          }
        }
      } catch (jsonError: any) {
        // If JSON parsing fails and response is not ok
        if (!response.ok) {
          throw {
            success: false,
            message: jsonError.message || 'An error occurred',
            statusCode: response.status,
          } as ApiError;
        }
        throw {
          success: false,
          message: 'Invalid response format',
        } as ApiError;
      }

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'An error occurred',
          statusCode: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: error.message || 'Network error occurred',
      } as ApiError;
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  login(token: string, userRole?: string): void {
    this.setToken(token);
    if (userRole && typeof window !== 'undefined') {
      document.cookie = `user_role=${userRole}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
    }
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Password reset methods
  async requestPasswordReset(email: string, userType: 'student' | 'supervisor'): Promise<ApiResponse> {
    return this.post('/auth/request-password-reset', {
      email,
      userType,
    });
  }

  async resetPassword(token: string, password: string, userType: 'student' | 'supervisor'): Promise<ApiResponse> {
    return this.post('/auth/reset-password', {
      token,
      password,
      userType,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
