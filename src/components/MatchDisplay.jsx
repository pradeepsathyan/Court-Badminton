import React from 'react';

const MatchDisplay = ({ matches, waitingList, onComplete, courtCount, completingCourt, onGenerate, generating }) => {
    // Create array of court IDs [1, 2, ..., courtCount]
    const courts = Array.from({ length: courtCount || 0 }, (_, i) => i + 1);

    return (
        <div className="match-display">
            <div className="matches-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Current Matches</h3>
                    {onGenerate && (
                        <button
                            className="book-now-btn"
                            onClick={onGenerate}
                            disabled={generating}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.6rem 1.2rem',
                                margin: 0,
                                opacity: generating ? 0.6 : 1,
                                cursor: generating ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {generating ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-random" style={{ marginRight: '0.5rem' }}></i>
                                    Generate Matches
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div className="matches-grid">
                    {courts.map((courtId) => {
                        const match = matches.find(m => m.courtId === courtId);
                        const isCompleting = completingCourt === courtId;
                        return (
                            <div key={courtId} className="match-card" style={{ opacity: match ? 1 : 0.7, border: match ? '1px solid #ddd' : '1px dashed #ccc', padding: '0.75rem' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', marginTop: 0 }}>Court {courtId}</h4>
                                {match ? (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                                            <div style={{ background: '#f8f9fa', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                    <span style={{ fontWeight: 600 }}>{match.team1[0].name}</span>
                                                    <span style={{ fontSize: '0.7rem', background: '#e3f2fd', color: '#1565c0', padding: '0 4px', borderRadius: '4px' }}>{match.team1[0].category?.[0] || 'I'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontWeight: 600 }}>{match.team1[1].name}</span>
                                                    <span style={{ fontSize: '0.7rem', background: '#e3f2fd', color: '#1565c0', padding: '0 4px', borderRadius: '4px' }}>{match.team1[1].category?.[0] || 'I'}</span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#95a5a6', fontWeight: 'bold', margin: '2px 0' }}>VS</div>

                                            <div style={{ background: '#f8f9fa', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                    <span style={{ fontWeight: 600 }}>{match.team2[0].name}</span>
                                                    <span style={{ fontSize: '0.7rem', background: '#fff3e0', color: '#e65100', padding: '0 4px', borderRadius: '4px' }}>{match.team2[0].category?.[0] || 'I'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontWeight: 600 }}>{match.team2[1].name}</span>
                                                    <span style={{ fontSize: '0.7rem', background: '#fff3e0', color: '#e65100', padding: '0 4px', borderRadius: '4px' }}>{match.team2[1].category?.[0] || 'I'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {onComplete && (
                                            <button
                                                onClick={() => onComplete(match.courtId)}
                                                disabled={isCompleting}
                                                style={{
                                                    marginTop: '0.5rem',
                                                    background: isCompleting ? '#95a5a6' : '#27ae60',
                                                    width: '100%',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.4rem',
                                                    cursor: isCompleting ? 'not-allowed' : 'pointer',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    opacity: isCompleting ? 0.7 : 1
                                                }}
                                            >
                                                {isCompleting ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin"></i> Completing...
                                                    </>
                                                ) : (
                                                    'Complete'
                                                )}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ padding: '1.5rem 0', textAlign: 'center', color: '#7f8c8d', fontSize: '0.9rem' }}>
                                        <p style={{ margin: 0 }}>Available</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="waiting-list-section">
                <h3>Waiting List ({waitingList.length})</h3>
                <div className="waiting-list" style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    margin: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    alignContent: 'flex-start'
                }}>
                    {waitingList.map(player => (
                        <div key={player.id} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 4px 4px 12px',
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            gap: '8px'
                        }}>
                            <span style={{ fontWeight: 600, color: '#2c3e50' }}>{player.name}</span>
                            <span style={{
                                fontSize: '0.7rem',
                                padding: '1px 6px',
                                background: player.category === 'Beginner' ? '#e8f5e9' : player.category === 'Expert' ? '#fff3e0' : '#e3f2fd',
                                color: player.category === 'Beginner' ? '#2e7d32' : player.category === 'Expert' ? '#e65100' : '#1565c0',
                                borderRadius: '8px',
                                fontWeight: 500
                            }}>
                                {player.category?.[0] || 'I'}
                            </span>
                            <span style={{
                                background: '#34495e',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {player.games_played || 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchDisplay;
