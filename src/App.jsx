import React, { useState } from "react";
import "./App.css";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import MatchSuggestionsPage from "./components/MatchSuggestionsPage/MatchingSuggestions";
import { AuthProvider, useAuth } from "./context/AuthContext";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Main application component for Skill Exchange App
// Handles global state, navigation, and API integration
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [viewedUser, setViewedUser] = useState(null);
  const { currentUser, logout } = useAuth();

  // Render the current page based on navigation state
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "profile":
        return <ProfilePage onNavigate={setCurrentPage} />;
      case "matches":
        return <MatchSuggestionsPage 
          onNavigate={setCurrentPage}
          user={currentUser}
          viewedUser={viewedUser}
          setViewedUser={setViewedUser}
        />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;