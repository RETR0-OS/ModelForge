# RLHF Strategy (Reinforcement Learning from Human Feedback)

Advanced fine-tuning using human preference learning with PPO (Proximal Policy Optimization).

## Overview

RLHF is an advanced training strategy that aligns language models with human preferences through reinforcement learning. It's the strategy behind models like ChatGPT and Claude.

## What is RLHF?

**RLHF** trains models to maximize reward signals based on human feedback:

1. **Supervised Fine-Tuning (SFT)**: Train base model on demonstrations
2. **Reward Model Training**: Train model to predict human preferences
3. **RL Optimization**: Use PPO to optimize for high reward

ModelForge focuses on the **RL Optimization** phase, assuming you have a reward model or preference data.

## Features

✅ **State-of-the-art alignment** - Best quality for human-aligned outputs  
✅ **Preference learning** - Learn from human feedback  
✅ **Iterative improvement** - Continuously improve model behavior  
⚠️ **Complex setup** - Requires reward model or preference data  
⚠️ **Computationally expensive** - Slower than SFT/QLoRA  
⚠️ **Advanced technique** - Recommended for experienced users  

## When to Use RLHF

### ✅ Use RLHF When:

- Aligning model outputs with human preferences
- Training conversational AI or assistants
- Need highest quality, human-like responses
- Have preference pairs or reward model
- Quality matters more than speed
- Have sufficient computational resources (high-end hardware)

### ❌ Don't Use RLHF When:

- First time fine-tuning (start with SFT)
- Limited VRAM (< 12GB)
- Simple supervised learning task
- Need fast training
- Don't have preference data

## Dataset Format

RLHF requires datasets with preference pairs:

```jsonl
{"prompt": "What is the capital of France?", "chosen": "The capital of France is Paris.", "rejected": "I don't know."}
{"prompt": "Explain quantum computing", "chosen": "Quantum computing uses quantum bits...", "rejected": "It's complicated."}
{"prompt": "Write a haiku about coding", "chosen": "Code flows like water\nBugs hide in silent shadows\nDebug brings the light", "rejected": "Coding is fun"}
```

**Required Fields**:
- `prompt`: Input prompt or question
- `chosen`: Preferred/better response
- `rejected`: Non-preferred/worse response

### Dataset Preparation

1. **Collect Human Feedback**: Get humans to rank multiple responses
2. **Create Preference Pairs**: Pair each prompt with chosen and rejected responses
3. **Quality Control**: Ensure clear preference distinctions
4. **Balance Dataset**: Include diverse prompts and preferences

### Example Dataset Creation

```python
# From human ratings
ratings = [
    {"prompt": "Tell me a joke", "response_a": "Why did the chicken...", "response_b": "Haha funny", "preference": "a"},
]

# Convert to RLHF format
rlhf_data = []
for item in ratings:
    rlhf_data.append({
        "prompt": item["prompt"],
        "chosen": item["response_a"] if item["preference"] == "a" else item["response_b"],
        "rejected": item["response_b"] if item["preference"] == "a" else item["response_a"]
    })
```

## Configuration

### Basic RLHF Configuration

```json
{
  "strategy": "rlhf",
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "dataset": "/path/to/preference-data.jsonl",
  "provider": "huggingface",
  
  "num_train_epochs": 1,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 8,
  "learning_rate": 1.41e-5,
  
  "lora_r": 16,
  "lora_alpha": 32,
  "use_4bit": true,
  "bf16": true
}
```

### Advanced RLHF Configuration

```json
{
  "strategy": "rlhf",
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "dataset": "/path/to/preference-data.jsonl",
  "provider": "unsloth",
  
  "num_train_epochs": 1,
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "learning_rate": 1.41e-5,
  
  "lora_r": 64,
  "lora_alpha": 16,
  "use_4bit": true,
  "bf16": true,
  
  "max_seq_length": 2048,
  "warmup_ratio": 0.1,
  "eval_split": 0.1
}
```

## How RLHF Works

### Training Process

```
1. Load Pre-trained Model
        ↓
2. Apply LoRA Adapters
        ↓
3. Add Value Head (for reward prediction)
        ↓
4. Load Preference Dataset
        ↓
5. PPO Training Loop:
   - Generate responses
   - Calculate rewards
   - Update policy
   - Clip gradients
        ↓
6. Save Fine-tuned Model
```

### Key Differences from SFT

| Aspect | SFT | RLHF |
|--------|-----|------|
| **Objective** | Minimize loss on examples | Maximize reward |
| **Training** | Supervised learning | Reinforcement learning |
| **Dataset** | Input-output pairs | Preference pairs |
| **Complexity** | Simple | Complex |
| **Speed** | Fast | Slow |
| **Quality** | High | Very High |

