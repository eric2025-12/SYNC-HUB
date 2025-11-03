import React, { createContext, useContext, useState, useEffect } from 'react'
// ✅ Make sure this file exists: frontend/src/services/authService.js
import * as authService from "../services/authService";



const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Load user from localStorage on initial render
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('synchub_user')
    return raw ? JSON.parse(raw) : null
  })

  // Load token from localStorage on initial render
  const [token, setToken] = useState(() => localStorage.getItem('synchub_token') || null)

  // Persist user and token to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('synchub_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('synchub_user')
    }

    if (token) {
      localStorage.setItem('synchub_token', token)
    } else {
      localStorage.removeItem('synchub_token')
    }
  }, [user, token])

  // Login function
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      if (res?.token) {
        setToken(res.token)
        setUser(res.user)
      }
      return res
    } catch (error) {
      console.error('Login error:', error)
      return { error: error.message || 'Login failed' }
    }
  }

  // Register function
  const register = async (payload) => {
    try {
      const res = await authService.register(payload)
      if (res?.token) {
        setToken(res.token)
        setUser(res.user)
      }
      return res
    } catch (error) {
      console.error('Register error:', error)
      return { error: error.message || 'Registration failed' }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext)

export default AuthContext
 