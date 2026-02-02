import { RecipeCard } from './RecipeCard'
import { useGetFavorites } from '../hooks/useGetFavorites'
import Loader from './Loader'

export default function RecipesGrid() {
    const { favorites, loading, error } = useGetFavorites()

    if (loading) {
        return <Loader />
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error while loading favorites: {error.message}</p>
            </div>
        )
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No favorite recipes at the moment.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {favorites.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    name={recipe.name}
                    description={recipe.description || ''}
                    imageUrl={recipe.image_url}
                />
            ))}
        </div>
    )
}