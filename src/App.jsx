import React, { useState } from "react";
import "./App.css";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import { AuthProvider } from "./context/AuthContext";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Main application component for Skill Exchange App
// Handles global state, navigation, and API integration
const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");

  // Render the current page based on navigation state
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "profile":
        return <ProfilePage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
};

export default App;