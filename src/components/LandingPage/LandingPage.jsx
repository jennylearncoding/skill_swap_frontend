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
      
      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2 className="how-it-works-title">HOW IT WORKS</h2>
        <div className="how-it-works-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Edit Your Profile</h3>
              <p>Add the skill you want to learn and the skill you can offer to others</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Explore Match Cards</h3>
              <p>Our AI will help find skills you might be interested in and suggest compatible learning partners</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Find Learning Partner</h3>
              <p>Browse through personalized match suggestions and find your ideal learning partner</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Contact Your Partner</h3>
              <p>Reach out via email to discuss your learning goals and schedule (chat feature coming soon!)</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Plan & Learn Together</h3>
              <p>Agree on a time and format for your skill exchange session</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">6</div>
            <div className="step-content">
              <h3>Rate Each Other</h3>
              <p>After your session, rate your learning partner (rating system coming soon!)</p>
            </div>
          </div>
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