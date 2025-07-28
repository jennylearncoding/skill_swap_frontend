import React, { useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { API_URL } from "../../App";

// Profile page for viewing and editing user information
// Handles avatar upload, field editing, and profile section rendering
const ProfilePage = ({ user, onSave, onNavigate, isReadOnly }) => {

  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");



  // Handle edit button: set the field to be edited and initialize edit value
  const handleEdit = (field) => {
    setEditField(field);
    if (field === "user_info") {
      setEditValue({
        username: user.username || "",
        pronouns: user.pronouns || "",
        email: user.email || ""
      });
    } else if (field === "skills_to_learn" || field === "skills_to_offer") {
      setEditValue([...(user[field] || []), "", "", ""].slice(0,3));
    } else {
      setEditValue(user[field] || "");
    }
  };



  // Handle save: update profile field via API and update parent state
  const handleSave = async () => {
    try {
      let value = editValue;
      let payload = {};
      if (editField === "skills_to_learn" || editField === "skills_to_offer") {
        value = editValue.map(s => s.trim()).filter(Boolean).slice(0,3);
        payload[editField] = value;
      } else if (editField === "user_info") {
        payload = {
          username: editValue.username,
          pronouns: editValue.pronouns,
          email: editValue.email
        };
      } else {
        payload[editField] = editValue;
      }
      const res = await axios.patch(`${API_URL}/profile/${user.id}`, payload);
      onSave(res.data);
      setEditField(null);
      setEditValue("");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  // Handle cancel: reset edit state
  const handleCancel = () => {
    setEditField(null);
    setEditValue("");
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
                  <div>Your Name: <input value={editValue.username} onChange={e => setEditValue({ ...editValue, username: e.target.value })} /></div>
                  <div>Pronouns: <input value={editValue.pronouns} onChange={e => setEditValue({ ...editValue, pronouns: e.target.value })} /></div>
                  <div>Email: <input value={editValue.email} onChange={e => setEditValue({ ...editValue, email: e.target.value })} /></div>
                  <button onClick={handleSave}>Save</button>
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
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <button onClick={handleSave}>Save</button>
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
                      value={editValue[i] || ""}
                      onChange={e => {
                        const newSkills = [...editValue];
                        newSkills[i] = e.target.value;
                        setEditValue(newSkills);
                      }}
                      placeholder={`Skill ${i+1}`}
                    />
                  ))}
                  <button onClick={handleSave}>Save</button>
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
                      value={editValue[i] || ""}
                      onChange={e => {
                        const newSkills = [...editValue];
                        newSkills[i] = e.target.value;
                        setEditValue(newSkills);
                      }}
                      placeholder={`Skill ${i+1}`}
                    />
                  ))}
                  <button onClick={handleSave}>Save</button>
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
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button onClick={handleSave}>Save</button>
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
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button onClick={handleSave}>Save</button>
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
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button onClick={handleSave}>Save</button>
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
      </div>
    </div>
  );
};

export default ProfilePage;