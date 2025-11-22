import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionBySlug, addPlayer, getPlayers } from '../services/api';
import SuccessModal from '../components/SuccessModal';

const Booking = () => {
    const { sessionId } = useParams(); // This is the slug
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [category, setCategory] = useState('Intermediate');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('book'); // 'book' or 'players'
    const [modal, setModal] = useState({ isOpen: false, type: 'success', message: '', playerName: '' });

    useEffect(() => {
        loadSessionData();
    }, [sessionId]);

    const loadSessionData = async () => {
        setLoading(true);
        // Get session details
        const sessionResult = await getSessionBySlug(sessionId);

        if (sessionResult.success) {
            setSession(sessionResult.session);

            // Get players for this session
            const playersResult = await getPlayers(sessionResult.session.id);
            if (playersResult.success) {
                setPlayers(playersResult.players);
            }
        } else {
            setModal({
                isOpen: true,
                type: 'error',
                message: 'Session not found. Redirecting to home...',
                playerName: ''
            });
            setTimeout(() => navigate('/'), 2000);
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
            const bookedPlayerName = playerName.trim();
            setPlayerName('');
            setModal({
                isOpen: true,
                type: 'success',
                message: "You're all set! See you on the court!",
                playerName: bookedPlayerName
            });
            // Reload data to update player list
            await loadSessionData();
        } else {
            if (result.error && result.error.includes('duplicate')) {
                setModal({
                    isOpen: true,
                    type: 'error',
                    message: 'This player name is already taken. Please choose a different name.',
                    playerName: ''
                });
            } else {
                setModal({
                    isOpen: true,
                    type: 'error',
                    message: result.error || 'Something went wrong. Please try again.',
                    playerName: ''
                });
            }
        }

        setSubmitting(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: "'Inter', sans-serif" }}>Loading session...</div>;
    if (!session) return <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: "'Inter', sans-serif" }}>Session not found</div>;

    const playerCount = players.length;
    const maxPlayers = 16; // Hardcoded for now as per image/requirement, or could be dynamic if added to DB

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: '180px' // Space for fixed footer
        }}>
            {/* Top Section Container */}
            <div style={{ paddingBottom: '0' }}>
                {/* Header */}
                <header style={{
                    padding: '1rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#111', padding: 0, minWidth: '40px' }}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, flex: 1, textAlign: 'center', color: '#0f172a' }}>
                        {session.court_name}
                    </h1>
                    <button style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#0ea5e9', padding: 0, minWidth: '40px' }}>
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                </header>

                {/* Date Subheader */}
                <div style={{ textAlign: 'center', paddingBottom: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                    {formatDate(session.date)}, {formatTime(session.start_time)} - {formatTime(session.end_time)}
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0'
                }}>
                    <button
                        onClick={() => setActiveTab('book')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            borderBottom: activeTab === 'book' ? '3px solid #0ea5e9' : '3px solid transparent',
                            color: activeTab === 'book' ? '#0ea5e9' : '#64748b',
                            fontWeight: activeTab === 'book' ? '700' : '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        Book Session
                    </button>
                    <button
                        onClick={() => setActiveTab('players')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            borderBottom: activeTab === 'players' ? '3px solid #0ea5e9' : '3px solid transparent',
                            color: activeTab === 'players' ? '#0ea5e9' : '#64748b',
                            fontWeight: activeTab === 'players' ? '700' : '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        Players
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            borderBottom: '3px solid transparent',
                            color: '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        Details
                    </button>
                </div>
            </div>

            <main style={{ padding: '1.5rem' }}>
                {activeTab === 'book' && (
                    <>
                        {/* Main Booking Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            marginBottom: '2rem',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Session Booking</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>
                                    <i className="fas fa-users" style={{ color: '#0ea5e9' }}></i>
                                    <span>{playerCount} / {maxPlayers}</span>
                                </div>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 0, marginBottom: '1.5rem' }}>
                                Book for the entire duration.
                            </p>

                            {/* Blue Info Box */}
                            <div style={{
                                backgroundColor: '#e0f2fe',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <div style={{ color: '#0ea5e9', fontWeight: '700', fontSize: '1rem', marginBottom: '0.3rem' }}>Full Session</div>
                                    <div style={{ color: '#0ea5e9', fontSize: '0.85rem', fontWeight: '500' }}>
                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '1.4rem', marginBottom: '0.3rem' }}>AED 35</div>
                                    <div style={{ color: '#0ea5e9', fontSize: '0.85rem', fontWeight: '500' }}>per player</div>
                                </div>
                            </div>

                            {/* Input Fields (Before Note) */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Skill Level</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>

                            {/* Organizer Note */}
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Organizer Note</div>
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#0f172a' }}>
                                    Session limited to {maxPlayers} players to ensure everyone gets plenty of court time. RSVP early!
                                </p>
                            </div>
                        </div>

                        {/* Registered Players Preview */}
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Registered Players</h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {players.slice(0, 5).map((player, index) => (
                                    <div key={player.id} style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e2e8f0',
                                        border: '2px solid white',
                                        marginLeft: index > 0 ? '-10px' : '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        color: '#64748b',
                                        fontWeight: '600'
                                    }}>
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                                {players.length > 5 && (
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e0f2fe',
                                        border: '2px solid white',
                                        marginLeft: '-10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        color: '#0ea5e9',
                                        fontWeight: '700'
                                    }}>
                                        +{players.length - 5}
                                    </div>
                                )}
                                {players.length === 0 && (
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Be the first to join!</span>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'players' && (
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>Active Players ({playerCount})</h2>
                        {players.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No players yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {players.map((player, index) => {
                                    // Skill level colors
                                    const skillColors = {
                                        'Beginner': '#10b981',
                                        'Intermediate': '#f59e0b',
                                        'Expert': '#ef4444'
                                    };
                                    const skillColor = skillColors[player.category] || '#64748b';

                                    // Generate gradient colors based on player name for abstract avatar
                                    const gradients = [
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                                        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                        'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
                                    ];
                                    const gradientIndex = player.name.charCodeAt(0) % gradients.length;
                                    const avatarGradient = gradients[gradientIndex];

                                    return (
                                        <div key={player.id} style={{
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            padding: '1rem 1.25rem',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                            background: avatarGradient,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '1.2rem',
                                                            fontWeight: '700'
                                                        }}
                                                    >
                                                        {player.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '2px',
                                                        right: '2px',
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        backgroundColor: skillColor,
                                                        border: '2px solid white'
                                                    }}></div>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>{player.name}</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: skillColor }}>{player.category}</div>
                                                </div>
                                            </div>
                                            <button style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                backgroundColor: '#e2e8f0',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#64748b',
                                                padding: 0
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove_circle</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Fixed Footer Button */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: '1rem 1.5rem',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                zIndex: 100
            }}>
                <button
                    onClick={handleBook}
                    disabled={submitting}
                    style={{
                        width: '100%',
                        backgroundColor: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}
                >
                    {submitting ? 'Booking...' : 'Book Session'}
                </button>
            </div>

            {/* Success/Error Modal */}
            <SuccessModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                playerName={modal.playerName}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
};

export default Booking;
