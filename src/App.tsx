import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './hooks/useAuth'
import './App.css'

function AppContent() {
  const { isLoggedIn, handleLogin, login } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLoginToggle={handleLogin} />} />
      <Route path="/login" element={<LoginPage onLogin={login} />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
