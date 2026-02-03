import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { config, buildApiUrl, fetchApi } from '../../src/config/api'

describe('config', () => {
  it('should have correct structure', () => {
    expect(config.api).toBeDefined()
    expect(config.api.baseUrl).toBeDefined()
    expect(config.api.endpoints).toBeDefined()
    expect(config.app.name).toBe('Regalade')
  })

  it('should have all required endpoints', () => {
    expect(config.api.endpoints.search).toBe('/search')
    expect(config.api.endpoints.login).toBe('/login')
    expect(config.api.endpoints.logout).toBe('/logout')
    expect(config.api.endpoints.me).toBe('/me')
    expect(config.api.endpoints.recipes).toBe('/recipes')
    expect(config.api.endpoints.favorites).toBe('/favorites')
  })

  it('should have dynamic endpoints as functions', () => {
    expect(config.api.endpoints.recipesById('123')).toBe('/recipes/123')
    expect(config.api.endpoints.userFavorites('john')).toBe('/users/john/favorites')
  })
})

describe('buildApiUrl', () => {
  it('should build correct API URL', () => {
    const endpoint = '/search'
    const url = buildApiUrl(endpoint)
    expect(url).toBe(`${config.api.baseUrl}${endpoint}`)
  })

  it('should handle endpoints with query parameters', () => {
    const endpoint = '/search?q=pizza'
    const url = buildApiUrl(endpoint)
    expect(url).toBe(`${config.api.baseUrl}${endpoint}`)
  })

  it('should handle dynamic endpoints', () => {
    const endpoint = config.api.endpoints.recipesById('456')
    const url = buildApiUrl(endpoint)
    expect(url).toBe(`${config.api.baseUrl}/recipes/456`)
  })
})

describe('fetchApi', () => {
  const mockEndpoint = '/test'
  const mockUrl = buildApiUrl(mockEndpoint)

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should successfully fetch JSON data', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'application/json',
        'content-length': '100',
      }),
      json: vi.fn().mockResolvedValue(mockData),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const result = await fetchApi(mockEndpoint)

    expect(global.fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      })
    )
    expect(result).toEqual(mockData)
  })

  it('should use custom method from options', async () => {
    const mockData = { success: true }
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: vi.fn().mockResolvedValue(mockData),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await fetchApi(mockEndpoint, { method: 'POST' })

    expect(global.fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('should pass custom options to fetch', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: vi.fn().mockResolvedValue({}),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await fetchApi(mockEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(global.fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'PUT',
      })
    )
  })

  it('should handle empty response with content-length 0', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
        'content-length': '0',
      }),
      text: vi.fn().mockResolvedValue(''),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const result = await fetchApi(mockEndpoint)

    expect(result).toBeNull()
  })

  it('should handle response without JSON content-type', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'text/plain',
      }),
      text: vi.fn().mockResolvedValue(''),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const result = await fetchApi(mockEndpoint)

    expect(result).toBeNull()
  })

  it('should throw error for HTTP error responses', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: vi.fn().mockRejectedValue(new Error('No JSON')),
      text: vi.fn().mockResolvedValue(''),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await expect(fetchApi(mockEndpoint)).rejects.toThrow('Erreur HTTP 404: Not Found')
  })

  it('should use error detail from JSON response if available', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: vi.fn().mockResolvedValue({ detail: 'Invalid input data' }),
      text: vi.fn().mockResolvedValue(''),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await expect(fetchApi(mockEndpoint)).rejects.toThrow('Invalid input data')
  })

  it('should use text response for error if JSON parsing fails', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockRejectedValue(new Error('Not JSON')),
      text: vi.fn().mockResolvedValue('Server error occurred'),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await expect(fetchApi(mockEndpoint)).rejects.toThrow('Server error occurred')
  })

  it('should truncate long error messages', async () => {
    const longErrorText = 'A'.repeat(300)
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockRejectedValue(new Error('Not JSON')),
      text: vi.fn().mockResolvedValue(longErrorText),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    try {
      await fetchApi(mockEndpoint)
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('A'.repeat(200))
      expect((error as Error).message.length).toBe(200)
    }
  })

  it('should handle network errors', async () => {
    const networkError = new TypeError('Failed to fetch')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockRejectedValue(networkError)

    await expect(fetchApi(mockEndpoint)).rejects.toThrow('Failed to fetch')
  })

  it('should handle JSON parsing errors', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
        'content-length': '100',
      }),
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await expect(fetchApi(mockEndpoint)).rejects.toThrow('Unexpected token')
  })

  it('should include credentials in request', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: vi.fn().mockResolvedValue({}),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    await fetchApi(mockEndpoint)

    expect(global.fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        credentials: 'include',
      })
    )
  })

  it('should handle POST request with body', async () => {
    const mockData = { id: 1, name: 'Created' }
    const mockResponse = {
      ok: true,
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: vi.fn().mockResolvedValue(mockData),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const body = JSON.stringify({ name: 'Test' })
    const result = await fetchApi(mockEndpoint, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(global.fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'POST',
        body,
      })
    )
    expect(result).toEqual(mockData)
  })
})
