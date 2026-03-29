import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiUser, FiChevronDown, FiSettings, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const dropdownRef = useRef(null);

    // Simple helper to get title from path
    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/dashboard': return 'Dashboard';
            case '/add-expense': return 'Add Expense';
            case '/wallets': return 'Wallets';
            case '/transactions': return 'Transactions';
            case '/reports': return 'Reports';
            case '/cash-flow': return 'Cash Flow';
            case '/goals': return 'Goals';
            case '/profile': return 'My Profile';
            case '/settings': return 'Settings';
            default: return 'FinTrack';
        }
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">
                {/* Global Top Navbar */}
                <header className="top-navbar">
                    <div className="page-header">
                        {location.pathname !== '/dashboard' && (
                            <h1>{getPageTitle(location.pathname)}</h1>
                        )}
                    </div>

                    <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--glass-border)',
                                color: theme === 'light' ? '#F59E0B' : '#A0A0C0',
                                padding: '10px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                transition: 'all 0.3s ease'
                            }}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            {theme === 'light' ? <FiSun /> : <FiMoon />}
                        </button>

                        {/* Profile Dropdown */}
                        <div
                            ref={dropdownRef}
                            className="user-dropdown"
                            style={{ position: 'relative' }}
                        >
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <div className="user-avatar" style={{
                                    background: 'linear-gradient(135deg, #4F46E5, #7045FF)',
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
                                }}>
                                    <FiUser size={20} />
                                </div>
                                <FiChevronDown
                                    color="var(--text-secondary)"
                                    style={{
                                        transition: 'transform 0.3s ease',
                                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    background: 'var(--card-bg)',
                                    backdropFilter: 'blur(16px)',
                                    borderRadius: '16px',
                                    boxShadow: 'var(--shadow-depth), 0 0 0 1px var(--glass-border)',
                                    width: '220px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--glass-border)',
                                    zIndex: 100,
                                    animation: 'fadeIn 0.2s ease-out'
                                }}>
                                    <div style={{ padding: '8px' }}>
                                        <Link to="/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px 16px', textDecoration: 'none',
                                                color: 'var(--text-main)', borderRadius: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--glass-surface)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <FiUser /> My Profile
                                        </Link>
                                        <Link to="/settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px 16px', textDecoration: 'none',
                                                color: 'var(--text-main)', borderRadius: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--glass-surface)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <FiSettings /> Settings
                                        </Link>
                                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 8px' }} />
                                        <div
                                            onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px 16px', cursor: 'pointer',
                                                color: '#EF4444', borderRadius: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <FiLogOut /> Logout
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content Renders Here */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
