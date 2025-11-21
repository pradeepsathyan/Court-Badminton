import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinish, 500); // Wait a bit after 100% before finishing
                    return 100;
                }
                return prev + 2; // Increment speed
            });
        }, 30); // Update frequency

        return () => clearInterval(timer);
    }, [onFinish]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f0fdf4', // Light green background
            backgroundImage: `
                linear-gradient(#e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Text Branding with Neon Effect */}
            <h1 style={{
                fontSize: '6rem',
                fontWeight: '900',
                color: '#fff', // White center
                margin: '0 0 1rem 0',
                letterSpacing: '4px',
                textShadow: `
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 20px #22c55e,
                    0 0 40px #22c55e,
                    0 0 80px #22c55e,
                    0 0 90px #22c55e,
                    0 0 100px #22c55e
                `, // Green neon glow
                fontFamily: "'Inter', sans-serif"
            }}>
                BMS
            </h1>

            <p style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#4b5563', // Grey
                margin: '0 0 4rem 0',
                letterSpacing: '3px',
                textTransform: 'uppercase'
            }}>
                Badminton Management System
            </p>

            {/* Loading Bar */}
            <div style={{
                width: '300px',
                height: '6px',
                background: '#dcfce7',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#22c55e', // Bright green
                    borderRadius: '4px',
                    transition: 'width 0.1s linear',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                }} />
            </div>

            <p style={{
                fontSize: '0.75rem',
                color: '#86efac', // Light green text
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: '600'
            }}>
                Initializing System
            </p>
        </div>
    );
};

export default SplashScreen;
