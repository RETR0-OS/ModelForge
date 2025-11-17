# Adding Custom Providers

Extend ModelForge with your own model providers.

## Overview

ModelForge's provider system is designed to be extensible. You can add support for new model sources, optimization libraries, or custom model loading logic.

## What is a Provider?

A **provider** is a backend that handles:
- Loading models from different sources (HuggingFace Hub, local files, custom APIs)
- Applying optimizations (quantization, kernel patches, memory optimizations)
- Managing tokenizers
- Setting up device mappings
- Validating model access

## Provider Interface

All providers must implement the provider protocol:

```python
from typing import Any, Protocol

class ModelProvider(Protocol):
    """Protocol that all providers must implement."""
    
    def load_model(
        self,
        model_id: str,
        model_class: str,
        quantization_config: Any = None,
        device_map: str = "auto",
        **kwargs
    ) -> Any:
        """Load a model from the provider."""
        ...
    
    def load_tokenizer(
        self,
        model_id: str,
        **kwargs
    ) -> Any:
        """Load a tokenizer for the model."""
        ...
    
    def validate_model_access(
        self,
        model_id: str,
        model_class: str
    ) -> bool:
        """Validate that the model is accessible."""
        ...
    
    def get_provider_name(self) -> str:
        """Return the provider name."""
        ...
```

## Creating a Custom Provider

### Step 1: Create Provider Class

Create a new file in `ModelForge/providers/`:

```python
# ModelForge/providers/custom_provider.py

from typing import Any, Dict, Optional
from transformers import AutoModelForCausalLM, AutoTokenizer
from ..logging_config import logger
from ..exceptions import ModelAccessError, ProviderError

class CustomProvider:
    """Custom provider implementation."""
    
    def __init__(self):
        """Initialize the custom provider."""
        logger.info("Initializing CustomProvider")
        # Add any initialization logic here
    
    def get_provider_name(self) -> str:
        """Return provider name."""
        return "custom"
    
    def load_model(
        self,
        model_id: str,
        model_class: str,
        quantization_config: Any = None,
        device_map: str = "auto",
        **kwargs
    ) -> Any:
        """
        Load model with custom logic.
        
        Args:
            model_id: Model identifier (HF repo or local path)
            model_class: Model class name (e.g., "AutoModelForCausalLM")
            quantization_config: Optional quantization config
            device_map: Device mapping strategy
            **kwargs: Additional arguments
            
        Returns:
            Loaded model instance
            
        Raises:
            ModelAccessError: If model cannot be accessed
            ProviderError: If loading fails
        """
        try:
            logger.info(f"Loading model {model_id} with CustomProvider")
            
            # Your custom model loading logic here
            # Example: Load from HuggingFace with custom patches
            model = AutoModelForCausalLM.from_pretrained(
                model_id,
                quantization_config=quantization_config,
                device_map=device_map,
                trust_remote_code=True,
                **kwargs
            )
            
            # Apply custom optimizations
            model = self._apply_custom_optimizations(model)
            
            logger.info(f"Model {model_id} loaded successfully")
            return model
            
        except Exception as e:
            logger.error(f"Failed to load model {model_id}: {e}")
            raise ProviderError(f"CustomProvider failed to load model: {e}") from e
    
    def load_tokenizer(
        self,
        model_id: str,
        **kwargs
    ) -> Any:
        """
        Load tokenizer for the model.
        
        Args:
            model_id: Model identifier
            **kwargs: Additional arguments
            
        Returns:
            Tokenizer instance
        """
        try:
            logger.info(f"Loading tokenizer for {model_id}")
            
            tokenizer = AutoTokenizer.from_pretrained(
                model_id,
                trust_remote_code=True,
                **kwargs
            )
            
            # Set padding token if not set
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token
            
            return tokenizer
            
        except Exception as e:
            logger.error(f"Failed to load tokenizer: {e}")
            raise ProviderError(f"Failed to load tokenizer: {e}") from e
    
    def validate_model_access(
        self,
        model_id: str,
        model_class: str
    ) -> bool:
        """
        Validate that model is accessible.
        
        Args:
            model_id: Model identifier
            model_class: Expected model class
            
        Returns:
            True if accessible
            
        Raises:
            ModelAccessError: If model is not accessible
        """
        try:
            from huggingface_hub import model_info
            
            # Check if model exists on HuggingFace
            info = model_info(model_id)
            logger.info(f"Model {model_id} is accessible")
            return True
            
        except Exception as e:
            logger.error(f"Model {model_id} not accessible: {e}")
            raise ModelAccessError(f"Cannot access model {model_id}: {e}") from e
    
    def _apply_custom_optimizations(self, model: Any) -> Any:
        """Apply custom optimizations to the model."""
        # Example: Apply custom kernels, patches, or optimizations
        logger.info("Applying custom optimizations")
        
        # Your optimization logic here
        # model = apply_flash_attention(model)
        # model = enable_custom_kernels(model)
        
        return model
```

### Step 2: Register Provider in Factory

Edit `ModelForge/providers/provider_factory.py`:

```python
from .custom_provider import CustomProvider

PROVIDER_REGISTRY = {
    "huggingface": HuggingFaceProvider,
    "unsloth": UnslothProvider,
    "custom": CustomProvider,  # Add your provider here
}

def create_provider(provider_name: str) -> Any:
    """Create a provider instance."""
    provider_class = PROVIDER_REGISTRY.get(provider_name.lower())
    
    if not provider_class:
        raise ProviderError(
            f"Unknown provider: {provider_name}. "
            f"Available providers: {list(PROVIDER_REGISTRY.keys())}"
        )
    
    return provider_class()
```

