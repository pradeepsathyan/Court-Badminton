import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSessions, createSession, updateSession, deleteSession } from '../services/api';

import BottomNavigation from '../components/BottomNavigation';

const Landing = () => {
    const [sessions, setSessions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal / Form State
    const [showModal, setShowModal] = useState(false);
    const [agentName, setAgentName] = useState('');
    const [courtName, setCourtName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [locationUrl, setLocationUrl] = useState('');
    const [organizerNote, setOrganizerNote] = useState('');
    const [sessionPrice, setSessionPrice] = useState('');
    const [editingSessionId, setEditingSessionId] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);
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
            organizer_note: organizerNote,
            price_per_player: sessionPrice ? parseFloat(sessionPrice) : null,
            court_count: 1,
            status: 'active' // Default status
        };

        let result;
        if (editingSessionId) {
            result = await updateSession(editingSessionId, sessionData);
        } else {
            result = await createSession(sessionData);
        }

        if (result.success) {
            await loadSessions();
            closeModal();
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
        setShowModal(true);
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

    const handleCancelSession = async (sessionId) => {
        if (window.confirm('Are you sure you want to cancel this session?')) {
            const result = await updateSession(sessionId, { status: 'cancelled' });
            if (result.success) {
                await loadSessions();
            } else {
                alert('Error cancelling session: ' + result.error);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSessionId(null);
        setCourtName('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocationUrl('');
    };

    const openCreateModal = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setEditingSessionId(null);
        setCourtName('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocationUrl('');
        setShowModal(true);
    };

    const handleLogout = () => {
        console.log('Logout clicked - Handler executing');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    };

    // Helper to determine status
    const getDerivedStatus = (session) => {
        if (session.status === 'cancelled') return 'Cancelled';

        const sessionDate = new Date(session.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        sessionDate.setHours(0, 0, 0, 0);

        if (sessionDate < today) return 'Completed';
        if (sessionDate.getTime() === today.getTime()) return 'In Progress';
        return 'Upcoming';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return { bg: '#d1fae5', text: '#065f46' }; // Green
            case 'In Progress': return { bg: '#dbeafe', text: '#1e40af' }; // Blue
            case 'Completed': return { bg: '#f3f4f6', text: '#374151' }; // Gray
            case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' }; // Red
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTimeRange = (start, end) => {
        const format = (timeStr) => {
            if (!timeStr) return '';
            const [h, m] = timeStr.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m} ${ampm}`;
        };
        return `${format(start)} - ${format(end)}`;
    };

    // Filter Logic
    const filteredSessions = sessions.filter(session => {
        const status = getDerivedStatus(session);
        const matchesSearch = session.agent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.court_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || status === filterStatus;

        return matchesSearch && matchesFilter;
    }).sort((a, b) => {
        // Sort by status priority: In Progress > Upcoming > Completed > Cancelled
        const statusPriority = {
            'In Progress': 1,
            'Upcoming': 2,
            'Completed': 3,
            'Cancelled': 4
        };

        const statusA = getDerivedStatus(a);
        const statusB = getDerivedStatus(b);

        return (statusPriority[statusA] || 5) - (statusPriority[statusB] || 5);
    });

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: '180px' // Space for FAB and Bottom Nav
        }}>
            {/* Header */}
            <header style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#111' }}>sports_tennis</span>
                <h1 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Sessions</h1>
                <i className="fas fa-search" style={{ fontSize: '1.2rem', color: '#111' }}></i>
            </header>

            {/* Search Bar */}
            <div style={{ padding: '0 1.25rem 1rem 1.25rem' }}>
                <div style={{
                    position: 'relative',
                    backgroundColor: '#eff6ff', // Light blueish gray
                    borderRadius: '12px',
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <i className="fas fa-search" style={{ color: '#6b7280', marginRight: '0.8rem', fontSize: '0.95rem' }}></i>
                    <input
                        type="text"
                        placeholder="Search sessions by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '0.95rem',
                            color: '#374151'
                        }}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.8rem',
                padding: '0 1.5rem 1.5rem 1.5rem',
                overflowX: 'auto',
                scrollbarWidth: 'none', // Hide scrollbar Firefox
                msOverflowStyle: 'none' // Hide scrollbar IE/Edge
            }}>
                {['All', 'Upcoming', 'In Progress', 'Completed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            backgroundColor: filterStatus === status ? '#2563eb' : '#f3f4f6',
                            color: filterStatus === status ? 'white' : '#6b7280',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Sessions List */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>Loading sessions...</div>
                ) : filteredSessions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No sessions found.</div>
                ) : (
                    filteredSessions.map(session => {
                        const status = getDerivedStatus(session);
                        const statusStyle = getStatusColor(status);

                        return (
                            <Link
                                key={session.id}
                                to={status !== 'Cancelled' ? `/booking/${session.shareable_slug}` : '#'}
                                style={{
                                    textDecoration: 'none',
                                    cursor: status !== 'Cancelled' ? 'pointer' : 'default'
                                }}
                                onClick={(e) => {
                                    if (status === 'Cancelled') {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    transition: 'box-shadow 0.2s ease',
                                    position: 'relative'
                                }}
                                    onMouseEnter={(e) => {
                                        if (status !== 'Cancelled') {
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: '#111'
                                        }}>
                                            {session.court_name}
                                        </h3>
                                        <span style={{
                                            backgroundColor: statusStyle.bg,
                                            color: statusStyle.text,
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {status}
                                        </span>
                                    </div>

                                    <div style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                        {formatDate(session.date)}, {formatTimeRange(session.start_time, session.end_time)}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
                                        <i className="fas fa-users" style={{ color: '#6b7280' }}></i>
                                        <span>{session.player_count || 0} Players</span>
                                    </div>

                                    {/* Action Buttons - Only for session owner */}
                                    {currentUser && currentUser.id === session.agent_id && (
                                        <div
                                            style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}
                                            onClick={(e) => e.preventDefault()} // Prevent card click when clicking action buttons
                                        >
                                            <Link to={`/matches/${session.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                                <button style={{
                                                    width: '100%',
                                                    padding: '0.8rem',
                                                    backgroundColor: '#2563eb',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <i className="fas fa-trophy"></i>
                                                    Matches
                                                </button>
                                            </Link>
                                            <Link to={`/courts/${session.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                                <button style={{
                                                    width: '100%',
                                                    padding: '0.8rem',
                                                    backgroundColor: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <i className="fas fa-border-all"></i>
                                                    Courts
                                                </button>
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleEditClick(session);
                                                }}
                                                style={{
                                                    padding: '0.8rem',
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#4b5563',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            {status !== 'Cancelled' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCancelSession(session.id);
                                                    }}
                                                    style={{
                                                        padding: '0.8rem',
                                                        backgroundColor: '#fee2e2',
                                                        color: '#991b1b',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Cancel Session"
                                                >
                                                    <i className="fas fa-ban"></i>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Floating Action Button - Adjusted position */}
            <button
                onClick={openCreateModal}
                style={{
                    position: 'fixed',
                    bottom: '5rem', // Moved up to avoid overlap with bottom nav
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                <i className="fas fa-plus"></i>
            </button>

            {/* Bottom Navigation */}
            <BottomNavigation
                onLogout={handleLogout}
                onCreateClick={openCreateModal}
                user={currentUser}
            />

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    zIndex: 200,
                    paddingTop: 0,
                    overflowY: 'auto'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0',
                        padding: 0,
                        width: '100%',
                        maxWidth: '500px',
                        minHeight: '100vh'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#111', padding: 0 }}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, flex: 1, textAlign: 'center' }}>
                                {editingSessionId ? 'Edit Session' : 'New Session'}
                            </h2>
                            <div style={{ width: '1.2rem' }}></div> {/* Spacer for centering */}
                        </div>

                        <form onSubmit={handleCreateOrUpdateSession} style={{ padding: '1.5rem' }}>
                            {/* Session Details Section */}
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1a1a' }}>Session Details</h3>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Session Name</label>
                                <input
                                    type="text"
                                    value={courtName}
                                    onChange={(e) => setCourtName(e.target.value)}
                                    required
                                    placeholder="e.g., Wednesday Night Smash"
                                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 0, marginBottom: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Start Time</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>End Time</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Location URL</label>
                                <input
                                    type="url"
                                    value={locationUrl}
                                    onChange={(e) => setLocationUrl(e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Organizer Note</label>
                                <textarea
                                    value={organizerNote}
                                    onChange={(e) => setOrganizerNote(e.target.value)}
                                    placeholder="Add any special instructions or notes for players..."
                                    rows="3"
                                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Session Price (per player)</label>
                                <input
                                    type="number"
                                    value={sessionPrice}
                                    onChange={(e) => setSessionPrice(e.target.value)}
                                    placeholder="AED 35"
                                    min="0"
                                    step="0.01"
                                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '50px',
                                border: 'none',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                            }}>
                                {editingSessionId ? 'Save Changes' : 'Create Session'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
