import React from 'react';

const SuccessModal = ({ isOpen, onClose, playerName, message, type = 'success' }) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: 'fa-check-circle',
            color: '#27ae60',
            gradient: 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)',
            title: 'Booking Confirmed! 🎉'
        },
        error: {
            icon: 'fa-exclamation-circle',
            color: '#e74c3c',
            gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            title: 'Oops! Something went wrong'
        },
        warning: {
            icon: 'fa-info-circle',
            color: '#f39c12',
            gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            title: 'Notice'
        }
    };

    const currentConfig = config[type] || config.success;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                animation: 'slideUp 0.3s ease',
                textAlign: 'center'
            }}>
                {/* Icon Circle */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: currentConfig.gradient,
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'scaleIn 0.5s ease',
                    boxShadow: `0 8px 25px ${currentConfig.color}40`
                }}>
                    <i className={`fas ${currentConfig.icon}`} style={{
                        fontSize: '2.5rem',
                        color: 'white'
                    }}></i>
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: '#2c3e50',
                    letterSpacing: '-0.5px'
                }}>
                    {currentConfig.title}
                </h2>

                {/* Message */}
                <p style={{
                    fontSize: '1.05rem',
                    color: '#7f8c8d',
                    marginBottom: '0.5rem',
                    lineHeight: '1.6'
                }}>
                    {message}
                </p>

                {playerName && type === 'success' && (
                    <p style={{
                        fontSize: '1.1rem',
                        color: currentConfig.color,
                        fontWeight: 600,
                        marginBottom: '2rem'
                    }}>
                        Welcome, <span style={{ color: '#2c3e50' }}>{playerName}</span>! 🏸
                    </p>
                )}

                {/* OK Button */}
                <button
                    onClick={onClose}
                    style={{
                        background: currentConfig.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.85rem 2.5rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 15px ${currentConfig.color}40`,
                        width: '100%',
                        maxWidth: '200px'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 20px ${currentConfig.color}50`;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 4px 15px ${currentConfig.color}40`;
                    }}
                >
                    Got it!
                </button>

                {/* Close X button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#95a5a6',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = '#ecf0f1';
                        e.target.style.color = '#2c3e50';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#95a5a6';
                    }}
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default SuccessModal;
