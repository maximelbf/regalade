import { useState, useCallback } from 'react'
import type { Recipe } from '../types'
import { config, fetchApi } from '../config/api'

interface UseSearchReturn {
  results: Recipe[]
  loading: boolean
  error: Error | null
  search: (query: string) => Promise<void>
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchApi<Recipe[]>(
        `${config.api.endpoints.search}?q=${encodeURIComponent(query)}`
      )
      setResults(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'))
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
