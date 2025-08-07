import React from "react";
import "./MatchCard.css";
import { API_URL } from "../../App";
// Enhanced avatar placeholder with better styling
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23grad)'/%3E%3Ccircle cx='50' cy='35' r='18' fill='white' opacity='0.9'/%3E%3Cpath d='M25 75 Q50 55 75 75' fill='white' opacity='0.9'/%3E%3C/svg%3E";

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
          alt={user.username || user.name || 'User'} 
          className="match-card-avatar" 
        />
    <div className="match-card-name">
      <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onViewProfile && onViewProfile(user)}>
        {user.username || user.name || 'Anonymous'}
      </span>
    </div>
    </div>
    <div className="match-card-info">
      <div>
        <b>Skill I offer:</b> {user.userOffer?.skillName || "Not specified"}
      </div>
      <div>
        <b>Wants to learn:</b> {user.userWant?.skillName || "Not specified"}
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