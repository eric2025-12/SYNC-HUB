import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { postJob } from "../services/jobService";

import { useNavigate } from 'react-router-dom'

export default function PostJob(){
  const [form, setForm] = useState({ title: '', description: '', category: '', budget: '' })
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        budget: parseFloat(form.budget || 0)
      }
      await postJob(payload)
      nav('/client')
    } catch (err) {
      setError(err.response?.data?.message || String(err))
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded mt-8">
        <h2 className="text-xl font-bold mb-4">Post a Job</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded"/>
          <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded"/>
          <input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} placeholder="Category" className="w-full p-2 border rounded"/>
          <input value={form.budget} onChange={e=>setForm({...form, budget: e.target.value})} placeholder="Budget (USD)" className="w-full p-2 border rounded" />
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Post Job</button>
        </form>
      </div>
    </div>
  )
}
