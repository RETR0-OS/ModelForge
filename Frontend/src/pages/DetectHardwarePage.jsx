import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HardwareDetection = ({ currentSettings, updateSettings }) => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [selectedTask, setSelectedTask] = useState(currentSettings.task || '');
  const [selectedModel, setSelectedModel] = useState(currentSettings.model_name || '');
  const [hardwareData, setHardwareData] = useState(null);
  const [stateUpdated, setStateUpdated] = useState(false);

  useEffect(() => {
    setShowResults(false);
  }, [selectedTask]);
  // Synchronize local state with props
  useEffect(() => {
    console.log("Current settings from props:", currentSettings);
    setSelectedTask(currentSettings.task || '');
    setSelectedModel(currentSettings.model_name || '');
  }, [currentSettings]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        console.log('Selected Task:', selectedTask);
        const resp = await fetch('http://localhost:8000/finetune/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: selectedTask })
        });

        const mockResponse = await resp.json();
        if (!resp.ok){
            throw new Error('Failed to fetch hardware data');
        }

        setHardwareData(mockResponse);
        setShowResults(true);
      
      // Save both the task and hardware config in the same update
      const updatedSettings = {
        task: selectedTask,
        hardware_config: {
          gpu: mockResponse.gpu_name,
          ram: mockResponse.ram_total_gb,
          disk: mockResponse.available_diskspace_gb,
          cpu_cores: mockResponse.cpu_cores,
        }
      };
      
      console.log('Updating both task and hardware config:', updatedSettings);
      
      updateSettings((prevSettings) => {
        console.log('Previous Settings in handleSubmit:', prevSettings);
        const newSettings = {
          ...prevSettings,
          ...updatedSettings
        };
        console.log('New Settings in handleSubmit:', newSettings);
        return newSettings;
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleConfigureTraining = () => {
    console.log('Selected Task before update:', selectedTask);
    console.log('Selected Model before update:', selectedModel);
    
    // Direct update (not using a function) to ensure immediate update
    const updatedSettings = {
      task: selectedTask,
      model_name: selectedModel
    };
    
    console.log('Updating task settings (direct update):', updatedSettings);
    
    // Update parent component state using direct object instead of function
    updateSettings(updatedSettings);
    
    // Set state updated flag and navigate
    setStateUpdated(true);
    setTimeout(() => {
      navigate('/finetune/load_settings');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hardware Detection</h1>
        <p className="text-lg text-gray-300 mb-6">
          Let's check your system to find the optimal configuration for LLM finetuning
        </p>
      </div>

      {stateUpdated && (
        <div className="bg-green-700 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
          <div>Settings updated successfully! Redirecting to configuration page...</div>
          <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
        </div>
      )}

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

        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="text-xl font-medium mb-4">Select Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {tasks.map((task) => (
    <div 
      key={task.id}
      onClick={() => setSelectedTask(task.id)}
      className={`
        task-card p-5 rounded-lg cursor-pointer transition-all
        ${selectedTask === task.id 
          ? 'bg-gray-800 border-2 border-orange-500' 
          : 'bg-gray-800 border border-gray-700'}
        hover:border-orange-500 hover:bg-gray-700
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-medium text-orange-500">{task.title}</h4>
        {selectedTask === task.id && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className="text-gray-400 text-sm">{task.description}</p>
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

        {showResults && hardwareData && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-medium mb-4">Hardware Detection Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">System Profile</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.profile}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">GPU</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.gpu_name}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">GPU Memory</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.gpu_total_memory_gb} GB</div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">System RAM</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.ram_total_gb} GB</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Available Disk Space</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.available_diskspace_gb} GB</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">CPU Cores</label>
                  <div className="p-3 bg-gray-900 rounded-lg text-white">{hardwareData.cpu_cores}</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Recommended Model</label>
              <div className="p-3 bg-gray-900 rounded-lg text-white font-medium text-orange-500">
                {hardwareData.model_recommendation}
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-400 mb-1">
                Select Your Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={async (e) => {
                  console.log('Setting model to:', e.target.value);
                  setSelectedModel(e.target.value);
                  await fetch(`http://localhost:8000/finetune/set_model`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      selected_model: e.target.value,
                    }),
                  });
                }}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 w-full text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select a model</option>
                {hardwareData.possible_options?.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

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
          onClick={handleConfigureTraining}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedModel || !showResults}
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
