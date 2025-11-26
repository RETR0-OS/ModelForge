# REST API Documentation

Complete API reference for ModelForge.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently no authentication required for local use. For production deployment, use reverse proxy with authentication.

## Endpoints

### System Information

#### GET /api/info

Get system information including available providers, strategies, and tasks.

**Response:**
```json
{
  "providers": ["huggingface", "unsloth"],
  "strategies": ["sft", "qlora", "rlhf", "dpo"],
  "tasks": ["text-generation", "summarization", "extractive-question-answering"],
  "version": "v2"
}
```

#### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "v2"
}
```

### Training

#### POST /api/start_training

Start a new training job.

**Request Body:**
```json
{
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.2-3B",
  "provider": "unsloth",
  "strategy": "sft",
  "dataset": "/path/to/dataset.jsonl",
  "max_seq_length": 2048,
  "num_train_epochs": 3,
  "per_device_train_batch_size": 4
}
```

**Response:**
```json
{
  "status": "started",
  "job_id": "train_123456",
  "message": "Training started successfully"
}
```

#### GET /api/training_status

Get current training status.

**Response:**
```json
{
  "status": "training",
  "progress": 45.5,
  "current_epoch": 2,
  "total_epochs": 3,
  "current_step": 500,
  "total_steps": 1100,
  "loss": 0.234,
  "learning_rate": 0.0002
}
```

#### POST /api/stop_training

Stop current training job.

**Response:**
```json
{
  "status": "stopped",
  "message": "Training stopped successfully"
}
```

### Models

#### GET /api/models

List all trained models.

**Response:**
```json
{
  "models": [
    {
      "id": 1,
      "name": "my-llama-3-2-3b-finetuned",
      "base_model": "meta-llama/Llama-3.2-3B",
      "task": "text-generation",
      "created_at": "2024-01-15T10:30:00Z",
      "size_mb": 6240
    }
  ]
}
```

#### GET /api/models/{model_id}

Get details of a specific model.

**Response:**
```json
{
  "id": 1,
  "name": "my-llama-3-2-3b-finetuned",
  "base_model": "meta-llama/Llama-3.2-3B",
  "task": "text-generation",
  "provider": "unsloth",
  "strategy": "sft",
  "training_params": {
    "num_epochs": 3,
    "batch_size": 4,
    "learning_rate": 0.0002
  },
  "metrics": {
    "final_loss": 0.234,
    "perplexity": 1.263
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### DELETE /api/models/{model_id}

Delete a trained model.

**Response:**
```json
{
  "status": "deleted",
  "message": "Model deleted successfully"
}
```

### Datasets

#### POST /api/upload_dataset

Upload a training dataset.

**Request:** Multipart form-data
- `file`: JSONL file

**Response:**
```json
{
  "status": "uploaded",
  "filename": "dataset.jsonl",
  "num_examples": 1000,
  "validation": {
    "valid": true,
    "errors": []
  }
}
```

#### GET /api/datasets

List uploaded datasets.

**Response:**
```json
{
  "datasets": [
    {
      "filename": "dataset.jsonl",
      "num_examples": 1000,
      "size_mb": 5.2,
      "uploaded_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Playground

#### POST /api/playground/generate

Test a model with inference.

**Request Body:**
```json
{
  "model_id": 1,
  "prompt": "What is machine learning?",
  "max_new_tokens": 100,
  "temperature": 0.7,
  "top_p": 0.9
}
```

**Response:**
```json
{
  "generated_text": "Machine learning is a subset of artificial intelligence...",
  "tokens_generated": 45,
  "generation_time_ms": 1234
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "detail": "Detailed error information",
  "status_code": 400
}
```

### Common Error Codes

- `400` - Bad Request (invalid parameters)
- `404` - Not Found (model/dataset not found)
- `409` - Conflict (training already in progress)
- `500` - Internal Server Error

## Rate Limiting

No rate limiting for local use. For production, implement via reverse proxy.

## WebSocket Support

Training progress updates available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/training');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Training progress:', data);
};
```

## Python Client Example

```python
import requests

# Start training
response = requests.post(
    'http://localhost:8000/api/start_training',
    json={
        'task': 'text-generation',
        'model_name': 'meta-llama/Llama-3.2-3B',
        'provider': 'unsloth',
        'dataset': '/path/to/dataset.jsonl',
        'num_train_epochs': 3
    }
)

print(response.json())

# Check status
status = requests.get('http://localhost:8000/api/training_status')
print(status.json())
```

## Next Steps

- [Training Configuration Schema](training-config.md) - Detailed config options
- [Response Formats](responses.md) - Detailed response structures

---

**API Reference for programmatic access to ModelForge** 🔌
