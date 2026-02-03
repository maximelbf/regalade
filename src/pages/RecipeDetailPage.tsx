import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useGetRecipe } from '../hooks/useGetRecipe'
import { useFavorite } from '../hooks/useFavorite'
import { favoritesService } from '../services/favoritesService'

interface RecipeDetailPageProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function RecipeDetailPage({ isLoggedIn, onLoginToggle }: RecipeDetailPageProps) {
  const { recetteId } = useParams<{ recetteId: string }>()
  const navigate = useNavigate()
  const { recipe, loading, error } = useGetRecipe(recetteId)
  const { addFavorite, removeFavorite } = useFavorite()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!recetteId || !isLoggedIn) {
        setIsFavorite(false)
        return
      }

      try {
        const isFav = await favoritesService.isRecipeFavorite(recetteId)
        setIsFavorite(isFav)
      } catch (err) {
        console.error('Error checking favorite status:', err)
        setIsFavorite(false)
      }
    }

    checkIfFavorite()
  }, [recetteId, isLoggedIn])

  const handleFavoriteToggle = async () => {
    if (!recetteId || !recipe) return

    try {
      if (isFavorite) {
        await removeFavorite(recetteId)
        setIsFavorite(false)
      } else {
        await addFavorite(recetteId, recipe)
        setIsFavorite(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />

      <main className="w-full px-8 py-12 mt-6 flex-grow relative">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Back
        </button>

        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-lg text-gray-600">Loading recipe...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {recipe && (
          <div className="bg-[#FFFDF7] rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
            {/* Image */}
            <div className="w-full h-[500px] bg-gray-200 overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image'
                }}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

                  {recipe.description && (
                    <p className="text-lg text-gray-700 leading-relaxed">{recipe.description}</p>
                  )}
                </div>

                {/* Bouton Favori */}
                {isLoggedIn && (
                  <button
                    onClick={handleFavoriteToggle}
                    className="flex-shrink-0 cursor-pointer"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      className="h-8 w-8 transition-all duration-200 hover:scale-110"
                      viewBox="0 0 24 24"
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: isFavorite ? '#ef4444' : '#6b7280' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Instructions Section with Info Panel */}
              {recipe.instructions && (
                <div className="border-t pt-8 flex gap-8">
                  <div className="w-80 bg-gray-100 rounded-lg p-6 h-fit">
                    <div className="space-y-6">
                      {recipe.category && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Catégorie
                          </p>
                          <p className="text-lg font-medium text-gray-900">{recipe.category}</p>
                        </div>
                      )}
                      {recipe.prep_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Préparation
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {recipe.prep_time} min
                          </p>
                        </div>
                      )}
                      {recipe.cook_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Cuisson
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {recipe.cook_time} min
                          </p>
                        </div>
                      )}
                      {recipe.prep_time && recipe.cook_time && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Temps total
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {recipe.prep_time + recipe.cook_time} min
                          </p>
                        </div>
                      )}
                      {recipe.servings && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Portions
                          </p>
                          <p className="text-lg font-medium text-gray-900">{recipe.servings}</p>
                        </div>
                      )}
                      {recipe.when_to_eat && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                            Moment
                          </p>
                          <p className="text-lg font-medium text-gray-900">{recipe.when_to_eat}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {recipe.instructions}
                    </p>
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
