// Mock data pour les tests
// Utilisez ces données dans vos tests pour éviter la duplication

export const mockRecipes = [
  {
    id: '1',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    ingredients: ['tomato', 'mozzarella', 'basil'],
    image_url: 'url',
  },
  {
    id: '2',
    name: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'],
    image_url: 'url',
  },
]

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
}

export const mockFavorites = [
  { id: '1', name: 'Recipe 1', cuisine: 'Italian', ingredients: [], image_url: 'url' },
  { id: '2', name: 'Recipe 2', cuisine: 'French', ingredients: [], image_url: 'url' },
]

export const mockRecipe = {
  id: '1',
  name: 'Spaghetti Carbonara',
  cuisine: 'Italian',
  ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'],
  image_url: 'url'
}

export const mockRecipe2 = {
  id: '3',
  name: 'New Recipe',
  cuisine: 'French',
  ingredients: ['dough', 'tomato', 'mozzarella'],
  image_url: 'url2'
}
