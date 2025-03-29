import React, { useState } from 'react';

const HardwareDetection = () => {
  const [selectedTask, setSelectedTask] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels] = useState(['llama2-7b', 'mistral-7b', 'falcon-7b']); // Example models

  // Mock hardware data - replace with actual detection logic
  const hardwareData = {
    profile: 'Standard Configuration',
    gpu: 'NVIDIA RTX 3090',
    gpuMemory: '24GB',
    ram: '32GB DDR4',
    disk: '512GB SSD',
    cpuCores: '8 cores',
    recommendedModel: 'llama2-7b'
  };

  const tasks = [
    {
      id: 'text-generation',
      title: 'Text Generation',
      description: 'Create models for generating coherent and contextually relevant text'
    },
    {
      id: 'summarization',
      title: 'Summarization',
      description: 'Train models that can condense long documents into concise summaries'
    },
    {
      id: 'question-answering',
      title: 'Question Answering',
      description: 'Build models that provide accurate answers to specific questions'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add actual hardware detection logic here
    setShowResults(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hardware Detection</h1>
        <p className="text-lg text-gray-300 mb-6">
          Let's check your system to find the optimal configuration for LLM finetuning
        </p>
      </div>

      {/* Hardware Detection Card */}
      <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          System Hardware Configuration
        </h2>

        {/* Task Selection */}
        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="text-xl font-medium mb-4">Select Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card border ${
                  selectedTask === task.id ? 'border-orange-500' : 'border-gray-700'
                } hover:border-orange-500 p-5 rounded-lg cursor-pointer transition-all`}
                onClick={() => setSelectedTask(task.id)}
              >
                <input
                  type="radio"
                  name="task"
                  value={task.id}
                  id={task.id}
                  className="hidden"
                  checked={selectedTask === task.id}
                  onChange={() => {}}
                />
                <label htmlFor={task.id} className="block h-full cursor-pointer">
                  <h4 className="text-lg font-medium text-orange-500 mb-2">{task.title}</h4>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!selectedTask}
            >
              Detect Hardware
            </button>
          </div>
        </form>

        {/* Hardware Results */}
        {showResults && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-medium mb-4">Hardware Detection Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">System Profile</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.profile}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">GPU</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.gpu}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">GPU Memory</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.gpuMemory}</div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">System RAM</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.ram}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Available Disk Space</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.disk}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">CPU Cores</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.cpuCores}</div>
                </div>
              </div>
            </div>

            {/* Model Recommendation */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Recommended Model</label>
              <div className="p-3 bg-gray-900 rounded-lg text-white font-medium text-orange-500">
                {hardwareData.recommendedModel}
              </div>
            </div>

            {/* Model Selection */}
            <div className="mt-6">
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-400 mb-1">
                Select Your Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 w-full text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select a model</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps Navigation */}
      <div className="text-center mb-8">
        <a
          href="/"
          className="text-orange-500 hover:text-orange-400 mr-6 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Back to Home
        </a>
        <button
          onClick={() => window.location.href = '/finetune/load_settings'}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedModel}
        >
          Configure Training
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HardwareDetection;