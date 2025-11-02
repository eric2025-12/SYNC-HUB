import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-sky-600">SyncHub</Link>
      <div className="space-x-4">
        {!user && <>
          <Link to="/login" className="px-4 py-2 bg-sky-500 text-white rounded">Login</Link>
        </>}
        {user && <>
          {user.role === 'developer' && <Link to="/freelancer" className="px-4 py-2">Dashboard</Link>}
          {user.role === 'client' && <Link to="/client" className="px-4 py-2">Dashboard</Link>}
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </>}
      </div>
    </nav>
  )
}
