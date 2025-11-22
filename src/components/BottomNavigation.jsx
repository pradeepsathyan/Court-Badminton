import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = ({ onLogout, onCreateClick, user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            label: 'Home',
            icon: 'fas fa-home',
            path: '/',
            action: () => navigate('/')
        },
        {
            label: user ? 'Create' : 'Login',
            icon: user ? 'fas fa-plus-circle' : 'fas fa-sign-in-alt',
            path: user ? null : '/login',
            action: user ? onCreateClick : () => navigate('/login')
        },
        ...(user ? [
            {
                label: 'Profile',
                icon: 'fas fa-user',
                path: '/profile',
                action: () => navigate('/profile')
            },
            {
                label: 'Logout',
                icon: 'fas fa-sign-out-alt',
                path: null,
                action: onLogout
            }
        ] : [])
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0.75rem 0',
            zIndex: 9999,
            boxShadow: 'none'
        }}>
            {navItems.map((item, index) => {
                const active = item.path && isActive(item.path);
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                            console.log('BottomNav button clicked:', item.label);
                            e.preventDefault();
                            e.stopPropagation();
                            if (item.action) {
                                console.log('Executing action for:', item.label);
                                item.action();
                            } else {
                                console.error('No action defined for:', item.label);
                            }
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: 'none',
                            border: 'none',
                            borderRadius: '0',
                            boxShadow: 'none',
                            cursor: 'pointer',
                            color: active ? '#2563eb' : '#6b7280',
                            flex: 1,
                            padding: '0.5rem' // Added padding for larger hit area
                        }}
                    >
                        <i className={item.icon} style={{ fontSize: '1.25rem', pointerEvents: 'none' }}></i>
                        <span style={{ fontSize: '0.75rem', fontWeight: active ? '600' : '500', pointerEvents: 'none' }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
