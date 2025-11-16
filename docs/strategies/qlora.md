# QLoRA Strategy

Memory-efficient fine-tuning using Quantized Low-Rank Adaptation.

## Overview

QLoRA combines 4-bit quantization with LoRA to dramatically reduce memory usage while maintaining quality.

## Features

✅ **30-50% less memory** - Train larger models on smaller GPUs  
✅ **Minimal quality loss** - Nearly identical to full precision  
✅ **Compatible with all models** - Works with any model  
✅ **Production ready** - Well-tested and stable  

## Usage

```json
{
  "strategy": "qlora",
  "use_4bit": true,
  "bnb_4bit_compute_dtype": "float16",
  "bnb_4bit_quant_type": "nf4"
}
```

## Benefits

### Memory Comparison (Llama-3.2-7B)

| Strategy | VRAM Usage |
|----------|------------|
| Standard SFT | 16 GB |
| QLoRA | 10 GB |
| **Savings** | **37.5%** |

## When to Use

Use QLoRA when:

✅ Limited VRAM (< 12GB for 7B models)  
✅ Want to train larger models  
✅ Memory is the bottleneck  
✅ Quality is still important  

## Next Steps

- [SFT Strategy](sft.md) - Standard approach
- [Strategy Overview](overview.md) - Compare strategies

---

**QLoRA: Train bigger models on smaller GPUs!** 💾
