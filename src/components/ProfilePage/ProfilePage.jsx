import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { API_URL } from "../../App";

// Profile page for viewing and editing user information
// Handles avatar upload, field editing, and profile section rendering
const ProfilePage = ({ user, onSave, onNavigate, isReadOnly }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [skills, setSkills] = useState([]);

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${API_URL}/skills`);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Fallback to demo skills if backend is not available
        setSkills([
          { id: 1, name: "Python", category: "Programming" },
          { id: 2, name: "JavaScript", category: "Programming" },
          { id: 3, name: "Guitar", category: "Music" },
          { id: 4, name: "Painting", category: "Art" },
          { id: 5, name: "Cooking", category: "Culinary" },
          { id: 6, name: "Photography", category: "Art" },
          { id: 7, name: "Yoga", category: "Fitness" },
          { id: 8, name: "Spanish", category: "Language" }
        ]);
      }
    };
    fetchSkills();
  }, []);

  // Helper function to get skill name by ID
  const getSkillNameById = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : `Skill ${skillId}`;
  };

  // Helper function to get skill ID by name
  const getSkillIdByName = (skillName) => {
    const skill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    return skill ? skill.id : null;
  };

  // Handle global edit button: enable editing for all fields
  const handleEdit = () => {
    setIsEditing(true);
    setHasUnsavedChanges(true);
    // Initialize all edit values
    setEditValues({
      user_info: {
        username: user.username || "",
        pronouns: user.pronouns || "",
        email: user.email || ""
      },
      bio: user.bio || "",
      skills_to_learn: [
        ...(user.skills_to_learn || user.userWants?.map(want => getSkillNameById(want.skill_id)) || []), 
        "", "", ""
      ].slice(0,3),
      skills_to_offer: [
        ...(user.skills_to_offer || user.userOffers?.map(offer => getSkillNameById(offer.skill_id)) || []), 
        "", "", ""
      ].slice(0,3),
      location: user.location || "",
      availability: user.availability || "",
      learning_style: user.learning_style || ""
    });
  };



  // Handle save: update profile field via API and update parent state
  const handleSave = async () => {
    try {
      let payload = {};
      
      // Build payload from all edited values
      Object.keys(editValues).forEach(field => {
        if (field === "skills_to_learn") {
          // Convert skills_to_learn to userWants format
          const skillNames = editValues[field].map(s => s.trim()).filter(Boolean).slice(0,3);
          payload.userWants = skillNames.map(skillName => {
            const skillId = getSkillIdByName(skillName);
            return {
              id: null, // New entry
              skill_id: skillId || 1, // Use found skill ID or default to 1
              user: null // Will be set by backend
            };
          });
        } else if (field === "skills_to_offer") {
          // Convert skills_to_offer to userOffers format
          const skillNames = editValues[field].map(s => s.trim()).filter(Boolean).slice(0,3);
          payload.userOffers = skillNames.map(skillName => {
            const skillId = getSkillIdByName(skillName);
            return {
              id: null, // New entry
              skill_id: skillId || 1, // Use found skill ID or default to 1
              user: null // Will be set by backend
            };
          });
        } else if (field === "user_info") {
          payload = {
            ...payload,
            username: editValues[field].username,
            pronouns: editValues[field].pronouns,
            email: editValues[field].email
          };
        } else {
          payload[field] = editValues[field];
        }
      });
      
      console.log('Sending PATCH request to:', `${API_URL}/profiles/${user.id}`);
      console.log('Payload:', payload);
      
      const res = await axios.patch(`${API_URL}/profiles/${user.id}`, payload);
      console.log('Response:', res.data);
      
      onSave(res.data);
      setIsEditing(false);
      setEditValues({});
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error details:', err);
      alert("Failed to update profile.");
    }
  };

  // Handle cancel: reset edit state
  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
    setHasUnsavedChanges(false);
  };

  return (
    <div className="profile-bg">
      <div className="profile-main">
        <div className="profile-card profile-left">
          <div className="profile-section">
            <div className="profile-section-header">
              User Info
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  <div>Your Name: <input value={editValues.user_info?.username || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, username: e.target.value } }))} /></div>
                  <div>Pronouns: <input value={editValues.user_info?.pronouns || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, pronouns: e.target.value } }))} /></div>
                  <div>Email: <input value={editValues.user_info?.email || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, email: e.target.value } }))} /></div>
                </>
              ) : (
                <>
                  <div>Your Name: <b>{user.username || "Not set"}</b></div>
                  <div>Pronouns: <b>{user.pronouns || "Not set"}</b></div>
                  <div>Email: <b>{user.email || "Not set"}</b></div>
                </>
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              About Me
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  <textarea
                    value={editValues.bio || ""}
                    onChange={e => setEditValues(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </>
              ) : (
                <div>{user.bio || "Not set"}</div>
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Want to Learn
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  {[0,1,2].map(i => (
                    <input
                      key={i}
                      value={editValues.skills_to_learn?.[i] || ""}
                      onChange={e => {
                        const newSkills = [...(editValues.skills_to_learn || [])];
                        newSkills[i] = e.target.value;
                        setEditValues(prev => ({ ...prev, skills_to_learn: newSkills }));
                      }}
                      placeholder={`Skill ${i+1}`}
                    />
                  ))}
                </>
              ) : (
                (user.skills_to_learn && user.skills_to_learn.length > 0)
                  ? user.skills_to_learn.map(skill => (
                      <span className="profile-skill" key={skill}>{skill}</span>
                    ))
                  : (user.userWants && user.userWants.length > 0)
                    ? user.userWants.map(want => (
                        <span className="profile-skill" key={want.id}>Skill ID: {want.skill_id}</span>
                      ))
                    : "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Skill to Offer
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  {[0,1,2].map(i => (
                    <input
                      key={i}
                      value={editValues.skills_to_offer?.[i] || ""}
                      onChange={e => {
                        const newSkills = [...(editValues.skills_to_offer || [])];
                        newSkills[i] = e.target.value;
                        setEditValues(prev => ({ ...prev, skills_to_offer: newSkills }));
                      }}
                      placeholder={`Skill ${i+1}`}
                    />
                  ))}
                </>
              ) : (
                (user.skills_to_offer && user.skills_to_offer.length > 0)
                  ? user.skills_to_offer.map(skill => (
                      <span className="profile-skill" key={skill}>{skill}</span>
                    ))
                  : (user.userOffers && user.userOffers.length > 0)
                    ? user.userOffers.map(offer => (
                        <span className="profile-skill" key={offer.id}>Skill ID: {offer.skill_id}</span>
                      ))
                    : "Not set"
              )}
            </div>
          </div>
        </div>
        <div className="profile-card profile-right">
          <div className="profile-section">
            <div className="profile-section-header">
              Location
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  <input value={editValues.location || ""} onChange={e => setEditValues(prev => ({ ...prev, location: e.target.value }))} />
                </>
              ) : (
                user.location || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Availability
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  <input value={editValues.availability || ""} onChange={e => setEditValues(prev => ({ ...prev, availability: e.target.value }))} />
                </>
              ) : (
                user.availability || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Learning Style
            </div>
            <div className="profile-section-content">
              {isEditing ? (
                <>
                  <input value={editValues.learning_style || ""} onChange={e => setEditValues(prev => ({ ...prev, learning_style: e.target.value }))} />
                </>
              ) : (
                user.learning_style || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">Average Rating</div>
            <div className="profile-section-content">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(user.average_rating || 0) ? "star filled" : "star"}>★</span>
              ))}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="profile-save-container">
            <button className="profile-save-btn" onClick={handleSave}>
              Save All Changes
            </button>
            <button className="profile-cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
        {!isEditing && !isReadOnly && (
          <div className="profile-edit-container">
            <button className="profile-edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;