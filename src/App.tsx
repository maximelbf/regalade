import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { testApi } from './utils/testApi'
import HomePage from './pages/HomePage'
import LoginPage from './pages/login'
import FavoritePage from './pages/FavoritePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import { authService } from './services/authService'

// Rendre testApi disponible en console
declare global {
  function testApi(): Promise<void>
}
if (typeof window !== 'undefined') {
  (window as any).testApi = testApi
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated())

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/favorites" element={<FavoritePage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />} />
        <Route path="/recettes/:recetteId" element={<RecipeDetailPage isLoggedIn={isLoggedIn} onLoginToggle={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
