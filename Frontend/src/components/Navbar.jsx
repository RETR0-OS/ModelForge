import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/LandingPage.css';

const Navbar = ({ appName = "ModelForge" }) => {
  // Get current location
  const location = useLocation();
  
  // Only show the Get Started button on the home/landing page
  const showGetStartedButton = location.pathname === '/' || location.pathname === '/home';
  
  // Determine if navigation should be disabled
  const disableNavigation = location.pathname === '/finetune/load_settings' || 
                            location.pathname === '/finetune/loading';

  return (
    <nav className="bg-black py-4 px-6 border-b border-orange-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {disableNavigation ? (
            // When in settings page, logo is just text, not a link
            <span className="text-orange-500 text-2xl font-bold">{appName}</span>
          ) : (
            // Otherwise, logo is a link to home
            <Link to="/" className="text-orange-500 text-2xl font-bold">{appName}</Link>
          )}
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          {showGetStartedButton && (
            <Link to="/finetune/detect" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-medium transition">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;