import React from "react";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <img
        src={user.profilePicture || "/default-avatar.png"}
        alt={user.name}
        className="profile-image"
      />
      <h3>{user.name}</h3>
      <p className="role">{user.role}</p>
      <p>{user.bio || "No bio provided."}</p>
      <p>Status: {user.isActive ? "🟢 Online" : "🔴 Offline"}</p>
      <button className="chat-btn">Message</button>
    </div>
  );
};

export default ProfileCard;
