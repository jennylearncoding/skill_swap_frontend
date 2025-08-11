import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../../App';

// Mock the AuthContext
const mockAuthContext = {
  currentUser: null,
  login: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
};

// Mock the AuthContext hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContext,
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation Flow', () => {
    test('should navigate between landing page and profile page', async () => {
      // Mock authenticated user for navigation test
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Should start on landing page
      expect(screen.getByText(/Skill Exchange/i)).toBeInTheDocument();
      expect(screen.getByText(/Home/i)).toBeInTheDocument();

      // Navigate to profile page using the navigation button
      const profileButton = screen.getByText('Profile', { selector: '.nav-link' });
      userEvent.click(profileButton);

      // Should show profile page content
      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });
    });

    test('should navigate to matches page', async () => {
      // Mock authenticated user for navigation test
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Navigate to matches page using the navigation button
      const matchButton = screen.getByText('Match', { selector: '.nav-link' });
      userEvent.click(matchButton);

      // Should show matches page content
      await waitFor(() => {
        expect(screen.getByText(/Match Suggestions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    test('should show login modal when trying to access protected features', async () => {
      // Reset to no user
      mockAuthContext.currentUser = null;
      
      render(<App />);

      // Profile and Match buttons should not be visible when not logged in
      expect(screen.queryByText('Profile', { selector: '.nav-link' })).not.toBeInTheDocument();
      expect(screen.queryByText('Match', { selector: '.nav-link' })).not.toBeInTheDocument();

      // Should show landing page with login button
      expect(screen.getByText(/Login \/ Sign Up/i)).toBeInTheDocument();
    });

    test('should handle authenticated user flow', async () => {
      // Mock authenticated user
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Profile and Match buttons should be visible when logged in
      expect(screen.getByText('Profile', { selector: '.nav-link' })).toBeInTheDocument();
      expect(screen.getByText('Match', { selector: '.nav-link' })).toBeInTheDocument();

      // Navigate to profile page
      const profileButton = screen.getByText('Profile', { selector: '.nav-link' });
      userEvent.click(profileButton);

      // Should show user profile - use more specific selector
      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });
    });
  });

  describe('Profile Management Flow', () => {
    test('should allow editing profile information', async () => {
      // Mock authenticated user
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      // Mock successful API response
      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
          userOffer: { skillName: 'React' },
          userWant: { skillName: 'Node.js' }
        }
      });

      render(<App />);

      // Navigate to profile page
      const profileButton = screen.getByText('Profile', { selector: '.nav-link' });
      userEvent.click(profileButton);

      // Wait for profile to load - use more specific selector
      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button
      const editButton = screen.getByText(/Edit Profile/i);
      userEvent.click(editButton);

      // Should show edit form with empty inputs (since no default data)
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      });

      // Update username
      const usernameInput = screen.getByDisplayValue('testuser');
      userEvent.clear(usernameInput);
      userEvent.type(usernameInput, 'updateduser');

      // Update email
      const emailInput = screen.getByDisplayValue('test@example.com');
      userEvent.clear(emailInput);
      userEvent.type(emailInput, 'updated@example.com');

      // Update skill to offer (input should be empty initially)
      const skillOfferInput = screen.getByPlaceholderText('Enter skill you can offer');
      userEvent.type(skillOfferInput, 'React');

      // Update skill to learn (input should be empty initially)
      const skillLearnInput = screen.getByPlaceholderText('Enter skill you want to learn');
      userEvent.type(skillLearnInput, 'Node.js');

      // Save changes
      const saveButton = screen.getByText(/Save All Changes/i);
      userEvent.click(saveButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      });
    });

    test('should validate required fields when saving profile', async () => {
      // Mock authenticated user
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Navigate to profile page
      const profileButton = screen.getByText('Profile', { selector: '.nav-link' });
      userEvent.click(profileButton);

      // Wait for profile to load - use more specific selector
      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button to enter edit mode
      const editButton = screen.getByText(/Edit Profile/i);
      userEvent.click(editButton);

      // Wait for edit form to appear
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      // Clear required fields
      const usernameInput = screen.getByDisplayValue('testuser');
      userEvent.clear(usernameInput);

      const emailInput = screen.getByDisplayValue('test@example.com');
      userEvent.clear(emailInput);

      const skillOfferInput = screen.getByPlaceholderText('Enter skill you can offer');
      userEvent.clear(skillOfferInput);

      const skillLearnInput = screen.getByPlaceholderText('Enter skill you want to learn');
      userEvent.clear(skillLearnInput);

      // Try to save
      const saveButton = screen.getByText(/Save All Changes/i);
      userEvent.click(saveButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Skill to offer is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Skill to learn is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Matching Flow', () => {
    test('should display matches when available', async () => {
      // Mock authenticated user
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Navigate to matches page
      const matchButton = screen.getByText('Match', { selector: '.nav-link' });
      userEvent.click(matchButton);

      // Should show matches
      await waitFor(() => {
        expect(screen.getByText(/Match Suggestions/i)).toBeInTheDocument();
      });

      // Should show AI disclaimer
      expect(screen.getByText(/This app uses AI to suggest matches/i)).toBeInTheDocument();
    });

    test('should handle empty matches state', async () => {
      // Mock authenticated user
      mockAuthContext.currentUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(<App />);

      // Navigate to matches page
      const matchButton = screen.getByText('Match', { selector: '.nav-link' });
      userEvent.click(matchButton);

      // Should show no matches message
      await waitFor(() => {
        expect(screen.getByText(/No matches found/i)).toBeInTheDocument();
      });
    });
  });
}); 