import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAgent } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await loginAgent(username, password);

        if (result.success) {
            // Store user in localStorage for session persistence
            localStorage.setItem('currentUser', JSON.stringify(result.agent));
            navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/login_bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            padding: '2rem'
        }}>
            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(2px)'
            }}></div>

            {/* Back to Home Button */}
            <Link to="/" style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                textDecoration: 'none',
                color: 'white',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                zIndex: 10,
                fontWeight: 600
            }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                }}>
                <i className="fas fa-arrow-left"></i>
                Back to Home
            </Link>

            {/* Login Card */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                zIndex: 1
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontFamily: '"Merriweather", serif',
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 800
                    }}>
                        Agent Login
                    </h1>
                    <p style={{
                        color: '#7f8c8d',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        Manage your badminton sessions
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                        borderRadius: '12px',
                        color: '#c0392b',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#2c3e50',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                fontSize: '1rem',
                                border: '2px solid #e9ecef',
                                borderRadius: '12px',
                                background: 'white',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                outline: 'none',
                                opacity: loading ? 0.6 : 1
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e9ecef';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#2c3e50',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                fontSize: '1rem',
                                border: '2px solid #e9ecef',
                                borderRadius: '12px',
                                background: 'white',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                outline: 'none',
                                opacity: loading ? 0.6 : 1
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e9ecef';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.125rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'white',
                            background: loading ? '#95a5a6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            marginTop: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Footer Links */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e9ecef'
                }}>
                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.95rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'color 0.3s ease'
                        }}
                            onMouseOver={(e) => e.target.style.color = '#764ba2'}
                            onMouseOut={(e) => e.target.style.color = '#667eea'}>
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
