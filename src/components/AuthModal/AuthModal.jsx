import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../context/AuthContext';

// AuthModal component - shows login/signup form in a popup modal
// Props: isOpen (whether to show the modal), onClose (function to close modal)
const AuthModal = ({ isOpen, onClose }) => {
  // State to track if we're in login mode (true) or signup mode (false)
  const [isLogin, setIsLogin] = useState(true);
  // State to store the form data (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // State to store any error messages to show to user
  const [error, setError] = useState('');
  // State to track if we're currently processing login/signup
  const [loading, setLoading] = useState(false);
  
  // Get login and signup functions from our auth context
  const { login, signup } = useAuth();

  // Function to handle when user types in the form fields
  const handleChange = (e) => {
    const newFormData = {
      email: formData.email,
      password: formData.password
    };
    // Update the field that the user typed in
    newFormData[e.target.name] = e.target.value;
    // Save the updated form data
    setFormData(newFormData);
    // Clear any error messages when user starts typing
    setError('');
  };

  // Function to handle when user submits the form (clicks login/signup button)
  const handleSubmit = async (e) => {
    // Prevent the form from doing its default behavior (refreshing the page)
    e.preventDefault();
    // Show loading state
    setLoading(true);
    // Clear any previous error messages
    setError('');

    // Check if user filled in all required fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      let result;
      // Call the appropriate function based on whether we're in login or signup mode
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password);
      }

      // If login/signup was successful
      if (result.success) {
        // Close the modal
        onClose();
        // Clear the form data
        const emptyForm = {
          email: '',
          password: ''
        };
        setFormData(emptyForm);
      } else {
        // Show error message from the server
        setError(result.error);
      }
    } catch (err) {
      // Show generic error if something unexpected happened
      setError('An unexpected error occurred');
    } finally {
      // Always stop the loading state, whether success or failure
      setLoading(false);
    }
  };

  // Function to switch between login and signup modes
  const toggleMode = () => {
    // Switch from login to signup or vice versa
    setIsLogin(!isLogin);
    // Clear any error messages
    setError('');
    // Clear the form data
    const emptyForm = {
      email: '',
      password: ''
    };
    setFormData(emptyForm);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Join SkillSwap'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create your account to start learning'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} className="auth-toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;