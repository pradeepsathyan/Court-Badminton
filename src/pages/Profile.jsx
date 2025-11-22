import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { updateAgent, deleteAgent } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        setUsername(currentUser.username || '');
        setEmail(currentUser.email || '');
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        const updates = {};
        if (newPassword) updates.password = newPassword;
        if (username && username !== user.username) updates.username = username;

        if (Object.keys(updates).length === 0) {
            setLoading(false);
            return;
        }

        const result = await updateAgent(user.id, updates);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setNewPassword('');
            setConfirmPassword('');

            // Update local user state and local storage
            const updatedUser = { ...user, ...result.agent };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }

        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        const result = await deleteAgent(user.id);
        if (result.success) {
            localStorage.removeItem('currentUser');
            window.location.href = '/register';
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to delete account' });
            setShowDeleteConfirm(false);
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: '100px'
        }}>
            {/* Header */}
            <header style={{
                padding: '1rem 1.25rem',
                backgroundColor: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>My Profile</h1>
            </header>

            <main style={{ padding: '1.5rem' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: '#22c55e',
                        margin: '0 auto 1rem auto'
                    }}>
                        <i className="fas fa-user"></i>
                    </div>
                    <h2 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', color: '#0f172a' }}>{user.username}</h2>
                    <p style={{ textAlign: 'center', margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Agent</p>
                </div>

                <form onSubmit={handleUpdateProfile}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>Account Details</h3>

                    {message.text && (
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                            color: message.type === 'error' ? '#991b1b' : '#166534',
                            fontSize: '0.9rem'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                backgroundColor: '#f1f5f9',
                                color: '#64748b',
                                cursor: 'not-allowed'
                            }}
                        />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a', marginTop: '2rem' }}>Security</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                    {!showDeleteConfirm ? (
                        <>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: 'white',
                                    color: '#475569',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    marginBottom: '1rem'
                                }}
                            >
                                Log Out
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#ef4444',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete Account
                            </button>
                        </>
                    ) : (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #fee2e2'
                        }}>
                            <h4 style={{ marginTop: 0, color: '#991b1b' }}>Are you sure?</h4>
                            <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                This action cannot be undone. All your sessions and data will be permanently deleted.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <BottomNavigation user={user} />
        </div>
    );
};

export default Profile;
