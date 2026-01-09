import { useState } from 'react'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality with API call to /search?q=...
      console.log('Searching for:', searchQuery)
    }
  }

  const handleLogin = () => {
    // TODO: Navigate to login page or open login modal
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
              Gourmet
            </span>
          </div>

          {/* Search Bar */}
          <form className="flex-1 max-w-2xl flex items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-2 transition-all focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-100" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search recipes..."
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
            {isLoggedIn ? 'Logout' : 'Login'}
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
            Recipes
          </a>
          <a href="/healthy" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Healthy
          </a>
          <a href="/fast" className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5">
            Quick
          </a>
        </div>
      </nav>

      {/* Banner Section */}
      <section className="relative w-full h-96 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
        <img 
          src="https://via.placeholder.com/1200x400?text=Welcome+to+Gourmet" 
          alt="Welcome Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 flex flex-col items-center justify-center text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">Welcome to Gourmet</h1>
          <p className="text-xl drop-shadow-md font-light">Discover delicious recipes for every occasion</p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full px-8 py-12 mt-6">
        {/* TODO: Add featured recipes section here */}
      </main>
    </div>
  )
}

export default App
