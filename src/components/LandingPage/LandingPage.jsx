import React, { useState } from "react";
import "./LandingPage.css";
import LandingImg from "../../assets/Landing.png";
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";

const LandingPage = ({ onNavigate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleAuthClick = () => {
    if (currentUser) {
      // If user is logged in, navigate to profile
      onNavigate('profile');
    } else {
      // If user is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="landing-root">
      <div className="landing-content">
        <div className="landing-left">
          <h1 className="landing-title">
            YOUR NEXT SKILL IS ONE <br /> MATCH AWAY
          </h1>
          <p className="landing-subtitle">
            Make learning feel like meeting a friend. Match with people who share your interests, exchange skills, and grow together.
          </p>
          <div className="landing-actions">
            {currentUser ? (
              <button className="landing-btn primary" onClick={handleAuthClick}>
                View My Profile
              </button>
            ) : (
              <button className="landing-btn primary" onClick={handleAuthClick}>
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
        <div className="landing-right">
          <img
            src={LandingImg}
            alt="People illustration"
            className="landing-illustration"
          />
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage; 