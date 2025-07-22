import React, { useState } from "react";
import "./LandingPage.css";
import axios from "axios";
import { API_URL } from "../../App";

const LandingPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/signup" : "/login";
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password
      });

      if (response.data) {
        onLogin(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Skill Exchange App</h1>
        <p>Connect with others to learn and share skills</p>
        
        <div className="auth-form">
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
            </button>
          </form>
          
          <div className="auth-switch">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="switch-btn"
            >
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 