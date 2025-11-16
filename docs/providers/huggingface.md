# HuggingFace Provider

The HuggingFace provider is the default, standard provider for ModelForge with maximum compatibility.

## Overview

The HuggingFace provider uses the standard Transformers library to load and fine-tune models from the HuggingFace Hub.

## Features

✅ **Maximum compatibility** - Works with all HuggingFace models  
✅ **All platforms** - Windows, Linux  
✅ **Well-tested** - Battle-tested implementation  
✅ **Extensive documentation** - Full HuggingFace ecosystem support  
✅ **All tasks** - Text generation, summarization, question answering  

## Installation

The HuggingFace provider is included by default with ModelForge:

```bash
pip install modelforge-finetuning
```

## Usage

### Basic Configuration

```json
{
  "provider": "huggingface",
  "model_name": "meta-llama/Llama-3.2-3B",
  "task": "text-generation",
  "strategy": "sft"
}
```

### Via UI

The HuggingFace provider is selected by default in the UI.

### Via API

```bash
curl -X POST http://localhost:8000/api/start_training \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "huggingface",
    "model_name": "meta-llama/Llama-3.2-3B",
    "task": "text-generation"
  }'
```

## Supported Models

All models compatible with HuggingFace Transformers:

- **Llama** (all versions)
- **Mistral** (all versions)
- **Qwen** (all versions)
- **Gemma** (all versions)
- **Phi** (all versions)
- **BART**
- **T5**
- **BERT-based models**
- And thousands more!

## Comparison with Unsloth

| Feature | HuggingFace | Unsloth |
|---------|-------------|---------|
| Training Speed | 1x (baseline) | 2x faster |
| Memory Usage | Baseline | -20% |
| Platform Support | All | Linux/WSL/Docker only |
| Model Support | All | Limited to specific architectures |
| Stability | Very Stable | Stable |
| Maturity | Mature | Newer |

## When to Use HuggingFace

Use HuggingFace provider when:

✅ Running on native Windows  
✅ Using models not supported by Unsloth (BART, T5, etc.)  
✅ Maximum compatibility is important  
✅ You need the most stable option  
✅ First time using ModelForge  

## Configuration Tips

### Optimal Settings

```json
{
  "provider": "huggingface",
  "use_4bit": true,
  "bf16": true,
  "gradient_checkpointing": true,
  "per_device_train_batch_size": 4,
  "gradient_accumulation_steps": 4
}
```

### For Low VRAM

```json
{
  "provider": "huggingface",
  "strategy": "qlora",
  "use_4bit": true,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 16,
  "gradient_checkpointing": true
}
```

## Next Steps

- [Provider Overview](overview.md) - Compare providers
- [Unsloth Provider](unsloth.md) - Try 2x faster training
- [Configuration Guide](../configuration/configuration-guide.md) - All options

---

**HuggingFace Provider: Reliable and compatible!** 🤗
