# Training Tasks

Understanding the different training tasks supported by ModelForge.

## Overview

ModelForge supports three primary training tasks, each optimized for different use cases. The task you choose determines how your model processes data and what kind of outputs it generates.

## Available Tasks

### 1. Text Generation

**Task ID**: `text-generation`

Generate text based on input prompts. This is the most versatile task type, suitable for:

✅ **Chatbots and conversational AI**  
✅ **Instruction following**  
✅ **Code generation**  
✅ **Creative writing**  
✅ **Story completion**  
✅ **Dialog systems**  

#### Dataset Format

```jsonl
{"input": "What is machine learning?", "output": "Machine learning is a subset of AI..."}
{"input": "Write a Python function to sort a list", "output": "def sort_list(lst):\n    return sorted(lst)"}
{"input": "Continue this story: Once upon a time", "output": "there was a brave knight who..."}
```

#### Recommended Models

| Hardware Profile | Primary Model | Alternatives |
|------------------|---------------|--------------|
| **Low End** (< 7GB VRAM) | qwen/Qwen2.5-3B | HuggingFaceTB/SmolLM3-3B, TinyLlama/TinyLlama_v1.1 |
| **Mid Range** (7-15GB VRAM) | mistralai/Mistral-Small-3.1-24B-Base-2503 | meta-llama/Llama-3.1-8B-Instruct, qwen/Qwen2.5-7B |
| **High End** (15GB+ VRAM) | meta-llama/Llama-4-Maverick-17B-128E-Instruct | qwen/Qwen2.5-32B, openai/gpt-oss-120b |

#### Configuration Example

```json
{
  "task": "text-generation",
  "model_name": "meta-llama/Llama-3.1-8B-Instruct",
  "dataset": "/path/to/dataset.jsonl",
  "provider": "unsloth",
  "strategy": "qlora",
  "num_train_epochs": 3
}
```

---

### 2. Summarization

**Task ID**: `summarization`

Condense long text into shorter, coherent summaries. Ideal for:

✅ **Document summarization**  
✅ **Article condensing**  
✅ **Meeting notes generation**  
✅ **Email summarization**  
✅ **Report abstracts**  

#### Dataset Format

```jsonl
{"input": "Long article or document text here...", "output": "Brief summary of the content."}
{"input": "Detailed meeting transcript...", "output": "Key points and action items."}
```

**Input**: Full-length text (can be several paragraphs)  
**Output**: Concise summary (typically 10-30% of original length)

#### Recommended Models

| Hardware Profile | Primary Model | Alternatives |
|------------------|---------------|--------------|
| **Low End** | google/flan-t5-large | sshleifer/distilbart-cnn-12-6, facebook/bart-base |
| **Mid Range** | google/flan-t5-large | facebook/bart-base, mistralai/Mistral-Small-3.1-24B-Base-2503 |
| **High End** | meta-llama/Llama-4-Maverick-17B-128E-Instruct | qwen/Qwen2.5-32B, openai/gpt-oss-120b |

#### Configuration Example

```json
{
  "task": "summarization",
  "model_name": "google/flan-t5-large",
  "dataset": "/path/to/summaries.jsonl",
  "provider": "huggingface",
  "strategy": "sft",
  "max_seq_length": 2048,
  "num_train_epochs": 3
}
```

---

### 3. Extractive Question Answering

**Task ID**: `extractive-question-answering`

Extract answers from text passages. Perfect for:

✅ **RAG (Retrieval-Augmented Generation) systems**  
✅ **Document search and retrieval**  
✅ **FAQ bots**  
✅ **Information extraction**  
✅ **Reading comprehension**  

#### Dataset Format

```jsonl
{"context": "Python is a programming language created by Guido van Rossum.", "question": "Who created Python?", "answer": "Guido van Rossum"}
{"context": "The capital of France is Paris, located on the Seine River.", "question": "What is the capital of France?", "answer": "Paris"}
```

**Fields**:
- `context`: The passage containing the answer
- `question`: The question to be answered
- `answer`: The exact answer text (must appear in context)

#### Recommended Models

