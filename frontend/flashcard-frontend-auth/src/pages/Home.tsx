import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { user, loading } = useAuthContext();

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="home-page">
            <div className="home-hero">
                <div className="hero-logo">
                    <div className="hero-logo-icon">📝</div>
                    <h1 className="hero-title">Memo</h1>
                </div>
                <p className="hero-subtitle">
                    The smart way to learn and memorize. Create, study, and master your flashcards.
                </p>
                <div className="hero-actions">
                    <Link to="/register" className="hero-button primary">
                        Get Started
                    </Link>
                    <Link to="/login" className="hero-button secondary">
                        Sign In
                    </Link>
                </div>
            </div>
            <div className="home-features">
                <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Create Decks</h3>
                    <p>Organize your study materials into custom flashcard decks</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Smart Study</h3>
                    <p>Use spaced repetition to maximize your learning efficiency</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Track Progress</h3>
                    <p>Monitor your learning journey with detailed statistics</p>
                </div>
            </div>
        </div>
    );
};

export default Home;