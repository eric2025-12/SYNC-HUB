import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api"; // Updated import path

export default function ClientDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/jobs/list", { params: { status: "available" } });
        setJobs(res.data?.jobs || []); // Safe fallback
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <Link
            to="/post-job"
            className="px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
          >
            Post a Job
          </Link>
        </header>

        <section className="mt-6">
          <h2 className="font-semibold mb-2">Available Jobs</h2>

          {loading && <p>Loading jobs...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading &&
              !error &&
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-3 rounded shadow">
                  <h3 className="font-bold">{job.title}</h3>
                  <p className="text-sm">{job.description}</p>
                  {job.budget && <p className="mt-1 font-semibold">${job.budget}</p>}
                </div>
              ))}
            {!loading && !error && jobs.length === 0 && <p>No available jobs.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
