import React, { useState } from 'react';

const PlayerInput = ({ players, onAddPlayer, onRemovePlayer, onImportPlayers, savedPlayers, onSavePlayer, onImportAll, onSaveAll }) => {
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
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '1rem' }}>
                <h2 style={{ margin: 0 }}>Players ({players.length})</h2>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7f8c8d', fontSize: '1.2rem', padding: 0 }}
                >
                    <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
                </button>
            </div>

            {!isCollapsed && (
                <>
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setShowImport(!showImport)}
                            style={{ background: '#8e44ad', fontSize: '0.9rem', padding: '0.5rem', flex: 1 }}
                        >
                            {showImport ? 'Hide Saved Players' : 'Import Saved Players'}
                        </button>
                        <button
                            onClick={onSaveAll}
                            style={{ background: '#27ae60', fontSize: '0.9rem', padding: '0.5rem', flex: 1 }}
                        >
                            Save All to Pool
                        </button>
                    </div>

                    {showImport && savedPlayers && (
                        <div className="import-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0 }}>Saved Players Pool</h4>
                                {savedPlayers.length > 0 && (
                                    <button
                                        onClick={onImportAll}
                                        style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#27ae60', color: 'white' }}
                                    >
                                        + Add All
                                    </button>
                                )}
                            </div>

                            {savedPlayers.length === 0 ? <p style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>No saved players found. Add players and click the save icon.</p> : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                    {savedPlayers.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onImportPlayers(p)}
                                            title={`Add ${p.name}`}
                                            style={{
                                                fontSize: '0.85rem',
                                                padding: '4px 10px',
                                                background: 'white',
                                                color: '#2c3e50',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: '15px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
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

                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Player Name"
                            style={{ flex: 2 }}
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem' }}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                        <button type="submit">Add</button>
                    </form>
                    <ul className="player-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {players.map((player, index) => (
                            <li key={player.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                borderBottom: '1px solid #e9ecef',
                                fontSize: '0.9rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{player.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        background: player.category === 'Beginner' ? '#e8f5e9' : player.category === 'Expert' ? '#fff3e0' : '#e3f2fd',
                                        color: player.category === 'Beginner' ? '#2e7d32' : player.category === 'Expert' ? '#e65100' : '#1565c0',
                                        borderRadius: '12px',
                                        fontWeight: 500
                                    }}>
                                        {player.category?.[0] || 'I'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>🎮 {player.gamesPlayed}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {!isPlayerSaved(player.name) && onSavePlayer && (
                                        <button
                                            onClick={() => onSavePlayer(player)}
                                            title="Save to Pool"
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#3498db',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.color = '#2980b9'}
                                            onMouseOut={(e) => e.target.style.color = '#3498db'}
                                        >
                                            <i className="fas fa-save"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onRemovePlayer(index)}
                                        title="Remove Player"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#e74c3c',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.color = '#c0392b'}
                                        onMouseOut={(e) => e.target.style.color = '#e74c3c'}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default PlayerInput;
