import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('synchub_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('synchub_token') || null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('synchub_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('synchub_user')
    }
    if (token) localStorage.setItem('synchub_token', token)
    else localStorage.removeItem('synchub_token')
  }, [user, token])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    if (res.token) {
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const register = async (payload) => {
    const res = await authService.register(payload)
    if (res.token) {
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

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

export const useAuth = () => useContext(AuthContext)
export default AuthContext
