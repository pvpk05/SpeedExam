/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Fetch profile data from backend
  useEffect(() => {
    axios
      .get('/api/AdminProfileData')
      .then((response) => {
        const { firstName, lastName } = response.data;
        setProfile({ firstName, lastName });
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  // Update profile
  const handleUpdateProfile = () => {
    axios
      .put('/api/AdminProfileData', profile)
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  // Update password
  const handleUpdatePassword = () => {
    if (!oldPassword || !newPassword) {
      alert('Please fill in all fields.');
      return;
    }

    axios
      .put('/api/AdminProfileData', {
        oldPassword,
        newPassword,
      })
      .then(() => {
        alert('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        alert('Failed to update password.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
        <input
          type="text"
          value={profile.firstName}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
        <input
          type="text"
          value={profile.lastName}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button
          onClick={handleUpdateProfile}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#4cafaf',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Profile
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3 style={{ textAlign: 'left' }}>Change Password</h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button
          onClick={handleUpdatePassword}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#4cafaf',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
