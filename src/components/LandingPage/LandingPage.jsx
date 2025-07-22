import React from "react";
import "./LandingPage.css";
import LandingImg from "../../assets/Landing.png";

const LandingPage = ({ onNavigate }) => {
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
        </div>
        <div className="landing-right">
          <img
            src={LandingImg}
            alt="People illustration"
            className="landing-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 