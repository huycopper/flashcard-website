import React, { useEffect, useState } from "react";

export default function DeckManager() {
  const [view, setView] = useState<"list" | "create" | "deck">("list");
  const [decks, setDecks] = useState<any[]>([]);
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [deckName, setDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    if (view === "list") {
      fetch("/api/decks").then(res => res.json()).then(setDecks);
    }
  }, [view]);

  const openDeck = (d: any) => {
    setDeck(d);
    fetch(`/api/decks/${d.id}/cards`).then(res => res.json()).then(setCards);
    setView("deck");
  };

  const createDeck = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: deckName }),
    }).then(() => { setView("list"); setDeckName(""); });
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/decks/${deck.id}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ front, back }),
    }).then(res => res.json()).then(card => {
      setCards([...cards, card]);
      setFront(""); setBack("");
    });
  };

  const deleteDeck = (id: string) => {
    fetch(`/api/decks/${id}`, { method: "DELETE" })
      .then(() => setDecks(decks.filter(d => d.id !== id)));
  };

  const deleteCard = (cardId: string) => {
    fetch(`/api/decks/${deck.id}/cards/${cardId}`, { method: "DELETE" })
      .then(() => setCards(cards.filter(c => c.id !== cardId)));
  };

  if (view === "create") {
    return (
      <form onSubmit={createDeck}>
        <h2>Create Deck</h2>
        <input value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="Deck name" required />
        <button type="submit">Create</button>
        <button type="button" onClick={() => setView("list")}>Back</button>
      </form>
    );
  }

  if (view === "deck" && deck) {
    return (
      <div>
        <h2>{deck.name}</h2>
        <button onClick={() => setView("list")}>Back</button>
        <ul>
          {cards.map(card => (
            <li key={card.id}>
              <b>{card.front}</b> - {card.back}
              <button onClick={() => deleteCard(card.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addCard}>
          <input value={front} onChange={e => setFront(e.target.value)} placeholder="Front" required />
          <input value={back} onChange={e => setBack(e.target.value)} placeholder="Back" required />
          <button type="submit">Add Card</button>
        </form>
      </div>
    );
  }

  // Deck list view
  return (
    <div>
      <h2>Decks</h2>
      <button onClick={() => setView("create")}>Create Deck</button>
      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <button onClick={() => openDeck(deck)}>{deck.name}</button>
            <button onClick={() => deleteDeck(deck.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
