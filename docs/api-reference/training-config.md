# Training Configuration Schema

Complete API reference for training configuration options.

## Overview

This document describes all available configuration options for fine-tuning models in ModelForge. The configuration is passed as JSON to the training API.

## Schema Definition

### TrainingConfig

The complete training configuration schema.

```python
class TrainingConfig(BaseModel):
    """Complete training configuration."""
    
    # Model and task settings
    task: str
    model_name: str
    provider: str = "huggingface"
    strategy: str = "sft"
    dataset: str
    compute_specs: str
    
    # LoRA settings
    lora_r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.1
    
    # Quantization settings
    use_4bit: bool = True
    use_8bit: bool = False
    bnb_4bit_compute_dtype: str = "float16"
    bnb_4bit_quant_type: str = "nf4"
    use_nested_quant: bool = False
    
    # Training precision
    fp16: bool = False
    bf16: bool = False
    
    # Training hyperparameters
    num_train_epochs: int = 1
    per_device_train_batch_size: int = 1
    per_device_eval_batch_size: int = 1
    gradient_accumulation_steps: int = 4
    gradient_checkpointing: bool = True
    max_grad_norm: float = 0.3
    learning_rate: float = 2e-4
    weight_decay: float = 0.001
    optim: str = "paged_adamw_32bit"
    lr_scheduler_type: str = "cosine"
    max_steps: int = -1
    warmup_ratio: float = 0.03
    group_by_length: bool = True
    packing: bool = False
    
    # Sequence settings
    max_seq_length: Optional[int] = None
    
    # Evaluation settings
    eval_split: float = 0.2
    eval_steps: int = 100
```

## Field Reference

### Core Settings

#### task

- **Type**: `string`
- **Required**: Yes
- **Valid Values**: `"text-generation"`, `"summarization"`, `"extractive-question-answering"`
- **Description**: The training task type

**Example**:
```json
{
  "task": "text-generation"
}
```

---

#### model_name

- **Type**: `string`
- **Required**: Yes
- **Description**: HuggingFace model ID or local path to model
- **Validation**: Cannot be empty

**Examples**:
```json
{
  "model_name": "meta-llama/Llama-3.1-8B-Instruct"
}
```
```json
{
  "model_name": "/path/to/local/model"
}
```

---

#### provider

- **Type**: `string`
- **Required**: No
- **Default**: `"huggingface"`
- **Valid Values**: `"huggingface"`, `"unsloth"`
- **Description**: Model loading provider

**Example**:
```json
{
  "provider": "unsloth"
}
```

---

#### strategy

- **Type**: `string`
- **Required**: No
- **Default**: `"sft"`
- **Valid Values**: `"sft"`, `"qlora"`, `"rlhf"`, `"dpo"`
- **Description**: Training strategy

**Example**:
```json
{
  "strategy": "qlora"
}
```

---

#### dataset

- **Type**: `string`
- **Required**: Yes
- **Description**: Path to JSONL dataset file
- **Validation**: Cannot be empty

**Example**:
```json
{
  "dataset": "/path/to/dataset.jsonl"
}
```

---

#### compute_specs

- **Type**: `string`
- **Required**: Yes
- **Valid Values**: `"low_end"`, `"mid_range"`, `"high_end"`
- **Description**: Hardware profile for optimization

**Example**:
```json
{
  "compute_specs": "mid_range"
}
```

---

### LoRA Settings

#### lora_r

- **Type**: `integer`
- **Default**: `16`
- **Range**: 1-256
- **Description**: LoRA rank (dimensionality of adapter)
- **Recommendations**: 
  - Low VRAM: 8-16
  - Mid VRAM: 16-32
  - High VRAM: 32-64

**Example**:
```json
{
  "lora_r": 64
}
```

---

#### lora_alpha

- **Type**: `integer`
- **Default**: `32`
- **Description**: LoRA alpha scaling parameter
- **Recommendation**: Usually `2 × lora_r`

**Example**:
```json
{
  "lora_alpha": 128
}
```

---

#### lora_dropout

- **Type**: `float`
- **Default**: `0.1`
- **Range**: 0.0-1.0
- **Description**: Dropout probability for LoRA layers

**Example**:
```json
{
  "lora_dropout": 0.05
}
```

---

### Quantization Settings

#### use_4bit

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable 4-bit quantization (BitsAndBytes)

**Example**:
```json
{
  "use_4bit": true
}
```

---

#### use_8bit

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable 8-bit quantization

