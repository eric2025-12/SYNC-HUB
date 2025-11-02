import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { listJobs } from '../services/jobService'
import JobCard from '../components/JobCard'
import { useAuth } from '../context/AuthContext'

export default function FreelancerDashboard(){
  const [jobs, setJobs] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      const res = await listJobs({ status: 'available' })
      setJobs(res.jobs || [])
    }
    load()
  }, [])

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Available Jobs</h1>
          <div>
            <span className="text-sm text-gray-600 mr-2">Logged in as {user?.name}</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {jobs.map(j => <JobCard key={j.id} job={j} />)}
        </section>
      </main>
    </div>
  )
}
