// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Import Shared Components
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

// Import Page Components
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';


const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Footer appears on all pages */}
        <Footer />
      </Router>
    </DndProvider>
  );
};

export default App;
