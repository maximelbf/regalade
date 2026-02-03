/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { favoritesService } from '../../src/services/favoritesService'
import { mockFavorites, mockRecipe, mockRecipe2 } from '../mocks/handlers'

const { mockFetchApi, mockConfig } = vi.hoisted(() => {
  const mockFetchApi = vi.fn()
  const mockConfig = {
    api: {
      endpoints: {
        favorites: '/favorites',
      },
    },
  }
  return { mockFetchApi, mockConfig }
})

vi.mock('../../src/config/api', () => ({
  config: mockConfig,
  fetchApi: mockFetchApi,
}))

describe('favoritesService', () => {
  let sessionStorageStore: Record<string, string> = {}

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorageStore = {}

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
    favoritesService.clearCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getFavorites', () => {
    it('should fetch favorites from API', async () => {
      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      const result = await favoritesService.getFavorites()

      expect(mockFetchApi).toHaveBeenCalledWith('/favorites', {
        method: 'GET',
      })
      expect(result).toEqual(mockFavorites)
    })

    it('should cache favorites after fetching', async () => {
      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      await favoritesService.getFavorites()

      expect((favoritesService as any).favoritesCache).toEqual(mockFavorites)
      expect((favoritesService as any).cacheTimestamp).toBeTypeOf('number')
    })

    it('should save cache to sessionStorage', async () => {
      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      await favoritesService.getFavorites()

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'favorites_cache',
        JSON.stringify(mockFavorites)
      )
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'favorites_cache_timestamp',
        expect.any(String)
      )
    })

    it('should return cached favorites if cache is valid', async () => {
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = Date.now()

      const result = await favoritesService.getFavorites()

      expect(mockFetchApi).not.toHaveBeenCalled()
      expect(result).toEqual(mockFavorites)
    })

    it('should fetch fresh data if cache is expired', async () => {
      const threeMinutesAgo = Date.now() - 3 * 60 * 1000
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = threeMinutesAgo

      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      await favoritesService.getFavorites()

      expect(mockFetchApi).toHaveBeenCalled()
    })

    it('should force refresh when forceRefresh is true', async () => {
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = Date.now()

      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      await favoritesService.getFavorites(true)

      expect(mockFetchApi).toHaveBeenCalled()
    })
  })

  describe('addToCache', () => {
    it('should add recipe to cache', () => {
      ;(favoritesService as any).favoritesCache = [...mockFavorites]
      ;(favoritesService as any).cacheTimestamp = Date.now()

      favoritesService.addToCache(mockRecipe2)

      expect((favoritesService as any).favoritesCache).toContainEqual(mockRecipe2)
      expect((favoritesService as any).favoritesCache.length).toBe(3)
    })

    it('should not add duplicate recipe', () => {
      ;(favoritesService as any).favoritesCache = [...mockFavorites]
      ;(favoritesService as any).cacheTimestamp = Date.now()

      favoritesService.addToCache(mockFavorites[0])

      expect((favoritesService as any).favoritesCache.length).toBe(2)
    })

    it('should initialize cache if it does not exist', () => {
      ;(favoritesService as any).favoritesCache = null

      favoritesService.addToCache(mockRecipe)

      expect((favoritesService as any).favoritesCache).toEqual([mockRecipe])
      expect((favoritesService as any).cacheTimestamp).toBeTypeOf('number')
    })

    it('should save cache to sessionStorage', () => {
      ;(favoritesService as any).favoritesCache = [...mockFavorites]
      ;(favoritesService as any).cacheTimestamp = Date.now()

      favoritesService.addToCache(mockRecipe2)

      expect(sessionStorage.setItem).toHaveBeenCalledWith('favorites_cache', expect.any(String))
    })
  })

  describe('removeFromCache', () => {
    it('should remove recipe from cache', () => {
      ;(favoritesService as any).favoritesCache = [...mockFavorites]
      ;(favoritesService as any).cacheTimestamp = Date.now()

      favoritesService.removeFromCache('1')

      expect((favoritesService as any).favoritesCache).not.toContainEqual(mockFavorites[0])
      expect((favoritesService as any).favoritesCache.length).toBe(1)
    })

    it('should do nothing if cache is null', () => {
      ;(favoritesService as any).favoritesCache = null

      expect(() => favoritesService.removeFromCache('1')).not.toThrow()
      expect((favoritesService as any).favoritesCache).toBeNull()
    })

    it('should update timestamp after removal', () => {
      const oldTimestamp = Date.now() - 1000
      ;(favoritesService as any).favoritesCache = [...mockFavorites]
      ;(favoritesService as any).cacheTimestamp = oldTimestamp

      favoritesService.removeFromCache('1')

      expect((favoritesService as any).cacheTimestamp).toBeGreaterThan(oldTimestamp)
    })

    it('should save cache to sessionStorage after removal', () => {
      ;(favoritesService as any).favoritesCache = [...mockFavorites]

      favoritesService.removeFromCache('1')

      expect(sessionStorage.setItem).toHaveBeenCalledWith('favorites_cache', expect.any(String))
    })
  })

  describe('clearCache', () => {
    it('should clear all cache data', () => {
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = Date.now()

      favoritesService.clearCache()

      expect((favoritesService as any).favoritesCache).toBeNull()
      expect((favoritesService as any).cacheTimestamp).toBeNull()
    })

    it('should remove data from sessionStorage', () => {
      sessionStorageStore['favorites_cache'] = JSON.stringify(mockFavorites)
      sessionStorageStore['favorites_cache_timestamp'] = Date.now().toString()

      favoritesService.clearCache()

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('favorites_cache')
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('favorites_cache_timestamp')
    })
  })

  describe('isRecipeFavorite', () => {
    it('should return true if recipe is in favorites', async () => {
      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      const result = await favoritesService.isRecipeFavorite('1')

      expect(result).toBe(true)
    })

    it('should return false if recipe is not in favorites', async () => {
      const apiResponse = mockFavorites.map(recipe => ({ recipe }))
      mockFetchApi.mockResolvedValueOnce(apiResponse)

      const result = await favoritesService.isRecipeFavorite('999')

      expect(result).toBe(false)
    })

    it('should use cached data if available', async () => {
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = Date.now()

      const result = await favoritesService.isRecipeFavorite('1')

      expect(mockFetchApi).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })

  describe('cache management', () => {
    it('should load cache from sessionStorage on initialization', () => {
      const timestamp = Date.now()
      sessionStorageStore['favorites_cache'] = JSON.stringify(mockFavorites)
      sessionStorageStore['favorites_cache_timestamp'] = timestamp.toString()
      ;(favoritesService as any).loadCacheFromStorage()

      expect((favoritesService as any).favoritesCache).toEqual(mockFavorites)
      expect((favoritesService as any).cacheTimestamp).toBe(timestamp)
    })

    it('should handle corrupted cache in sessionStorage', () => {
      sessionStorageStore['favorites_cache'] = 'invalid json'
      sessionStorageStore['favorites_cache_timestamp'] = 'invalid'

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(favoritesService as any).loadCacheFromStorage()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should validate cache based on timestamp', () => {
      const now = Date.now()

      // Valid cache
      ;(favoritesService as any).favoritesCache = mockFavorites
      ;(favoritesService as any).cacheTimestamp = now
      expect((favoritesService as any).isCacheValid()).toBe(true)

      // Expired cache (3 minutes old)
      ;(favoritesService as any).cacheTimestamp = now - 3 * 60 * 1000
      expect((favoritesService as any).isCacheValid()).toBe(false)

      // No cache
      ;(favoritesService as any).favoritesCache = null
      ;(favoritesService as any).cacheTimestamp = null
      expect((favoritesService as any).isCacheValid()).toBe(false)
    })
  })
})
