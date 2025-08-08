import React, { useState, useEffect } from "react";
import "./MatchingSuggestions.css";
import MatchCard from "../MatchCard/MatchCard";
import ProfilePage from "../ProfilePage/ProfilePage";
import { API_URL } from "../../App";

const CARDS_PER_VIEW = 3;

const MatchSuggestionsPage = ({
  onChat,
  onNavigateProfile,
  onNavigate,
  user,
  viewedUser,
  setViewedUser,
  onLogout,
}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIdx, setStartIdx] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [availableFilterTags, setAvailableFilterTags] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [userWantSkill, setUserWantSkill] = useState("");
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      
      // Fetch user profile to get skills (since login no longer returns skills)
      const fetchUserProfileAndMatches = async () => {
        try {
          // First, get user's full profile to access skills
          const profileResponse = await fetch(`${API_URL}/profiles/${user.id}`);
          const userProfile = await profileResponse.json();
          
          // Set user's want skill for display
          if (userProfile.userWant?.skillName) {
            setUserWantSkill(userProfile.userWant.skillName);
          }
          
          // Then fetch matches
          const matchesResponse = await fetch(`${API_URL}/matches/${user.id}`);
          const data = await matchesResponse.json();
          
          // Backend returns matches as array of objects with user, rankType, relevanceScore
          const matchedUsers = (data.matches || []).map(match => match.user);
          console.log('Raw matches from backend:', matchedUsers.length);
          console.log('Matches data:', matchedUsers);
          setMatches(matchedUsers);
          setTotalMatches(data.totalMatches || 0);
          const filterTags = data.availableFilterTags || [];
          console.log('Available filter tags:', filterTags);
          setAvailableFilterTags(filterTags);
          // Initialize with all filters selected to show all matches by default
          setActiveFilters(filterTags);
          
        } catch (error) {
          console.error("Error fetching user profile or matches:", error);
          setMatches([]);
          setTotalMatches(0);
          setAvailableFilterTags([]);
          setActiveFilters([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfileAndMatches();
    } else {
      // If no user, set empty state
      setMatches([]);
      setTotalMatches(0);
      setAvailableFilterTags([]);
      setActiveFilters([]);
      setLoading(false);
    }
  }, [user]);

  // Removed console.log for better performance

  // Filter logic
  const toggleFilter = (tag) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setStartIdx(0); // Reset to first page when filtering
  };

  // Apply active filters to matches (show users whose skills match ANY active filter)
  const filteredMatches = activeFilters.length === 0 
    ? matches // If no filters selected, show all matches
    : activeFilters.length === availableFilterTags.length
    ? matches // If all filters selected, show all matches (optimization)
    : matches.filter(user => {
        const userOfferTags = user.userOffer?.tags || [];
        const userWantTags = user.userWant?.tags || [];
        const allUserTags = [...userOfferTags, ...userWantTags];
        console.log(`User ${user.username || user.id} tags:`, allUserTags);
        console.log('Active filters:', activeFilters);
        const hasMatch = activeFilters.some(filter => allUserTags.includes(filter));
        console.log(`User ${user.username || user.id} matches filters:`, hasMatch);
        return hasMatch;
      });

  console.log(`Filtered matches: ${filteredMatches.length} out of ${matches.length}`);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - CARDS_PER_VIEW, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      Math.min(prev + CARDS_PER_VIEW, (filteredMatches || []).length - CARDS_PER_VIEW)
    );
  };

  const visibleMatches = (filteredMatches || []).slice(startIdx, startIdx + CARDS_PER_VIEW);

  if (loading) {
    return <div className="match-bg"><div>Loading matches...</div></div>;
  }

  if (viewedUser) {
    return (
      <div className="match-bg">
        <button
          onClick={() => setViewedUser(null)}
          className="back-to-matches-btn"
        >
          &larr; Back to Matches
        </button>
        <ProfilePage user={viewedUser} isReadOnly={true} onNavigate={onNavigate} />
      </div>
    );
  }

  // Chat Card Component
  const ChatCard = ({ user, onClose }) => (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-card" onClick={(e) => e.stopPropagation()}>
        <button className="chat-close-btn" onClick={onClose}>×</button>
        <div className="chat-header">
          <h3>Contact {user.username || user.name || 'User'}</h3>
        </div>
        <div className="chat-content">
          <div className="chat-email">
            <strong>Email:</strong> {user.email || 'Email not available'}
          </div>
          <div className="chat-future-note">
            💬 <strong>Chat Feature Coming Soon!</strong><br/>
            For now, you can reach out via email to start your skill exchange journey.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="match-bg">
      <div className="match-header">
      </div>
      <div className="match-title">
        <h1 className="match-suggestions-title">Match Suggestions</h1>
        {userWantSkill && (
          <p className="match-intro">
            Since you want to learn <strong>{userWantSkill}</strong>, our AI suggested these skill categories. 
            Click to filter by specific categories:
          </p>
        )}
        {availableFilterTags.length > 0 && (
          <div className="filter-buttons">
            {availableFilterTags.map(tag => (
              <button
                key={tag}
                className={`filter-btn ${activeFilters.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        <p className="match-count">
          {activeFilters.length === 0 || activeFilters.length === availableFilterTags.length
            ? <>Showing all <strong>{totalMatches}</strong> learning {totalMatches === 1 ? 'buddy' : 'buddies'}</>
            : <>Showing <strong>{filteredMatches.length}</strong> of <strong>{totalMatches}</strong> learning {totalMatches === 1 ? 'buddy' : 'buddies'}</>
          }
        </p>
      </div>
      <div className="match-cards-row">
        <button
          className="arrow-btn"
          aria-label="Previous"
          onClick={handlePrev}
          disabled={startIdx === 0}
        >{'<'}</button>
        {visibleMatches.length === 0 ? (
          <div>No matches found.</div>
        ) : (
          visibleMatches.map((user) => (
            <MatchCard 
              key={user.id} 
              user={user} 
              onChat={() => setChatUser(user)} 
              onViewProfile={setViewedUser}
            />
          ))
        )}
        <button
          className="arrow-btn"
          aria-label="Next"
          onClick={handleNext}
          disabled={startIdx + CARDS_PER_VIEW >= (filteredMatches || []).length}
        >{'>'}</button>
      </div>

       {/* AI Disclaimer */}
       <div className="ai-disclaimer">
         <p>This app uses AI to suggest matches based only on the skills and interests you provide. It's helpful, not perfect—so use your best judgment when connecting!</p>
       </div>

       {/* Chat Card Modal */}
       {chatUser && (
         <ChatCard user={chatUser} onClose={() => setChatUser(null)} />
       )}
     </div>
   );
};

export default MatchSuggestionsPage;