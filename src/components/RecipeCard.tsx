interface RecipeCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  onRecipeClick?: (recipeId: string) => void
}

export const RecipeCard = ({ id, name, description, imageUrl, onRecipeClick }: RecipeCardProps) => {
  const handleClick = () => {
    if (onRecipeClick) {
      onRecipeClick(id)
    } else {
      window.location.href = `/recettes/${id}`
    }
  }

  return (
    <div
      onClick={handleClick}
      className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-102 cursor-pointer overflow-clip group"
    >
      {/* Image */}
      <div className="relative w-full h-40 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{description}</p>
      </div>
    </div>
  )
}
