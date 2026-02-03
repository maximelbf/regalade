import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGetRecipe } from '../../src/hooks/useGetRecipe'
import { mockRecipe, mockRecipe2 } from '../mocks/handlers'

const { mockFetchApi, mockConfig } = vi.hoisted(() => {
  const mockFetchApi = vi.fn()
  const mockConfig = {
    api: {
      endpoints: {
        recipesById: vi.fn((id: string) => `/api/recipes/${id}`),
      },
    },
  }
  return { mockFetchApi, mockConfig }
})

vi.mock('../../src/config/api', () => ({
  config: mockConfig,
  fetchApi: mockFetchApi,
}))

describe('useGetRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch recipe when recipeId is provided', async () => {
    mockFetchApi.mockResolvedValueOnce(mockRecipe)

    const { result } = renderHook(() => useGetRecipe('1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.recipe).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recipe).toEqual(mockRecipe)
    expect(result.current.error).toBe(null)
    expect(mockFetchApi).toHaveBeenCalledWith('/api/recipes/1')
  })

  it('should not fetch when recipeId is undefined', async () => {
    const { result } = renderHook(() => useGetRecipe(undefined))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recipe).toBe(null)
    expect(result.current.error).toBe(null)
    expect(mockFetchApi).not.toHaveBeenCalled()
  })

  it('should handle errors when fetching recipe', async () => {
    const mockError = new Error('Recipe not found')
    mockFetchApi.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useGetRecipe('999'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recipe).toBe(null)
    expect(result.current.error).toBe('Recipe not found')
  })

  it('should refetch when recipeId changes', async () => {
    mockFetchApi.mockResolvedValueOnce(mockRecipe).mockResolvedValueOnce(mockRecipe2)

    const { result, rerender } = renderHook(({ id }) => useGetRecipe(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.recipe).toEqual(mockRecipe)
    })

    // Change recipeId
    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.recipe).toEqual(mockRecipe2)
    })

    expect(mockFetchApi).toHaveBeenCalledTimes(2)
    expect(mockFetchApi).toHaveBeenNthCalledWith(1, '/api/recipes/1')
    expect(mockFetchApi).toHaveBeenNthCalledWith(2, '/api/recipes/2')
  })

  it('should clear error on successful refetch after error', async () => {
    const mockError = new Error('Failed to fetch')
    mockFetchApi.mockRejectedValueOnce(mockError).mockResolvedValueOnce(mockRecipe)

    const { result, rerender } = renderHook(({ id }) => useGetRecipe(id), {
      initialProps: { id: '999' },
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch')
    })

    // Refetch with valid ID
    rerender({ id: '1' })

    await waitFor(() => {
      expect(result.current.recipe).toEqual(mockRecipe)
    })

    expect(result.current.error).toBe(null)
  })

  it('should set loading to true when refetching', async () => {
    mockFetchApi.mockResolvedValue(mockRecipe)

    const { result, rerender } = renderHook(({ id }) => useGetRecipe(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    rerender({ id: '2' })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle non-Error objects in catch block', async () => {
    mockFetchApi.mockRejectedValueOnce('String error')

    const { result } = renderHook(() => useGetRecipe('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Error while fetching recipe')
    expect(result.current.recipe).toBe(null)
  })
})
