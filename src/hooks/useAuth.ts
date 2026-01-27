import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier si un token existe au chargement
    setIsLoggedIn(authService.isAuthenticated())
  }, [])

  const logout = async () => {
    await authService.logout()
    setIsLoggedIn(false)
    navigate('/')
  }

  const handleLogin = () => {
    if (isLoggedIn) {
      logout()
    } else {
      navigate('/login')
    }
  }

  const login = () => {
    setIsLoggedIn(true)
  }

  return {
    isLoggedIn,
    handleLogin,
    login,
    logout,
  }
}
