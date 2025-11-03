import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJob, applyJob } from "../services/jobService";


export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  // Load job details on component mount
  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setError('');
      try {
        const res = await getJob(id);
        setJob(res.job || res); // depending on how jobService returns data
      } catch (err) {
        setError(err.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  // Apply for the job
  const handleApply = async () => {
    setApplying(true);
    setMessage('');
    setError('');
    try {
      const res = await applyJob(id);
      setMessage(res.message || 'Application submitted successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="mt-3">{job.description}</p>

      <div className="mt-4">
        <span className="px-2 py-1 bg-slate-100 rounded">{job.category || 'General'}</span>
        <span className="ml-3 font-bold">{job.budget ? `$${job.budget}` : 'No budget'}</span>
      </div>

      <div className="mt-6">
        <button
          onClick={handleApply}
          disabled={applying}
          className={`px-4 py-2 rounded text-white ${
            applying ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600'
          }`}
        >
          {applying ? 'Applying...' : 'Apply for Job'}
        </button>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
