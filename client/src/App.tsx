import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AccessDenied from './components/AccessDenied'
import ForgotPassword from './components/ForgotPassword'
import { getUser } from './lib/supabase'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...')
        const user = await getUser()
        console.log('User:', user)
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error('Auth error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const renderAuthContent = () => {
    console.log('Rendering auth content, isForgotPassword:', isForgotPassword)
    if (isForgotPassword) {
      return <ForgotPassword onBackToLogin={() => setIsForgotPassword(false)} />
    }

    return isLogin ? (
      <Login 
        onToggleAuth={() => setIsLogin(false)} 
        onForgotPassword={() => setIsForgotPassword(true)}
      />
    ) : (
      <Register onToggleAuth={() => setIsLogin(true)} />
    )
  }

  console.log('App render - isAuthenticated:', isAuthenticated)

  return (
    <Router basename="/Website">
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated === null ? (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : isAuthenticated ? (
              <Dashboard />
            ) : (
              <AccessDenied />
            )
          } 
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                {renderAuthContent()}
              </div>
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  )
}

export default App
