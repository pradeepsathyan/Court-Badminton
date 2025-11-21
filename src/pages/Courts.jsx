import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, updateSession } from '../services/api';
import SuccessModal from '../components/SuccessModal';

const Courts = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [courtCount, setCourtCount] = useState(4);
    const [courtNames, setCourtNames] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        loadData();
    }, [sessionId]);

    const loadData = async () => {
        setLoading(true);
        const sessionResult = await getSessionById(sessionId);
        if (sessionResult.success) {
            setSession(sessionResult.session);
            const count = sessionResult.session.court_count || 4;
            setCourtCount(count);

            // Parse court numbers from comma-separated string
            const savedCourtNumbers = sessionResult.session.court_numbers || '';
            if (savedCourtNumbers) {
                const names = savedCourtNumbers.split(',').map(n => n.trim());
                setCourtNames(Array.from({ length: count }, (_, i) => names[i] || ''));
            } else {
                setCourtNames(Array.from({ length: count }, () => ''));
            }
        }
        setLoading(false);
    };

    // Update court names array when court count changes
    useEffect(() => {
        setCourtNames(prev => {
            const newNames = Array.from({ length: courtCount }, (_, i) => prev[i] || '');
            return newNames;
        });
    }, [courtCount]);

    const handleCourtNameChange = (index, value) => {
        const newNames = [...courtNames];
        newNames[index] = value;
        setCourtNames(newNames);
    };

    const handleSaveCourtConfig = async () => {
        // Convert court names array to comma-separated string, filtering out empty values
        const courtNumbersString = courtNames
            .map((name, i) => name.trim() || (i + 1).toString())
            .join(',');

        const result = await updateSession(sessionId, {
            court_count: courtCount,
            court_numbers: courtNumbersString
        });

        if (result.success) {
            setModalState({
                show: true,
                type: 'success',
                message: 'Court configuration saved successfully!'
            });
            await loadData();
        } else {
            setModalState({
                show: true,
                type: 'error',
                message: result.error || 'Failed to save court configuration'
            });
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>Session not found</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Inter', sans-serif", paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <button onClick={() => navigate('/')} style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#111'
                }}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, flex: 1, textAlign: 'center' }}>Configure Courts</h1>
                <div style={{ width: '44px' }}></div>
            </header>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
                {/* Number of Courts Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1a202c' }}>
                        Number of Courts
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                        Set the number of courts for this session.
                    </p>

                    {/* Total Courts Card */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '1.25rem 1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {/* Yellow Icon */}
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            🏸
                        </div>

                        <div style={{ flex: 1, fontWeight: '600', fontSize: '1.05rem', color: '#1a202c' }}>
                            Total Courts
                        </div>

                        {/* Minus Button */}
                        <button
                            onClick={() => setCourtCount(Math.max(1, courtCount - 1))}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: '600'
                            }}
                        >
                            -
                        </button>

                        {/* Count Display */}
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            minWidth: '40px',
                            textAlign: 'center',
                            color: '#1a202c'
                        }}>
                            {courtCount}
                        </div>

                        {/* Plus Button */}
                        <button
                            onClick={() => setCourtCount(Math.min(20, courtCount + 1))}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: '#5b21b6',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: '600'
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Court Details Section */}
                <div>
                    <h3 style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        color: '#9ca3af',
                        marginBottom: '1rem',
                        textTransform: 'uppercase'
                    }}>
                        COURT DETAILS
                    </h3>

                    {/* Court Name Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Array.from({ length: courtCount }, (_, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '1rem 1.25rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                {/* Court Number Badge */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: '#5b21b6',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </div>

                                {/* Court Name Input */}
                                <input
                                    type="text"
                                    value={courtNames[index]}
                                    onChange={(e) => handleCourtNameChange(index, e.target.value)}
                                    placeholder="Enter custom name"
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#1a202c',
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                backgroundColor: 'white',
                borderTop: '1px solid #e5e7eb',
                zIndex: 50
            }}>
                <button
                    onClick={handleSaveCourtConfig}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '50px',
                        border: 'none',
                        backgroundColor: '#5b21b6',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
                    }}
                >
                    Save Courts
                </button>
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

export default Courts;
