# Hardware Profiles

Optimize ModelForge for your GPU with hardware-aware model recommendations and configurations.

## Overview

Hardware profiles automatically detect your system capabilities and recommend optimal models and settings. This ensures you get the best performance without manual configuration.

## How Hardware Profiles Work

```
System Scan
    ↓
Detect GPU VRAM + System RAM
    ↓
Classify into Profile (low_end/mid_range/high_end)
    ↓
Recommend Models + Settings
    ↓
Apply Optimizations
```

## Available Profiles

ModelForge classifies hardware into three profiles based on GPU VRAM and system RAM:

### 1. Low End Profile

**Hardware Requirements:**
- **GPU VRAM**: < 7.2 GB
- **OR**: GPU VRAM < 15.2 GB AND System RAM < 15.2 GB

**Typical Hardware:**
- NVIDIA GTX 1650 (4GB)
- NVIDIA GTX 1660 (6GB)
- NVIDIA RTX 3050 (4-6GB)
- NVIDIA RTX A2000 (6GB)

**Recommended Settings:**
```json
{
  "compute_specs": "low_end",
  "use_4bit": true,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 8,
  "max_seq_length": 512
}
```

**Recommended Models:**

| Task | Primary Model | Size | VRAM Usage |
|------|---------------|------|------------|
| Text Generation | qwen/Qwen2.5-3B | 3B params | ~4-5 GB |
| Summarization | google/flan-t5-large | 770M params | ~3-4 GB |
| Question Answering | deepset/roberta-base-squad2 | 125M params | ~2-3 GB |

**Optimization Tips:**
- ✅ Use 4-bit quantization (`use_4bit: true`)
- ✅ Small batch size (1-2)
- ✅ Higher gradient accumulation (8-16)
- ✅ Shorter sequences (512-1024 tokens)
- ✅ QLoRA strategy for memory efficiency

---

### 2. Mid Range Profile

**Hardware Requirements:**
- **GPU VRAM**: 7.2 - 15.2 GB
- **System RAM**: ≥ 15.2 GB
- **OR**: GPU VRAM ≥ 15.2 GB AND System RAM < 15.2 GB

**Typical Hardware:**
- NVIDIA RTX 2070/2080 (8GB)
- NVIDIA RTX 3060 Ti (8GB)
- NVIDIA RTX 3070 (8GB)
- NVIDIA RTX 4060 Ti (8-16GB)
- NVIDIA RTX A4000 (12GB)

**Recommended Settings:**
```json
{
  "compute_specs": "mid_range",
  "use_4bit": true,
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "max_seq_length": 1024
}
```

**Recommended Models:**

| Task | Primary Model | Size | VRAM Usage |
|------|---------------|------|------------|
| Text Generation | mistralai/Mistral-Small-3.1-24B-Base-2503 | 24B params | ~12-14 GB |
| Text Generation (alt) | meta-llama/Llama-3.1-8B-Instruct | 8B params | ~8-10 GB |
| Summarization | google/flan-t5-large | 770M params | ~4-5 GB |
| Question Answering | meta-llama/Llama-3.1-8B-Instruct | 8B params | ~8-10 GB |

**Optimization Tips:**
- ✅ 4-bit quantization recommended
- ✅ Moderate batch size (2-4)
- ✅ Standard gradient accumulation (4-8)
- ✅ Medium sequences (1024-2048 tokens)
- ✅ Unsloth provider for 2x speedup
- ✅ Both SFT and QLoRA strategies work well

---

### 3. High End Profile

**Hardware Requirements:**
- **GPU VRAM**: ≥ 15.2 GB
- **System RAM**: ≥ 15.2 GB

**Typical Hardware:**
- NVIDIA RTX 3080/3090 (10-24GB)
- NVIDIA RTX 4080/4090 (12-24GB)
- NVIDIA RTX A5000/A6000 (24-48GB)
- NVIDIA Tesla V100 (16-32GB)
- NVIDIA A100 (40-80GB)

