import React, { useState } from 'react';

const PlayerInput = ({ players, onAddPlayer, onRemovePlayer, onImportPlayers, savedPlayers, onSavePlayer, onImportAll, onSaveAll, courtCount, setCourtCount }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Intermediate');
    const [showImport, setShowImport] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAddPlayer(name, category);
            setName('');
            setCategory('Intermediate');
        }
    };

    // Check if a player is already in the saved pool
    const isPlayerSaved = (playerName) => {
        return savedPlayers && savedPlayers.some(p => p.name === playerName);
    };

    return (
        <div className="card" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>Players ({players.length})</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7f8c8d', fontSize: '1.2rem', padding: 0 }}
                    >
                        <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    {/* Court Configuration - Inline */}
                    <div style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <label htmlFor="court-count" style={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.9rem', margin: 0 }}>
                            <i className="fas fa-layer-group" style={{ marginRight: '0.5rem' }}></i>
                            Courts:
                        </label>
                        <input
                            id="court-count"
                            type="number"
                            min="1"
                            value={courtCount}
                            onChange={(e) => setCourtCount(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{
                                width: '70px',
                                height: '40px',
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.9rem',
                                borderRadius: '6px',
                                border: '2px solid #dee2e6',
                                textAlign: 'center'
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowImport(!showImport)}
                            style={{
                                background: 'transparent',
                                border: '2px solid #8e44ad',
                                color: '#8e44ad',
                                fontSize: '0.85rem',
                                padding: '0.5rem 1rem',
                                flex: '1 1 auto',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.background = '#8e44ad'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#8e44ad'; }}
                        >
                            <i className={`fas fa-${showImport ? 'eye-slash' : 'database'}`} style={{ marginRight: '0.4rem' }}></i>
                            {showImport ? 'Hide Pool' : 'Import Pool'}
                        </button>
                        <button
                            onClick={onSaveAll}
                            style={{
                                background: 'transparent',
                                border: '2px solid #27ae60',
                                color: '#27ae60',
                                fontSize: '0.85rem',
                                padding: '0.5rem 1rem',
                                flex: '1 1 auto',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.background = '#27ae60'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#27ae60'; }}
                        >
                            <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>
                            Save All
                        </button>
                    </div>

                    {/* Saved Players Pool */}
                    {showImport && savedPlayers && (
                        <div className="import-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Saved Players Pool</h4>
                                {savedPlayers.length > 0 && (
                                    <button
                                        onClick={onImportAll}
                                        style={{ fontSize: '0.8rem', padding: '4px 10px', background: '#27ae60', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <i className="fas fa-plus" style={{ marginRight: '0.3rem' }}></i>
                                        Add All
                                    </button>
                                )}
                            </div>

                            {savedPlayers.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0.5rem 0' }}>
                                    No saved players. Add players and click save icon.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', padding: '0.5rem 0' }}>
                                    {savedPlayers.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onImportPlayers(p)}
                                            title={`Add ${p.name}`}
                                            style={{
                                                fontSize: '0.85rem',
                                                padding: '5px 10px',
                                                background: 'white',
                                                color: '#2c3e50',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => { e.target.style.background = '#ecf0f1'; e.target.style.borderColor = '#95a5a6'; }}
                                            onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#bdc3c7'; }}
                                        >
                                            <span>{p.name}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#95a5a6' }}>({p.category?.[0] || 'I'})</span>
                                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>+</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add Player Form */}
                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Player Name"
                            style={{ minWidth: '120px', height: '40px', padding: '0 0.75rem' }}
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ height: '40px', padding: '0 0.5rem' }}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                        <button type="submit" style={{ flex: '0 1 auto', padding: '0 1.5rem', height: '40px' }}>
                            <i className="fas fa-plus" style={{ marginRight: '0.4rem' }}></i>
                            Add
                        </button>
                    </form>

                    {/* Players List - Tag Style */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '0.5rem',
                        background: '#fafbfc',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        {players.length === 0 ? (
                            <p style={{ margin: '1rem auto', color: '#95a5a6', fontSize: '0.9rem' }}>
                                No players yet. Add players above.
                            </p>
                        ) : (
                            players.map((player, index) => (
                                <div key={player.id} style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '6px 6px 6px 12px',
                                    background: 'white',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{player.name}</span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 6px',
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
                                    {!isPlayerSaved(player.name) && onSavePlayer && (
                                        <button
                                            onClick={() => onSavePlayer(player)}
                                            title="Save to Pool"
                                            style={{
                                                background: 'transparent',
                                                color: '#3498db',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s',
                                                padding: 0
                                            }}
                                            onMouseOver={(e) => { e.target.style.color = '#2980b9'; e.target.style.transform = 'scale(1.1)'; }}
                                            onMouseOut={(e) => { e.target.style.color = '#3498db'; e.target.style.transform = 'scale(1)'; }}
                                        >
                                            <i className="fas fa-bookmark"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onRemovePlayer(index)}
                                        title="Remove Player"
                                        style={{
                                            background: 'transparent',
                                            color: '#e74c3c',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            transition: 'all 0.2s',
                                            padding: 0
                                        }}
                                        onMouseOver={(e) => { e.target.style.color = '#c0392b'; e.target.style.transform = 'scale(1.1)'; }}
                                        onMouseOut={(e) => { e.target.style.color = '#e74c3c'; e.target.style.transform = 'scale(1)'; }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerInput;
