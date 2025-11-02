import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import api from "../services/api";

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await api.get("/users?role=freelancer");
        setFreelancers(res.data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };
    fetchFreelancers();
  }, []);

  return (
    <div className="page-container">
      <h2>Available Freelancers</h2>
      <div className="freelancer-grid">
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