**Recommended Settings:**
```json
{
  "compute_specs": "high_end",
  "use_4bit": false,
  "bf16": true,
  "per_device_train_batch_size": 4,
  "gradient_accumulation_steps": 2,
  "max_seq_length": 2048
}
```

**Recommended Models:**

| Task | Primary Model | Size | VRAM Usage |
|------|---------------|------|------------|
| Text Generation | meta-llama/Llama-4-Maverick-17B-128E-Instruct | 17B params | ~16-18 GB |
| Text Generation (large) | qwen/Qwen2.5-32B | 32B params | ~20-24 GB |
| Summarization | meta-llama/Llama-4-Maverick-17B-128E-Instruct | 17B params | ~16-18 GB |
| Question Answering | qwen/Qwen2.5-32B | 32B params | ~20-24 GB |

**Optimization Tips:**
- ✅ Optional 4-bit quantization (not required)
- ✅ Use BF16 precision on Ampere+ GPUs (RTX 30xx/40xx)
- ✅ Larger batch size (4-8)
- ✅ Lower gradient accumulation (2-4)
- ✅ Longer sequences (2048-4096 tokens)
- ✅ Unsloth provider highly recommended
- ✅ Can use advanced strategies (RLHF, DPO)

---

## Profile Classification Rules

ModelForge uses these rules to classify your hardware:

```python
if gpu_vram < 7.2 GB:
    profile = "low_end"
    
elif gpu_vram < 15.2 GB and ram < 15.2 GB:
    profile = "low_end"
    
elif gpu_vram < 15.2 GB and ram >= 15.2 GB:
    profile = "mid_range"
    
elif gpu_vram >= 15.2 GB and ram < 15.2 GB:
    profile = "mid_range"
    
else:  # gpu_vram >= 15.2 GB and ram >= 15.2 GB
    profile = "high_end"
```

## Automatic Hardware Detection

### Via UI

When you start training in the UI:

1. Select your task
2. Click **"Detect Hardware"**
3. ModelForge automatically:
   - Scans GPU and RAM
   - Classifies into profile
   - Recommends optimal models
   - Pre-fills configuration

### Via API

```bash
curl -X POST http://localhost:8000/api/finetune/detect \
  -H "Content-Type: application/json" \
  -d '{"task": "text-generation"}'
```

**Response:**
```json
{
  "hardware_specs": {
    "gpu_name": "NVIDIA RTX 3070",
    "gpu_memory_gb": 8.0,
    "ram_gb": 16.0,
    "cuda_version": "12.6"
  },
  "compute_profile": "mid_range",
  "recommended_model": "meta-llama/Llama-3.1-8B-Instruct",
  "possible_models": [
    "meta-llama/Llama-3.1-8B-Instruct",
    "qwen/Qwen2.5-7B",
    "mistralai/Mistral-Small-3.1-24B-Base-2503"
  ]
}
```

## Manual Profile Selection

You can override automatic detection:

```json
{
  "compute_specs": "mid_range",  // Force mid-range profile
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  ...
}
```

## Profile-Specific Optimizations

### Memory Optimization by Profile

| Profile | Quantization | Batch Size | Grad Accum | Max Seq Len |
|---------|--------------|------------|------------|-------------|
| Low End | 4-bit (required) | 1 | 8-16 | 512-1024 |
| Mid Range | 4-bit (recommended) | 2-4 | 4-8 | 1024-2048 |
| High End | Optional | 4-8 | 2-4 | 2048-4096 |

### Provider Recommendations by Profile

| Profile | Primary Provider | Secondary | Speedup |
|---------|------------------|-----------|---------|
| Low End | HuggingFace | - | 1x |
| Mid Range | Unsloth | HuggingFace | 2x |
| High End | Unsloth | HuggingFace | 2x |

> **Note**: Unsloth requires Linux, WSL, or Docker. Not available on native Windows.

### Strategy Recommendations by Profile

| Profile | Recommended Strategy | Alternative |
|---------|---------------------|-------------|
| Low End | QLoRA | SFT |
| Mid Range | QLoRA or SFT | RLHF, DPO |
| High End | SFT, QLoRA, RLHF, DPO | Any |

