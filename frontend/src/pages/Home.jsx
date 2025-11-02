import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Home(){
  return (
    <div>
      <Navbar />
      <header className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-sky-600">SyncHub</h1>
        <p className="mt-4 text-gray-700">Connect. Collaborate. Complete — small tasks done fast</p>
        <div className="mt-8 space-x-4">
          <Link to="/register" className="px-6 py-3 bg-sky-500 text-white rounded">Join Now</Link>
          <Link to="/login" className="px-6 py-3 border border-sky-500 text-sky-500 rounded">Login</Link>
        </div>
      </header>
    </div>
  )
}
