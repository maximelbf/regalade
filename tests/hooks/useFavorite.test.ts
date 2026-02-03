import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFavorite } from '../../src/hooks/useFavorite'
import { mockRecipe, mockUser } from '../mocks/handlers'

const { mockFetchApi, mockConfig } = vi.hoisted(() => {
  const mockFetchApi = vi.fn()
  const mockConfig = {
    api: {
      endpoints: {
        userFavorites: vi.fn((username: string) => `/api/users/${username}/favorites`),
      },
    },
  }
  return { mockFetchApi, mockConfig }
})

const { mockAuthService, mockFavoritesService } = vi.hoisted(() => {
  const mockAuthService = {
    getCurrentUser: vi.fn(),
  }
  const mockFavoritesService = {
    addToCache: vi.fn(),
    removeFromCache: vi.fn(),
    clearCache: vi.fn(),
  }
  return { mockAuthService, mockFavoritesService }
})

vi.mock('../../src/config/api', () => ({
  config: mockConfig,
  fetchApi: mockFetchApi,
}))

vi.mock('../../src/services/authService', () => ({
  authService: mockAuthService,
}))

vi.mock('../../src/services/favoritesService', () => ({
  favoritesService: mockFavoritesService,
}))

describe('useFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthService.getCurrentUser.mockResolvedValue(mockUser)
  })

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useFavorite())

    expect(result.current.error).toBe(null)
    expect(typeof result.current.addFavorite).toBe('function')
    expect(typeof result.current.removeFavorite).toBe('function')
  })

  describe('addFavorite', () => {
    it('should add favorite with recipe object', async () => {
      mockFetchApi.mockResolvedValueOnce({})

      const { result } = renderHook(() => useFavorite())

      await result.current.addFavorite('1', mockRecipe)

      expect(mockFavoritesService.addToCache).toHaveBeenCalledWith(mockRecipe)
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled()
      expect(mockFetchApi).toHaveBeenCalledWith('/api/users/testuser/favorites?recipeID=1', {
        method: 'POST',
      })
      expect(result.current.error).toBe(null)
    })

    it('should add favorite without recipe object and clear cache', async () => {
      mockFetchApi.mockResolvedValueOnce({})

      const { result } = renderHook(() => useFavorite())

      await result.current.addFavorite('1')

      expect(mockFavoritesService.clearCache).toHaveBeenCalled()
      expect(mockFavoritesService.addToCache).not.toHaveBeenCalled()
      expect(mockFetchApi).toHaveBeenCalledWith('/api/users/testuser/favorites?recipeID=1', {
        method: 'POST',
      })
    })

    it('should handle errors when adding favorite', async () => {
      const mockError = new Error('Failed to add favorite')
      mockFetchApi.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useFavorite())

      await expect(result.current.addFavorite('1', mockRecipe)).rejects.toThrow(
        'Failed to add favorite'
      )

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to add favorite')
      })

      expect(mockFavoritesService.clearCache).toHaveBeenCalled()
    })
  })

  describe('removeFavorite', () => {
    it('should remove favorite successfully', async () => {
      mockFetchApi.mockResolvedValueOnce({})

      const { result } = renderHook(() => useFavorite())

      await result.current.removeFavorite('1')

      expect(mockFavoritesService.removeFromCache).toHaveBeenCalledWith('1')
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled()
      expect(mockFetchApi).toHaveBeenCalledWith('/api/users/testuser/favorites?recipeID=1', {
        method: 'DELETE',
      })
      expect(result.current.error).toBe(null)
    })

    it('should handle errors when removing favorite', async () => {
      const mockError = new Error('Failed to remove favorite')
      mockFetchApi.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useFavorite())

      await expect(result.current.removeFavorite('1')).rejects.toThrow('Failed to remove favorite')

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to remove favorite')
      })

      expect(mockFavoritesService.clearCache).toHaveBeenCalled()
    })
  })

  it('should clear error state on successful operation after error', async () => {
    const mockError = new Error('Failed to add')
    mockFetchApi.mockRejectedValueOnce(mockError).mockResolvedValueOnce({})

    const { result } = renderHook(() => useFavorite())

    // First call fails
    await expect(result.current.addFavorite('1')).rejects.toThrow()
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to add')
    })

    // Second call succeeds
    await result.current.addFavorite('2')
    await waitFor(() => {
      expect(result.current.error).toBe(null)
    })
  })
})
