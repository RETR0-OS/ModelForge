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

## ⚡ **Quick Start**  
1. **Install** (Python 3.10+):  
   ```bash
   pip install -r requirements.txt  # Includes transformers, peft
   ```  
2. **Run**:  
   ```bash
   uvicorn app:app --reload  # Launches FastAPI server at localhost:8000
   ```
   ```bash
   npm start # Launches the React app at localhost:3000
   ```  
3. **Finetune**:  
   - Select a task (e.g., "Summarization").  
   - Upload a dataset (JSONL with `instruction` and `response` fields).  
   - Click **Start Training** (3 epochs by default).  

## 📂 **Dataset Format**  
```json
[
  {"input": "Enter a really long article here...", "output": "Short summary."},
  {"input": "Enter the poem topic here...", "output": "Roses are red..."}
]
```

## 🛠 **Tech Stack**  
- `transformers` + `peft` (LoRA finetuning)  
- `bitsandbytes` (4-bit quantization)  
- `React` (UI)   

## ❓ **FAQ**  
**Q: No GPU?**  
A: GPU required for now—stay tuned for CPU support!  

**Q: Slow training?**  
A: Reduce epochs/batch size in training configuraiton step.  

---