| Hardware Profile | Primary Model | Alternatives |
|------------------|---------------|--------------|
| **Low End** | deepset/roberta-base-squad2 | facebook/bart-base, meta-llama/Llama-3.2-1B |
| **Mid Range** | meta-llama/Llama-3.1-8B-Instruct | deepset/roberta-base-squad2, google/flan-t5-large |
| **High End** | meta-llama/Llama-4-Maverick-17B-128E-Instruct | qwen/Qwen2.5-32B, openai/gpt-oss-120b |

#### Configuration Example

```json
{
  "task": "extractive-question-answering",
  "model_name": "deepset/roberta-base-squad2",
  "dataset": "/path/to/qa-dataset.jsonl",
  "provider": "huggingface",
  "strategy": "sft",
  "num_train_epochs": 3
}
```

---

## Choosing the Right Task

### Decision Guide

```
Need a chatbot or instruction follower?
    → text-generation

Need to condense documents?
    → summarization

Need to extract specific information from documents?
    → extractive-question-answering
```

### Task Comparison

| Feature | Text Generation | Summarization | Question Answering |
|---------|----------------|---------------|-------------------|
| **Use Case** | Open-ended generation | Content condensing | Information extraction |
| **Output Type** | Any text | Summary | Specific answer |
| **Input Length** | Short prompts | Long documents | Context + question |
| **Creativity** | High | Medium | Low |
| **Precision** | Variable | Medium | High |
| **Training Speed** | Medium | Fast | Fast |

## Task-Specific Configuration

### Text Generation

```json
{
  "task": "text-generation",
  "max_seq_length": 2048,  // Longer for conversations
  "learning_rate": 2e-4,
  "num_train_epochs": 3
}
```

### Summarization

```json
{
  "task": "summarization",
  "max_seq_length": 1024,  // Shorter is often sufficient
  "learning_rate": 3e-4,   // Can use higher LR
  "num_train_epochs": 5    // May need more epochs
}
```

### Question Answering

```json
{
  "task": "extractive-question-answering",
  "max_seq_length": 512,   // Typically shorter contexts
  "learning_rate": 3e-5,   // Lower LR for precision
  "num_train_epochs": 3
}
```

## Dataset Preparation

### General Guidelines

1. **Quality over quantity**: 100 high-quality examples > 1000 poor examples
2. **Diverse examples**: Cover various scenarios your model will encounter
3. **Balanced data**: Include positive and negative examples
4. **Clean formatting**: Use proper JSON/JSONL format
5. **Validation split**: Reserve 10-20% for evaluation

### Dataset Size Recommendations

| Task | Minimum | Recommended | Optimal |
|------|---------|-------------|---------|
| Text Generation | 50 examples | 500-1000 | 5000+ |
| Summarization | 100 examples | 1000-2000 | 10000+ |
| Question Answering | 200 examples | 1000-3000 | 10000+ |

## Evaluation Metrics

ModelForge automatically evaluates your models using task-specific metrics:

### Text Generation
- **Perplexity**: Lower is better (measures prediction confidence)
- **Loss**: Training and validation loss

### Summarization
- **ROUGE scores**: ROUGE-1, ROUGE-2, ROUGE-L
- **Loss**: Sequence-to-sequence loss

### Question Answering
- **Exact Match (EM)**: Percentage of exact answer matches
- **F1 Score**: Token-level F1 between prediction and ground truth
- **Loss**: Classification/extraction loss

## Common Pitfalls

### ❌ Wrong Task Selection

**Problem**: Using text-generation for summarization  
**Solution**: Use the `summarization` task for better results and faster training

### ❌ Incorrect Dataset Format

**Problem**: Using `{"text": "...", "label": "..."}` for text-generation  
**Solution**: Use `{"input": "...", "output": "..."}` format

### ❌ Mismatched Model and Task

**Problem**: Using BERT for text-generation  
**Solution**: Use decoder-only models (Llama, Mistral) for generation

## Next Steps

- **[Dataset Formats](dataset-formats.md)** - Detailed dataset preparation guide
- **[Configuration Guide](configuration-guide.md)** - All configuration options
- **[Hardware Profiles](hardware-profiles.md)** - Optimize for your GPU
- **[Model Recommendations](../providers/overview.md)** - Choose the right model

---

**Choose the right task for your use case!** Each task is optimized for specific scenarios.
