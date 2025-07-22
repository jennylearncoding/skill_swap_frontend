import React, { useState } from "react";
import "./App.css";
import ProfilePage from "./components/ProfilePage/ProfilePage";

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








  // Handle profile save: update user
  const handleProfileSave = (profileData) => {
    setUser(profileData);
  };



  // Render the current page based on user and navigation state
  const renderPage = () => {
    return (
      <ProfilePage
        user={user}
        onSave={handleProfileSave}
      />
    );
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
};

export default App;
