import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGetFavorites } from '../../src/hooks/useGetFavorites'
import { mockFavorites } from '../mocks/handlers'

const { mockFavoritesService } = vi.hoisted(() => {
  const mockFavoritesService = {
    getFavorites: vi.fn(),
  }
  return { mockFavoritesService }
})

vi.mock('../../src/services/favoritesService', () => ({
  favoritesService: mockFavoritesService,
}))

describe('useGetFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch favorites on mount', async () => {
    mockFavoritesService.getFavorites.mockResolvedValueOnce(mockFavorites)

    const { result } = renderHook(() => useGetFavorites())

    expect(result.current.loading).toBe(true)
    expect(result.current.favorites).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.favorites).toEqual(mockFavorites)
    expect(result.current.error).toBe(null)
    expect(mockFavoritesService.getFavorites).toHaveBeenCalledWith(false)
  })

  it('should handle errors when fetching favorites', async () => {
    const mockError = new Error('Failed to fetch favorites')
    mockFavoritesService.getFavorites.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useGetFavorites())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.favorites).toEqual([])
    expect(result.current.error).toEqual(mockError)
  })
})
