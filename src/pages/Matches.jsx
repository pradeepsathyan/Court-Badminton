import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, getPlayers, createMatch, updatePlayer, getMatches, deleteMatch } from '../services/api';
import SuccessModal from '../components/SuccessModal';

const Matches = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [completingMatchId, setCompletingMatchId] = useState(null);
    const [modalState, setModalState] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        loadData();
    }, [sessionId]);

    const loadData = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }

        // Load session
        const sessionResult = await getSessionById(sessionId);
        if (sessionResult.success) {
            setSession(sessionResult.session);
        }

        // Load players
        const playersResult = await getPlayers(sessionId);
        if (playersResult.success) {
            setPlayers(playersResult.players || []);
        }

        // Load matches
        const matchesResult = await getMatches(sessionId);
        if (matchesResult.success) {
            // Transform matches to match the expected format
            const transformedMatches = matchesResult.matches.map(m => ({
                id: m.id,
                courtId: m.court_id,
                team1: [m.team1_player1, m.team1_player2].filter(Boolean),
                team2: [m.team2_player1, m.team2_player2].filter(Boolean)
            }));
            setMatches(transformedMatches || []);
        }

        if (showLoading) {
            setLoading(false);
        }
    };

    const getPlayerInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name.substring(0, 2);
    };

    const getGradient = (index) => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        ];
        return gradients[index % gradients.length];
    };

    const handleGenerateMatches = async () => {
        if (!session || generating) return;
        setGenerating(true);

        try {
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
                setModalState({
                    show: true,
                    type: 'warning',
                    message: 'All courts are occupied! Complete a match first.'
                });
                setGenerating(false);
                return;
            }

            // Get waiting players
            const playingPlayerIds = new Set();
            matches.forEach(m => {
                m.team1.concat(m.team2).forEach(player => {
                    if (player && player.id) {
                        playingPlayerIds.add(player.id);
                    }
                });
            });
            const waitingPlayers = players.filter(p => !playingPlayerIds.has(p.id) && p.is_waiting !== false);

            if (waitingPlayers.length < 4) {
                setModalState({
                    show: true,
                    type: 'warning',
                    message: `Need at least 4 waiting players to generate a match. Currently have ${waitingPlayers.length}.`
                });
                setGenerating(false);
                return;
            }

            // Sort waiting players by games played (ascending) to prioritize those who played less
            // Add some randomness for players with same number of games
            const sortedPlayers = [...waitingPlayers].sort((a, b) => {
                const gamesA = a.games_played || 0;
                const gamesB = b.games_played || 0;
                if (gamesA !== gamesB) return gamesA - gamesB;
                return Math.random() - 0.5;
            });

            // Generate matches for empty courts
            const newMatches = [];
            const updatedPlayerIds = new Set();
            let playerIndex = 0;

            for (const courtId of emptyCourts) {
                if (playerIndex + 3 >= sortedPlayers.length) break;

                const p1 = sortedPlayers[playerIndex++];
                const p2 = sortedPlayers[playerIndex++];
                const p3 = sortedPlayers[playerIndex++];
                const p4 = sortedPlayers[playerIndex++];

                // Create match in DB
                const matchData = {
                    court_id: courtId,
                    team1_player1_id: p1.id,
                    team1_player2_id: p2.id,
                    team2_player1_id: p3.id,
                    team2_player2_id: p4.id
                };

                const result = await createMatch(sessionId, matchData);
                if (result.success) {
                    newMatches.push(result.match);
                    [p1, p2, p3, p4].forEach(p => updatedPlayerIds.add(p.id));
                }
            }

            // Update players' waiting status
            for (const playerId of updatedPlayerIds) {
                await updatePlayer(playerId, { is_waiting: false });
            }

            // Reload data to get updated state - silent refresh
            await loadData(false);

            setModalState({
                show: true,
                type: 'success',
                message: `Generated ${newMatches.length} match${newMatches.length !== 1 ? 'es' : ''}!`
            });
        } catch (error) {
            console.error('Error generating matches:', error);
            setModalState({
                show: true,
                type: 'error',
                message: 'Error generating matches: ' + error.message
            });
            await loadData(false);
        } finally {
            setGenerating(false);
        }
    };

    const handleCompleteMatch = async (matchId, courtId) => {
        setCompletingMatchId(matchId);
        try {
            // Find the match to get player IDs
            const match = matches.find(m => m.id === matchId);
            if (!match) {
                throw new Error('Match not found');
            }

            // Get all player IDs from the match
            const allPlayers = [...match.team1, ...match.team2];

            // Update games_played count for all players in the match
            for (const player of allPlayers) {
                if (player && player.id) {
                    const currentGamesPlayed = player.games_played || 0;
                    await updatePlayer(player.id, {
                        games_played: currentGamesPlayed + 1,
                        is_waiting: true // Reset to waiting status
                    });
                }
            }

            // Delete the match
            const result = await deleteMatch(matchId);
            if (result.success) {
                setModalState({
                    show: true,
                    type: 'success',
                    message: `Match completed! All players updated.`
                });
                // Reload data to update the display - silent refresh
                await loadData(false);
            } else {
                setModalState({
                    show: true,
                    type: 'error',
                    message: 'Failed to clear court'
                });
            }
        } catch (error) {
            console.error('Error completing match:', error);
            setModalState({
                show: true,
                type: 'error',
                message: 'Error completing match: ' + error.message
            });
        } finally {
            setCompletingMatchId(null);
        }
    };

    const handleRemovePlayer = async (playerId) => {
        try {
            await updatePlayer(playerId, { is_waiting: false });
            // Silent refresh
            await loadData(false);
        } catch (error) {
            console.error('Error removing player:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>Session not found</div>
            </div>
        );
    }

    // Calculate waiting players - filter out those who are not waiting
    const playingPlayerIds = new Set();
    matches.forEach(m => {
        m.team1.concat(m.team2).forEach(player => {
            if (player && player.id) {
                playingPlayerIds.add(player.id);
            }
        });
    });

    // Only show players who are NOT playing AND have is_waiting = true (default is true for new players)
    const waitingPlayers = players.filter(p => !playingPlayerIds.has(p.id) && p.is_waiting !== false);
    const courtCount = session.court_count || 1;

    // Get custom court names
    let courtNames = [];
    if (session.court_numbers) {
        courtNames = session.court_numbers.split(',').map(n => n.trim());
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Inter', sans-serif", paddingBottom: '180px' }}>
            {/* Header */}
            <header style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <button onClick={() => navigate('/')} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#111',
                    fontSize: '1.2rem'
                }}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Match Generation</h1>
                <button onClick={() => navigate(`/courts/${sessionId}`)} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1a202c',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '1.1rem'
                }}>
                    <i className="fas fa-plus"></i>
                </button>
            </header>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
                {/* Ready to Play Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1a202c' }}>
                        Ready to Play?
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                        {waitingPlayers.length} Players waiting for a match across {courtCount} courts.
                    </p>

                    {/* Waiting Players */}
                    {waitingPlayers.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a202c' }}>
                                Waiting Players
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {waitingPlayers.map((player, index) => (
                                    <div key={player.id} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.4rem 0.75rem',
                                        backgroundColor: 'white',
                                        borderRadius: '50px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            color: '#1a202c'
                                        }}>
                                            {player.name}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#6b7280',
                                            fontWeight: '500'
                                        }}>
                                            ({player.games_played || 0})
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemovePlayer(player.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '0 0 0 0.25rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <i className="fas fa-times" style={{ fontSize: '0.85rem' }}></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateMatches}
                        disabled={generating || waitingPlayers.length < 4}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '50px',
                            border: 'none',
                            backgroundColor: generating || waitingPlayers.length < 4 ? '#9ca3af' : '#5b21b6',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: generating || waitingPlayers.length < 4 ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 16px rgba(91, 33, 182, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {generating ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '1rem' }}></i>
                                Generating...
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.2rem' }}>✨</span>
                                Generate Matches
                            </>
                        )}
                    </button>
                </div>

                {/* Matches Generated Section */}
                {matches.length > 0 && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1a202c' }}>
                            Matches Generated!
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {Array.from({ length: courtCount }, (_, courtIndex) => {
                                const courtId = courtIndex + 1;
                                const customName = courtNames[courtIndex] || '';
                                // If custom name exists and is not just a number, use it; otherwise use "Court X"
                                let courtName = customName.trim();
                                if (courtName && !isNaN(courtName)) {
                                    courtName = `Court ${courtName}`;
                                }
                                if (!courtName) {
                                    courtName = `Court ${courtId}`;
                                }
                                const match = matches.find(m => m.courtId === courtId);

                                if (!match) {
                                    // Empty court
                                    return (
                                        <div key={courtId} style={{
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            padding: '1.25rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                            border: '2px dashed #e5e7eb'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#1a202c' }}>{courtName}</h3>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                                                No match assigned
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={courtId} style={{
                                        backgroundColor: 'white',
                                        borderRadius: '16px',
                                        padding: '1.25rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#1a202c' }}>{courtName}</h3>
                                            <button
                                                onClick={() => handleCompleteMatch(match.id, courtId)}
                                                disabled={completingMatchId === match.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: completingMatchId === match.id ? '#9ca3af' : '#10b981',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    cursor: completingMatchId === match.id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {completingMatchId === match.id ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.8rem' }}></i>
                                                        Completing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-check" style={{ fontSize: '0.8rem' }}></i>
                                                        Complete Match
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem' }}>
                                            {/* Team 1 */}
                                            <div style={{ flex: 1, backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '0.75rem' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team 1</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    {match.team1.map((player, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '50%',
                                                                background: getGradient(idx),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontWeight: '700',
                                                                fontSize: '0.7rem',
                                                                flexShrink: 0
                                                            }}>
                                                                {getPlayerInitials(player.name)}
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                                                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1a202c' }}>
                                                                    {player.name}
                                                                </div>
                                                                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '500' }}>
                                                                    {player.category || 'Intermediate'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* VS Divider */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>VS</div>
                                            </div>

                                            {/* Team 2 */}
                                            <div style={{ flex: 1, backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '0.75rem' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Team 2</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    {match.team2.map((player, idx) => (
                                                        <div key={idx} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '50%',
                                                                background: getGradient(idx + 2),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontWeight: '700',
                                                                fontSize: '0.7rem',
                                                                flexShrink: 0
                                                            }}>
                                                                {getPlayerInitials(player.name)}
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'flex-end' }}>
                                                                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1a202c' }}>
                                                                    {player.name}
                                                                </div>
                                                                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '500' }}>
                                                                    {player.category || 'Intermediate'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Success/Error Modal */}
            {modalState.show && (
                <SuccessModal
                    type={modalState.type}
                    message={modalState.message}
                    onClose={() => setModalState({ ...modalState, show: false })}
                />
            )}
        </div>
    );
};

export default Matches;
