import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchSuggestionsPage from '../../components/MatchSuggestionsPage/MatchingSuggestions';
import { AuthProvider } from '../../context/AuthContext';

// Mock functions
const mockOnNavigate = jest.fn();
const mockOnChat = jest.fn();
const mockOnNavigateProfile = jest.fn();
const mockOnLogout = jest.fn();
const mockSetViewedUser = jest.fn();

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

describe('MatchingSuggestions Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Match Display', () => {
    test('should display matches when available', async () => {
      // Mock fetch responses
      global.fetch
        .mockResolvedValueOnce({
          json: async () => ({
            userWant: { skillName: 'Python' }
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({
            matches: [
              {
                user: {
                  id: 1,
                  username: 'user1',
                  email: 'user1@example.com',
                  userOffer: { skillName: 'JavaScript' },
                  userWant: { skillName: 'Python' },
                  average_rating: 4.5
                }
              },
              {
                user: {
                  id: 2,
                  username: 'user2',
                  email: 'user2@example.com',
                  userOffer: { skillName: 'React' },
                  userWant: { skillName: 'Node.js' },
                  average_rating: 4.0
                }
              }
            ],
            totalMatches: 2,
            availableFilterTags: ['JavaScript', 'React']
          })
        });

      render(
        <MatchSuggestionsPage
          onNavigate={mockOnNavigate}
          onChat={mockOnChat}
          onNavigateProfile={mockOnNavigateProfile}
          onLogout={mockOnLogout}
          user={{ id: 1 }}
          setViewedUser={mockSetViewedUser}
        />
      );

      // Should show loading initially
      expect(screen.getByText('Loading matches...')).toBeInTheDocument();

      // Wait for matches to load
      await waitFor(() => {
        expect(screen.getByText('Match Suggestions')).toBeInTheDocument();
      });

      // Should display match cards
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      
      // Check for skills in match cards - use getAllByText since there are multiple elements
      const javascriptElements = screen.getAllByText('JavaScript');
      const reactElements = screen.getAllByText('React');
      
      // Should have JavaScript in match card info (not just filter buttons)
      expect(javascriptElements.some(el => el.closest('.match-card-info'))).toBe(true);
      expect(reactElements.some(el => el.closest('.match-card-info'))).toBe(true);

      // Should show AI disclaimer
      expect(screen.getByText(/This app uses AI to suggest matches/i)).toBeInTheDocument();
    });

    test('should handle empty matches state', async () => {
      // Mock empty matches response
      global.fetch
        .mockResolvedValueOnce({
          json: async () => ({
            userWant: { skillName: 'Python' }
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({
            matches: [],
            totalMatches: 0,
            availableFilterTags: []
          })
        });

      render(
        <MatchSuggestionsPage
          onNavigate={mockOnNavigate}
          onChat={mockOnChat}
          onNavigateProfile={mockOnNavigateProfile}
          onLogout={mockOnLogout}
          user={{ id: 1 }}
          setViewedUser={mockSetViewedUser}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No matches found.')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('should handle chat button click', async () => {
      // Mock fetch responses
      global.fetch
        .mockResolvedValueOnce({
          json: async () => ({
            userWant: { skillName: 'Python' }
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({
            matches: [
              {
                user: {
                  id: 1,
                  username: 'user1',
                  email: 'user1@example.com',
                  userOffer: { skillName: 'JavaScript' },
                  userWant: { skillName: 'Python' },
                  average_rating: 4.5
                }
              }
            ],
            totalMatches: 1,
            availableFilterTags: ['JavaScript']
          })
        });

      render(
        <MatchSuggestionsPage
          onNavigate={mockOnNavigate}
          onChat={mockOnChat}
          onNavigateProfile={mockOnNavigateProfile}
          onLogout={mockOnLogout}
          user={{ id: 1 }}
          setViewedUser={mockSetViewedUser}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
      });

      // Click chat button
      const chatButton = screen.getByText('Chat');
      userEvent.click(chatButton);

      // Should show chat modal
      await waitFor(() => {
        expect(screen.getByText('Contact Your Learning Partner')).toBeInTheDocument();
      });
    });

    test('should handle profile view click', async () => {
      // Mock fetch responses
      global.fetch
        .mockResolvedValueOnce({
          json: async () => ({
            userWant: { skillName: 'Python' }
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({
            matches: [
              {
                user: {
                  id: 1,
                  username: 'user1',
                  email: 'user1@example.com',
                  userOffer: { skillName: 'JavaScript' },
                  userWant: { skillName: 'Python' },
                  average_rating: 4.5
                }
              }
            ],
            totalMatches: 1,
            availableFilterTags: ['JavaScript']
          })
        });

      render(
        <MatchSuggestionsPage
          onNavigate={mockOnNavigate}
          onChat={mockOnChat}
          onNavigateProfile={mockOnNavigateProfile}
          onLogout={mockOnLogout}
          user={{ id: 1 }}
          setViewedUser={mockSetViewedUser}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
      });

      // Click on username to view profile
      const usernameLink = screen.getByText('user1');
      userEvent.click(usernameLink);

      // Should call setViewedUser with the user
      expect(mockSetViewedUser).toHaveBeenCalledWith({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        userOffer: { skillName: 'JavaScript' },
        userWant: { skillName: 'Python' },
        average_rating: 4.5
      });
    });
  });

  describe('Profile View Mode', () => {
    test('should display user profile when viewedUser is set', async () => {
      const viewedUser = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        userOffer: { skillName: 'JavaScript' },
        userWant: { skillName: 'Python' },
        average_rating: 4.5
      };

      render(
        <AuthProvider>
          <MatchSuggestionsPage
            onNavigate={mockOnNavigate}
            onChat={mockOnChat}
            onNavigateProfile={mockOnNavigateProfile}
            onLogout={mockOnLogout}
            viewedUser={viewedUser}
            setViewedUser={mockSetViewedUser}
          />
        </AuthProvider>
      );

      // When viewedUser is set, the component should render ProfilePage
      // Wait for the profile to load
      await waitFor(() => {
        // Should show back button
        expect(screen.getByText('← Back to Matches')).toBeInTheDocument();
        
        // Should show profile content
        expect(screen.getByText('user1', { selector: '.profile-name' })).toBeInTheDocument();
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
      });

      // Should not show matches content
      expect(screen.queryByText('Match Suggestions')).not.toBeInTheDocument();
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      // Suppress expected console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock failed API response
      global.fetch.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <MatchSuggestionsPage
            onNavigate={mockOnNavigate}
            onChat={mockOnChat}
            onNavigateProfile={mockOnNavigateProfile}
            onLogout={mockOnLogout}
            user={{ id: 1 }}
            setViewedUser={mockSetViewedUser}
          />
        </AuthProvider>
      );

      // Should show loading state initially
      expect(screen.getByText('Loading matches...')).toBeInTheDocument();

      // Should handle error gracefully
      await waitFor(() => {
        expect(screen.getByText('No matches found.')).toBeInTheDocument();
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });

    test('should handle missing user data', async () => {
      render(
        <AuthProvider>
          <MatchSuggestionsPage
            onNavigate={mockOnNavigate}
            onChat={mockOnChat}
            onNavigateProfile={mockOnNavigateProfile}
            onLogout={mockOnLogout}
            setViewedUser={mockSetViewedUser}
          />
        </AuthProvider>
      );

      // Should show no matches when no user
      await waitFor(() => {
        expect(screen.getByText('No matches found.')).toBeInTheDocument();
      });

      // Fetch should not be called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
}); 