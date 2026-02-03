import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/Header'
import { RecipeCard } from '../components/RecipeCard'
import Loader from '../components/Loader'
import { useSearch } from '../hooks/useSearch'

interface SearchPageProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function SearchPage({ isLoggedIn, onLoginToggle }: SearchPageProps) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { results, loading, error, search } = useSearch()

  useEffect(() => {
    if (query) {
      search(query)
    }
  }, [query, search])

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />

      <main className="flex-grow w-full px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600 mb-8">{query && `Results for "${query}"`}</p>

          {loading && <Loader />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              <p className="font-semibold">Search Error</p>
              <p>{error.message}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No recipes found for "{query}". Try another search!
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  name={recipe.name}
                  description={recipe.description || ''}
                  imageUrl={recipe.image_url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
