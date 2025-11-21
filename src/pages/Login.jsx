import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAgent } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await loginAgent(username, password);

        if (result.success) {
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
            backgroundColor: '#f8f9fa', // Light off-white background
            fontFamily: "'Inter', sans-serif",
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Logo Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#dcfce7', // Light green circle
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: '#22c55e',
                    fontSize: '2rem'
                }}>
                    <i className="fas fa-table-tennis"></i> {/* Racket icon approximation */}
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#000',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                }}>
                    Badminton MS
                </h2>

                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#111',
                    marginBottom: '2.5rem',
                    textAlign: 'center',
                    lineHeight: 1.2
                }}>
                    Log In to Your<br />Account
                </h1>

                {/* Error Message */}
                {error && (
                    <div style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginBottom: '1.5rem',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid #fca5a5'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    {/* Email / Username Input */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#000',
                            fontSize: '1rem'
                        }}>
                            Email / Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-envelope" style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#22c55e', // Green icon
                                fontSize: '1.1rem'
                            }}></i>
                            <input
                                type="text"
                                placeholder="Enter your email or username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem', // Left padding for icon
                                    fontSize: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '50px', // Rounded pill shape
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#000',
                            fontSize: '1rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-lock" style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#22c55e', // Green icon
                                fontSize: '1.1rem'
                            }}></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem 1rem 3rem', // Padding for both icons
                                    fontSize: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '50px', // Rounded pill shape
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    fontSize: '1.1rem'
                                }}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                        <Link to="#" style={{
                            color: '#22c55e',
                            textDecoration: 'underline',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: 'white',
                            backgroundColor: '#22c55e', // Bright green
                            border: 'none',
                            borderRadius: '50px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#22c55e')}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ fontSize: '1rem', color: '#000', fontWeight: '500' }}>
                    New to BMS?{' '}
                    <Link to="/register" style={{
                        color: '#22c55e',
                        textDecoration: 'none',
                        fontWeight: '700'
                    }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
