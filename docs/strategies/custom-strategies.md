# Adding Custom Strategies

Extend ModelForge with your own training strategies.

## Overview

ModelForge's strategy system is designed to be extensible. You can add support for new training algorithms, optimization techniques, or custom fine-tuning approaches.

## What is a Strategy?

A **strategy** defines how models are trained:
- Model preparation (adapters, PEFT configuration)
- Dataset formatting and preprocessing
- Trainer setup and configuration
- Training algorithm and optimization
- Evaluation metrics

## Strategy Interface

All strategies must implement these core methods:

```python
from typing import Any, Dict, List

class TrainingStrategy:
    """Base interface for training strategies."""
    
    def get_strategy_name(self) -> str:
        """Return the strategy name."""
        ...
    
    def prepare_model(self, model: Any, config: Dict) -> Any:
        """Prepare model for training (add adapters, etc.)."""
        ...
    
    def prepare_dataset(
        self,
        dataset: Any,
        tokenizer: Any,
        config: Dict
    ) -> Any:
        """Format and prepare dataset for training."""
        ...
    
    def create_trainer(
        self,
        model: Any,
        train_dataset: Any,
        eval_dataset: Any,
        tokenizer: Any,
        config: Dict,
        callbacks: List = None
    ) -> Any:
        """Create and configure the trainer."""
        ...
    
    def get_required_dataset_fields(self) -> List[str]:
        """Return required dataset field names."""
        ...
```

## Creating a Custom Strategy

### Step 1: Create Strategy Class

Create a new file in `ModelForge/strategies/`:

```python
# ModelForge/strategies/custom_strategy.py

from typing import Any, Dict, List
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
from transformers import TrainingArguments, Trainer

from ..logging_config import logger
from ..exceptions import TrainingError

class CustomStrategy:
    """Custom training strategy implementation."""
    
    def __init__(self):
        """Initialize the custom strategy."""
        logger.info("Initializing CustomStrategy")
    
    def get_strategy_name(self) -> str:
        """Return strategy name."""
        return "custom"
    
    def prepare_model(self, model: Any, config: Dict) -> Any:
        """
        Prepare model for custom training.
        
        Args:
            model: Base model instance
            config: Configuration dictionary
            
        Returns:
            Prepared model
        """
        logger.info("Preparing model for custom strategy")
        
        # Apply quantization preparation if needed
        if config.get("use_4bit") or config.get("use_8bit"):
            model = prepare_model_for_kbit_training(model)
        
        # Apply LoRA adapters
        if config.get("use_lora", True):
            peft_config = LoraConfig(
                r=config.get("lora_r", 16),
                lora_alpha=config.get("lora_alpha", 32),
                lora_dropout=config.get("lora_dropout", 0.1),
                bias="none",
                task_type=TaskType.CAUSAL_LM,
                target_modules=config.get("target_modules", "all-linear"),
            )
            model = get_peft_model(model, peft_config)
        
        # Apply your custom model modifications here
        model = self._apply_custom_modifications(model, config)
        
        logger.info("Model prepared successfully")
        return model
    
    def prepare_dataset(
        self,
        dataset: Any,
        tokenizer: Any,
        config: Dict
    ) -> Any:
        """
        Prepare dataset for custom training.
        
        Args:
            dataset: Raw dataset
            tokenizer: Tokenizer instance
            config: Configuration dictionary
            
        Returns:
            Prepared dataset
        """
        logger.info("Preparing dataset for custom strategy")
        
        # Validate required fields
        required_fields = self.get_required_dataset_fields()
        missing_fields = [f for f in required_fields if f not in dataset.column_names]
        
        if missing_fields:
            raise TrainingError(
                f"Dataset missing required fields: {missing_fields}. "
                f"Required fields: {required_fields}"
            )
        
        # Apply custom dataset transformations
        dataset = self._transform_dataset(dataset, tokenizer, config)
        
        logger.info(f"Dataset prepared: {len(dataset)} examples")
        return dataset
    
    def create_trainer(
        self,
        model: Any,
        train_dataset: Any,
        eval_dataset: Any,
        tokenizer: Any,
        config: Dict,
        callbacks: List = None
    ) -> Any:
        """
        Create custom trainer.
        
        Args:
            model: Prepared model
            train_dataset: Training dataset
            eval_dataset: Evaluation dataset
            tokenizer: Tokenizer instance
            config: Training configuration
            callbacks: Optional callbacks
            
        Returns:
            Trainer instance
        """
        logger.info("Creating custom trainer")
        
        # Setup training arguments
        training_args = TrainingArguments(
            output_dir=config.get("output_dir", "./results"),
            num_train_epochs=config.get("num_train_epochs", 3),
            per_device_train_batch_size=config.get("per_device_train_batch_size", 4),
            per_device_eval_batch_size=config.get("per_device_eval_batch_size", 4),
            gradient_accumulation_steps=config.get("gradient_accumulation_steps", 4),
            learning_rate=config.get("learning_rate", 2e-4),
            weight_decay=config.get("weight_decay", 0.01),
            warmup_ratio=config.get("warmup_ratio", 0.03),
            lr_scheduler_type=config.get("lr_scheduler_type", "cosine"),
            logging_steps=config.get("logging_steps", 10),
            evaluation_strategy="steps",
            eval_steps=config.get("eval_steps", 100),
            save_strategy="steps",
            save_steps=config.get("save_steps", 500),
            fp16=config.get("fp16", False),
            bf16=config.get("bf16", False),
            gradient_checkpointing=config.get("gradient_checkpointing", True),
            optim=config.get("optim", "paged_adamw_32bit"),
        )
        
        # Create custom trainer or use standard Trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
            tokenizer=tokenizer,
            callbacks=callbacks or [],
        )
        
        return trainer
    
    def get_required_dataset_fields(self) -> List[str]:
        """Return required dataset fields."""
        return ["input", "output"]  # Customize based on your needs
    
    def _apply_custom_modifications(self, model: Any, config: Dict) -> Any:
        """Apply custom model modifications."""
        # Example: Add custom layers, freeze certain parameters, etc.
        logger.info("Applying custom model modifications")
        
        # Your custom logic here
        # model.add_custom_layer()
        # freeze_base_model(model)
        
        return model
    
    def _transform_dataset(
        self,
        dataset: Any,
        tokenizer: Any,
        config: Dict
    ) -> Any:
        """Transform dataset for custom training."""
        logger.info("Transforming dataset")
        
        # Example: Custom tokenization, formatting, etc.
        def format_example(example):
            # Your custom formatting logic
            formatted = {
                "input_ids": tokenizer.encode(
                    example["input"],
                    max_length=config.get("max_seq_length", 512),
                    truncation=True,
                    padding="max_length"
                ),
                "labels": tokenizer.encode(
                    example["output"],
                    max_length=config.get("max_seq_length", 512),
                    truncation=True,
                    padding="max_length"
                )
            }
            return formatted
        
        dataset = dataset.map(
            format_example,
            remove_columns=dataset.column_names
        )
        
        return dataset
```

