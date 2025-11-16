# Supervised Fine-Tuning (SFT) Strategy

The SFT strategy is the standard, general-purpose fine-tuning approach using LoRA adapters.

## Overview

Supervised Fine-Tuning uses labeled examples to teach the model new behaviors or knowledge through standard supervised learning.

## Features

✅ **Simple and effective** - Works for most use cases  
✅ **Well-tested** - Industry standard approach  
✅ **Fast training** - Faster than RLHF/DPO  
✅ **Low complexity** - Easy to understand and debug  
✅ **Good quality** - High-quality results for most tasks  

## Usage

```json
{
  "strategy": "sft",
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.2-3B",
  "lora_r": 16,
  "lora_alpha": 32,
  "lora_dropout": 0.1
}
```

## LoRA Configuration

SFT uses LoRA (Low-Rank Adaptation) for efficient fine-tuning:

```json
{
  "lora_r": 16,           // Rank (8, 16, 32, 64)
  "lora_alpha": 32,       // Alpha (usually 2x rank)
  "lora_dropout": 0.1,    // Dropout rate
  "target_modules": "all-linear"
}
```

## Dataset Format

Standard input-output pairs:

```jsonl
{"input": "Question or instruction", "output": "Expected response"}
```

See [Dataset Formats](../configuration/dataset-formats.md) for details.

## Next Steps

- [QLoRA Strategy](qlora.md) - Memory-efficient variant
- [Strategy Overview](overview.md) - Compare all strategies
- [Configuration Guide](../configuration/configuration-guide.md) - All options

---

**SFT: The reliable standard for fine-tuning!** ✨
