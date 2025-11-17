# API Response Formats

Reference documentation for all API response structures in ModelForge.

## Overview

This document describes the response formats for all ModelForge API endpoints. All responses are in JSON format unless otherwise specified.

## Common Response Patterns

### Success Response

Standard success response structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { }
}
```

### Error Response

Standard error response structure:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (validation error)
- `403`: Forbidden (model access denied)
- `404`: Not Found
- `500`: Internal Server Error

---

## Training Endpoints

### POST /api/finetune/validate_task

Validate task selection.

**Request**:
```json
{
  "task": "text-generation"
}
```

**Response**:
```json
{
  "valid": true,
  "task": "text-generation"
}
```

---

### POST /api/finetune/validate_model

Validate model selection.

**Request**:
```json
{
  "selected_model": "meta-llama/Llama-3.1-8B-Instruct"
}
```

**Response**:
```json
{
  "valid": true,
  "model": "meta-llama/Llama-3.1-8B-Instruct"
}
```

---

### POST /api/finetune/validate_custom_model

Validate custom model repository.

**Request**:
```json
{
  "repo_name": "username/custom-model"
}
```

**Success Response**:
```json
{
  "valid": true,
  "repo_name": "username/custom-model",
  "model_info": {
    "id": "username/custom-model",
    "author": "username",
    "downloads": 1234,
    "likes": 56
  }
}
```

**Error Response** (403):
```json
{
  "detail": "Model username/custom-model is not accessible. Please check if it exists and you have permissions."
}
```

---

### POST /api/finetune/detect

Detect hardware and get model recommendations.

**Request**:
```json
{
  "task": "text-generation"
}
```

**Response**:
```json
{
  "status_code": 200,
  "profile": "mid_range",
  "task": "text-generation",
  "gpu_name": "NVIDIA GeForce RTX 3070",
  "gpu_total_memory_gb": 8.0,
  "ram_total_gb": 16.0,
  "available_diskspace_gb": 250.5,
  "cpu_cores": 8,
  "model_recommendation": "meta-llama/Llama-3.1-8B-Instruct",
  "possible_options": [
    "meta-llama/Llama-3.1-8B-Instruct",
    "qwen/Qwen2.5-7B",
    "mistralai/Mistral-Small-3.1-24B-Base-2503"
  ]
}
```

**Fields**:
- `profile`: Hardware profile (`low_end`, `mid_range`, `high_end`)
- `task`: Selected task
- `gpu_name`: GPU model name
- `gpu_total_memory_gb`: Total GPU VRAM in GB
- `ram_total_gb`: System RAM in GB
- `available_diskspace_gb`: Available disk space
- `cpu_cores`: Number of CPU cores
- `model_recommendation`: Primary recommended model
- `possible_options`: List of alternative models

---

### POST /api/finetune/set_model

Set selected model for training.

**Request**:
```json
{
  "selected_model": "meta-llama/Llama-3.1-8B-Instruct"
}
```

**Response**:
```json
{
  "success": true,
  "selected_model": "meta-llama/Llama-3.1-8B-Instruct",
  "message": "Model selection saved successfully"
}
```

---

### POST /api/finetune/set_custom_model

Set and validate custom model.

**Request**:
```json
{
  "repo_name": "username/custom-model"
}
```

**Response**:
```json
{
  "success": true,
  "selected_model": "username/custom-model",
  "message": "Custom model validated and saved successfully",
  "valid": true,
  "repo_name": "username/custom-model"
}
```

---

### GET /api/finetune/session

Get current session data.

**Response**:
```json
{
  "success": true,
  "task": "text-generation",
  "selected_model": "meta-llama/Llama-3.1-8B-Instruct",
  "is_custom_model": false
}
```

---

### GET /api/finetune/load_settings

Get default training settings based on hardware.

**Response**:
```json
{
  "per_device_train_batch_size": 2,
  "gradient_accumulation_steps": 4,
  "learning_rate": 2e-4,
  "num_train_epochs": 3,
  "max_seq_length": 2048,
  "lora_r": 64,
  "lora_alpha": 128,
  "use_4bit": true,
  "bf16": true,
  "warmup_ratio": 0.03,
  "lr_scheduler_type": "cosine",
  "optim": "paged_adamw_32bit"
}
```

---

### POST /api/finetune/start_training

Start a training job.

**Request**:
```json
{
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "provider": "unsloth",
  "strategy": "qlora",
  "dataset": "/path/to/dataset.jsonl",
  "compute_specs": "mid_range",
  "num_train_epochs": 3,
  "per_device_train_batch_size": 2,
  "learning_rate": 2e-4,
  ...
}
```

**Response**:
```json
{
  "success": true,
  "message": "Training started successfully",
  "job_id": "train_20240315_143022"
}
```

**Error Response** (400):
```json
{
  "detail": "Dataset validation failed: File not found"
}
```

---

### GET /api/finetune/status

Get training status.

**Response** (Training in Progress):
```json
{
  "status": "running",
  "progress": 45,
  "message": "Training epoch 2/3 - Step 450/1000",
  "error": null
}
```

**Response** (Training Completed):
```json
{
  "status": "completed",
  "progress": 100,
  "message": "Training completed successfully",
  "error": null
}
```

**Response** (Training Failed):
```json
{
  "status": "error",
  "progress": 30,
  "message": "Training failed",
  "error": "CUDA out of memory"
}
```

**Response** (Idle):
```json
{
  "status": "idle",
  "progress": 0,
  "message": "No training in progress",
  "error": null
}
```

**Status Values**:
- `idle`: No training running
- `running`: Training in progress
- `completed`: Training finished successfully
- `error`: Training failed

---

### POST /api/finetune/reset_status

Reset training status.

**Response**:
```json
{
  "success": true,
  "message": "Training status reset successfully"
}
```

---

### GET /api/finetune/hardware_specs

Get hardware specifications.

**Response**:
```json
{
  "gpu_name": "NVIDIA GeForce RTX 3070",
  "gpu_memory_gb": 8.0,
  "ram_gb": 16.0,
  "disk_space_gb": 250.5,
  "cpu_cores": 8,
  "cuda_version": "12.6",
  "torch_version": "2.1.0"
}
```

---

### GET /api/finetune/recommended_models/{task}

Get recommended models for a task.

**Path Parameter**:
- `task`: Task type (`text-generation`, `summarization`, `extractive-question-answering`)

**Response**:
```json
{
  "task": "text-generation",
  "recommended_model": "meta-llama/Llama-3.1-8B-Instruct",
  "possible_models": [
    "meta-llama/Llama-3.1-8B-Instruct",
    "qwen/Qwen2.5-7B",
    "mistralai/Mistral-Small-3.1-24B-Base-2503"
  ],
  "compute_profile": "mid_range"
}
```

---

## Model Management Endpoints

### GET /api/models/

List all fine-tuned models.

**Response**:
```json
[
  {
    "model_id": "model_20240315_143022",
    "name": "Llama-3.1-8B-Custom",
    "base_model": "meta-llama/Llama-3.1-8B-Instruct",
    "task": "text-generation",
    "strategy": "qlora",
    "created_at": "2024-03-15T14:30:22Z",
    "size_mb": 450.5,
    "path": "/path/to/model"
  },
  {
    "model_id": "model_20240314_092011",
    "name": "Qwen-7B-Summarizer",
    "base_model": "qwen/Qwen2.5-7B",
    "task": "summarization",
    "strategy": "sft",
    "created_at": "2024-03-14T09:20:11Z",
    "size_mb": 380.2,
    "path": "/path/to/model"
  }
]
```

---

### GET /api/models/{model_id}

Get details for a specific model.

**Path Parameter**:
- `model_id`: Model identifier

**Response**:
```json
{
  "model_id": "model_20240315_143022",
  "name": "Llama-3.1-8B-Custom",
  "base_model": "meta-llama/Llama-3.1-8B-Instruct",
  "task": "text-generation",
  "strategy": "qlora",
  "provider": "unsloth",
  "created_at": "2024-03-15T14:30:22Z",
  "size_mb": 450.5,
  "path": "/path/to/model",
  "config": {
    "lora_r": 64,
    "lora_alpha": 128,
    "num_train_epochs": 3,
    "learning_rate": 2e-4
  },
  "metrics": {
    "final_loss": 0.234,
    "eval_loss": 0.267,
    "perplexity": 1.89
  }
}
```

---

### GET /api/models/task/{task}

Get models for a specific task.

**Path Parameter**:
- `task`: Task type

**Response**:
```json
[
  {
    "model_id": "model_20240315_143022",
    "name": "Llama-3.1-8B-Custom",
    "base_model": "meta-llama/Llama-3.1-8B-Instruct",
    "task": "text-generation",
    "created_at": "2024-03-15T14:30:22Z"
  }
]
```

---

### DELETE /api/models/{model_id}

Delete a fine-tuned model.

**Path Parameter**:
- `model_id`: Model identifier

**Response**:
```json
{
  "success": true,
  "message": "Model model_20240315_143022 deleted successfully"
}
```

---

## Hub Management Endpoints

### POST /api/hub/push

Push model to HuggingFace Hub.

**Request**:
```json
{
  "model_id": "model_20240315_143022",
  "repo_name": "username/my-fine-tuned-model",
  "private": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Model pushed to HuggingFace Hub successfully",
  "repo_url": "https://huggingface.co/username/my-fine-tuned-model"
}
```

---

## Playground Endpoints

### GET /api/playground/model_path

Get path to fine-tuned model for playground.

**Query Parameters**:
- `model_id`: Model identifier

**Response**:
```json
{
  "model_path": "/path/to/model",
  "model_id": "model_20240315_143022"
}
```

---

### POST /api/playground/new

Generate text with a model.

**Request**:
```json
{
  "model_id": "model_20240315_143022",
  "prompt": "What is machine learning?",
  "max_length": 100,
  "temperature": 0.7,
  "top_p": 0.9
}
```

**Response**:
```json
{
  "generated_text": "Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed. It involves algorithms that can identify patterns and make decisions based on input data.",
  "prompt": "What is machine learning?",
  "tokens_generated": 45,
  "generation_time_ms": 1234
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "detail": [
    {
      "loc": ["body", "task"],
      "msg": "Invalid task: xyz. Must be one of ['text-generation', 'summarization', 'extractive-question-answering']",
      "type": "value_error"
    }
  ]
}
```

### Model Access Error (403)

```json
{
  "detail": "Model meta-llama/restricted-model is not accessible. Please check if you have the required permissions."
}
```

### Not Found (404)

```json
{
  "detail": "Model model_xyz not found"
}
```

### Internal Server Error (500)

```json
{
  "detail": "An internal error occurred: [error details]"
}
```

---

## Response Schema Types

### TrainingStatus

```typescript
{
  status: "idle" | "running" | "completed" | "error"
  progress: number  // 0-100
  message: string
  error: string | null
}
```

### TrainingResult

```typescript
{
  success: boolean
  model_id?: string
  model_path?: string
  message: string
  error?: string
}
```

### HardwareSpecs

```typescript
{
  gpu_name: string
  gpu_memory_gb: number
  ram_gb: number
  disk_space_gb: number
  cpu_cores: number
  cuda_version?: string
  torch_version?: string
}
```

### ModelInfo

```typescript
{
  model_id: string
  name: string
  base_model: string
  task: string
  strategy: string
  provider?: string
  created_at: string
  size_mb: number
  path: string
  config?: object
  metrics?: object
}
```

---

## Next Steps

- **[REST API Documentation](rest-api.md)** - Complete API endpoint reference
- **[Training Configuration Schema](training-config.md)** - Configuration options
- **[Configuration Guide](../configuration/configuration-guide.md)** - User guide

---

**Complete API response format reference for ModelForge.**
