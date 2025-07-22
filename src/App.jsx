import React, { useState } from "react";
import "./App.css";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";

export const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// Main application component for Skill Exchange App
// Handles global state, navigation, and API integration
const App = () => {
  const [user, setUser] = useState({
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    pronouns: "they/them",
    bio: "I'm excited to learn and share skills!",
    skills_to_learn: ["Guitar", "Painting", "Cooking"],
    skills_to_offer: ["Python", "Photography", "Yoga"],
    location: "San Francisco, CA",
    availability: "Weekends",
    learning_style: "in-person",
    average_rating: 4.5,
    image_url: null
  });
  const [currentPage, setCurrentPage] = useState("landing");








  // Handle profile save: update user
  const handleProfileSave = (profileData) => {
    setUser(profileData);
  };



  // Render the current page based on user and navigation state
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "profile":
        return <ProfilePage user={user} onSave={handleProfileSave} />;
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

export default App;
