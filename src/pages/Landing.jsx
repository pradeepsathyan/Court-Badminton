import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSessions, createSession, updateSession, deleteSession } from '../services/api';

const Landing = () => {
    const [sessions, setSessions] = useState([]);
    const [agentName, setAgentName] = useState('');
    const [courtName, setCourtName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [locationUrl, setLocationUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadSessions();

        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            setCurrentUser(user);
            setAgentName(user.username);
        }
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        const result = await getSessions();
        if (result.success) {
            setSessions(result.sessions);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setAgentName('');
    };

    const handleCreateOrUpdateSession = async (e) => {
        e.preventDefault();
        if (!agentName || !courtName || !date || !startTime || !endTime || !currentUser) return;

        const sessionData = {
            agent_id: currentUser.id,
            agent_name: agentName,
            court_name: courtName,
            date,
            start_time: startTime,
            end_time: endTime,
            location_url: locationUrl,
            court_count: 1
        };

        let result;
        if (editingSessionId) {
            result = await updateSession(editingSessionId, sessionData);
            setEditingSessionId(null);
        } else {
            result = await createSession(sessionData);
        }

        if (result.success) {
            await loadSessions();
            // Clear form
            setCourtName('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setLocationUrl('');
        } else {
            alert('Error: ' + result.error);
        }
    };

    const handleEditClick = (session) => {
        setAgentName(session.agent_name);
        setCourtName(session.court_name);
        setDate(session.date);
        setStartTime(session.start_time || '');
        setEndTime(session.end_time || '');
        setLocationUrl(session.location_url || '');
        setEditingSessionId(session.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            const result = await deleteSession(sessionId);
            if (result.success) {
                await loadSessions();
            } else {
                alert('Error deleting session: ' + result.error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingSessionId(null);
        setCourtName('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocationUrl('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Filter sessions
    const displaySessions = sessions.filter(session => {
        // Only show user's own sessions if logged in
        if (currentUser && session.agent_id !== currentUser.id) {
            return false;
        }

        // Filter out past sessions
        const sessionDate = new Date(session.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return sessionDate >= today;
    });

    return (
        <div className="app-container">
            {/* Title and Burger Menu - Outside white box */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <h1 className="fancy-title">
                    Badminton<br />Match Selector
                </h1>

                <button
                    className="burger-menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <div className={`burger-icon ${menuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <div className={`menu-dropdown ${menuOpen ? 'open' : ''}`}>
                    {currentUser ? (
                        <>
                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ background: '#e74c3c', width: '100%' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}>
                                <button style={{ width: '100%' }}>Agent Login</button>
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>
                                <button style={{ background: '#2c3e50', width: '100%' }}>Register Agent</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* White box - Only for welcome message */}
            {currentUser && (
                <header style={{ textAlign: 'left', padding: '1.5rem' }}>
                    <p>Welcome, <strong>{currentUser.username}</strong>! 👋</p>
                </header>
            )}

            {currentUser && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2>{editingSessionId ? 'Edit Session' : 'Create New Session'}</h2>
                    <form onSubmit={handleCreateOrUpdateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Agent Name (Organizer)"
                                value={agentName}
                                readOnly
                                style={{ background: '#f0f0f0' }}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Court Name"
                                value={courtName}
                                onChange={(e) => setCourtName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="url"
                                placeholder="Location Map URL (Optional)"
                                value={locationUrl}
                                onChange={(e) => setLocationUrl(e.target.value)}
                            />
                        </div>
                        <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            />
                        </div>
                        <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="generate-btn">
                                {editingSessionId ? 'Update Session' : 'Create Session'}
                            </button>
                            {editingSessionId && (
                                <button type="button" onClick={handleCancelEdit} style={{ background: '#95a5a6', marginTop: '1rem' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="sessions-list">
                <h2>Available Sessions</h2>
                {loading ? (
                    <p>Loading sessions...</p>
                ) : displaySessions.length === 0 ? (
                    <p>No active sessions found.</p>
                ) : (
                    <div className="courts-grid">
                        {displaySessions.map(session => (
                            <div key={session.id} className="court-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>{session.agent_name}</h3>
                                    <span className="session-badge" style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}>
                                        <i className="fas fa-users"></i>
                                        {session.player_count || 0} Players
                                    </span>
                                </div>
                                <p><strong>Court:</strong> {session.court_name}</p>
                                <p><strong>Date:</strong> {formatDate(session.date)}</p>
                                <p><strong>Time:</strong> {formatTime(session.start_time)} - {formatTime(session.end_time)}</p>
                                {session.location_url && (
                                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                        <a
                                            href={session.location_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', textDecoration: 'none' }}
                                        >
                                            <img
                                                src="/sample_map.png"
                                                alt="Location Map - Click to view in Google Maps"
                                                style={{
                                                    width: '100%',
                                                    height: '140px',
                                                    objectFit: 'cover',
                                                    borderRadius: '12px',
                                                    border: '2px solid #e9ecef',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.transform = 'scale(1.02)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </a>
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                    <Link to={`/booking/${session.shareable_slug}`} style={{ width: '100%' }}>
                                        <button className="book-now-btn">Book Now</button>
                                    </Link>
                                    {currentUser && currentUser.id === session.agent_id && (
                                        <>
                                            <Link to={`/dashboard/${session.id}`} style={{ width: '100%' }}>
                                                <button className="manage-btn">Manage</button>
                                            </Link>
                                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(session); }} className="edit-btn">Edit</button>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(session.id); }} className="delete-btn">Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
