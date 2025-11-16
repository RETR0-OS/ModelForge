# macOS Installation Guide

Setup guide for ModelForge on macOS. **Note**: NVIDIA GPUs are not available on modern Macs, so this guide is for Intel Macs with NVIDIA GPUs or for CPU-only development/testing.

## ⚠️ Important Limitations

- **Apple Silicon (M1/M2/M3)**: Currently **not supported**. ModelForge requires NVIDIA CUDA.
- **Intel Macs without NVIDIA GPU**: Can run in CPU mode (very slow, not recommended for training).
- **Intel Macs with NVIDIA GPU** (2013 and older): Can run with CUDA support.

For production use, we recommend:
- Linux workstation with NVIDIA GPU
- Cloud instances (AWS, GCP, Azure) with NVIDIA GPUs
- Remote development on Linux server

## Prerequisites

- **macOS 10.15 or later**
- **Python 3.11.x** (Python 3.12 not yet supported)
- **NVIDIA GPU** (only on older Intel Macs)
- **Homebrew** package manager

## Installation Steps

### 1. Install Homebrew

If not already installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Python 3.11

```bash
brew install python@3.11
```

Verify:
```bash
python3.11 --version
```

### 3. Create Virtual Environment

```bash
# Create project directory
mkdir ~/ModelForge
cd ~/ModelForge

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### 4. Install ModelForge

```bash
pip install modelforge-finetuning
```

### 5. Install PyTorch

**For CPU-only (Apple Silicon or Intel without NVIDIA):**
```bash
pip install torch torchvision torchaudio
```

**For Intel Macs with NVIDIA GPU:**
```bash
# Install CUDA-enabled PyTorch (legacy)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### 6. Set HuggingFace Token

```bash
export HUGGINGFACE_TOKEN="your_token_here"

# Or add to .zshrc for persistence
echo 'export HUGGINGFACE_TOKEN="your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

### 7. Run ModelForge

```bash
modelforge run
```

Open browser to: `http://localhost:8000`

## CPU-Only Mode Considerations

If running without NVIDIA GPU:

1. **Very Slow Training**: CPU training is 10-100x slower than GPU
2. **Limited Model Size**: Only small models (< 1B parameters)
3. **Development Only**: Not recommended for production training
4. **Testing**: Good for testing workflows and UI

**Recommended Configuration for CPU:**
```json
{
  "model_name": "distilgpt2",  // Small model
  "num_train_epochs": 1,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 4,
  "use_4bit": false,  // No quantization on CPU
  "bf16": false,
  "fp16": false
}
```

## Cloud Alternatives

For serious LLM fine-tuning on macOS, consider:

### Option 1: Cloud GPU Instances

**Google Colab Pro:**
- $10/month
- NVIDIA T4/V100 GPUs
- Jupyter notebooks
- Easy setup

**AWS EC2 (g4dn instances):**
- Pay per use
- NVIDIA T4 GPUs
- Full Linux environment
- Scalable

**Lambda Labs:**
- GPU cloud specialist
- NVIDIA A100/H100 GPUs
- Pre-configured for ML
- Cost-effective

### Option 2: Remote Development

Connect to a remote Linux server:

1. Set up Linux server with NVIDIA GPU
2. Install ModelForge on server
3. Access via SSH tunnel:
   ```bash
   ssh -L 8000:localhost:8000 user@remote-server
   ```
4. Open `http://localhost:8000` on Mac

## Docker Alternative (Development)

For testing and development:

```bash
# Install Docker Desktop
brew install --cask docker

# Pull ModelForge image
docker pull retro0s/modelforge:latest

# Run (CPU mode)
docker run -p 8000:8000 \
  -e HUGGINGFACE_TOKEN=your_token_here \
  retro0s/modelforge:latest
```

## Troubleshooting

### "No CUDA GPUs are available"

**Solution**: This is expected on modern Macs. Use cloud GPU or remote server.

### Slow Training Performance

**Solutions**:
1. Use smaller models (distilgpt2, tiny-llama)
2. Reduce batch size to 1
3. Consider cloud GPU instances
4. Use remote Linux server

### Memory Issues

**Solutions**:
1. Close other applications
2. Use smaller models
3. Reduce sequence length
4. Monitor Activity Monitor

## Next Steps

- **[Post-Installation Setup](post-installation.md)** - Configure ModelForge
- **[Quick Start Guide](../getting-started/quickstart.md)** - Run your first training
- **[Cloud Setup Guide](../troubleshooting/cloud-setup.md)** - Use cloud GPUs

---

**For Production**: We strongly recommend using Linux with NVIDIA GPUs. See [Linux Installation](linux.md).
