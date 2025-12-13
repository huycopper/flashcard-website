import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeckList from "./DeckList";
import DeckDetail from "./DeckDetail";
import CreateDeck from "./CreateDeck";
import DeckManager from "./DeckManager";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Decks</Link> | <Link to="/create">Create Deck</Link>
      </nav>
      <Routes>
        <Route path="/" element={<DeckList />} />
        <Route path="/create" element={<CreateDeck />} />
        <Route path="/deck/:deckId" element={<DeckDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
