// Import React and our authentication hook
import React from "react";
// Import CSS file for styling the navigation bar
import "./Navigation.css";
// Import our custom hook to access user login info
import { useAuth } from "../../context/AuthContext";

// Navigation component - shows the top navigation bar on every page
// Props: currentPage (which page we're on), onNavigate (function to change pages)
const Navigation = ({ currentPage, onNavigate }) => {
  // Get current user info and logout function from our auth context
  const { currentUser, logout } = useAuth();

  // Function to handle when user clicks logout
  const handleLogout = () => {
    // Log out the user (clear their data)
    logout();
    // Navigate back to the landing page
    onNavigate("landing");
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* App logo/name on the left side */}
        <div className="nav-logo">
          SkillSwap AI
        </div>
        
        {/* Navigation buttons on the right side */}
        <div className="nav-links">
          {/* Home button - always visible */}
          <button 
            className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
            onClick={() => onNavigate("landing")}
          >
            Home
          </button>
          
          {/* These buttons only show if user is logged in */}
          {currentUser && (
            <>
              {/* Profile button - only for logged-in users */}
              <button 
                className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
                onClick={() => onNavigate("profile")}
              >
                Profile
              </button>
              
              {/* Match button - only for logged-in users */}
              <button 
                className={`nav-link ${currentPage === "matches" ? "active" : ""}`}
                onClick={() => onNavigate("matches")}
              >
                Match
              </button>
              
              {/* Logout button - only for logged-in users */}
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