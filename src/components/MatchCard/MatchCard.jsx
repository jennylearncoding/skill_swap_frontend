import React from "react";
import "./MatchCard.css";
import { API_URL } from "../../App";
// Default avatar placeholder - using a data URL for a simple placeholder
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20 80 Q50 60 80 80' fill='%23bdbdbd'/%3E%3C/svg%3E";

const MatchCard = ({ user, onChat, onViewProfile }) => {
  const getImageUrl = () => {
    if (!user.image_url) {
      return DEFAULT_AVATAR;
    }
    if (user.image_url.startsWith('http')) {
      return user.image_url;
    }
    return `${API_URL}${user.image_url}`;
  };

  return (
  <div className="match-card">
      <div className="match-card-header">
        <img 
          src={getImageUrl()} 
          alt={user.name} 
          className="match-card-avatar" 
        />
    <div className="match-card-name">
      <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onViewProfile && onViewProfile(user)}>{user.name}</span>
        </div>
    </div>
    <div className="match-card-info">
      <div>
        <b>Skill I offer:</b> {(user.skills_to_offer || []).join(", ")}
      </div>
      <div>
        <b>Wants to learn:</b> {(user.skills_to_learn || []).join(", ")}
      </div>
    </div>
    <div className="match-card-rating">
      {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.round(user.average_rating || 0) ? "star filled" : "star"}>★</span>
      ))}
    </div>
    <button className="chat-btn" onClick={() => onChat(user)}>Chat</button>
  </div>
);
};

export default MatchCard;