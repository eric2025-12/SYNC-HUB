import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getJob, applyJob } from '../services/jobService'

export default function JobDetails(){
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load(){
      const res = await getJob(id)
      setJob(res.job)
    }
    load()
  }, [id])

  const apply = async () => {
    try {
      const res = await applyJob(id)
      setMessage(res.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  if (!job) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="mt-3">{job.description}</p>
      <div className="mt-4">
        <span className="px-2 py-1 bg-slate-100 rounded">{job.category || 'General'}</span>
        <span className="ml-3 font-bold">{job.budget ? `$${job.budget}` : 'No budget'}</span>
      </div>
      <div className="mt-6">
        <button onClick={apply} className="px-4 py-2 bg-sky-600 text-white rounded">Apply for Job</button>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  )
}
