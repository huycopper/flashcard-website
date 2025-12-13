import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateDeck() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(() => navigate("/"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Deck</h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Deck name"
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateDeck;
