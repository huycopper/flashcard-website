import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getDecks, getDeck, Deck } from '../services/deckService';

const Dashboard: React.FC = () => {
    const { user } = useAuthContext();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDecks: 0,
        totalCards: 0,
        studySessions: 0,
        cardsReviewed: 0,
    });

    useEffect(() => {
        loadDecks();
    }, []);

    const loadDecks = async () => {
        setLoading(true);
        try {
            const decksData = await getDecks();
            setDecks(decksData);
            
            // Calculate stats
            let totalCards = 0;
            for (const deck of decksData) {
                try {
                    const deckWithCards = await getDeck(deck.id);
                    totalCards += deckWithCards.cards.length;
                } catch (err) {
                    console.error(`Error loading cards for deck ${deck.id}:`, err);
                }
            }
            
            setStats({
                totalDecks: decksData.length,
                totalCards,
                studySessions: 0, // TODO: Implement study sessions tracking
                cardsReviewed: 0, // TODO: Implement cards reviewed tracking
            });
        } catch (err: any) {
            console.error('Error loading decks:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Decks',
            value: stats.totalDecks,
            icon: '📚',
            color: '#4f46e5',
            bgColor: '#eef2ff',
        },
        {
            title: 'Total Cards',
            value: stats.totalCards,
            icon: '🃏',
            color: '#059669',
            bgColor: '#d1fae5',
        },
        {
            title: 'Study Sessions',
            value: stats.studySessions,
            icon: '📖',
            color: '#dc2626',
            bgColor: '#fee2e2',
        },
        {
            title: 'Cards Reviewed',
            value: stats.cardsReviewed,
            icon: '✅',
            color: '#ea580c',
            bgColor: '#ffedd5',
        },
    ];

    const quickActions = [
        { title: 'Create New Deck', icon: '➕', link: '/decks/create', color: '#4f46e5' },
        { title: 'Start Study Session', icon: '🎯', link: '/study', color: '#059669' },
        { title: 'Browse Decks', icon: '🔍', link: '/decks', color: '#dc2626' },
        { title: 'View Progress', icon: '📊', link: '/progress', color: '#ea580c' },
    ];

    // Generate recent activity from decks
    const recentActivity = decks
        .slice(0, 4)
        .map((deck) => {
            const date = new Date(deck.created_at);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            let timeAgo = '';
            if (diffDays > 0) {
                timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            } else if (diffHours > 0) {
                timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else {
                timeAgo = 'Just now';
            }
            
            return {
                action: `Created "${deck.title}" deck`,
                time: timeAgo,
                icon: '✨',
            };
        });

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>
                        Welcome back,{' '}
                        <span className="user-name">
                            {user?.email?.split('@')[0] || user?.username || 'User'}
                        </span>
                        ! 👋
                    </h1>
                    <p className="welcome-subtitle">
                        Ready to continue your learning journey?
                    </p>
                </div>
                <div className="header-actions">
                    <button className="action-button primary">
                        <span>🚀</span>
                        Start Studying
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                            <span>{stat.icon}</span>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value" style={{ color: stat.color }}>
                                {stat.value}
                            </h3>
                            <p className="stat-title">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                        <p>Get started quickly with these actions</p>
                    </div>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                className="quick-action-card"
                                style={{ borderLeftColor: action.color }}
                            >
                                <div className="action-icon" style={{ color: action.color }}>
                                    {action.icon}
                                </div>
                                <h3>{action.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <p>Your latest learning activities</p>
                    </div>
                    <div className="activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">{activity.icon}</div>
                                    <div className="activity-content">
                                        <p className="activity-action">{activity.action}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-activity">
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-section decks-section">
                <div className="section-header">
                    <h2>My Decks</h2>
                    <p>Your flashcard decks</p>
                </div>
                {loading ? (
                    <div className="loading-decks">
                        <p>Loading decks...</p>
                    </div>
                ) : decks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <p>You don't have any decks yet.</p>
                        <Link to="/decks/create" className="button-primary">
                            Create Your First Deck
                        </Link>
                    </div>
                ) : (
                    <div className="decks-grid">
                        {decks.map((deck) => (
                            <Link
                                key={deck.id}
                                to={`/decks/${deck.id}`}
                                className="deck-card"
                            >
                                <div className="deck-card-header">
                                    <h3>{deck.title}</h3>
                                    {deck.is_public && (
                                        <span className="public-badge">🌐 Public</span>
                                    )}
                                </div>
                                {deck.description && (
                                    <p className="deck-card-description">{deck.description}</p>
                                )}
                                <div className="deck-card-footer">
                                    <span className="deck-date">
                                        Created {new Date(deck.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="deck-arrow">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="study-progress-section">
                <div className="section-header">
                    <h2>Study Progress</h2>
                    <p>Your learning streak and achievements</p>
                </div>
                <div className="progress-cards">
                    <div className="progress-card">
                        <div className="progress-icon">🔥</div>
                        <div className="progress-content">
                            <h3>7 Day Streak</h3>
                            <p>Keep it up! You're on fire!</p>
                        </div>
                    </div>
                    <div className="progress-card">
                        <div className="progress-icon">🏆</div>
                        <div className="progress-content">
                            <h3>5 Achievements</h3>
                            <p>Unlock more by studying regularly</p>
                        </div>
                    </div>
                    <div className="progress-card">
                        <div className="progress-icon">📈</div>
                        <div className="progress-content">
                            <h3>89% Mastery</h3>
                            <p>Great progress on your cards!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

