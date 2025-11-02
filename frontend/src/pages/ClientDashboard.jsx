import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ClientDashboard(){
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    async function load() {
      // Load jobs posted by this client
      const res = await api.get('/jobs/list', { params: { status: 'available' } })
      setJobs(res.data.jobs || [])
    }
    load()
  }, [])

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <Link to="/post-job" className="px-3 py-2 bg-sky-600 text-white rounded">Post a Job</Link>
        </header>
        <section className="mt-6">
          <h2 className="font-semibold mb-2">Available jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(j => (
              <div key={j.id} className="bg-white p-3 rounded shadow">
                <h3 className="font-bold">{j.title}</h3>
                <p className="text-sm">{j.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
