// Import React hooks and axios for making API calls
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set up the API URL for making requests to our backend
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Create a React Context for sharing user login info across the app
// This is like a global storage that any component can access
const AuthContext = createContext();

// Custom hook to use the auth context - makes it easier to access user data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main AuthProvider component that wraps the app and provides user login state
export const AuthProvider = ({ children }) => {
  // State to store the current logged-in user (null if not logged in)
  const [currentUser, setCurrentUser] = useState(null);
  // State to track if we're still loading user data from localStorage
  const [loading, setLoading] = useState(true);

  // This runs when the app first loads
  useEffect(() => {
    // Check if user is already logged in (stored in browser's localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      // If we find saved user data, convert it back to an object and set it
      setCurrentUser(JSON.parse(savedUser));
    }
    // Mark loading as done
    setLoading(false);
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      // Send login request to our backend API
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      // Handle new login response format (no nested user object)
      if (response.data.id) {
        // Create user data object from the response
        const userData = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          hasProfile: response.data.hasProfile
        };
        // Save user data in our app state
        setCurrentUser(userData);
        // Also save in browser's localStorage so user stays logged in
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return { success: true };
      }
      // Fallback for old format
      /*
      else if (response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return { success: true };
      }
      */
    } catch (error) {
      // If login fails, log the error and return failure message
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Function to handle user signup/registration
  const signup = async (email, password) => {
    try {
      // Send signup request to our backend API
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password
      });
      
      // Handle register response format
      if (response.data.id) {
        // Create user data object from the response
        const userData = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          hasProfile: false // New users don't have profiles yet
        };
        // Save user data in our app state
        setCurrentUser(userData);
        // Also save in browser's localStorage so user stays logged in
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      // If signup fails, log the error and return failure message
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      };
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Clear user data from app state
    setCurrentUser(null);
    // Remove user data from browser's localStorage
    localStorage.removeItem('currentUser');
  };

  // Function to update user data (used when user edits their profile)
  const updateUser = (userData) => {
    // Update user data in app state
    setCurrentUser(userData);
    // Also update in browser's localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // Create the value object that will be shared with all child components
  const value = {
    currentUser,    // The current logged-in user (or null)
    login,          // Function to log in
    signup,         // Function to sign up
    logout,         // Function to log out
    updateUser,     // Function to update user data
    loading         // Whether we're still loading user data
  };

  // Provide the auth context to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};