import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { config, fetchApi } from '../config/api'

type UseGetRecipeReturn = {
  recipe: Recipe | null
  loading: boolean
  error: string | null
}

export const useGetRecipe = (recipeId: string | undefined): UseGetRecipeReturn => {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const endpoint = config.api.endpoints.recipesById(recipeId)
        const data = await fetchApi<Recipe>(endpoint)
        setRecipe(data)
      } catch (err) {
        console.error('Error fetching recipe:', err)
        setError(err instanceof Error ? err.message : 'Error while fetching recipe')
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  return { recipe, loading, error }
}
