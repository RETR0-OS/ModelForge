import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const Navbar = ({ appName = "ModelForge" }) => {
  return (
    <nav className="bg-black py-4 px-6 border-b border-orange-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-orange-500 text-2xl font-bold">{appName}</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link to="/finetune/detect" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-medium transition">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;