import React from 'react';

const LandingPage = ({ appDescription = "Transform and customize large language models to your specific needs with just a few clicks." }) => {
  const features = [
    "No-Code Interface",
    "Advanced Tuning",
    "Efficient Training",
    "Hardware Optimized"
  ];

  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="hero-section py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful LLM Finetuning <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Without Code</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {appDescription}
            </p>

            <div className="space-x-4 flex flex-wrap justify-center gap-4">
              <a href="/finetune/detect" className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-lg text-lg font-medium transition shadow-lg hover:shadow-orange-500/30">
                Start Finetuning
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#features" className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition">
                Learn More
              </a>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="mt-16 relative h-64 hidden md:block">
            {[/* Floating cards content remains same */].map((card, index) => (
              <div key={index} className={`absolute ${card.positionClasses} animate-float-${card.speed}`}>
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-orange-500/20 w-48">
                  {/* Card content */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            ModelForge makes finetuning large language models accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-orange-500/10 transition group">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderFeatureIcon(index)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-400 text-sm">
                    {getFeatureDescription(index)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="process-section py-16 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Three simple steps to customize models for your specific use case
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative">
                <div className="absolute -left-3 -top-3 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-2xl">
                  {step}
                </div>
                <div className="bg-gray-800 p-6 rounded-xl h-full pl-10">
                  <h3 className="text-xl font-semibold mb-4">
                    {getStepTitle(step)}
                  </h3>
                  <p className="text-gray-400">
                    {getStepDescription(step)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section py-20 text-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to customize your LLM?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start finetuning your models in minutes with our guided process.
          </p>
          <a href="/finetune/detect" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg text-lg font-medium transition inline-flex items-center group">
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper functions for dynamic content
const renderFeatureIcon = (index) => {
  switch(index) {
    case 0: return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
    // Add other cases for different icons
  }
};

const getFeatureDescription = (index) => {
  const descriptions = [
    "Simple visual interface that removes the complexity of LLM tuning",
    "Advanced tuning techniques without writing a single line of code",
    "Memory-efficient training that runs on consumer hardware",
    "Optimized for maximum performance on your local CUDA devices"
  ];
  return descriptions[index];
};

const getStepTitle = (step) => {
  const titles = [
    "Hardware Detection",
    "Configure Training",
    "Start Finetuning"
  ];
  return titles[step - 1];
};

const getStepDescription = (step) => {
  const descriptions = [
    "ModelForge automatically analyzes your system and recommends the optimal configuration for your hardware.",
    "Select your base model, upload your training data and adjust parameters with intuitive controls.",
    "Launch the training process with one click and monitor progress in real time with interactive visualizations."
  ];
  return descriptions[step - 1];
};

export default LandingPage;