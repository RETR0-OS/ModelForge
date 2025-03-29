// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';

const Navbar = ({ appName = "ModelForge" }) => {
  return (
    <nav className="bg-gray-800 p-4 border-b border-orange-500">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3">
            <img src={logo} alt={`${appName} Logo`} className="h-8 w-8 rounded-full border-2 border-orange-500" />
          </div>
          <Link to="/" className="text-orange-500 text-2xl font-bold">{appName}</Link>
        </div>
        <div className="space-x-4">
          <Link to="/finetune/detect" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;