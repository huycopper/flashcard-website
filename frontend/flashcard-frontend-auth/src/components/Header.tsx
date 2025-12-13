import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="logo-brand">
                    <div className="logo-icon">📝</div>
                    <span className="logo-text">Memo</span>
                </Link>

                <nav className="header-nav">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            <Link to="/decks/create" className="nav-link">
                                Create Deck
                            </Link>
                            <div className="user-menu">
                                <div className="user-info">
                                    <span className="user-avatar">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                    <span className="user-name">
                                        {user.email?.split('@')[0] || user.username || 'User'}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="nav-link register-link">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;