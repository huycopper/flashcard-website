import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateDeck from './pages/CreateDeck';
import DeckDetail from './pages/DeckDetail';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/decks/create"
            element={
              <PrivateRoute>
                <CreateDeck />
              </PrivateRoute>
            }
          />
          <Route
            path="/decks/:id"
            element={
              <PrivateRoute>
                <DeckDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;