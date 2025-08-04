import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import LandingPage from './pages/LandingPage';
import AnalysisForm from './pages/AnalysisForm';
import ResultsDashboard from './pages/ResultsDashboard';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<AnalysisForm />} />
          <Route path="/results" element={<ResultsDashboard />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;