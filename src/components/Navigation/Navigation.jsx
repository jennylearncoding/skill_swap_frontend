import React from "react";
import "./Navigation.css";
import { useAuth } from "../../context/AuthContext";

const Navigation = ({ currentPage, onNavigate }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate("landing");
  };

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
          {currentUser && (
            <>
              <button 
                className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
                onClick={() => onNavigate("profile")}
              >
                Profile
              </button>
              <button 
                className={`nav-link ${currentPage === "matches" ? "active" : ""}`}
                onClick={() => onNavigate("matches")}
              >
                Match
              </button>
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 