### Step 3: Update Validation Schema

Edit `ModelForge/schemas/training_schemas.py`:

```python
VALID_PROVIDERS = ["huggingface", "unsloth", "custom"]  # Add your provider
```

### Step 4: Test Your Provider

```python
# test_custom_provider.py

from ModelForge.providers.provider_factory import create_provider

def test_custom_provider():
    # Create provider instance
    provider = create_provider("custom")
    
    # Test model validation
    try:
        provider.validate_model_access(
            "meta-llama/Llama-3.2-3B",
            "AutoModelForCausalLM"
        )
        print("✅ Model validation successful")
    except Exception as e:
        print(f"❌ Model validation failed: {e}")
    
    # Test model loading
    try:
        model = provider.load_model(
            "meta-llama/Llama-3.2-3B",
            "AutoModelForCausalLM",
            device_map="auto"
        )
        print("✅ Model loading successful")
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
    
    # Test tokenizer loading
    try:
        tokenizer = provider.load_tokenizer("meta-llama/Llama-3.2-3B")
        print("✅ Tokenizer loading successful")
    except Exception as e:
        print(f"❌ Tokenizer loading failed: {e}")

if __name__ == "__main__":
    test_custom_provider()
```

## Advanced Examples

### Example 1: Cloud API Provider

Provider that loads models from a cloud API instead of locally:

```python
class CloudAPIProvider:
    """Provider for cloud-hosted models."""
    
    def __init__(self, api_key: str, api_endpoint: str):
        self.api_key = api_key
        self.api_endpoint = api_endpoint
    
    def load_model(self, model_id: str, **kwargs):
        """Load model from cloud API."""
        # Return a wrapper that makes API calls
        return CloudModelWrapper(
            model_id=model_id,
            api_key=self.api_key,
            api_endpoint=self.api_endpoint
        )
```

### Example 2: Optimized Local Provider

Provider with custom optimizations for local models:

```python
class OptimizedLocalProvider:
    """Provider with aggressive optimizations."""
    
    def load_model(self, model_id: str, **kwargs):
        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16,
            device_map="auto"
        )
        
        # Apply flash attention
        model = apply_flash_attention_2(model)
        
        # Compile with torch.compile
        model = torch.compile(model, mode="max-autotune")
        
        return model
```

### Example 3: GGUF Provider

Provider for loading GGUF quantized models:

```python
class GGUFProvider:
    """Provider for GGUF format models."""
    
    def load_model(self, model_id: str, **kwargs):
        from llama_cpp import Llama
        
        # Load GGUF model
        model = Llama(
            model_path=model_id,
            n_gpu_layers=-1,  # Use all GPU layers
            n_ctx=2048
        )
        
        return model
```

## Provider Configuration

You can add provider-specific configuration options:

```python
class CustomProvider:
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.optimization_level = self.config.get("optimization_level", "default")
        self.use_custom_kernels = self.config.get("use_custom_kernels", True)
```

Then use it:

```json
{
  "provider": "custom",
  "provider_config": {
    "optimization_level": "aggressive",
    "use_custom_kernels": true
  }
}
```

## Best Practices

### ✅ Do's

1. **Always validate inputs** - Check model_id, model_class, etc.
2. **Implement proper error handling** - Use custom exceptions
3. **Add logging** - Use logger for debugging
4. **Set fallbacks** - Handle missing pad tokens, etc.
5. **Test thoroughly** - Test with various models and configs
6. **Document requirements** - List dependencies and installation

### ❌ Don'ts

1. **Don't break the interface** - Always implement all required methods
2. **Don't hardcode paths** - Use configuration or environment variables
3. **Don't ignore errors silently** - Always raise appropriate exceptions
4. **Don't skip validation** - Always validate model access
5. **Don't assume HuggingFace** - Support other model sources

## Troubleshooting

### Import Errors

**Problem**: Provider imports fail

**Solution**: Add dependencies to `pyproject.toml`:

```toml
[project.optional-dependencies]
custom = [
    "custom-library>=1.0.0",
]
```

### Model Loading Fails

**Problem**: Models don't load with custom provider

**Solution**: Add detailed logging to debug:

```python
logger.debug(f"Loading with kwargs: {kwargs}")
logger.debug(f"Quantization config: {quantization_config}")
```

### Provider Not Recognized

**Problem**: `Unknown provider: custom`

**Solution**: Ensure provider is registered in `PROVIDER_REGISTRY` and `VALID_PROVIDERS`.

## Contributing Your Provider

Want to contribute your provider to ModelForge?

1. **Create a Pull Request** on GitHub
2. **Include documentation** - Add provider docs
3. **Add tests** - Include unit and integration tests
4. **Update README** - Document new provider
5. **Add dependencies** - Update `pyproject.toml`

See [Contributing Guide](../contributing/contributing.md) for details.

## Next Steps

- **[Provider Overview](overview.md)** - Understand the provider system
- **[HuggingFace Provider](huggingface.md)** - Study the standard implementation
- **[Unsloth Provider](unsloth.md)** - See an optimized provider example
- **[Contributing Guide](../contributing/contributing.md)** - Submit your provider

---

**Extend ModelForge with custom providers!** Support any model source or optimization library.
