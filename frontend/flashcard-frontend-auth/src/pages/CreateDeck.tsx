import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeck } from '../services/deckService';

const CreateDeck: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title.trim()) {
            setError('Deck title is required');
            setLoading(false);
            return;
        }

        try {
            const deck = await createDeck(title.trim(), description.trim(), isPublic);
            // Navigate to deck detail page to add cards
            navigate(`/decks/${deck.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to create deck');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-deck-page">
            <div className="page-header">
                <h1>Create New Deck</h1>
                <p>Create a new flashcard deck to organize your study materials</p>
            </div>

            <div className="form-container">
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="deck-form">
                    <div className="form-group">
                        <label htmlFor="title">
                            <span className="label-text">Deck Title *</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Spanish Vocabulary, Math Formulas"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <span className="label-text">Description</span>
                            <span className="label-hint">(Optional)</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this deck is about..."
                            rows={4}
                            maxLength={500}
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span>Make this deck public</span>
                            <span className="checkbox-hint">
                                (Others can view and use your deck)
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="button-secondary"
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="button-primary"
                            disabled={loading || !title.trim()}
                        >
                            {loading ? 'Creating...' : 'Create Deck'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDeck;

