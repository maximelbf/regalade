import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/login'
import FavoritePage from './pages/FavoritePage'
import SearchPage from './pages/SearchPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import { authService } from './services/authService'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated())

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />}
        />
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route
          path="/search"
          element={<SearchPage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />}
        />
        <Route
          path="/favorites"
          element={<FavoritePage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />}
        />
        <Route
          path="/recettes/:recetteId"
          element={<RecipeDetailPage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
