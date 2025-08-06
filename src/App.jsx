import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Main application component for Skill Exchange App
// Handles global state, navigation, and API integration
const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("landing");
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Attempting to fetch user from:", `${API_URL}/profiles/52`);
        // For now, we'll use a demo user ID. In a real app, this would come from authentication
        const response = await axios.get(`${API_URL}/profiles/52`);
        console.log("User data received:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        console.error("API URL being used:", API_URL);
        console.error("Full error details:", error.response?.status, error.response?.statusText);
        // Fallback to demo data if backend is not available
        setUser({
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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);








  // Handle profile save: update user
  const handleProfileSave = (profileData) => {
    setUser(profileData);
  };



  // Render the current page based on user and navigation state
  const renderPage = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

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
