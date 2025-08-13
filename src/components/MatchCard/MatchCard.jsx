import React from "react";
import "./MatchCard.css";
import { API_URL } from "../../App";
import userPlaceholder from "../../assets/user.png";

const MatchCard = ({ user, onChat, onViewProfile, rankType }) => {
  const getImageUrl = () => {
    if (!user.image_url) {
      return userPlaceholder;
    }
    if (user.image_url.startsWith('http')) {
      return user.image_url;
    }
    return `${API_URL}${user.image_url}`;
  };

  return (
  <div className={`match-card ${rankType === 'Perfect Match' ? 'perfect-match' : ''}`}>
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
      {rankType && (
        <div className="match-card-rank-type">
          {rankType}
        </div>
      )}
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