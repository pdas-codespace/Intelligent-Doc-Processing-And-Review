import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import HumanReview from './components/HumanReview';
import DocumentDetails from './components/DocumentDetails';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/review" element={<HumanReview />} />
          <Route path="/document/:id" element={<DocumentDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;