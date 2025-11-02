import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' })
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await register(form)
      if (res.token) {
        if (res.user.role === 'developer') nav('/freelancer')
        else nav('/client')
      }
    } catch (err) {
      setError(err.response?.data?.message || String(err))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Create account</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Full name" className="w-full p-2 border rounded"/>
        <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded"/>
        <input value={form.password} onChange={e=>setForm({...form, password: e.target.value})} placeholder="Password" type="password" className="w-full p-2 border rounded"/>
        <select value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full p-2 border rounded">
          <option value="developer">Freelancer / Developer</option>
          <option value="client">Client</option>
        </select>
        <button className="w-full p-2 bg-sky-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}