## VRAM Usage Estimation

### Formula

```
VRAM Usage ≈ Model Size × Precision Factor × Overhead Factor
```

### Precision Factors

- **4-bit**: ~0.5 GB per billion parameters
- **8-bit**: ~1 GB per billion parameters  
- **16-bit (FP16/BF16)**: ~2 GB per billion parameters
- **32-bit (FP32)**: ~4 GB per billion parameters

### Example Calculations

**7B model with 4-bit quantization:**
```
7B × 0.5 GB/B × 1.5 (overhead) = ~5.25 GB VRAM
```

**7B model with 16-bit precision:**
```
7B × 2 GB/B × 1.5 (overhead) = ~21 GB VRAM
```

**32B model with 4-bit quantization:**
```
32B × 0.5 GB/B × 1.5 (overhead) = ~24 GB VRAM
```

## Troubleshooting

### Out of Memory (OOM) Errors

**Error**: `CUDA out of memory`

**Solutions**:
1. Reduce batch size: `per_device_train_batch_size: 1`
2. Increase gradient accumulation: `gradient_accumulation_steps: 16`
3. Enable 4-bit quantization: `use_4bit: true`
4. Reduce sequence length: `max_seq_length: 512`
5. Enable gradient checkpointing: `gradient_checkpointing: true`
6. Try a smaller model

### Slow Training

**Problem**: Training is taking too long

**Solutions**:
1. **Use Unsloth provider** for 2x speedup (if on Linux/WSL)
2. Increase batch size if you have VRAM headroom
3. Reduce gradient accumulation steps
4. Use mixed precision (BF16 on RTX 30xx/40xx)
5. Consider a smaller model

### Wrong Profile Detection

**Problem**: ModelForge detects wrong profile

**Solutions**:
1. Manually specify profile: `"compute_specs": "mid_range"`
2. Check GPU drivers are up to date
3. Verify CUDA is properly installed
4. Check `nvidia-smi` output matches expected VRAM

## Best Practices

### For Low End Hardware

1. ✅ Always use 4-bit quantization
2. ✅ Start with smallest recommended models
3. ✅ Use QLoRA strategy
4. ✅ Batch size = 1, gradient accumulation = 8-16
5. ✅ Keep sequences short (512-1024)
6. ✅ Close other GPU applications

### For Mid Range Hardware

1. ✅ Use 4-bit quantization for large models (7B+)
2. ✅ Unsloth provider for best performance
3. ✅ Batch size = 2-4
4. ✅ Try both SFT and QLoRA strategies
5. ✅ Medium sequences (1024-2048)

### For High End Hardware

1. ✅ Unsloth provider mandatory for speed
2. ✅ Can skip quantization for small models
3. ✅ Use BF16 on Ampere+ GPUs
4. ✅ Larger batch sizes (4-8)
5. ✅ Try advanced strategies (RLHF, DPO)
6. ✅ Longer sequences (2048-4096)

## Performance Comparison

### Training Time Estimates (1000 examples, 3 epochs)

| Model Size | Profile | Provider | Strategy | Time |
|------------|---------|----------|----------|------|
| 3B | Low End | HuggingFace | QLoRA | ~2 hours |
| 7B | Mid Range | Unsloth | QLoRA | ~45 min |
| 7B | Mid Range | HuggingFace | QLoRA | ~90 min |
| 17B | High End | Unsloth | SFT | ~60 min |
| 32B | High End | Unsloth | QLoRA | ~90 min |

> Times are approximate and vary based on exact hardware and configuration.

## Next Steps

- **[Configuration Guide](configuration-guide.md)** - Detailed configuration options
- **[Provider Overview](../providers/overview.md)** - Choose HuggingFace or Unsloth
- **[Training Strategies](../strategies/overview.md)** - Select optimal strategy
- **[Performance Optimization](../troubleshooting/performance.md)** - Fine-tune performance

---

**Hardware profiles make ModelForge accessible to everyone!** From 4GB to 80GB VRAM, we've got you covered.
