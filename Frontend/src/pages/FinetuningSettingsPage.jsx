import React, { useState } from 'react';

const FinetuneSettings = ({ defaultValues }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formState, setFormState] = useState({
    num_train_epochs: defaultValues.num_train_epochs || 3,
    lora_r: defaultValues.lora_r || 16,
    max_seq_length: defaultValues.max_seq_length || 512,
    lora_alpha: defaultValues.lora_alpha || 32,
    lora_dropout: defaultValues.lora_dropout || 0.05,
    quantization: defaultValues.use_4bit ? '4bit' : defaultValues.load_in_8bit ? '8bit' : 'none',
    bnb_4bit_compute_dtype: defaultValues.bnb_4bit_compute_dtype || 'nf4',
    bnb_4bit_use_quant_type: defaultValues.bnb_4bit_use_quant_type || false,
    use_nested_quant: defaultValues.use_nested_quant || false,
    bnb_4bit_quant_type: defaultValues.bnb_4bit_quant_type || 'nf4',
    fp16: defaultValues.fp16 || false,
    bf16: defaultValues.bf16 || false,
    per_device_train_batch_size: defaultValues.per_device_train_batch_size || 2,
    per_device_eval_batch_size: defaultValues.per_device_eval_batch_size || 2,
    learning_rate: defaultValues.learning_rate || 2e-4,
    gradient_accumulation_steps: defaultValues.gradient_accumulation_steps || 1,
    max_grad_norm: defaultValues.max_grad_norm || 0.3,
    warmup_ratio: defaultValues.warmup_ratio || 0.03,
    weight_decay: defaultValues.weight_decay || 0.001,
    gradient_checkpointing: defaultValues.gradient_checkpointing || false,
    group_by_length: defaultValues.group_by_length || false,
    packing: defaultValues.packing || false,
    optim: defaultValues.optim || 'paged_adamw_32bit',
    lr_scheduler_type: defaultValues.lr_scheduler_type || 'cosine',
    max_steps: defaultValues.max_steps || -1,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formState);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Finetuning Settings</h1>
        <p className="text-gray-400 mt-2">Configure your model training parameters</p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Configuration Summary */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Task</label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                {defaultValues.task}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                {defaultValues.model_name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Compute Tier</label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                {defaultValues.compute_specs}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="num_train_epochs" className="block text-sm font-medium text-gray-400 mb-1">
                Number of Training Epochs
              </label>
              <input
                type="number"
                id="num_train_epochs"
                name="num_train_epochs"
                min="1"
                max="100"
                value={formState.num_train_epochs}
                onChange={handleInputChange}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 w-full text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            
            {/* Other form fields continue similarly... */}

            <div>
              <label htmlFor="dataset_file" className="block text-sm font-medium text-gray-400 mb-1">
                Dataset File
              </label>
              <div className="flex items-center">
                <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-white">Upload Dataset</span>
                  <input
                    type="file"
                    id="dataset_file"
                    name="dataset_file"
                    accept=".json,.csv,.jsonl"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-orange-500 hover:text-orange-400 transition"
          >
            <span className="mr-2">Advanced Settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-6">
            {/* LoRA Settings */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-white mb-3">LoRA Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lora_alpha" className="block text-sm font-medium text-gray-400 mb-1">
                    LoRA Alpha
                  </label>
                  <input
                    type="number"
                    id="lora_alpha"
                    name="lora_alpha"
                    value={formState.lora_alpha}
                    onChange={handleInputChange}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 w-full text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                {/* Other advanced fields continue similarly... */}
              </div>
            </div>

            {/* BitsAndBytes Settings */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-white mb-3">BitsAndBytes Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="quantization"
                      value="4bit"
                      checked={formState.quantization === '4bit'}
                      onChange={handleInputChange}
                      className="rounded-full bg-gray-900 border-gray-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-400">Load in 4-bit</span>
                  </label>
                </div>
                {/* Other quantization options... */}
              </div>
            </div>

            {/* Other advanced sections... */}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition inline-flex items-center"
          >
            Start Finetuning
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

// Default props for component
FinetuneSettings.defaultProps = {
  defaultValues: {
    task: 'text-generation',
    model_name: 'llama2-7b',
    compute_specs: 'Standard GPU',
    num_train_epochs: 3,
    lora_r: 16,
    max_seq_length: 512,
    use_4bit: true,
    load_in_8bit: false,
    bnb_4bit_compute_dtype: 'nf4',
    bnb_4bit_use_quant_type: false,
    use_nested_quant: false,
    bnb_4bit_quant_type: 'nf4',
    fp16: false,
    bf16: false,
    per_device_train_batch_size: 2,
    per_device_eval_batch_size: 2,
    learning_rate: 2e-4,
    gradient_accumulation_steps: 1,
    max_grad_norm: 0.3,
    warmup_ratio: 0.03,
    weight_decay: 0.001,
    gradient_checkpointing: false,
    group_by_length: false,
    packing: false,
    optim: 'paged_adamw_32bit',
    lr_scheduler_type: 'cosine',
    max_steps: -1
  }
};

export default FinetuneSettings;