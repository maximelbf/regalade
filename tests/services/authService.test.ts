/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { authService } from '../../src/services/authService'
import { mockUser } from '../mocks/handlers'

const { mockFetchApi, mockConfig } = vi.hoisted(() => {
  const mockFetchApi = vi.fn()
  const mockConfig = {
    api: {
      baseUrl: 'https://api.example.com',
      endpoints: {
        login: '/login',
        logout: '/logout',
        me: '/me',
      },
    },
  }
  return { mockFetchApi, mockConfig }
})

vi.mock('../../src/config/api', () => ({
  config: mockConfig,
  fetchApi: mockFetchApi,
}))

describe('authService', () => {
  let cookieStore: string = ''
  let sessionStorageStore: Record<string, string> = {}

  beforeEach(() => {
    vi.clearAllMocks()
    cookieStore = ''
    sessionStorageStore = {}
    global.fetch = vi.fn()

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      get: () => cookieStore,
      set: (value: string) => {
        if (value.includes('expires=Thu, 01 Jan 1970')) {
          cookieStore = ''
        } else {
          cookieStore = value
        }
      },
      configurable: true,
    })

    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: vi.fn((key: string) => sessionStorageStore[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        sessionStorageStore[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete sessionStorageStore[key]
      }),
      clear: vi.fn(() => {
        sessionStorageStore = {}
      }),
    }

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    })

    // Clear cache
    ;(authService as any).userCache = null
    ;(authService as any).cacheTimestamp = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('should successfully login and set token cookie', async () => {
      const credentials = { username: 'john', password: 'password123' }
      const mockResponse = { token: 'abc123token' }

      mockFetchApi.mockResolvedValueOnce(mockResponse)

      const result = await authService.login(credentials)

      expect(mockFetchApi).toHaveBeenCalledWith(
        '/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(cookieStore).toContain('token=abc123token')
    })

    it('should clear user cache after login', async () => {
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = Date.now()

      mockFetchApi.mockResolvedValueOnce({ token: 'newtoken' })

      await authService.login({ username: 'john', password: 'pass' })

      expect((authService as any).userCache).toBeNull()
      expect((authService as any).cacheTimestamp).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token cookie exists', () => {
      cookieStore = 'token=abc123; path=/'

      const result = authService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when token cookie does not exist', () => {
      cookieStore = 'other=value'

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when no cookies exist', () => {
      cookieStore = ''

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe('logout', () => {
    it('should call logout endpoint and clear token', async () => {
      cookieStore = 'token=abc123'
      ;(global.fetch as any).mockResolvedValueOnce({ ok: true })

      await authService.logout()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/logout',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      )
      expect(cookieStore).toBe('')
    })

    it('should clear user cache on logout', async () => {
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = Date.now()
      ;(global.fetch as any).mockResolvedValueOnce({ ok: true })

      await authService.logout()

      expect((authService as any).userCache).toBeNull()
      expect((authService as any).cacheTimestamp).toBeNull()
    })

    it('should clear token even if logout request fails', async () => {
      cookieStore = 'token=abc123'
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await authService.logout()

      expect(cookieStore).toBe('')
    })

    it('should clear sessionStorage on logout', async () => {
      sessionStorageStore['user_cache'] = JSON.stringify(mockUser)
      sessionStorageStore['user_cache_timestamp'] = Date.now().toString()
      ;(global.fetch as any).mockResolvedValueOnce({ ok: true })

      await authService.logout()

      expect(sessionStorageStore['user_cache']).toBeUndefined()
      expect(sessionStorageStore['user_cache_timestamp']).toBeUndefined()
    })
  })

  describe('getCurrentUser', () => {
    it('should fetch user from API', async () => {
      mockFetchApi.mockResolvedValueOnce(mockUser)

      const user = await authService.getCurrentUser()

      expect(mockFetchApi).toHaveBeenCalledWith('/me', {
        method: 'GET',
      })
      expect(user).toEqual(mockUser)
    })

    it('should cache user data', async () => {
      mockFetchApi.mockResolvedValueOnce(mockUser)

      await authService.getCurrentUser()

      expect((authService as any).userCache).toEqual(mockUser)
      expect((authService as any).cacheTimestamp).toBeTypeOf('number')
    })

    it('should save cache to sessionStorage', async () => {
      mockFetchApi.mockResolvedValueOnce(mockUser)

      await authService.getCurrentUser()

      expect(sessionStorage.setItem).toHaveBeenCalledWith('user_cache', JSON.stringify(mockUser))
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'user_cache_timestamp',
        expect.any(String)
      )
    })

    it('should return cached user if cache is valid', async () => {
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = Date.now()

      const user = await authService.getCurrentUser()

      expect(mockFetchApi).not.toHaveBeenCalled()
      expect(user).toEqual(mockUser)
    })

    it('should fetch fresh data if cache is expired', async () => {
      const fiveMinutesAgo = Date.now() - 6 * 60 * 1000
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = fiveMinutesAgo

      mockFetchApi.mockResolvedValueOnce(mockUser)

      await authService.getCurrentUser()

      expect(mockFetchApi).toHaveBeenCalled()
    })

    it('should force refresh when forceRefresh is true', async () => {
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = Date.now()

      mockFetchApi.mockResolvedValueOnce(mockUser)

      await authService.getCurrentUser(true)

      expect(mockFetchApi).toHaveBeenCalled()
    })
  })

  describe('cache management', () => {
    it('should load cache from sessionStorage on initialization', () => {
      const cachedUser = { ...mockUser, username: 'cached' }
      const timestamp = Date.now()

      sessionStorageStore['user_cache'] = JSON.stringify(cachedUser)
      sessionStorageStore['user_cache_timestamp'] = timestamp.toString()

      // Force re-initialization by calling private method
      ;(authService as any).loadCacheFromStorage()

      expect((authService as any).userCache).toEqual(cachedUser)
      expect((authService as any).cacheTimestamp).toBe(timestamp)
    })

    it('should handle corrupted cache in sessionStorage', () => {
      sessionStorageStore['user_cache'] = 'invalid json'
      sessionStorageStore['user_cache_timestamp'] = 'invalid'

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(authService as any).loadCacheFromStorage()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should validate cache based on timestamp', () => {
      const now = Date.now()

      // Valid cache
      ;(authService as any).userCache = mockUser
      ;(authService as any).cacheTimestamp = now
      expect((authService as any).isCacheValid()).toBe(true)

      // Expired cache (6 minutes old)
      ;(authService as any).cacheTimestamp = now - 6 * 60 * 1000
      expect((authService as any).isCacheValid()).toBe(false)

      // No cache
      ;(authService as any).userCache = null
      ;(authService as any).cacheTimestamp = null
      expect((authService as any).isCacheValid()).toBe(false)
    })
  })
})