**Example**:
```json
{
  "use_8bit": true
}
```

---

#### bnb_4bit_compute_dtype

- **Type**: `string`
- **Default**: `"float16"`
- **Valid Values**: `"float16"`, `"bfloat16"`, `"float32"`
- **Description**: Compute dtype for 4-bit quantization

**Example**:
```json
{
  "bnb_4bit_compute_dtype": "bfloat16"
}
```

---

#### bnb_4bit_quant_type

- **Type**: `string`
- **Default**: `"nf4"`
- **Valid Values**: `"nf4"`, `"fp4"`
- **Description**: Quantization type (NormalFloat4 or Float4)

**Example**:
```json
{
  "bnb_4bit_quant_type": "nf4"
}
```

---

#### use_nested_quant

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable nested quantization for additional memory savings

**Example**:
```json
{
  "use_nested_quant": true
}
```

---

### Training Precision

#### fp16

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Use 16-bit floating point precision
- **Use**: Older GPUs (GTX 10xx, RTX 20xx)

**Example**:
```json
{
  "fp16": true
}
```

---

#### bf16

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Use bfloat16 precision
- **Use**: Ampere+ GPUs (RTX 30xx, 40xx, A100)
- **Recommendation**: Preferred over fp16 on supported hardware

**Example**:
```json
{
  "bf16": true
}
```

---

### Training Hyperparameters

#### num_train_epochs

- **Type**: `integer`
- **Default**: `1`
- **Minimum**: 1
- **Description**: Number of training epochs

**Examples**:
```json
{
  "num_train_epochs": 3
}
```

---

#### per_device_train_batch_size

- **Type**: `integer`
- **Default**: `1`
- **Minimum**: 1
- **Description**: Training batch size per GPU

**Recommendations**:
- Low End: 1
- Mid Range: 2-4
- High End: 4-8

**Example**:
```json
{
  "per_device_train_batch_size": 4
}
```

---

#### per_device_eval_batch_size

- **Type**: `integer`
- **Default**: `1`
- **Minimum**: 1
- **Description**: Evaluation batch size per GPU

**Example**:
```json
{
  "per_device_eval_batch_size": 4
}
```

---

#### gradient_accumulation_steps

- **Type**: `integer`
- **Default**: `4`
- **Description**: Number of gradient accumulation steps
- **Purpose**: Simulate larger batch sizes without increasing memory

**Effective Batch Size** = `per_device_train_batch_size × gradient_accumulation_steps`

**Example**:
```json
{
  "gradient_accumulation_steps": 8
}
```

---

#### gradient_checkpointing

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable gradient checkpointing to save memory
- **Trade-off**: Lower memory usage, slightly slower training

**Example**:
```json
{
  "gradient_checkpointing": true
}
```

---

#### max_grad_norm

- **Type**: `float`
- **Default**: `0.3`
- **Description**: Maximum gradient norm for clipping

**Example**:
```json
{
  "max_grad_norm": 1.0
}
```

---

#### learning_rate

- **Type**: `float`
- **Default**: `2e-4`
- **Range**: > 0 and ≤ 1
- **Description**: Initial learning rate

**Recommendations**:
- SFT: 2e-4
- QLoRA: 2e-4
- RLHF: 1.41e-5
- DPO: 5e-7

**Example**:
```json
{
  "learning_rate": 2e-4
}
```

---

#### weight_decay

- **Type**: `float`
- **Default**: `0.001`
- **Description**: Weight decay for regularization

**Example**:
```json
{
  "weight_decay": 0.01
}
```

---

#### optim

- **Type**: `string`
- **Default**: `"paged_adamw_32bit"`
- **Valid Values**: `"adamw_torch"`, `"adamw_8bit"`, `"paged_adamw_32bit"`, `"sgd"`
- **Description**: Optimizer type

**Recommendations**:
- Standard: `"adamw_torch"`
- Memory-efficient: `"paged_adamw_32bit"` or `"adamw_8bit"`

**Example**:
```json
{
  "optim": "paged_adamw_32bit"
}
```

---

#### lr_scheduler_type

- **Type**: `string`
- **Default**: `"cosine"`
- **Valid Values**: `"linear"`, `"cosine"`, `"constant"`, `"polynomial"`
- **Description**: Learning rate scheduler type

**Example**:
```json
{
  "lr_scheduler_type": "cosine"
}
```

---

#### max_steps

- **Type**: `integer`
- **Default**: `-1` (disabled)
- **Description**: Maximum number of training steps (overrides epochs if set)

