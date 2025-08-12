import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path


class ConfigurationManager:
    """Simple configuration manager for loading and accessing configuration files."""
    
    def __init__(self, config_dir: Optional[str] = None, model_configs_dir: Optional[str] = None):
        """
        Initialize the configuration manager.
        
        Args:
            config_dir: Directory containing configuration files. 
                       Defaults to configs/ in the utilities directory.
            model_configs_dir: Directory containing modular model configuration files.
                              Defaults to model_configs/ in the ModelForge directory.
        """
        if config_dir is None:
            # Default to configs directory relative to this file
            current_dir = Path(__file__).parent.parent
            self.config_dir = current_dir / "configs"
        else:
            self.config_dir = Path(config_dir)
        
        if model_configs_dir is None:
            # Default to model_configs directory in the ModelForge root
            current_dir = Path(__file__).parent.parent.parent
            self.model_configs_dir = current_dir / "model_configs"
        else:
            self.model_configs_dir = Path(model_configs_dir)
        
        self._models_config = None
        self._hardware_thresholds_config = None
        self._tasks_config = None
        
        # Track loading errors for graceful degradation
        self._loading_errors = []
        
        # Load all configurations on initialization
        self._load_configurations()
    
    def _load_configurations(self):
        """Load all configuration files with enhanced error handling."""
        try:
            logging.info(f"Loading configurations from: {self.config_dir}")
            logging.info(f"Loading model configurations from: {self.model_configs_dir}")
            
            # Load each configuration file independently
            self._models_config = self._load_modular_model_configs()
            self._hardware_thresholds_config = self._load_json_file_safely("hardware_thresholds.json")
            self._tasks_config = self._load_json_file_safely("tasks.json")
            
            # Validate essential configurations
            self._validate_configurations()
            
            if self._loading_errors:
                logging.warning(f"Configuration loading completed with {len(self._loading_errors)} errors")
            else:
                logging.info("All configurations loaded successfully")
                
        except Exception as e:
            error_msg = f"Failed to load configuration files: {e}"
            logging.error(error_msg)
            raise RuntimeError(error_msg) from e
    
    def _load_json_file_safely(self, filename: str) -> Optional[Dict[str, Any]]:
        """Load a JSON configuration file with error handling."""
        try:
            return self._load_json_file(filename)
        except Exception as e:
            error_msg = f"Failed to load {filename}: {str(e)}"
            self._loading_errors.append(error_msg)
            logging.error(error_msg)
            return None

    def _load_modular_model_configs(self) -> Optional[Dict[str, Any]]:
        """
        Load modular model configuration files from the model_configs directory.
        
        Returns:
            Dictionary with 'profiles' key containing all hardware profile configurations,
            or None if loading fails.
        """
        try:
            if not self.model_configs_dir.exists():
                error_msg = f"Model configs directory not found: {self.model_configs_dir}"
                self._loading_errors.append(error_msg)
                logging.error(error_msg)
                return None
            
            if not self.model_configs_dir.is_dir():
                error_msg = f"Model configs path is not a directory: {self.model_configs_dir}"
                self._loading_errors.append(error_msg)
                logging.error(error_msg)
                return None
            
            # Initialize the profiles structure
            profiles = {}
            
            # Scan for all JSON files in the model_configs directory
            json_files = list(self.model_configs_dir.glob("*.json"))
            
            if not json_files:
                error_msg = f"No JSON configuration files found in: {self.model_configs_dir}"
                self._loading_errors.append(error_msg)
                logging.warning(error_msg)
                return None
            
            logging.info(f"Found {len(json_files)} model configuration files")
            
            # Load each profile configuration file
            for config_file in json_files:
                try:
                    with open(config_file, 'r', encoding='utf-8') as file:
                        config_data = json.load(file)
                    
                    # Validate the structure of the config file
                    if not isinstance(config_data, dict):
                        error_msg = f"Invalid config format in {config_file.name}: expected object, got {type(config_data).__name__}"
                        self._loading_errors.append(error_msg)
                        logging.error(error_msg)
                        continue
                    
                    if "profile" not in config_data:
                        error_msg = f"Missing 'profile' field in {config_file.name}"
                        self._loading_errors.append(error_msg)
                        logging.error(error_msg)
                        continue
                    
                    if "tasks" not in config_data:
                        error_msg = f"Missing 'tasks' field in {config_file.name}"
                        self._loading_errors.append(error_msg)
                        logging.error(error_msg)
                        continue
                    
                    profile_name = config_data["profile"]
                    
                    # Validate that profile name matches filename
                    expected_filename = f"{profile_name}.json"
                    if config_file.name != expected_filename:
                        warning_msg = f"Profile name '{profile_name}' doesn't match filename '{config_file.name}', expected '{expected_filename}'"
                        logging.warning(warning_msg)
                    
                    # Add the profile to our structure
                    profiles[profile_name] = config_data["tasks"]
                    logging.info(f"Loaded profile '{profile_name}' from {config_file.name}")
                    
                except json.JSONDecodeError as e:
                    error_msg = f"Invalid JSON in {config_file.name}: {e}"
                    self._loading_errors.append(error_msg)
                    logging.error(error_msg)
                    continue
                except Exception as e:
                    error_msg = f"Error loading {config_file.name}: {e}"
                    self._loading_errors.append(error_msg)
                    logging.error(error_msg)
                    continue
            
            if not profiles:
                error_msg = "No valid model profiles were loaded"
                self._loading_errors.append(error_msg)
                logging.error(error_msg)
                return None
            
            # Return in the same format as the original models.json structure
            return {
                "profiles": profiles,
                "custom_model_support": {
                    "enabled": True,
                    "validation_timeout_seconds": 10,
                    "default_warnings": [
                        "Custom model compatibility not guaranteed",
                        "Memory and performance not estimated",
                        "User responsible for hardware limitations"
                    ]
                }
            }
            
        except Exception as e:
            error_msg = f"Failed to load modular model configs: {e}"
            self._loading_errors.append(error_msg)
            logging.error(error_msg)
            return None
    
    def _load_json_file(self, filename: str) -> Dict[str, Any]:
        """Load a JSON configuration file."""
        file_path = self.config_dir / filename
        
        if not file_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {file_path}")
        
        if not file_path.is_file():
            raise ValueError(f"Configuration path is not a file: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = json.load(file)
                if not isinstance(content, dict):
                    raise ValueError(f"Configuration file must contain a JSON object, not {type(content).__name__}")
                return content
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {filename}: {e}")
        except Exception as e:
            raise RuntimeError(f"Error reading {filename}: {e}")
    
    def _validate_configurations(self):
        """Validate that essential configurations are present."""
        validation_errors = []
        
        # Validate models configuration
        if self._models_config is None:
            validation_errors.append("Models configuration is missing")
        elif not self._models_config.get("profiles"):
            validation_errors.append("Models configuration missing 'profiles' section")
        
        # Validate hardware thresholds configuration
        if self._hardware_thresholds_config is None:
            validation_errors.append("Hardware thresholds configuration is missing")
        
        # Validate tasks configuration
        if self._tasks_config is None:
            validation_errors.append("Tasks configuration is missing")
        elif not self._tasks_config.get("available_tasks"):
            validation_errors.append("Tasks configuration missing 'available_tasks' section")
        
        if validation_errors:
            error_msg = "Configuration validation failed: " + "; ".join(validation_errors)
            raise ValueError(error_msg)
    
    def get_model_profiles(self) -> Dict[str, Any]:
        """Get all model profiles with fallback."""
        if self._models_config is None:
            logging.warning("Models configuration not available, returning empty profiles")
            return {}
        return self._models_config.get("profiles", {})
    
    def get_models_for_profile_and_task(self, profile: str, task: str) -> Dict[str, Any]:
        """
        Get model configuration for a specific profile and task.
        
        Args:
            profile: Hardware profile (low_end, mid_range, high_end)
            task: Task name (text-generation, summarization, etc.)
            
        Returns:
            Dictionary containing primary model and alternatives
            
        Raises:
            ValueError: If profile or task is not found
            RuntimeError: If models configuration is not available
        """
        if self._models_config is None:
            raise RuntimeError("Models configuration is not available")
        
        profiles = self.get_model_profiles()
        
        if profile not in profiles:
            available_profiles = list(profiles.keys())
            raise ValueError(f"Unknown profile: {profile}. Available profiles: {available_profiles}")
        
        profile_config = profiles[profile]
        
        if task not in profile_config:
            available_tasks = list(profile_config.keys())
            raise ValueError(f"Unknown task '{task}' for profile '{profile}'. Available tasks: {available_tasks}")
        
        return profile_config[task]
    
    def get_hardware_thresholds(self) -> Dict[str, Any]:
        """Get hardware classification thresholds with fallback."""
        if self._hardware_thresholds_config is None:
            logging.warning("Hardware thresholds configuration not available, returning defaults")
            return self._get_default_hardware_thresholds()
        return self._hardware_thresholds_config
    
    def get_gpu_memory_thresholds(self) -> Dict[str, float]:
        """Get GPU memory thresholds with fallback."""
        thresholds = self.get_hardware_thresholds()
        return thresholds.get("gpu_memory_thresholds", {
            "low_end_max": 7.2,
            "mid_range_max": 15.2
        })
    
    def get_ram_thresholds(self) -> Dict[str, float]:
        """Get RAM thresholds with fallback."""
        thresholds = self.get_hardware_thresholds()
        return thresholds.get("ram_thresholds", {
            "low_end_max": 15.2
        })
    
    def get_available_tasks(self) -> List[Dict[str, Any]]:
        """Get list of available tasks with fallback."""
        if self._tasks_config is None:
            logging.warning("Tasks configuration not available, returning default tasks")
            return self._get_default_tasks()
        return self._tasks_config.get("available_tasks", self._get_default_tasks())
    
    def get_task_names(self) -> List[str]:
        """Get list of available task names."""
        return [task["name"] for task in self.get_available_tasks()]
    
    def get_default_task(self) -> str:
        """Get the default task name with fallback."""
        if self._tasks_config is None:
            return "text-generation"
        return self._tasks_config.get("default_task", "text-generation")
    
    def is_task_supported(self, task: str) -> bool:
        """Check if a task is supported."""
        supported_tasks = self.get_task_names()
        return task in supported_tasks
    
    def get_loading_errors(self) -> List[str]:
        """Get list of errors that occurred during configuration loading."""
        return self._loading_errors.copy()
    
    def has_loading_errors(self) -> bool:
        """Check if there were errors during configuration loading."""
        return len(self._loading_errors) > 0
    
    def _get_default_hardware_thresholds(self) -> Dict[str, Any]:
        """Get default hardware thresholds for fallback."""
        return {
            "gpu_memory_thresholds": {
                "low_end_max": 7.2,
                "mid_range_max": 15.2
            },
            "ram_thresholds": {
                "low_end_max": 15.2
            }
        }
    
    def _get_default_tasks(self) -> List[Dict[str, Any]]:
        """Get default tasks for fallback."""
        return [
            {"name": "text-generation", "description": "Generate text based on input prompts", "supported": True},
            {"name": "summarization", "description": "Summarize long text into shorter summaries", "supported": True},
            {"name": "question-answering", "description": "Answer questions based on context", "supported": True},
            {"name": "extractive-question-answering", "description": "Extract answers from text passages", "supported": True}
        ] 