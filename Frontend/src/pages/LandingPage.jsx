// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// import '../styles/landing.css';

const LandingPage = ({ appName }) => {
  // Keeping the features array exactly as used in the original template
  const features = [
    "Intuitive no-code interface",
    "PEFT and LoRA-based finetuning",
    "4-bit/8-bit quantization",
    "GPU-accelerated performance"
  ];
  
  const appDescription = "No-code LLM finetuning for CUDA environments";

  return (
    <div>
        <div className="landing-container">
        <p>hello</p>
        </div>
    </div>
  );
};

export default LandingPage;