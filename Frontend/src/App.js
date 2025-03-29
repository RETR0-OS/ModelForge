// src/App.jsx
import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
// import DetectHardwarePage from './pages/DetectHardwarePage';
// import FinetuningSettingsPage from './pages/FinetuningSettingsPage';
import './index.css';

const RedirectToFastAPI = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/";
  }, []);

  return null; // Render nothing while redirecting
};

function App() {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route
            path="/app"
            element={<DetectHardwarePage />}
          /> */}
          <Route
            path="/app"
            element={<RedirectToFastAPI />}
          />
        </Routes>
        {/* </Routes> */}
      </div>
    </Router>
  );
}

export default App;