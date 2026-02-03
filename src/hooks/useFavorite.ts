import { useState } from 'react'
import { config, fetchApi } from '../config/api'
import { authService } from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import type { Recipe } from '../types'

type UseFavoriteReturn = {
  addFavorite: (recipeId: string, recipe?: Recipe) => Promise<void>
  removeFavorite: (recipeId: string) => Promise<void>
  error: string | null
}

export const useFavorite = (): UseFavoriteReturn => {
  const [error, setError] = useState<string | null>(null)

  const addFavorite = async (recipeId: string, recipe?: Recipe) => {
    try {
      setError(null)

      if (recipe) {
        favoritesService.addToCache(recipe)
      } else {
        // Si la recette n'est pas fournie, on invalide le cache pour forcer la récupération à la prochaine requête
        favoritesService.clearCache()
      }

      const user = await authService.getCurrentUser()
      const endpoint = `${config.api.endpoints.userFavorites(user.username)}?recipeID=${recipeId}`

      await fetchApi(endpoint, {
        method: 'POST',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding favorite'
      setError(errorMessage)
      // En cas d'erreur, invalider le cache pour revenir à l'état serveur
      favoritesService.clearCache()
      throw err
    }
  }

  const removeFavorite = async (recipeId: string) => {
    try {
      setError(null)

      favoritesService.removeFromCache(recipeId)

      const user = await authService.getCurrentUser()
      const endpoint = `${config.api.endpoints.userFavorites(user.username)}?recipeID=${recipeId}`

      await fetchApi(endpoint, {
        method: 'DELETE',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error removing favorite'
      setError(errorMessage)
      // En cas d'erreur, invalider le cache pour revenir à l'état serveur
      favoritesService.clearCache()
      throw err
    }
  }

  return { addFavorite, removeFavorite, error }
}
