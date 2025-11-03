import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listJobs } from "../services/jobService"; // Updated path
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

export default function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await listJobs({ status: "available" });
        setJobs(res?.jobs || []); // Safe fallback
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
          <h1 className="text-2xl font-bold">Available Jobs</h1>
          <div>
            <span className="text-sm text-gray-600 mr-2">
              Logged in as {user?.name || "Guest"}
            </span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {loading && <p>Loading jobs...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && jobs.length === 0 && <p>No available jobs.</p>}
          {!loading &&
            !error &&
            jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </section>
      </main>
    </div>
  );
}
