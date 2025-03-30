// src/pages/Loading.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Loading.css';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Initializing model...",
    "Loading dataset...",
    "Configuring training parameters...",
    "Preparing LoRA adapters...",
    "Starting training loop...",
    "Training in progress..."
  ];

  useEffect(() => {
    // Simulate progress
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Update step based on progress
        const newStep = Math.floor(oldProgress / (100 / steps.length));
        if (newStep !== currentStep) {
          setCurrentStep(newStep);
        }
        
        return oldProgress + 0.5;
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [currentStep, steps.length]);

  return (
    <div className="loading-container">
      <div className="loading-card">
        <h1 className="loading-title">Finetuning Your Model</h1>
        
        {/* Cool circular animation */}
        <div className="circular-loader-container">
          <div className="orbital-loader">
            <div className="center-core"></div>
            <div className="orbital-ring ring-1"></div>
            <div className="orbital-ring ring-2"></div>
            <div className="orbital-ring ring-3"></div>
            
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            
            <div className="orbital-trail trail-1"></div>
            <div className="orbital-trail trail-2"></div>
            <div className="orbital-trail trail-3"></div>
          </div>
        </div>
        
        <div className="step-indicator">
          <p className="current-step">{steps[currentStep]}</p>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
          <div className="progress-text">{Math.floor(progress)}%</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;