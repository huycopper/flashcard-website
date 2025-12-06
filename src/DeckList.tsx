import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DeckList() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetch("/api/decks")
      .then(res => res.json())
      .then(setDecks);
  }, []);

  const deleteDeck = (id: string) => {
    fetch(`/api/decks/${id}`, { method: "DELETE" })
      .then(() => setDecks(decks.filter((d: any) => d.id !== id)));
  };

  return (
    <div>
      <h2>Decks</h2>
      <ul>
        {decks.map((deck: any) => (
          <li key={deck.id}>
            <Link to={`/deck/${deck.id}`}>{deck.name}</Link>
            <button onClick={() => deleteDeck(deck.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeckList;
