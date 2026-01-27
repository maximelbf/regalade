import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
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

  return {
    isLoggedIn,
    handleLogin,
  }
}
