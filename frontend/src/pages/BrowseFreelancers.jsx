import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import api from "../services/api"; // Updated path

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/users", {
          params: { role: "freelancer" },
        });
        setFreelancers(res.data || []);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
        setError(err.response?.data?.message || "Failed to fetch freelancers");
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, []);

  if (loading) return <div className="page-container">Loading freelancers...</div>;
  if (error) return <div className="page-container text-red-600">{error}</div>;

  return (
    <div className="page-container">
      <h2 className="text-2xl font-bold mb-4">Available Freelancers</h2>
      <div className="freelancer-grid grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {freelancers.length > 0 ? (
          freelancers.map((freelancer) => (
            <ProfileCard key={freelancer.id} user={freelancer} />
          ))
        ) : (
          <p>No freelancers found.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseFreelancers;