### Step 2: Register Strategy in Factory

Edit `ModelForge/strategies/strategy_factory.py`:

```python
from .custom_strategy import CustomStrategy

STRATEGY_REGISTRY = {
    "sft": SFTStrategy,
    "qlora": QLoRAStrategy,
    "rlhf": RLHFStrategy,
    "dpo": DPOStrategy,
    "custom": CustomStrategy,  # Add your strategy here
}

def create_strategy(strategy_name: str) -> Any:
    """Create a strategy instance."""
    strategy_class = STRATEGY_REGISTRY.get(strategy_name.lower())
    
    if not strategy_class:
        raise ValueError(
            f"Unknown strategy: {strategy_name}. "
            f"Available strategies: {list(STRATEGY_REGISTRY.keys())}"
        )
    
    return strategy_class()
```

### Step 3: Update Validation Schema

Edit `ModelForge/schemas/training_schemas.py`:

```python
VALID_STRATEGIES = ["sft", "qlora", "rlhf", "dpo", "custom"]  # Add your strategy
```

### Step 4: Test Your Strategy

```python
# test_custom_strategy.py

from ModelForge.strategies.strategy_factory import create_strategy
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_dataset

def test_custom_strategy():
    # Create strategy instance
    strategy = create_strategy("custom")
    
    # Load model and tokenizer
    model_id = "meta-llama/Llama-3.2-3B"
    model = AutoModelForCausalLM.from_pretrained(model_id)
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    
    # Prepare model
    config = {
        "lora_r": 16,
        "lora_alpha": 32,
        "use_4bit": True,
    }
    model = strategy.prepare_model(model, config)
    print("✅ Model prepared successfully")
    
    # Load and prepare dataset
    dataset = load_dataset("your-dataset")
    train_dataset = strategy.prepare_dataset(
        dataset["train"],
        tokenizer,
        config
    )
    print("✅ Dataset prepared successfully")
    
    # Create trainer
    trainer = strategy.create_trainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=dataset.get("validation"),
        tokenizer=tokenizer,
        config=config
    )
    print("✅ Trainer created successfully")

if __name__ == "__main__":
    test_custom_strategy()
```

## Advanced Examples

### Example 1: Curriculum Learning Strategy

Strategy that gradually increases task difficulty:

