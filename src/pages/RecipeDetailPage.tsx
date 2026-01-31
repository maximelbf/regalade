import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import type { Recipe, Ingredient } from '../types'
import { config, fetchApi } from '../config/api'

interface RecipeDetailPageProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function RecipeDetailPage({ isLoggedIn, onLoginToggle }: RecipeDetailPageProps) {
  const { recetteId } = useParams<{ recetteId: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const endpoint = config.api.endpoints.recipesById(recetteId!)
        const data = await fetchApi<Recipe>(endpoint)
        setRecipe(data)
      } catch (err) {
        console.error('Error fetching recipe:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la recette')
      } finally {
        setLoading(false)
      }
    }

    const fetchIngredients = async () => {
      try {
        const ingredientsData = await fetchApi<Ingredient[]>(config.api.endpoints.ingredients)
        setIngredients(ingredientsData)
      } catch (err) {
        console.error('Error fetching ingredients:', err)
      }
    }

    if (recetteId) {
      fetchRecipe()
      fetchIngredients()
    }
  }, [recetteId])

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />
      <Navigation />

      <main className="w-full px-8 py-12 mt-6 flex-grow relative">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Retour à l'accueil
        </button>

        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-lg text-gray-600">Chargement de la recette...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {recipe && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
            {/* Image */}
            <div className="w-full h-[500px] bg-gray-200 overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image'
                }}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

                {recipe.description && (
                  <p className="text-lg text-gray-700 leading-relaxed">{recipe.description}</p>
                )}
              </div>

              {/* Instructions Section with Info Panel */}
              {recipe.instructions && (
                <div className="border-t pt-8 flex gap-8">
                  <div className="w-80 bg-gray-100 rounded-lg p-6 h-fit">
                    <div className="space-y-6">
                      {recipe.category && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Catégorie</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.category}</p>
                        </div>
                      )}
                      {recipe.prep_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Préparation</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.prep_time} min</p>
                        </div>
                      )}
                      {recipe.cook_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Cuisson</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.cook_time} min</p>
                        </div>
                      )}
                      {recipe.prep_time && recipe.cook_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Temps total</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.prep_time + recipe.cook_time} min</p>
                        </div>
                      )}
                      {recipe.servings && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Portions</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.servings}</p>
                        </div>
                      )}
                      {recipe.when_to_eat && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Moment</p>
                          <p className="text-lg font-medium text-gray-900">{recipe.when_to_eat}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
