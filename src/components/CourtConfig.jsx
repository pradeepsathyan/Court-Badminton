import React, { useState } from 'react';

const CourtConfig = ({ courtCount, setCourtCount }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '1rem' }}>
                <h2 style={{ margin: 0 }}>Court Configuration</h2>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7f8c8d', fontSize: '1.2rem', padding: 0 }}
                >
                    <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
                </button>
            </div>

            {!isCollapsed && (
                <div className="input-group">
                    <label htmlFor="court-count">Number of Courts:</label>
                    <input
                        id="court-count"
                        type="number"
                        min="1"
                        value={courtCount}
                        onChange={(e) => setCourtCount(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                </div>
            )}
        </div>
    );
};

export default CourtConfig;
