import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import FreelancerDashboard from '../pages/FreelancerDashboard'
import ClientDashboard from '../pages/ClientDashboard'
import PostJob from '../pages/PostJob'
import JobDetails from '../pages/JobDetails'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/freelancer" element={
        <ProtectedRoute>
          <FreelancerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/client" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
      <Route path="/job/:id" element={<ProtectedRoute><JobDetails/></ProtectedRoute>} />

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}
