# ModelForge 🔧⚡

**Finetune LLMs on your laptop’s GPU—no code, no PhD, no hassle.**  

![logo](https://github.com/user-attachments/assets/12b3545d-0e8b-4460-9291-d0786c9cb0fa)


## 🚀 **Features**  
- **GPU-Powered Finetuning**: Optimized for NVIDIA GPUs (even 4GB VRAM).  
- **One-Click Workflow**: Upload data → Pick task → Train → Test.  
- **Hardware-Aware**: Auto-detects your GPU/CPU and recommends models.  
- **React UI**: No CLI or notebooks—just a friendly interface.  

## 📖 Supported Tasks
- **Text-Generation**: Generates answers in the form of text based on prior and fine-tuned knowledge. Ideal for use cases like customer support chatbots, story generators, social media script writers, code generators, and general-purpose chatbots.
- **Summarization**: Generates summaries for long articles and texts. Ideal for use cases like news article summarization, law document summarization, and medical article summarization.
- **Extractive Question Answering**: Finds the answers relevant to a query from a given context. Best for use cases like Retrieval Augmented Generation (RAG), and enterprise document search (for example, searching for information in internal documentation).

## Installation
### Prerequisites
- **Python==3.11.x**: Ensure you have Python installed.
- **NVIDIA GPU**: Recommended VRAM >= 6GB.
- **CUDA**: Ensure CUDA is installed and configured for your GPU.
- **HuggingFace Account**: Create an account on [Hugging Face](https://huggingface.co/) and [generate a finegrained access token](https://huggingface.co/settings/tokens).

### Steps
1. **Install the Package**:  
   ```bash
   pip install modelforge-finetuning
   ```

2. **Set HuggingFace API Key in environment variables**:<br>
   Linux:
   ```bash
   export HUGGINGFACE_TOKEN=your_huggingface_token
   ```
   Windows Powershell:
   ```bash
   $env:HUGGINGFACE_TOKEN="your_huggingface_token"
   ```
   Windows CMD:
   ```bash
   set HUGGINGFACE_TOKEN=your_huggingface_token
   ```
   Or use a .env file:
    ```bash
    echo "HUGGINGFACE_TOKEN=your_huggingface_token" > .env
    ```

3. **Install Appropriate CUDA version for PyTorch**:
   -  Navigate to the [PyTorch installation page](https://pytorch.org/get-started/locally/) and select the appropriate CUDA version for your system.
   - Install PyTorch with the correct CUDA version. For example, for CUDA 12.6 on Windows, you can use:
   ```bash
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
    ```

4. **Run the Application**:
   ```bash
   modelforge run
   ```

5. **Done!**:
   Navigate to [http://localhost:8000](http://localhost:8000) in your browser and get started!

### **Running the Application Again in the Future**
1. **Start the Application**:
   ```bash
   modelforge run
   ```
2. **Navigate to the App**:  
   Open your browser and go to [http://localhost:8000](http://localhost:8000).

### **Stopping the Application**
To stop the application and free up resources, press `Ctrl+C` in the terminal running the app.

## 📂 **Dataset Format**  
```jsonl
{"input": "Enter a really long article here...", "output": "Short summary."},
{"input": "Enter the poem topic here...", "output": "Roses are red..."}
```

## 🛠 **Tech Stack**  
- `transformers` + `peft` (LoRA finetuning)  
- `bitsandbytes` (4-bit quantization)  
- `React` (UI)   
- `FastAPI` (Backend)
- `Python` (Backend)
- `React.JS` (Frontend)