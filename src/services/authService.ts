const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  token: string
}

interface ApiError {
  detail?: string
  status?: number
  title?: string
}

class AuthService {
  private static TOKEN_KEY = 'auth_token'

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Login failed')
    }

    const data: LoginResponse = await response.json()
    this.setToken(data.token)
    return data
  }

  async logout(): Promise<void> {
    const token = this.getToken()
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    this.removeToken()
  }

  setToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token)
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY)
  }

  removeToken(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getAuthHeaders(): HeadersInit {
    const token = this.getToken()
    return token
      ? { 'Authorization': `Bearer ${token}` }
      : {}
  }
}

export const authService = new AuthService()
export type { LoginCredentials, LoginResponse, ApiError }
