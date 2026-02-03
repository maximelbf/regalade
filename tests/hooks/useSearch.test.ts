import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSearch } from '../../src/hooks/useSearch'
import { mockRecipes } from '../mocks/handlers'

const { mockFetchApi, mockConfig } = vi.hoisted(() => {
  const mockFetchApi = vi.fn()
  const mockConfig = {
    api: {
      endpoints: {
        search: '/api/search',
      },
    },
  }
  return { mockFetchApi, mockConfig }
})

vi.mock('../../src/config/api', () => ({
  config: mockConfig,
  fetchApi: mockFetchApi,
}))

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty results', () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should search and return results', async () => {
    mockFetchApi.mockResolvedValueOnce(mockRecipes)

    const { result } = renderHook(() => useSearch())

    await result.current.search('pizza')

    await waitFor(() => {
      expect(result.current.results).toEqual(mockRecipes)
    })

    expect(result.current.error).toBe(null)
  })

  it('should handle search errors', async () => {
    const mockError = new Error('Search failed')
    mockFetchApi.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSearch())

    await result.current.search('pizza')

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })

    expect(result.current.results).toEqual([])
  })

  it('should clear results when search query is empty', async () => {
    const { result } = renderHook(() => useSearch())

    await result.current.search('')

    expect(result.current.results).toEqual([])
    expect(result.current.error).toBe(null)
    expect(mockFetchApi).not.toHaveBeenCalled()
  })
})
