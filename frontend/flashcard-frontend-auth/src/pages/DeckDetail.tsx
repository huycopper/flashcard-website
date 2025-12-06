import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, addCard, DeckWithCards } from '../services/deckService';

const DeckDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deckData, setDeckData] = useState<DeckWithCards | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddCard, setShowAddCard] = useState(false);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [addingCard, setAddingCard] = useState(false);

    useEffect(() => {
        if (id) {
            loadDeck();
        }
    }, [id]);

    const loadDeck = async () => {
        if (!id) return;
        setLoading(true);
        setError('');
        try {
            const data = await getDeck(id);
            setDeckData(data);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to load deck');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !front.trim() || !back.trim()) {
            return;
        }

        setAddingCard(true);
        try {
            await addCard(id, front.trim(), back.trim());
            setFront('');
            setBack('');
            setShowAddCard(false);
            // Reload deck to show new card
            await loadDeck();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to add card');
        } finally {
            setAddingCard(false);
        }
    };

    if (loading) {
        return (
            <div className="deck-detail-page">
                <div className="loading-container">
                    <p>Loading deck...</p>
                </div>
            </div>
        );
    }

    if (error && !deckData) {
        return (
            <div className="deck-detail-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="button-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!deckData) {
        return null;
    }

    const { deck, cards } = deckData;

    return (
        <div className="deck-detail-page">
            <div className="deck-header">
                <div className="deck-header-content">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="back-button"
                    >
                        ← Back
                    </button>
                    <div className="deck-info">
                        <h1>{deck.title}</h1>
                        {deck.description && <p className="deck-description">{deck.description}</p>}
                        <div className="deck-meta">
                            <span className="meta-item">
                                <span className="meta-icon">🃏</span>
                                {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
                            </span>
                            {deck.is_public && (
                                <span className="meta-item public-badge">
                                    <span className="meta-icon">🌐</span>
                                    Public
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="button-primary add-card-button"
                >
                    {showAddCard ? 'Cancel' : '+ Add Card'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {showAddCard && (
                <div className="add-card-form-container">
                    <h2>Add New Card</h2>
                    <form onSubmit={handleAddCard} className="card-form">
                        <div className="form-group">
                            <label htmlFor="front">
                                <span className="label-text">Front (Question) *</span>
                            </label>
                            <textarea
                                id="front"
                                value={front}
                                onChange={(e) => setFront(e.target.value)}
                                placeholder="Enter the question or prompt..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="back">
                                <span className="label-text">Back (Answer) *</span>
                            </label>
                            <textarea
                                id="back"
                                value={back}
                                onChange={(e) => setBack(e.target.value)}
                                placeholder="Enter the answer..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="button-secondary"
                                onClick={() => {
                                    setShowAddCard(false);
                                    setFront('');
                                    setBack('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button-primary"
                                disabled={addingCard || !front.trim() || !back.trim()}
                            >
                                {addingCard ? 'Adding...' : 'Add Card'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="cards-section">
                <h2>Cards ({cards.length})</h2>
                {cards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🃏</div>
                        <p>No cards yet. Add your first card to get started!</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {cards.map((card) => (
                            <div key={card.id} className="card-item">
                                <div className="card-front">
                                    <div className="card-label">Front</div>
                                    <div className="card-content">{card.front}</div>
                                </div>
                                <div className="card-divider">⇄</div>
                                <div className="card-back">
                                    <div className="card-label">Back</div>
                                    <div className="card-content">{card.back}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeckDetail;

