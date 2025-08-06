import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { API_URL } from "../../App";

const ProfilePage = ({ user, onSave, onNavigate, isReadOnly }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]); 

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${API_URL}/skills`);
        setAvailableSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    
    fetchSkills();
  }, []);

  const getSkillIdByName = (skillName) => {
    const skill = availableSkills.find(s => s.name === skillName);
    return skill ? skill.id : null;
  };

  const getSkillById = (skillId) => {
    return availableSkills.find(s => s.id === skillId);
  };

  const handleEdit = () => {
    setIsEditing(true);
    
    setEditValues({
      user_info: {
        username: user.username || "",
        pronouns: user.pronouns || "",
        email: user.email || ""
      },
      bio: user.bio || "",
      skill_to_learn: user.userWant?.skill?.id || getSkillIdByName(user.userWant?.skillName) || "", // ✅ Single value
      skill_to_offer: user.userOffer?.skill?.id || getSkillIdByName(user.userOffer?.skillName) || "", // ✅ Single value
      location: user.location || "",
      availability: user.availability || "",
      learning_style: user.learning_style || ""
    });
  };

  const handleSave = async () => {
    try {
      let payload = {};
      
      Object.keys(editValues).forEach(field => {
        if (field === "skill_to_learn") { 
          const skillId = editValues[field]; 
          if (skillId) {
            payload.userWant = { skill: { id: parseInt(skillId) } };
          } else {
            payload.userWant = null;
          }
        } else if (field === "skill_to_offer") { 
          const skillId = editValues[field]; 
          if (skillId) {
            payload.userOffer = { skill: { id: parseInt(skillId) } };
          } else {
            payload.userOffer = null;
          }
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
      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (err) {
      console.error('Error details:', err);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  return (
    <div className="profile-bg">
      <div className="profile-main">
        <div className="profile-card profile-left">
          {/* User Info section */}
          <div className="profile-section">
            <div className="profile-section-header">User Info</div>
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

          {/* About Me section */}
          <div className="profile-section">
            <div className="profile-section-header">About Me</div>
            <div className="profile-section-content">
              {isEditing ? (
                <textarea
                  value={editValues.bio || ""}
                  onChange={e => setEditValues(prev => ({ ...prev, bio: e.target.value }))}
                />
              ) : (
                <div>{user.bio || "Not set"}</div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-header">Skill to Learn</div>
            <div className="profile-section-content">
              {isEditing ? (
                <select
                  value={editValues.skill_to_learn || ""} 
                  onChange={e => setEditValues(prev => ({ 
                    ...prev, 
                    skill_to_learn: e.target.value 
                  }))}
                >
                  <option value="">Select a skill to learn...</option>
                  {availableSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              ) : (
                user.userWant?.skillName || user.userWant?.skill?.name ? (
                  <span className="profile-skill">
                    {user.userWant?.skillName || user.userWant?.skill?.name}
                  </span>
                ) : "Not set"
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-header">Skill to Offer</div>
            <div className="profile-section-content">
              {isEditing ? (
                <select
                  value={editValues.skill_to_offer || ""} 
                  onChange={e => setEditValues(prev => ({ 
                    ...prev, 
                    skill_to_offer: e.target.value
                  }))}
                >
                  <option value="">Select a skill to offer...</option>
                  {availableSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              ) : (
                user.userOffer?.skillName || user.userOffer?.skill?.name ? (
                  <span className="profile-skill">
                    {user.userOffer?.skillName || user.userOffer?.skill?.name}
                  </span>
                ) : "Not set"
              )}
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="profile-card profile-right">
          <div className="profile-section">
            <div className="profile-section-header">Location</div>
            <div className="profile-section-content">
              {isEditing ? (
                <input value={editValues.location || ""} onChange={e => setEditValues(prev => ({ ...prev, location: e.target.value }))} />
              ) : (
                user.location || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">Availability</div>
            <div className="profile-section-content">
              {isEditing ? (
                <input value={editValues.availability || ""} onChange={e => setEditValues(prev => ({ ...prev, availability: e.target.value }))} />
              ) : (
                user.availability || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">Learning Style</div>
            <div className="profile-section-content">
              {isEditing ? (
                <input value={editValues.learning_style || ""} onChange={e => setEditValues(prev => ({ ...prev, learning_style: e.target.value }))} />
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

        {/* Confirmation and buttons */}
        {showConfirmation && (
          <div className="profile-confirmation">
            <div className="confirmation-message">
              ✅ Profile updated successfully!
            </div>
          </div>
        )}
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