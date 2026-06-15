import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await API.put('/auth/profile', profile);
      updateUser({ ...user, ...res.data.user });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    if (pwd.newPassword !== pwd.confirm) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (pwd.newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      setPwdMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Change failed' });
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>My Profile</h1>
            <p className="page-subtitle">Manage your account details and password</p>
          </div>
        </div>

        <div className="cards-grid">
          {/* Profile details */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3>Account details</h3>
            {profileMsg.text && (
              <div className={profileMsg.type === 'success' ? 'alert-success' : 'alert-error'}>
                {profileMsg.text}
              </div>
            )}
            <form onSubmit={saveProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Save changes</button>
            </form>
          </div>

          {/* Change password */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3>Change password</h3>
            {pwdMsg.text && (
              <div className={pwdMsg.type === 'success' ? 'alert-success' : 'alert-error'}>
                {pwdMsg.text}
              </div>
            )}
            <form onSubmit={changePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={pwd.newPassword}
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Update password</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
