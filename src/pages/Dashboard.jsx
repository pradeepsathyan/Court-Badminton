import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerInput from '../components/PlayerInput';
import CourtConfig from '../components/CourtConfig';
import MatchDisplay from '../components/MatchDisplay';
import {
    getSessionById,
    updateSession,
    getPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getMatches,
    createMatch,
    deleteMatch,
    getSavedPlayers,
    savePlayerToPool
} from '../services/api';

const Dashboard = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [savedPlayers, setSavedPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            setCurrentUser(user);
            loadAllData(user);
        } else {
            navigate('/login');
        }
    }, [sessionId, navigate]);

    const loadAllData = async (user) => {
        setLoading(true);

        // Load session
        const sessionResult = await getSessionById(sessionId);
        if (sessionResult.success) {
            setSession(sessionResult.session);

            // Verify user owns this session
            if (sessionResult.session.agent_id !== user.id) {
                alert('Access denied: You do not own this session');
                navigate('/');
                return;
            }
        } else {
            alert('Session not found');
            navigate('/');
            return;
        }

        // Load players
        const playersResult = await getPlayers(sessionId);
        if (playersResult.success) {
            setPlayers(playersResult.players);
        }

        // Load matches
        const matchesResult = await getMatches(sessionId);
        if (matchesResult.success) {
            // Transform matches to match the expected format
            const transformedMatches = matchesResult.matches.map(m => ({
                id: m.id,
                courtId: m.court_id,
                team1: [m.team1_player1, m.team1_player2],
                team2: [m.team2_player1, m.team2_player2]
            }));
            setMatches(transformedMatches);
        }

        // Load saved players
        const savedResult = await getSavedPlayers(user.id);
        if (savedResult.success) {
            setSavedPlayers(savedResult.players);
        }

        setLoading(false);
    };

    const handleAddPlayer = async (name, category) => {
        const result = await addPlayer(sessionId, {
            name,
            category,
            games_played: 0,
            is_waiting: true
        });

        if (result.success) {
            await loadAllData(currentUser);
        } else {
            alert('Error adding player: ' + result.error);
        }
    };

    const handleRemovePlayer = async (index) => {
        const player = players[index];
        const result = await deletePlayer(player.id);

        if (result.success) {
            await loadAllData(currentUser);
        } else {
            alert('Error removing player: ' + result.error);
        }
    };

    const handleSetCourtCount = async (count) => {
        const result = await updateSession(sessionId, { court_count: count });

        if (result.success) {
            setSession({ ...session, court_count: count });
        } else {
            alert('Error updating court count: ' + result.error);
        }
    };

    const handleCompleteMatch = async (courtId) => {
        const matchIndex = matches.findIndex(m => m.courtId === courtId);
        if (matchIndex === -1) return;

        const match = matches[matchIndex];
        const matchPlayers = [...match.team1, ...match.team2];

        // Update each player's games played and waiting status
        for (const player of matchPlayers) {
            await updatePlayer(player.id, {
                games_played: player.games_played + 1,
                is_waiting: true
            });
        }

        // Delete the match
        await deleteMatch(match.id);

        // Reload data
        await loadAllData(currentUser);
    };

    const handleGenerateMatches = async () => {
        if (!session) return;

        const courtCount = session.court_count || 1;

        // Find empty courts
        const occupiedCourtIds = new Set(matches.map(m => m.courtId));
        const emptyCourts = [];
        for (let i = 1; i <= courtCount; i++) {
            if (!occupiedCourtIds.has(i)) {
                emptyCourts.push(i);
            }
        }

        if (emptyCourts.length === 0) {
            alert("All courts are occupied! Complete a match first.");
            return;
        }

        // Get available players
        const playingIds = new Set(matches.flatMap(m => [...m.team1, ...m.team2]).map(p => p.id));
        const availablePlayers = players.filter(p => !playingIds.has(p.id));

        if (availablePlayers.length < 4) {
            alert(`Need at least 4 available players. Currently ${availablePlayers.length} available.`);
            return;
        }

        // Sort by games played (fairness first)
        let sortedWaiters = [...availablePlayers].sort((a, b) => a.games_played - b.games_played);

        // Generate matches for empty courts
        for (const courtId of emptyCourts) {
            if (sortedWaiters.length < 4) break;

            const courtPlayers = sortedWaiters.splice(0, 4);
            courtPlayers.sort(() => 0.5 - Math.random()); // Shuffle teams

            // Create match in database
            await createMatch(sessionId, {
                court_id: courtId,
                team1_player1_id: courtPlayers[0].id,
                team1_player2_id: courtPlayers[1].id,
                team2_player1_id: courtPlayers[2].id,
                team2_player2_id: courtPlayers[3].id
            });

            // Update players' waiting status
            for (const player of courtPlayers) {
                await updatePlayer(player.id, { is_waiting: false });
            }
        }

        // Reload all data
        await loadAllData(currentUser);
    };

    const handleSavePlayerToPool = async (player) => {
        if (!currentUser) return;

        const result = await savePlayerToPool(currentUser.id, {
            name: player.name,
            category: player.category
        });

        if (result.success) {
            setSavedPlayers([...savedPlayers, result.player]);
            alert(`Saved ${player.name} to pool!`);
        } else {
            alert(result.error || 'Player already in pool');
        }
    };

    const handleSaveAllToPool = async () => {
        if (!currentUser || players.length === 0) return;

        let addedCount = 0;
        for (const player of players) {
            const result = await savePlayerToPool(currentUser.id, {
                name: player.name,
                category: player.category
            });
            if (result.success) {
                addedCount++;
            }
        }

        if (addedCount > 0) {
            alert(`Saved ${addedCount} player(s) to pool!`);
            await loadAllData(currentUser);
        } else {
            alert('All players already in pool.');
        }
    };

    const handleImportPlayer = async (playerData) => {
        await handleAddPlayer(playerData.name, playerData.category);
    };

    const handleImportAllPlayers = async () => {
        if (savedPlayers.length === 0) return;

        let addedCount = 0;
        for (const playerData of savedPlayers) {
            // Check if already in session
            if (!players.find(p => p.name === playerData.name)) {
                await handleAddPlayer(playerData.name, playerData.category);
                addedCount++;
            }
        }

        if (addedCount > 0) {
            alert(`Added ${addedCount} player(s) from pool!`);
        } else {
            alert('All players from pool are already in the session.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;
    if (!session || !currentUser) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Session not found</div>;

    // Calculate waiting players
    const playingIds = new Set(matches.flatMap(m => [...m.team1, ...m.team2]).map(p => p.id));
    const waitingPlayers = players.filter(p => !playingIds.has(p.id));

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

    return (
        <div className="app-container">
            <header style={{ position: 'relative', paddingLeft: '3rem', background: 'transparent', boxShadow: 'none' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '0.5rem',
                        background: 'rgba(0, 0, 0, 0.05)',
                        border: 'none',
                        color: '#2c3e50',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'scale(1.1)'; }}
                    onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.05)'; e.target.style.transform = 'scale(1)'; }}
                    title="Back to Home"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h1 style={{ fontFamily: '"Merriweather", serif', marginBottom: '0' }}>{session.agent_name}</h1>


            </header>

            <main>
                <div className="controls">
                    <CourtConfig courtCount={session.court_count || 1} setCourtCount={handleSetCourtCount} />
                    <PlayerInput
                        players={players}
                        onAddPlayer={handleAddPlayer}
                        onRemovePlayer={handleRemovePlayer}
                        onImportPlayers={handleImportPlayer}
                        onImportAll={handleImportAllPlayers}
                        onSavePlayer={handleSavePlayerToPool}
                        onSaveAll={handleSaveAllToPool}
                        savedPlayers={savedPlayers}
                    />
                    <button className="book-now-btn" onClick={handleGenerateMatches} disabled={players.length < 4} style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                        <i className="fas fa-random" style={{ marginRight: '0.5rem' }}></i>
                        Generate Matches
                    </button>
                </div>

                <MatchDisplay
                    matches={matches}
                    waitingList={waitingPlayers}
                    onComplete={handleCompleteMatch}
                    courtCount={session.court_count || 1}
                />

                {/* Shareable URL Section */}
                <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '2px solid rgba(102, 126, 234, 0.3)' }}>
                    <h3 style={{ marginTop: 0, color: '#667eea' }}>📤 Share this Session</h3>
                    <p style={{ margin: '0.5rem 0', color: '#7f8c8d' }}>Anyone with this link can book a spot:</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                        <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/booking/${session.shareable_slug}`}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '2px solid #667eea',
                                background: 'white',
                                fontSize: '0.9rem'
                            }}
                            onClick={(e) => e.target.select()}
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/booking/${session.shareable_slug}`);
                                alert('Link copied to clipboard!');
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            <i className="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
