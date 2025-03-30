import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TechnicalDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  
  // Technical specifications for different aspects
  const technicalSpecs = {
    architecture: [
      {
        title: "PEFT Implementation",
        description: "Parameter-Efficient Fine-Tuning with LoRA adapters using 4-bit base models",
        details: [
          "Low-Rank Adaptation (LoRA) with configurable rank and alpha parameters",
          "Support for various adapter configurations (LoRA, AdaLoRA, IA³)",
          "Matrix factorization to enable efficient parameter updates",
          "Trainable weight ratio typically <1% of full model parameters"
        ]
      },
      {
        title: "Quantization Framework",
        description: "Automatic quantization for base models using GPTQ and bitsandbytes",
        details: [
          "4-bit quantization with NF4/FP4 data types",
          "8-bit quantization with scaled computation",
          "Support for double quantization for further memory optimization",
          "Nested quantization options for maximum compression"
        ]
      },
      {
        title: "Model Architecture Support",
        description: "Compatible with major transformer architectures",
        details: [
          "Decoder-only: Llama, Mistral, Phi, GPT-2, Falcon",
          "Encoder-only: BERT, RoBERTa, DeBERTa",
          "Encoder-decoder: T5, BART, Flan-T5"
        ]
      }
    ],
    performance: [
      {
        title: "Hardware Profiling",
        description: "Automatic hardware detection and optimization",
        details: [
          "CUDA hardware capability detection",
          "Memory usage optimizations based on available VRAM",
          "Dynamic batch size adjustment",
          "Progressive loading for low-memory environments"
        ]
      },
      {
        title: "Training Efficiency",
        description: "Optimizations for faster training with minimal resources",
        details: [
          "Gradient checkpointing for reduced memory usage",
          "FlashAttention 2.0 integration for faster attention computation",
          "Mixed precision training (BF16/FP16)",
          "Gradient accumulation to simulate larger batch sizes"
        ]
      },
      {
        title: "Resource Requirements",
        description: "Minimum and recommended system specifications",
        details: [
          "Minimum: CUDA-capable GPU with 6GB VRAM, 16GB system RAM",
          "Recommended: NVIDIA GPU with 12GB+ VRAM, 32GB system RAM",
          "Optimal: NVIDIA RTX 3090/4090 or A100 with 24GB+ VRAM",
          "Storage: 20GB+ free space for base models and adapters"
        ]
      }
    ],
    data: [
      {
        title: "Dataset Processing",
        description: "Advanced data preparation pipeline",
        details: [
          "JSON/JSONL format support with configurable prompting templates",
          "Automatic train/validation splitting",
          "Tokenization with special token handling",
          "On-the-fly data augmentation options"
        ]
      },
      {
        title: "Training Formats",
        description: "Multiple training paradigms for different use cases",
        details: [
          "Instruction fine-tuning with optional system prompts",
          "Conversation fine-tuning with multi-turn support",
          "Supervised fine-tuning for specific tasks",
          "Custom formatting with template engine"
        ]
      },
      {
        title: "Data Requirements",
        description: "Guidance on dataset preparation",
        details: [
          "Recommended minimum: 100+ high-quality examples",
          "Optimal range: 1,000-10,000 examples",
          "Format validation with automatic error detection",
          "Handling of long-context training data"
        ]
      }
    ],
    hyperparameters: [
      {
        title: "Learning Parameters",
        description: "Configurable optimization settings",
        details: [
          "Learning rate: 1e-5 to 2e-4 (adaptive range based on task)",
          "Schedulers: Cosine, linear, constant, warmup",
          "Weight decay: 0.01-0.001 for regularization",
          "Gradient clipping at 1.0 to prevent explosions"
        ]
      },
      {
        title: "LoRA Configuration",
        description: "Fine-grained control over adapter training",
        details: [
          "Rank (r): 8, 16, 32, 64 options (complexity vs. performance)",
          "Alpha (α): Typically 2x rank for stable training",
          "Target modules: Configurable matrix selection",
          "Dropout: 0.05-0.1 for regularization"
        ]
      },
      {
        title: "Advanced Options",
        description: "Expert-level configuration parameters",
        details: [
          "Sequence packing for maximum throughput",
          "Group by length for optimized batching",
          "Custom optimizer configurations (AdamW, 8-bit Adam)",
          "Framework integration options (DeepSpeed, FSDP)"
        ]
      }
    ]
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Header Section */}
      <header className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-grid-pattern z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">ModelForge</span>
            </Link>
            
            <Link to="/" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="mt-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Technical Documentation</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive technical details for developers and ML engineers
            </p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-0 bg-gray-900 z-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar py-4" role="tablist" aria-orientation="horizontal">
            {['architecture', 'performance', 'data', 'hyperparameters'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">System Architecture</h2>
                <p className="text-lg text-gray-300 text-center">
                  ModelForge employs state-of-the-art Parameter-Efficient Fine-Tuning (PEFT) techniques to
                  enable efficient training on consumer hardware with minimal quality compromise.
                </p>
              </div>
              
              {technicalSpecs.architecture.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/30 transition group">
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-500 transition">{spec.title}</h3>
                      <p className="text-gray-300 mt-2">{spec.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {spec.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mt-10">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-500">Technical Note</h4>
                    <p className="text-gray-300 mt-1">
                      The architecture uses a modular adapter approach that modifies only a small subset of
                      parameters during training, keeping the base model frozen. This approach dramatically
                      reduces memory requirements and training time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Performance Optimization</h2>
                <p className="text-lg text-gray-300 text-center">
                  ModelForge automatically optimizes training parameters based on available hardware,
                  enabling high-performance fine-tuning even on consumer-grade GPUs.
                </p>
              </div>
              
              {technicalSpecs.performance.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/30 transition group">
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-500 transition">{spec.title}</h3>
                      <p className="text-gray-300 mt-2">{spec.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {spec.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* GPU Memory Chart */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">GPU Memory Usage by Model Size</h3>
                
                <div className="relative overflow-hidden">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Phi-2 (2.7B)</span>
                        <span>4-6 GB VRAM</span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[20%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Mistral-7B</span>
                        <span>8-12 GB VRAM</span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[40%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Llama-2-13B</span>
                        <span>14-18 GB VRAM</span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[60%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Llama-2-70B</span>
                        <span>40+ GB VRAM</span>
                      </div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[95%]"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 w-full h-px bg-gray-700"></div>
                </div>
                
                <p className="text-gray-400 text-sm mt-6">
                  Memory estimates based on 4-bit quantization with LoRA adapters (r=16). System RAM requirements
                  are typically 2x the VRAM requirements.
                </p>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Data Processing</h2>
                <p className="text-lg text-gray-300 text-center">
                  ModelForge provides advanced data handling capabilities, supporting multiple formats 
                  and training paradigms to accommodate diverse use cases.
                </p>
              </div>
              
              {technicalSpecs.data.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/30 transition group">
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-500 transition">{spec.title}</h3>
                      <p className="text-gray-300 mt-2">{spec.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {spec.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* Example Training Data Formats */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700">
                <div className="border-b border-gray-700 py-3 px-6 flex items-center justify-between">
                  <span className="text-white font-medium">Example Training Data Formats (JSONL)</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <h4 className="text-xl font-medium text-white mb-4">Text Generation</h4>
                  <pre className="text-gray-300 font-mono text-sm mb-8">
{`{
  "instruction": "Write a short story about a robot learning to paint.",
  "input": "The robot's name is Canvas-3000.",
  "output": "Canvas-3000 whirred softly as its optical sensors focused on the blank paper..."
}`}
                  </pre>
                  
                  <h4 className="text-xl font-medium text-white mb-4">Summarization</h4>
                  <pre className="text-gray-300 font-mono text-sm mb-8">
{`{
  "article": "Scientists have discovered a new species of deep-sea creature living near hydrothermal vents...",
  "instruction": "Summarize this scientific discovery in simple terms.",
  "summary": "Scientists found a new creature living near underwater hot springs in the deep ocean..."
}`}
                  </pre>
                  
                  <h4 className="text-xl font-medium text-white mb-4">Question Answering</h4>
                  <pre className="text-gray-300 font-mono text-sm mb-8">
{`{
  "context": "The Great Barrier Reef is the world's largest coral reef system. It is located off the coast of Queensland, Australia...",
  "question": "Where is the Great Barrier Reef located?",
  "answer": "The Great Barrier Reef is located off the coast of Queensland, Australia."
}`}
                  </pre>
                  
                  <h4 className="text-xl font-medium text-white mb-4">Conversation</h4>
                  <pre className="text-gray-300 font-mono text-sm">
{`{
  "conversations": [
    {"role": "system", "content": "You are a helpful AI assistant."},
    {"role": "user", "content": "Can you explain how neural networks work?"},
    {"role": "assistant", "content": "Neural networks are computing systems inspired by biological neural networks..."}
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Hyperparameters Tab */}
          {activeTab === 'hyperparameters' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Hyperparameter Configuration</h2>
                <p className="text-lg text-gray-300 text-center">
                  ModelForge provides fine-grained control over training hyperparameters with sensible
                  defaults for beginners and advanced options for experts.
                </p>
              </div>
              
              {technicalSpecs.hyperparameters.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/30 transition group">
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-500 transition">{spec.title}</h3>
                      <p className="text-gray-300 mt-2">{spec.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {spec.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* Hyperparameter Recommendations */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mt-10">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-500">Recommended Configurations</h4>
                    <p className="text-gray-300 mt-1">
                      For most use cases, we recommend starting with LoRA rank (r) = 16, learning rate = 2e-4, 
                      and 3 epochs. For instruction-tuning tasks, use warmup ratio = 0.03 and weight decay = 0.01.
                      Adjust batch size based on your GPU memory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">ModelForge</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">Efficient, no-code LLM finetuning for everyone</p>
              <Link to="/" className="text-orange-500 hover:text-orange-400 transition mt-2 inline-block">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Styling for hiding scrollbars but keeping functionality */}
      <style jsx="true">{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(255, 83, 51, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default TechnicalDetailsPage;