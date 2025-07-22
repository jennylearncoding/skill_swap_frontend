import React from "react";
import "./Navigation.css";

const Navigation = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => onNavigate("landing")}>
          Skill Exchange
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
            onClick={() => onNavigate("landing")}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
            onClick={() => onNavigate("profile")}
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 