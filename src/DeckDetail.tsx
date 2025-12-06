import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DeckDetail() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    fetch(`/api/decks/${deckId}`)
      .then(res => res.json())
      .then(setDeck);

    fetch(`/api/decks/${deckId}/cards`)
      .then(res => res.json())
      .then(setCards);
  }, [deckId]);

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/decks/${deckId}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ front, back }),
    })
      .then(res => res.json())
      .then(card => {
        setCards([...cards, card]);
        setFront("");
        setBack("");
      });
  };

  const deleteCard = (cardId: string) => {
    fetch(`/api/decks/${deckId}/cards/${cardId}`, { method: "DELETE" })
      .then(() => setCards(cards.filter((c: any) => c.id !== cardId)));
  };

  if (!deck) return <div>Loading...</div>;

  return (
    <div>
      <h2>{deck.name}</h2>
      <h3>Cards</h3>
      <ul>
        {cards.map((card: any) => (
          <li key={card.id}>
            <b>{card.front}</b> - {card.back}
            <button onClick={() => deleteCard(card.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addCard}>
        <input
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder="Front"
          required
        />
        <input
          value={back}
          onChange={e => setBack(e.target.value)}
          placeholder="Back"
          required
        />
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
}

export default DeckDetail;
