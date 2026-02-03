import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { config } from '../config/api'

interface HeaderProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function Header({ isLoggedIn, onLoginToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      setSearchQuery('')
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleLoginClick = () => {
    if (isLoggedIn) {
      onLoginToggle()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-100 w-full bg-[#FFFDF7] border-b-2 border-gray-100 shadow-sm">
      <div className="w-full px-8 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent"
          >
            {config.app.name}
          </Link>
        </div>

        {/* Search Bar */}
        <form
          className="flex-1 max-w-2xl flex items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-4 py-2 transition-all focus-within:border-red-500 focus-within:shadow-lg focus-within:shadow-red-100"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="text-xl transition-transform hover:scale-110">
            🔍
          </button>
        </form>

        {/* Favorites Link and Login Button */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <Link to="/favorites" className="text-gray-600 hover:text-gray-800 transition-colors">
              Favorites
            </Link>
          )}

          <button
            className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold transition-all ${
              isLoggedIn ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-500 hover:bg-red-600'
            } text-white hover:shadow-lg hover:-translate-y-0.5 hover:cursor-pointer`}
            onClick={handleLoginClick}
          >
            {isLoggedIn ? 'Log out' : 'Log in'}
          </button>
        </div>
      </div>
    </header>
  )
}
