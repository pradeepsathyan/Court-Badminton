import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { updateAgent } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
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

        if (Object.keys(updates).length === 0) {
            setLoading(false);
            return;
        }

        const result = await updateAgent(user.id, updates);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
            // Update local storage if needed (though password hash isn't stored there usually)
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }

        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
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
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>Security</h3>

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
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fef2f2',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginTop: '2rem'
                    }}
                >
                    Log Out
                </button>
            </main>

            <BottomNavigation user={user} />
        </div>
    );
};

export default Profile;
