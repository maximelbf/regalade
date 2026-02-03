import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { favoritesService } from '../services/favoritesService'

type UseGetFavoritesReturn = {
  favorites: Recipe[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export const useGetFavorites = (): UseGetFavoritesReturn => {
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFavorites = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true)
      const data = await favoritesService.getFavorites(forceRefresh)
      setFavorites(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchFavorites(true)
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return { favorites, loading, error, refresh }
}
