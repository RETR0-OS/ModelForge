# ModelForge 🔧⚡

**Finetune Mistral-7B or TinyLlama on your laptop’s GPU—no code, no PhD, no hassle.**  

![Demo GIF](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW0yN2cyb2VkOGVnbGJ6cmVjZGNzOHJtY3BneGJ0eW1iZ2R6eGJ0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4kI2X9y7M4N3WU/giphy.gif) *(placeholder: replace with your demo GIF)*  

## 🚀 **Features**  
- **GPU-Powered Finetuning**: Optimized for NVIDIA GPUs (even 4GB VRAM).  
- **One-Click Workflow**: Upload data → Pick task → Train → Export GGUF.  
- **Hardware-Aware**: Auto-detects your GPU/CPU and recommends models.  
- **Gradio UI**: No CLI or notebooks—just a friendly interface.  

## ⚡ **Quick Start**  
1. **Install** (Python 3.10+):  
   ```bash
   pip install -r requirements.txt  # Includes transformers, peft, gradio
   ```  
2. **Run**:  
   ```bash
   python app.py  # Launches Gradio UI at localhost:7860
   ```  
3. **Finetune**:  
   - Select a task (e.g., "Summarization").  
   - Upload a dataset (CSV/JSON with `instruction` and `response` fields).  
   - Click **Start Training** (3 epochs by default).  

## 📂 **Dataset Format**  
```json
[
  {"instruction": "Summarize this", "response": "Short summary."},
  {"instruction": "Write a poem", "response": "Roses are red..."}
]
```

## 🛠 **Tech Stack**  
- `transformers` + `peft` (LoRA finetuning)  
- `bitsandbytes` (4-bit quantization)  
- `gradio` (UI)  
- `llama.cpp` (GGUF export)  

## ❓ **FAQ**  
**Q: No GPU?**  
A: GPU required for now—stay tuned for CPU support!  

**Q: Slow training?**  
A: Reduce epochs/batch size in `app.py` (hardcoded defaults).  

---

*Built in 48 hours at DevhacksXStrategy.* 🚀  
