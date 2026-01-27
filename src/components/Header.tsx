import { useState } from 'react'

interface HeaderProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function Header({ isLoggedIn, onLoginToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality with API call to /search?q=...
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <header className="sticky top-0 z-100 w-full bg-white border-b-2 border-gray-100 shadow-sm">
      <div className="w-full px-8 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Gourmet
          </span>
        </div>

        {/* Search Bar */}
        <form 
          className="flex-1 max-w-2xl flex items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-2 transition-all focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-100" 
          onSubmit={handleSearch}
        >
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
          onClick={onLoginToggle}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  )
}
