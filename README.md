# ModelForge 🔧⚡

**Finetune LLMs on your laptop’s GPU—no code, no PhD, no hassle.**  

![logo](https://github.com/user-attachments/assets/12b3545d-0e8b-4460-9291-d0786c9cb0fa)


## 🚀 **Features**  
- **GPU-Powered Finetuning**: Optimized for NVIDIA GPUs (even 4GB VRAM).  
- **One-Click Workflow**: Upload data → Pick task → Train → Test.  
- **Hardware-Aware**: Auto-detects your GPU/CPU and recommends models.  
- **React UI**: No CLI or notebooks—just a friendly interface.  

## ⚡ **Quick Start**  
1. **Install** (Python 3.10+):  
   ```bash
   pip install -r requirements.txt  # Includes transformers, peft, gradio
   ```  
2. **Run**:  
   ```bash
   python app.py  # Launches FastAPI server at localhost:8000
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
  {"instruction": "Summarize this", "input": "Enter a really long article here...", "response": "Short summary."},
  {"instruction": "Write a poem", "input": "Enter the poem topic here...", "response": "Roses are red..."}
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

*Built in 48 hours at DevhacksXStrategy.* 🚀  
