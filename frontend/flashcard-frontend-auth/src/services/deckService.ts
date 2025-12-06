import apiClient from '../api/apiClient';

export interface Deck {
    id: string;
    title: string;
    description?: string;
    is_public: boolean;
    owner_id: string;
    created_at: string;
    updated_at?: string;
}

export interface Card {
    id: string;
    deck_id: string;
    front: string;
    back: string;
    created_at: string;
}

export interface DeckWithCards {
    deck: Deck;
    cards: Card[];
}

// Get all decks for the current user
export const getDecks = async (): Promise<Deck[]> => {
    const response = await apiClient.get('/decks');
    return response.data;
};

// Create a new deck
export const createDeck = async (
    title: string,
    description?: string,
    is_public: boolean = false
): Promise<Deck> => {
    const response = await apiClient.post('/decks', {
        title,
        description,
        is_public,
    });
    return response.data;
};

// Get a specific deck with its cards
export const getDeck = async (deckId: string): Promise<DeckWithCards> => {
    const response = await apiClient.get(`/decks/${deckId}`);
    return response.data;
};

// Add a card to a deck
export const addCard = async (
    deckId: string,
    front: string,
    back: string
): Promise<Card> => {
    const response = await apiClient.post(`/decks/${deckId}/cards`, {
        front,
        back,
    });
    return response.data;
};

// Get deck statistics
export const getDeckStats = async (deckId: string): Promise<any> => {
    const response = await apiClient.get(`/decks/${deckId}/stats`);
    return response.data;
};

export const deckService = {
    getDecks,
    createDeck,
    getDeck,
    addCard,
    getDeckStats,
};

