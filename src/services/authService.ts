import { config, fetchApi } from '../config/api'
import type { User } from '../types'

type LoginCredentials = {
  username: string
  password: string
}

type LoginResponse = {
  token: string
}

class AuthService {
  private userCache: User | null = null
  private cacheTimestamp: number | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly STORAGE_KEY = 'user_cache'
  private readonly TIMESTAMP_KEY = 'user_cache_timestamp'

  constructor() {
    // Restaurer le cache depuis sessionStorage au démarrage
    this.loadCacheFromStorage()
  }

  private loadCacheFromStorage(): void {
    try {
      const cachedData = sessionStorage.getItem(this.STORAGE_KEY)
      const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY)
      
      if (cachedData && timestamp) {
        this.userCache = JSON.parse(cachedData)
        this.cacheTimestamp = parseInt(timestamp, 10)
      }
    } catch (err) {
      console.error('Error loading user cache from storage:', err)
    }
  }

  private saveCacheToStorage(): void {
    try {
      if (this.userCache && this.cacheTimestamp) {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.userCache))
        sessionStorage.setItem(this.TIMESTAMP_KEY, this.cacheTimestamp.toString())
      }
    } catch (err) {
      console.error('Error saving user cache to storage:', err)
    }
  }

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
      this.clearUserCache()
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
      this.clearUserCache()
    }
  }

  private clearUserCache(): void {
    this.userCache = null
    this.cacheTimestamp = null
    sessionStorage.removeItem(this.STORAGE_KEY)
    sessionStorage.removeItem(this.TIMESTAMP_KEY)
  }

  private isCacheValid(): boolean {
    if (!this.userCache || !this.cacheTimestamp) {
      return false
    }
    const now = Date.now()
    return (now - this.cacheTimestamp) < this.CACHE_DURATION
  }

  async getCurrentUser(forceRefresh: boolean = false): Promise<User> {
    if (!forceRefresh && this.isCacheValid() && this.userCache) {
      return this.userCache
    }

    const user = await fetchApi<User>(config.api.endpoints.me, {
      method: 'GET',
    })
    
    this.userCache = user
    this.cacheTimestamp = Date.now()
    this.saveCacheToStorage()
    
    return user
  }
}

export const authService = new AuthService()