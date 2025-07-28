import React, { useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { API_URL } from "../../App";

// Profile page for viewing and editing user information
// Handles avatar upload, field editing, and profile section rendering
const ProfilePage = ({ user, onSave, onNavigate, isReadOnly }) => {

  const [editField, setEditField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);



  // Handle edit button: set the field to be edited and initialize edit value
  const handleEdit = (field) => {
    setEditField(field);
    setHasUnsavedChanges(true);
    if (field === "user_info") {
      setEditValues(prev => ({
        ...prev,
        [field]: {
          username: user.username || "",
          pronouns: user.pronouns || "",
          email: user.email || ""
        }
      }));
    } else if (field === "skills_to_learn" || field === "skills_to_offer") {
      setEditValues(prev => ({
        ...prev,
        [field]: [...(user[field] || []), "", "", ""].slice(0,3)
      }));
    } else {
      setEditValues(prev => ({
        ...prev,
        [field]: user[field] || ""
      }));
    }
  };



  // Handle save: update profile field via API and update parent state
  const handleSave = async () => {
    try {
      let payload = {};
      
      // Build payload from all edited values
      Object.keys(editValues).forEach(field => {
        if (field === "skills_to_learn" || field === "skills_to_offer") {
          const value = editValues[field].map(s => s.trim()).filter(Boolean).slice(0,3);
          payload[field] = value;
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
      setEditField(null);
      setEditValues({});
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error details:', err);
      alert("Failed to update profile.");
    }
  };

  // Handle cancel: reset edit state
  const handleCancel = () => {
    setEditField(null);
    setEditValues({});
    setHasUnsavedChanges(false);
  };

  return (
    <div className="profile-bg">
      <div className="profile-main">
        <div className="profile-card profile-left">
          <div className="profile-section">
            <div className="profile-section-header">
              User Info {(!isReadOnly && editField !== "user_info") && (<button className="profile-edit-btn" onClick={() => handleEdit("user_info")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "user_info" ? (
                <>
                  <div>Your Name: <input value={editValues.user_info?.username || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, username: e.target.value } }))} /></div>
                  <div>Pronouns: <input value={editValues.user_info?.pronouns || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, pronouns: e.target.value } }))} /></div>
                  <div>Email: <input value={editValues.user_info?.email || ""} onChange={e => setEditValues(prev => ({ ...prev, user_info: { ...prev.user_info, email: e.target.value } }))} /></div>
                  <button onClick={handleCancel}>Cancel</button>
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
              About Me {(!isReadOnly && editField !== "bio") && (<button className="profile-edit-btn" onClick={() => handleEdit("bio")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "bio" ? (
                <>
                  <textarea
                    value={editValues.bio || ""}
                    onChange={e => setEditValues(prev => ({ ...prev, bio: e.target.value }))}
                  />
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <div>{user.bio || "Not set"}</div>
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Want to Learn {(!isReadOnly && editField !== "skills_to_learn") && (<button className="profile-edit-btn" onClick={() => handleEdit("skills_to_learn")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "skills_to_learn" ? (
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
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                (user.skills_to_learn && user.skills_to_learn.length > 0)
                  ? user.skills_to_learn.map(skill => (
                      <span className="profile-skill" key={skill}>{skill}</span>
                    ))
                  : "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Skill to Offer {(!isReadOnly && editField !== "skills_to_offer") && (<button className="profile-edit-btn" onClick={() => handleEdit("skills_to_offer")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "skills_to_offer" ? (
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
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                (user.skills_to_offer && user.skills_to_offer.length > 0)
                  ? user.skills_to_offer.map(skill => (
                      <span className="profile-skill" key={skill}>{skill}</span>
                    ))
                  : "Not set"
              )}
            </div>
          </div>
        </div>
        <div className="profile-card profile-right">
          <div className="profile-section">
            <div className="profile-section-header">
              Location {(!isReadOnly && editField !== "location") && (<button className="profile-edit-btn" onClick={() => handleEdit("location")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "location" ? (
                <>
                  <input value={editValues.location || ""} onChange={e => setEditValues(prev => ({ ...prev, location: e.target.value }))} />
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                user.location || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Availability {(!isReadOnly && editField !== "availability") && (<button className="profile-edit-btn" onClick={() => handleEdit("availability")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "availability" ? (
                <>
                  <input value={editValues.availability || ""} onChange={e => setEditValues(prev => ({ ...prev, availability: e.target.value }))} />
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                user.availability || "Not set"
              )}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-section-header">
              Learning Style {(!isReadOnly && editField !== "learning_style") && (<button className="profile-edit-btn" onClick={() => handleEdit("learning_style")}>Edit</button>)}
            </div>
            <div className="profile-section-content">
              {editField === "learning_style" ? (
                <>
                  <input value={editValues.learning_style || ""} onChange={e => setEditValues(prev => ({ ...prev, learning_style: e.target.value }))} />
                  <button onClick={handleCancel}>Cancel</button>
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
        {hasUnsavedChanges && (
          <div className="profile-save-container">
            <button className="profile-save-btn" onClick={handleSave}>
              Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;