```python
class CurriculumLearningStrategy:
    """Strategy with curriculum learning."""
    
    def prepare_dataset(self, dataset, tokenizer, config):
        # Sort by difficulty (e.g., sequence length)
        dataset = dataset.sort("length")
        
        # Divide into stages
        n_stages = 3
        stage_size = len(dataset) // n_stages
        
        # Return datasets for each stage
        stages = []
        for i in range(n_stages):
            start = i * stage_size
            end = start + stage_size
            stages.append(dataset[start:end])
        
        return stages
    
    def create_trainer(self, model, train_dataset, eval_dataset, tokenizer, config, callbacks):
        # Train on each stage sequentially
        for stage_idx, stage_data in enumerate(train_dataset):
            logger.info(f"Training stage {stage_idx + 1}/{len(train_dataset)}")
            
            trainer = Trainer(
                model=model,
                train_dataset=stage_data,
                eval_dataset=eval_dataset,
                ...
            )
            
            trainer.train()
        
        return model
```

### Example 2: Multi-Task Strategy

Strategy that trains on multiple tasks simultaneously:

```python
class MultiTaskStrategy:
    """Strategy for multi-task learning."""
    
    def get_required_dataset_fields(self):
        return ["input", "output", "task_type"]
    
    def prepare_dataset(self, dataset, tokenizer, config):
        def format_with_task(example):
            # Prepend task type to input
            formatted_input = f"[{example['task_type']}] {example['input']}"
            return {
                "input": formatted_input,
                "output": example["output"]
            }
        
        return dataset.map(format_with_task)
```

### Example 3: Knowledge Distillation Strategy

Strategy that uses a teacher model:

```python
class KnowledgeDistillationStrategy:
    """Strategy with knowledge distillation."""
    
    def __init__(self, teacher_model_id: str):
        self.teacher_model_id = teacher_model_id
        self.teacher_model = None
    
    def prepare_model(self, model, config):
        # Load teacher model
        self.teacher_model = AutoModelForCausalLM.from_pretrained(
            self.teacher_model_id
        )
        self.teacher_model.eval()
        
        # Prepare student model
        model = prepare_model_for_kbit_training(model)
        return model
    
    def create_trainer(self, model, train_dataset, eval_dataset, tokenizer, config, callbacks):
        # Custom training loop with distillation loss
        # loss = student_loss + alpha * distillation_loss
        ...
```

## Best Practices

### ✅ Do's

1. **Implement all required methods** - Follow the interface completely
2. **Add comprehensive logging** - Help with debugging
3. **Validate inputs** - Check dataset fields, config values
4. **Handle errors gracefully** - Use proper exception handling
5. **Document requirements** - List dependencies and constraints
6. **Test thoroughly** - Test with various models and datasets
7. **Optimize memory usage** - Be mindful of VRAM constraints

### ❌ Don'ts

1. **Don't break compatibility** - Maintain the interface contract
2. **Don't hardcode values** - Use configuration parameters
3. **Don't ignore existing strategies** - Learn from SFT, QLoRA implementations
4. **Don't skip validation** - Always validate dataset fields
5. **Don't forget edge cases** - Handle empty datasets, missing fields

## Integration with ModelForge

### Configuration via API

```bash
curl -X POST http://localhost:8000/api/start_training \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "custom",
    "model_name": "meta-llama/Llama-3.2-3B",
    "dataset": "/path/to/dataset.jsonl",
    ...
  }'
```

### Configuration via UI

Your custom strategy will automatically appear in the UI strategy dropdown once registered.

## Troubleshooting

### Strategy Not Found

**Problem**: `Unknown strategy: custom`

**Solution**: Ensure strategy is registered in `STRATEGY_REGISTRY` and `VALID_STRATEGIES`.

### Dataset Validation Fails

**Problem**: Missing required fields

**Solution**: Check `get_required_dataset_fields()` matches your dataset.

### Training Fails

**Problem**: Trainer crashes during training

**Solution**: Add detailed logging in `create_trainer()` to debug.

## Contributing Your Strategy

Want to contribute your strategy to ModelForge?

1. **Create a Pull Request** on GitHub
2. **Include documentation** - Add strategy docs
3. **Add tests** - Include unit and integration tests
4. **Update README** - Document new strategy
5. **Provide examples** - Include usage examples

See [Contributing Guide](../contributing/contributing.md) for details.

## Example Strategies to Implement

### Ideas for Custom Strategies

1. **Few-Shot Learning** - Train with very few examples
2. **Active Learning** - Iteratively select best training examples
3. **Meta-Learning** - Learn to learn across tasks
4. **Continual Learning** - Learn new tasks without forgetting
5. **Adapter Tuning** - Use adapter layers instead of LoRA
6. **Prefix Tuning** - Optimize only input prefixes
7. **BitFit** - Fine-tune only bias terms
8. **IA3** - Infused Adapter by Inhibiting and Amplifying

## Next Steps

- **[Strategy Overview](overview.md)** - Understand the strategy system
- **[SFT Strategy](sft.md)** - Study the standard implementation
- **[QLoRA Strategy](qlora.md)** - See memory-efficient strategy
- **[Contributing Guide](../contributing/contributing.md)** - Submit your strategy

---

**Extend ModelForge with custom strategies!** Support any training algorithm or optimization technique.
