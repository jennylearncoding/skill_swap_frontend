import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ProfilePage from '../../components/ProfilePage/ProfilePage';
import { AuthProvider } from '../../context/AuthContext';

// Mock functions
const mockOnNavigate = jest.fn();

// Mock the AuthContext
const mockAuthContext = {
  currentUser: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  },
  login: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
};

// Mock the AuthContext hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContext,
}));

describe('ProfilePage Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile Display', () => {
    test('should display user profile information', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          userOffer: { skillName: 'JavaScript' },
          userWant: { skillName: 'Python' }
        }
      });

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    test('should show edit profile button for own profile', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          userOffer: { skillName: 'JavaScript' },
          userWant: { skillName: 'Python' }
        }
      });

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  describe('Profile Editing', () => {
    test('should allow editing profile information', async () => {
      // Mock successful API responses
      axios.get
        .mockResolvedValueOnce({
          data: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            userOffer: { skillName: 'JavaScript' },
            userWant: { skillName: 'Python' }
          }
        });

      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
          userOffer: { skillName: 'React' },
          userWant: { skillName: 'Node.js' }
        }
      });

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button
      const editButton = screen.getByText('Edit Profile');
      userEvent.click(editButton);

      // Should show edit form
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

      // Update skill to offer
      const skillOfferInput = screen.getByDisplayValue('JavaScript');
      userEvent.clear(skillOfferInput);
      userEvent.type(skillOfferInput, 'React');

      // Update skill to learn
      const skillLearnInput = screen.getByDisplayValue('Python');
      userEvent.clear(skillLearnInput);
      userEvent.type(skillLearnInput, 'Node.js');

      // Save changes
      const saveButton = screen.getByText('Save All Changes');
      userEvent.click(saveButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      });
    });

    test('should validate required fields when saving profile', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          userOffer: { skillName: 'JavaScript' },
          userWant: { skillName: 'Python' }
        }
      });

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button
      const editButton = screen.getByText('Edit Profile');
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

      const skillOfferInput = screen.getByDisplayValue('JavaScript');
      userEvent.clear(skillOfferInput);

      const skillLearnInput = screen.getByDisplayValue('Python');
      userEvent.clear(skillLearnInput);

      // Try to save
      const saveButton = screen.getByText('Save All Changes');
      userEvent.click(saveButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Skill to offer is required')).toBeInTheDocument();
        expect(screen.getByText('Skill to learn is required')).toBeInTheDocument();
      });
    });

    test('should validate email format', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          userOffer: { skillName: 'JavaScript' },
          userWant: { skillName: 'Python' }
        }
      });

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button
      const editButton = screen.getByText('Edit Profile');
      userEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      // Enter invalid email
      const emailInput = screen.getByDisplayValue('test@example.com');
      userEvent.clear(emailInput);
      userEvent.type(emailInput, 'invalid-email');

      // Try to save
      const saveButton = screen.getByText('Save All Changes');
      userEvent.click(saveButton);

      // Should show email validation error
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors when saving profile', async () => {
      // Suppress expected console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock successful load, failed save
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          userOffer: { skillName: 'JavaScript' },
          userWant: { skillName: 'Python' }
        }
      });

      axios.patch.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Click edit profile button
      const editButton = screen.getByText('Edit Profile');
      userEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      // Try to save
      const saveButton = screen.getByText('Save All Changes');
      userEvent.click(saveButton);

      await waitFor(() => {
        // The component should still be in edit mode or show an error message
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });

    test('should handle API errors when loading profile', async () => {
      // Suppress expected console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock failed API response
      axios.get.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} />
        </AuthProvider>
      );

      // Should fall back to currentUser data
      await waitFor(() => {
        expect(screen.getByText('testuser', { selector: '.profile-name' })).toBeInTheDocument();
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('Read-only Mode', () => {
    test('should display profile in read-only mode when viewing other user', async () => {
      const otherUser = {
        id: 2,
        username: 'otheruser',
        email: 'other@example.com',
        userOffer: { skillName: 'Python' },
        userWant: { skillName: 'JavaScript' }
      };

      render(
        <AuthProvider>
          <ProfilePage onNavigate={mockOnNavigate} user={otherUser} isReadOnly={true} />
        </AuthProvider>
      );

      // Should display other user's information
      expect(screen.getByText('otheruser', { selector: '.profile-name' })).toBeInTheDocument();
      expect(screen.getByText('other@example.com')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();

      // Should not show edit button in read-only mode
      expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    });
  });
}); 