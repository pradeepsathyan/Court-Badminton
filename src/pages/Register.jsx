import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAgent } from '../services/api';
import BottomNavigation from '../components/BottomNavigation';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        // Use Email as the username for the system
        const result = await registerAgent(email, password, fullName);

        if (result.success) {
            // Auto login - store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(result.agent));
            // We could store fullName in a user profile table later
            navigate('/');
        } else {
            setError(result.error || 'Registration failed');
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
            padding: '1rem',
            paddingBottom: '180px' // Space for Bottom Nav
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
                    color: '#22c55e'
                }}>
                    {/* SVG Shuttlecock Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32" fill="currentColor">
                        <path d="M48 464c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48H96c-26.5 0-48 21.5-48 48v32zm32-320c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H112c-17.7 0-32-14.3-32-32v-64zm32-96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H144c-17.7 0-32-14.3-32-32V48zM96 256c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64v-32c0-35.3-28.7-64-64-64H96z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#111',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                }}>
                    Create Account
                </h1>

                <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: '0 0 2rem 0',
                    textAlign: 'center',
                    lineHeight: 1.5
                }}>
                    Join the BMS community and get on the court!
                </p>

                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    {/* Full Name Input */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#000',
                            fontSize: '1rem'
                        }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-user" style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af', // Grey icon
                                fontSize: '1.1rem'
                            }}></i>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px', // Rounded corners
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#000',
                            fontSize: '1rem'
                        }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-envelope" style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af', // Grey icon
                                fontSize: '1.1rem'
                            }}></i>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '1.25rem' }}>
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
                                color: '#9ca3af', // Grey icon
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
                                    padding: '1rem 3rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
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
                                    color: '#9ca3af',
                                    fontSize: '1.1rem'
                                }}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#000',
                            fontSize: '1rem'
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-lock" style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af', // Grey icon
                                fontSize: '1.1rem'
                            }}></i>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: error.includes('match') ? '1px solid #ef4444' : '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#9ca3af',
                                    fontSize: '1.1rem'
                                }}
                            >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            width: '100%',
                            marginBottom: '1.5rem',
                            color: '#ef4444',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: 'white',
                            backgroundColor: '#10b981', // Green
                            border: 'none',
                            borderRadius: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: '#10b981',
                        textDecoration: 'none',
                        fontWeight: '700'
                    }}>
                        Log In
                    </Link>
                </div>
            </div>
            <BottomNavigation user={null} />
        </div >
    );
};

export default Register;