## Hardware Requirements

### Minimum Requirements

- **GPU**: 12GB+ VRAM
- **RAM**: 16GB+ system RAM
- **Recommended**: Mid-range to high-end profile
- **Provider**: HuggingFace (Unsloth experimental)

### Memory Usage

RLHF requires more memory than SFT due to:
- Value head network
- PPO buffers
- Advantage estimation

**Example** (7B model):
- SFT with 4-bit: ~6-8 GB VRAM
- RLHF with 4-bit: ~10-12 GB VRAM

## Recommended Settings by Hardware

### Mid Range (12-16GB VRAM)

```json
{
  "strategy": "rlhf",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "use_4bit": true,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 8,
  "lora_r": 16,
  "max_seq_length": 1024
}
```

### High End (16GB+ VRAM)

```json
{
  "strategy": "rlhf",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "use_4bit": true,
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "lora_r": 64,
  "max_seq_length": 2048
}
```

## Hyperparameter Tuning

### Learning Rate

RLHF typically uses **lower learning rates** than SFT:

- **SFT**: 2e-4
- **RLHF**: 1.41e-5 (recommended)

### LoRA Configuration

```json
{
  "lora_r": 16,        // Can use 16, 32, 64
  "lora_alpha": 32,    // Usually 2x rank
  "lora_dropout": 0.05 // Lower dropout for RLHF
}
```

### Training Epochs

RLHF requires **fewer epochs** than SFT:

- **SFT**: 3-5 epochs
- **RLHF**: 1-2 epochs (risk of reward hacking with more)

## Evaluation

RLHF models are evaluated using:

1. **Reward Score**: Average predicted reward
2. **KL Divergence**: Deviation from base model (prevents over-optimization)
3. **Human Evaluation**: Manual quality assessment

## Common Issues

### Reward Hacking

**Problem**: Model learns to game the reward without improving quality

**Solutions**:
- Use KL penalty to stay close to base model
- Limit training to 1-2 epochs
- Monitor KL divergence
- Use diverse preference data

### High Memory Usage

**Problem**: RLHF runs out of memory

**Solutions**:
- Use 4-bit quantization
- Reduce batch size to 1
- Increase gradient accumulation
- Reduce sequence length
- Use smaller model

### Unstable Training

**Problem**: Loss oscillates or diverges

**Solutions**:
- Lower learning rate (1e-5 or lower)
- Increase warmup steps
- Use gradient clipping
- Check dataset quality

## Advanced Topics

### Custom Reward Models

You can use custom reward models:

```python
from transformers import AutoModelForSequenceClassification

reward_model = AutoModelForSequenceClassification.from_pretrained(
    "your-reward-model"
)
```

### Multi-Objective RLHF

Optimize for multiple objectives:

```python
reward = 0.7 * quality_score + 0.3 * safety_score
```

## Comparison with DPO

| Feature | RLHF | DPO |
|---------|------|-----|
| **Complexity** | High | Lower |
| **Reward Model** | Required | Not required |
| **Stability** | Less stable | More stable |
| **Performance** | Excellent | Excellent |
| **Speed** | Slower | Faster |
| **Memory** | Higher | Lower |

**Recommendation**: Try DPO first - it's simpler and often performs similarly.

## Example: Training a Helpful Assistant

```json
{
  "strategy": "rlhf",
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "dataset": "/data/helpful-assistant-preferences.jsonl",
  "provider": "unsloth",
  
  "num_train_epochs": 1,
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "learning_rate": 1.41e-5,
  "warmup_ratio": 0.1,
  
  "lora_r": 64,
  "lora_alpha": 128,
  "use_4bit": true,
  "bf16": true,
  
  "max_seq_length": 2048,
  "eval_split": 0.1
}
```

## Best Practices

1. ✅ Start with SFT before RLHF
2. ✅ Use high-quality preference data
3. ✅ Monitor KL divergence to prevent over-optimization
4. ✅ Use lower learning rates than SFT
5. ✅ Limit to 1-2 epochs
6. ✅ Include diverse prompts in dataset
7. ✅ Evaluate with human feedback

## Next Steps

- **[DPO Strategy](dpo.md)** - Simpler alternative to RLHF
- **[SFT Strategy](sft.md)** - Start here before RLHF
- **[QLoRA Strategy](qlora.md)** - Memory-efficient training
- **[Strategy Overview](overview.md)** - Compare all strategies

---

**RLHF: The gold standard for human-aligned AI!** ⭐ Complex but powerful.
