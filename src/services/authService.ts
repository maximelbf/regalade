import { config, fetchApi } from '../config/api'

type LoginCredentials = {
  username: string
  password: string
}

type LoginResponse = {
  token: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetchApi<LoginResponse>(config.api.endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      this.setTokenCookie(response.token)
    }
    
    return response
  }
  
  private setTokenCookie(token: string): void {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  }

  private clearTokenCookie(): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  isAuthenticated(): boolean {
    return document.cookie.split('; ').some(cookie => cookie.startsWith('token='))
  }

  async logout(): Promise<void> {
    try {
      const url = `${config.api.baseUrl}${config.api.endpoints.logout}`
      await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokenCookie()
    }
  }
}

export const authService = new AuthService()