**Example**:
```json
{
  "max_steps": 1000
}
```

---

#### warmup_ratio

- **Type**: `float`
- **Default**: `0.03`
- **Range**: 0.0-1.0
- **Description**: Proportion of training for learning rate warmup

**Example**:
```json
{
  "warmup_ratio": 0.1
}
```

---

#### group_by_length

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Group sequences of similar length for efficiency

**Example**:
```json
{
  "group_by_length": true
}
```

---

#### packing

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Pack multiple sequences into one to maximize GPU utilization

**Example**:
```json
{
  "packing": true
}
```

---

### Sequence Settings

#### max_seq_length

- **Type**: `integer` or `null`
- **Default**: `null` (auto-detect)
- **Description**: Maximum sequence length in tokens

**Recommendations**:
- Low End: 512-1024
- Mid Range: 1024-2048
- High End: 2048-4096

**Note**: When using Unsloth provider, cannot be `-1` or `null`.

**Example**:
```json
{
  "max_seq_length": 2048
}
```

---

### Evaluation Settings

#### eval_split

- **Type**: `float`
- **Default**: `0.2`
- **Range**: 0.0-1.0
- **Description**: Proportion of data to use for evaluation

**Example**:
```json
{
  "eval_split": 0.1
}
```

---

#### eval_steps

- **Type**: `integer`
- **Default**: `100`
- **Description**: Evaluate every N steps

**Example**:
```json
{
  "eval_steps": 50
}
```

---

## Complete Configuration Examples

### Low End Hardware (4-6GB VRAM)

```json
{
  "task": "text-generation",
  "model_name": "qwen/Qwen2.5-3B",
  "provider": "huggingface",
  "strategy": "qlora",
  "dataset": "/path/to/dataset.jsonl",
  "compute_specs": "low_end",
  
  "lora_r": 16,
  "lora_alpha": 32,
  "lora_dropout": 0.1,
  
  "use_4bit": true,
  "bf16": false,
  "fp16": true,
  
  "num_train_epochs": 3,
  "per_device_train_batch_size": 1,
  "gradient_accumulation_steps": 16,
  "learning_rate": 2e-4,
  "max_seq_length": 512,
  
  "eval_split": 0.2,
  "eval_steps": 100
}
```

### Mid Range Hardware (8-12GB VRAM)

```json
{
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "provider": "unsloth",
  "strategy": "qlora",
  "dataset": "/path/to/dataset.jsonl",
  "compute_specs": "mid_range",
  
  "lora_r": 64,
  "lora_alpha": 128,
  "lora_dropout": 0.1,
  
  "use_4bit": true,
  "bf16": true,
  
  "num_train_epochs": 3,
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "learning_rate": 2e-4,
  "max_seq_length": 2048,
  
  "eval_split": 0.2,
  "eval_steps": 100
}
```

### High End Hardware (16GB+ VRAM)

```json
{
  "task": "text-generation",
  "model_name": "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
  "provider": "unsloth",
  "strategy": "sft",
  "dataset": "/path/to/dataset.jsonl",
  "compute_specs": "high_end",
  
  "lora_r": 64,
  "lora_alpha": 128,
  "lora_dropout": 0.05,
  
  "use_4bit": false,
  "bf16": true,
  
  "num_train_epochs": 3,
  "per_device_train_batch_size": 4,
  "gradient_accumulation_steps": 2,
  "learning_rate": 2e-4,
  "max_seq_length": 4096,
  
  "eval_split": 0.1,
  "eval_steps": 50
}
```

## Validation Rules

The configuration schema enforces these validation rules:

1. **task**: Must be in `["text-generation", "summarization", "extractive-question-answering"]`
2. **strategy**: Must be in `["sft", "qlora", "rlhf", "dpo"]`
3. **provider**: Must be in `["huggingface", "unsloth"]`
4. **model_name**: Cannot be empty
5. **dataset**: Cannot be empty
6. **num_train_epochs**: Must be ≥ 1
7. **per_device_train_batch_size**: Must be ≥ 1
8. **learning_rate**: Must be > 0 and ≤ 1
9. **lora_r**: Must be between 1 and 256
10. **eval_split**: Must be between 0 and 1

## Next Steps

- **[REST API Documentation](rest-api.md)** - API endpoints
- **[Response Formats](responses.md)** - API response structures
- **[Configuration Guide](../configuration/configuration-guide.md)** - User-friendly configuration guide

---

**Complete schema reference for ModelForge training configuration.**
