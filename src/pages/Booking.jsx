import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionBySlug, addPlayer } from '../services/api';

const Booking = () => {
    const { sessionId } = useParams(); // This is actually the slug now
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [category, setCategory] = useState('Intermediate');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    const loadSession = async () => {
        setLoading(true);
        const result = await getSessionBySlug(sessionId);

        if (result.success) {
            setSession(result.session);
        } else {
            alert('Session not found');
            navigate('/');
        }
        setLoading(false);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        if (!playerName.trim() || !session) return;

        setSubmitting(true);

        const result = await addPlayer(session.id, {
            name: playerName.trim(),
            category: category,
            games_played: 0,
            is_waiting: false
        });

        if (result.success) {
            setPlayerName('');
            alert('Booking successful!');
            // Reload session to see updated player count
            await loadSession();
        } else {
            if (result.error.includes('duplicate')) {
                alert('Player name already taken!');
            } else {
                alert('Error: ' + result.error);
            }
        }

        setSubmitting(false);
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading session...</div>;
    if (!session) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Session not found</div>;

    return (
        <div className="app-container">
            <button onClick={() => navigate('/')} className="back-button" aria-label="Back to Home">
                <i className="fas fa-arrow-left"></i>
            </button>

            <header style={{ textAlign: 'center', marginTop: '1rem', background: 'transparent', boxShadow: 'none' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{session.court_name}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                    <span className="session-badge">
                        <i className="far fa-calendar"></i>
                        {formatDate(session.date)}
                    </span>
                    <span className="session-badge">
                        <i className="far fa-clock"></i>
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </span>
                </div>
            </header>

            <main>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center' }}>Book Your Spot</h2>
                    <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '1.5rem' }}>
                        Organized by <strong>{session.agent_name}</strong>
                    </p>

                    {session.location_url && (
                        <div style={{ marginBottom: '1.5rem' }}>
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
                                        height: '200px',
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

                    <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                required
                                disabled={submitting}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div className="input-group">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={submitting}
                                style={{ width: '100%', padding: '1rem', boxSizing: 'border-box' }}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="book-now-btn"
                            disabled={submitting}
                            style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                        >
                            {submitting ? 'Booking...' : 'Book Your Spot'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d', textAlign: 'center' }}>
                            📋 Session Code: <strong style={{ color: '#667eea' }}>{session.shareable_slug}</strong>
                        </p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#95a5a6', textAlign: 'center' }}>
                            Share this link with others to join!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Booking;
