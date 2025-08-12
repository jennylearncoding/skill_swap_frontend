// Import React and the useState hook for managing state
import React, { useState } from "react";
// Import CSS file for styling
import "./App.css";
// Import all the page components we'll use
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import MatchSuggestionsPage from "./components/MatchSuggestionsPage/MatchingSuggestions";
// Import our authentication context (for user login/logout)
import { AuthProvider, useAuth } from "./context/AuthContext";

// Set up the API URL - use environment variable or default to localhost
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Main application component for SkillSwap App
// This component handles which page to show and manages navigation
const AppContent = () => {
  // State to keep track of which page we're currently on
  const [currentPage, setCurrentPage] = useState("landing");
  // State to keep track of which user's profile we're viewing (for viewing other users)
  const [viewedUser, setViewedUser] = useState(null);
  // Get current user info and logout function from our auth context
  const { currentUser, logout } = useAuth();

  // Function to decide which page component to show based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        // Show the home page (landing page)
        return <LandingPage onNavigate={setCurrentPage} />;
      case "profile":
        // Show the user's own profile page
        return <ProfilePage onNavigate={setCurrentPage} />;
      case "matches":
        // Show the match suggestions page with user data
        return <MatchSuggestionsPage 
          onNavigate={setCurrentPage}
          user={currentUser}
          viewedUser={viewedUser}
          setViewedUser={setViewedUser}
        />;
      default:
        // If something goes wrong, show landing page
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  // Main app structure: navigation bar at top, page content below
  return (
    <div className="App">
      {/* Navigation bar that shows at the top of every page */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {/* The main page content that changes based on navigation */}
      {renderPage()}
    </div>
  );
};

// Root App component that wraps everything in the AuthProvider
// AuthProvider gives all child components access to user login/logout info
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;