# Model Configuration Directory

This directory contains modular configuration files for model recommendations based on hardware profiles and tasks.

## Schema

Each configuration file represents a hardware profile (e.g., `low_end.json`, `mid_range.json`, `high_end.json`) and contains recommended models for various tasks.

### File Structure

```json
{
  "profile": "profile_name",
  "tasks": {
    "task_name": {
      "primary": "best_recommended_model",
      "alternatives": ["model1", "model2", "model3"]
    }
  }
}
```

### Fields

- **profile**: The hardware profile name (low_end, mid_range, high_end)
- **tasks**: Object containing task configurations
- **primary**: The best/default recommended model for this task and profile
- **alternatives**: Array of additional recommended models for this task and profile

### Supported Tasks

- `text-generation`: Generate text based on input prompts
- `summarization`: Summarize long text into shorter summaries
- `question-answering`: Answer questions based on context
- `extractive-question-answering`: Extract answers from text passages

### Example Configuration File

```json
{
  "profile": "mid_range",
  "tasks": {
    "text-generation": {
      "primary": "mistralai/Mistral-7B-Instruct-v0.3",
      "alternatives": [
        "mistralai/Mistral-7B-Instruct-v0.3",
        "meta-llama/Llama-3.2-1B"
      ]
    },
    "summarization": {
      "primary": "facebook/bart-base",
      "alternatives": [
        "facebook/bart-base",
        "google-t5/t5-small"
      ]
    }
  }
}
```

## Contributing

### Adding a New Hardware Profile

1. Create a new JSON file named `{profile_name}.json` in this directory
2. Follow the schema above
3. Ensure the `profile` field matches the filename (without .json extension)
4. Add appropriate models for each supported task

### Adding Models to Existing Profiles

1. Open the relevant profile file (e.g., `low_end.json`)
2. Add models to the `alternatives` array for the relevant task
3. Optionally, change the `primary` model if you believe a better default exists
4. Ensure all model names are valid HuggingFace repository names

### Guidelines

- **Primary Model**: Should be the best performing model for the given hardware profile and task
- **Alternatives**: Should be ordered by preference (best alternatives first)
- **Model Names**: Must be valid HuggingFace repository names (format: `organization/model-name`)
- **Hardware Compatibility**: Ensure models can run on the target hardware profile
- **License Compliance**: Only include models with appropriate licenses for the intended use

### Validation

All configuration files are automatically validated on startup. Ensure your JSON is properly formatted and follows the schema.
