// src/App.jsx
import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/AppLanding';
import DetectHardwarePage from './pages/DetectHardwarePage';
import FinetuneSettings from './pages/FinetuningSettingsPage';
// import DetectHardwarePage from './pages/DetectHardwarePage';
// import FinetuningSettingsPage from './pages/FinetuningSettingsPage';
import './index.css';

const RedirectToFastAPI = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/";
  }, []);

  return null; // Render nothing while redirecting
};

function App() {
  const defaultValuesFinetuningSettings = {
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
    max_steps: -1,
  };
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/finetune/load_settings" element={<FinetuneSettings defaultValues={defaultValuesFinetuningSettings} />} />
          <Route path="/finetune/detect" element={<DetectHardwarePage />} />
          {/* <Route path="/landing" element={<LandingPage />} /> */}
          {/* <Route
            path="/app"
            element={<DetectHardwarePage />}
          /> */}
          <Route
            path="/app"
            element={<RedirectToFastAPI />}
          />
        </Routes>
        {/* </Routes> */}
      </div>
    </Router>
  );
}

export default App;