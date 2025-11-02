import React from 'react'
import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-semibold text-lg">{job.title}</h3>
      <p className="text-sm text-gray-600 truncate">{job.description}</p>
      <div className="flex justify-between items-center mt-3">
        <div>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded">{job.category || 'General'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{job.budget ? `$${job.budget}` : 'No budget'}</span>
          <Link to={`/job/${job.id}`} className="px-3 py-1 bg-sky-500 text-white rounded text-sm">View</Link>
        </div>
      </div>
    </div>
  )
}
