import { useState, useEffect, useRef } from 'react'
import { RecipeCard } from './RecipeCard'
import { fetchApi, config } from '../config/api'

interface Recipe {
  id: string
  name: string
  description: string
  image_url: string
  prep_time: number
  cook_time: number
  servings: number
}

export const RecipesScrollbar = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Log pour le diagnostique
        const url = `${config.api.baseUrl}${config.api.endpoints.recipes}?limit=12`
        console.log('Chargement des recettes depuis:', url)
        
        const data = await fetchApi<Recipe[]>(`${config.api.endpoints.recipes}?limit=12`)
        console.log('Recettes chargées:', data)
        setRecipes(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des recettes'
        setError(errorMessage)
        console.error('Erreur lors du chargement des recettes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })
    }
  }

  if (error) {
    return (
      <section className="w-full px-8 py-8 bg-white border-b border-gray-100">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700 font-semibold mb-2">⚠️ Erreur lors du chargement des recettes</p>
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-2 font-mono">
            URL: {config.api.baseUrl}{config.api.endpoints.recipes}
          </p>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="w-full px-8 py-8 bg-white border-b border-gray-100">
        <div className="flex items-center justify-center">
          <div className="animate-spin">⏳</div>
          <p className="ml-2 text-gray-600">Chargement des recettes...</p>
        </div>
      </section>
    )
  }

  if (recipes.length === 0) {
    return (
      <section className="w-full px-8 py-8 bg-white border-b border-gray-100">
        <p className="text-gray-600 text-center">Aucune recette disponible</p>
      </section>
    )
  }

  return (
    <section className="w-full px-8 py-8 bg-white border-b border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Recettes à découvrir
        </h2>
        <p className="text-gray-600 text-sm mt-2">Faites défiler pour explorer nos recettes</p>
      </div>

      {/* Scrollable Container with Arrows */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Recipes Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              name={recipe.name}
              description={recipe.description}
              imageUrl={recipe.image_url}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
