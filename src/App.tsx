import { useState } from 'react'
import './App.css'
import { config, fetchApi } from './config/api'
import { RecipesScrollbar } from './components/RecipesScrollbar'
import { testApi } from './utils/testApi'

// Rendre testApi disponible en console
declare global {
  function testApi(): Promise<void>
}
if (typeof window !== 'undefined') {
  (window as any).testApi = testApi
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchApi(`${config.api.endpoints.search}?q=${encodeURIComponent(searchQuery)}`)
        .then((results) => {
          console.log('Résultats de recherche:', results)
        })
        .catch((err) => {
          console.error('Erreur lors de la recherche:', err)
        })
    }
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Header with Logo, Search Bar, and Login Button */}
      <header className="sticky top-0 z-100 w-full bg-white border-b-2 border-gray-100 shadow-sm">
        <div className="w-full px-8 py-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {config.app.name}
            </span>
          </div>

          {/* Search Bar */}
          <form className="flex-1 max-w-2xl flex items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-2 transition-all focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-100" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Chercher des recettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
            <button type="submit" className="text-xl transition-transform hover:scale-110">
              🔍
            </button>
          </form>

          {/* Login Button */}
          <button 
            className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold transition-all ${
              isLoggedIn 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white hover:shadow-lg hover:-translate-y-0.5`}
            onClick={handleLogin}
          >
            {isLoggedIn ? 'Déconnexion' : 'Connexion'}
          </button>
        </div>
      </header>

      {/* Navigation with Categories */}
      <nav className="sticky top-16 z-99 w-full bg-white border-b border-gray-100">
        <div className="w-full px-8 py-4 flex gap-12 items-center">
          <a href="/planner" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Planner
          </a>
          <a href="/recipes" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Recettes
          </a>
          <a href="/healthy" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Sain
          </a>
          <a href="/fast" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Rapide
          </a>
        </div>
      </nav>

      {/* Banner Section */}
      <section className="relative w-full h-96 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
        <img 
          src="https://via.placeholder.com/1200x400?text=Bienvenue+chez+Gourmet" 
          alt="Bannière de bienvenue" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 flex flex-col items-center justify-center text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">Bienvenue à {config.app.name}</h1>
          <p className="text-xl drop-shadow-md font-light">Découvrez des recettes délicieuses pour chaque occasion</p>
        </div>
      </section>

      {/* Recipes Scrollbar Section */}
      <RecipesScrollbar />

      {/* Main Content Area */}
      <main className="w-full px-8 py-12 mt-6">
        {config.features.adminPanel && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Panneau admin activé. URL de base API: <code className="bg-blue-100 px-2 py-1 rounded">{config.api.baseUrl}</code></p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
