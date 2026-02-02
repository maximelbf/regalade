import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { config, fetchApi } from '../config/api'

type UseGetFavoritesReturn = {
  favorites: Recipe[]
  loading: boolean
  error: Error | null
}

export const useGetFavorites = (): UseGetFavoritesReturn => {
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const data = await fetchApi<Recipe[]>(config.api.endpoints.favorites, {
          method: 'GET',
        })
        setFavorites(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  return { favorites, loading, error }
}