import React, { createContext, useState, useEffect } from "react";
import { listJobs } from "../services/jobService"; // Updated import

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await listJobs(params); // listJobs returns res.data from jobService
      setJobs(res || []); // fallback to empty array if res is undefined
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, fetchJobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};
