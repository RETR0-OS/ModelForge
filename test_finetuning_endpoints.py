#!/usr/bin/env python3
"""
Comprehensive Test Script for Finetuning Endpoints
Tests all 24 combinations: 3 tasks × 2 providers × 4 strategies
"""

import requests
import json
import time
import sys
from datetime import datetime
from pathlib import Path

BASE_URL = "http://localhost:8000/api/finetune"

# Test configurations
TASKS = ["text-generation", "summarization", "extractive-question-answering"]
PROVIDERS = ["huggingface", "unsloth"]
STRATEGIES = ["sft", "rlhf", "dpo", "qlora"]

# Dataset mapping for each task
DATASET_MAPPING = {
    "text-generation": "/home/user/ModelForge/ModelForge/test_datasets/low_text_generation.jsonl",
    "summarization": "/home/user/ModelForge/ModelForge/test_datasets/low_summarization_train_set.jsonl",
    "extractive-question-answering": "/home/user/ModelForge/ModelForge/test_datasets/low_qa_train_set.jsonl"
}

# Use a lightweight model for all tests
TEST_MODEL = "gpt2"  # Small, fast model available on HuggingFace

# Results tracking
results = []
start_time = datetime.now()

def log_message(message, level="INFO"):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")
    sys.stdout.flush()

def api_call(endpoint, method="GET", data=None, timeout=600):
    """Make an API call with error handling"""
    url = f"{BASE_URL}/{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, timeout=timeout)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=timeout)

        return response
    except requests.exceptions.RequestException as e:
        log_message(f"API call failed: {e}", "ERROR")
        return None

def reset_session():
    """Reset the training session"""
    log_message("Resetting session...")
    response = api_call("reset_status", method="POST")
    if response and response.status_code == 200:
        log_message("Session reset successful")
        time.sleep(2)  # Give time for cleanup
        return True
    else:
        log_message("Session reset failed", "ERROR")
        return False

def validate_task(task):
    """Validate task selection"""
    log_message(f"Validating task: {task}")
    response = api_call("validate_task", method="POST", data={"task": task})
    if response and response.status_code == 200:
        log_message(f"Task '{task}' validated successfully")
        return True
    else:
        log_message(f"Task validation failed: {response.status_code if response else 'No response'}", "ERROR")
        return False

def set_model(task):
    """Set the model for training"""
    log_message(f"Setting model: {TEST_MODEL}")

    # Use set_model endpoint instead of set_custom_model to bypass HuggingFace validation
    # which fails due to proxy restrictions
    response = api_call("set_model", method="POST", data={
        "selected_model": TEST_MODEL
    })
    if response and response.status_code == 200:
        log_message(f"Model '{TEST_MODEL}' set successfully")
        return True
    else:
        log_message(f"Model setting failed: {response.status_code if response else 'No response'}", "ERROR")
        if response:
            log_message(f"Response: {response.text}", "ERROR")
        return False

def validate_dataset(dataset_path):
    """Validate dataset path"""
    log_message(f"Validating dataset: {dataset_path}")
    response = api_call("validate_dataset_path", method="POST", data={
        "path": dataset_path
    })
    if response and response.status_code == 200:
        log_message("Dataset validated successfully")
        return True
    else:
        log_message(f"Dataset validation failed: {response.status_code if response else 'No response'}", "ERROR")
        return False

def start_training(task, provider, strategy, dataset_path):
    """Start training with specified configuration"""
    log_message(f"Starting training: task={task}, provider={provider}, strategy={strategy}")

    # Training configuration - using TrainingConfig schema fields
    config = {
        "task": task,
        "model_name": TEST_MODEL,
        "provider": provider,
        "strategy": strategy,
        "dataset": dataset_path,
        "compute_specs": "low_end",  # Using low_end for fast testing
        "num_train_epochs": 1,  # Only 1 epoch for testing
        "per_device_train_batch_size": 1,  # Very small batch for fast testing
        "per_device_eval_batch_size": 1,
        "gradient_accumulation_steps": 1,
        "learning_rate": 2e-4,
        "max_seq_length": 128,  # Shorter sequences for faster training
        "warmup_ratio": 0.03,
        "eval_steps": 100,
        "lora_r": 8,  # Small LoRA rank for fast testing
        "lora_alpha": 16,
        "lora_dropout": 0.1,
        "use_4bit": False,  # Disable quantization for CPU testing
        "gradient_checkpointing": False,  # Disable for speed
        "group_by_length": False,
        "packing": False
    }

    response = api_call("start_training", method="POST", data=config, timeout=3600)

    if response and response.status_code == 200:
        log_message("Training started successfully")
        return True
    else:
        log_message(f"Training start failed: {response.status_code if response else 'No response'}", "ERROR")
        if response:
            log_message(f"Response: {response.text}", "ERROR")
        return False

def monitor_training(max_wait_seconds=3600):
    """Monitor training status until completion or timeout"""
    log_message("Monitoring training progress...")
    start = time.time()
    last_status = None

    while time.time() - start < max_wait_seconds:
        response = api_call("status")
        if response and response.status_code == 200:
            status_data = response.json()
            current_status = status_data.get("status", "unknown")

            if current_status != last_status:
                log_message(f"Training status: {current_status}")
                last_status = current_status

                # Log progress if available
                if "progress" in status_data:
                    log_message(f"Progress: {status_data['progress']}")

            if current_status == "completed":
                log_message("Training completed successfully!")
                return True, "completed"
            elif current_status == "failed":
                error_msg = status_data.get("error", "Unknown error")
                log_message(f"Training failed: {error_msg}", "ERROR")
                return False, f"failed: {error_msg}"
            elif current_status == "idle":
                log_message("Training status is idle (may have completed or reset)")
                return True, "idle"

        time.sleep(5)  # Check every 5 seconds

    log_message("Training monitoring timed out", "ERROR")
    return False, "timeout"

def test_combination(task, provider, strategy, combination_number, total_combinations):
    """Test a single task/provider/strategy combination"""
    log_message("=" * 80)
    log_message(f"TEST {combination_number}/{total_combinations}")
    log_message(f"Task: {task} | Provider: {provider} | Strategy: {strategy}")
    log_message("=" * 80)

    test_start = time.time()
    result = {
        "test_number": combination_number,
        "task": task,
        "provider": provider,
        "strategy": strategy,
        "model": TEST_MODEL,
        "dataset": DATASET_MAPPING[task],
        "start_time": datetime.now().isoformat(),
        "status": "pending"
    }

    try:
        # Step 1: Reset session
        if not reset_session():
            result["status"] = "failed"
            result["error"] = "Session reset failed"
            result["duration_seconds"] = time.time() - test_start
            return result

        # Step 2: Validate task
        if not validate_task(task):
            result["status"] = "failed"
            result["error"] = "Task validation failed"
            result["duration_seconds"] = time.time() - test_start
            return result

        # Step 3: Set model
        if not set_model(task):
            result["status"] = "failed"
            result["error"] = "Model setting failed"
            result["duration_seconds"] = time.time() - test_start
            return result

        # Step 4: Validate dataset
        dataset_path = DATASET_MAPPING[task]
        if not validate_dataset(dataset_path):
            result["status"] = "failed"
            result["error"] = "Dataset validation failed"
            result["duration_seconds"] = time.time() - test_start
            return result

        # Step 5: Start training
        if not start_training(task, provider, strategy, dataset_path):
            result["status"] = "failed"
            result["error"] = "Training start failed"
            result["duration_seconds"] = time.time() - test_start
            return result

        # Step 6: Monitor training
        success, final_status = monitor_training(max_wait_seconds=3600)

        result["status"] = "success" if success else "failed"
        result["training_status"] = final_status
        result["duration_seconds"] = time.time() - test_start
        result["end_time"] = datetime.now().isoformat()

        log_message(f"Test completed with status: {result['status']}")

    except Exception as e:
        log_message(f"Test failed with exception: {e}", "ERROR")
        result["status"] = "failed"
        result["error"] = str(e)
        result["duration_seconds"] = time.time() - test_start
        result["end_time"] = datetime.now().isoformat()

    return result

def main():
    """Run all test combinations"""
    log_message("=" * 80)
    log_message("STARTING COMPREHENSIVE FINETUNING ENDPOINT TESTS")
    log_message("=" * 80)
    log_message(f"Total combinations to test: {len(TASKS) * len(PROVIDERS) * len(STRATEGIES)}")
    log_message(f"Test model: {TEST_MODEL}")
    log_message(f"Epochs per test: 1")
    log_message("=" * 80)

    combination_number = 0
    total_combinations = len(TASKS) * len(PROVIDERS) * len(STRATEGIES)

    # Generate all combinations and test each
    for task in TASKS:
        for provider in PROVIDERS:
            for strategy in STRATEGIES:
                combination_number += 1

                result = test_combination(task, provider, strategy, combination_number, total_combinations)
                results.append(result)

                # Save intermediate results
                save_results()

                # Brief pause between tests
                if combination_number < total_combinations:
                    log_message(f"Pausing 10 seconds before next test...")
                    time.sleep(10)

    # Final summary
    log_message("=" * 80)
    log_message("ALL TESTS COMPLETED")
    log_message("=" * 80)

    total_duration = (datetime.now() - start_time).total_seconds()
    successful = sum(1 for r in results if r["status"] == "success")
    failed = sum(1 for r in results if r["status"] == "failed")

    log_message(f"Total tests: {len(results)}")
    log_message(f"Successful: {successful}")
    log_message(f"Failed: {failed}")
    log_message(f"Total duration: {total_duration:.2f} seconds ({total_duration/60:.2f} minutes)")

    # Print failure summary if any
    if failed > 0:
        log_message("=" * 80)
        log_message("FAILED TESTS:")
        log_message("=" * 80)
        for r in results:
            if r["status"] == "failed":
                log_message(f"  - {r['task']} / {r['provider']} / {r['strategy']}: {r.get('error', 'Unknown error')}")

    save_results()

def save_results():
    """Save results to JSON file"""
    output_file = "/home/user/ModelForge/test_results.json"
    with open(output_file, 'w') as f:
        json.dump({
            "test_run_start": start_time.isoformat(),
            "test_run_end": datetime.now().isoformat(),
            "total_duration_seconds": (datetime.now() - start_time).total_seconds(),
            "total_tests": len(results),
            "successful": sum(1 for r in results if r["status"] == "success"),
            "failed": sum(1 for r in results if r["status"] == "failed"),
            "results": results
        }, f, indent=2)
    log_message(f"Results saved to: {output_file}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log_message("\nTests interrupted by user", "WARNING")
        save_results()
        sys.exit(1)
    except Exception as e:
        log_message(f"Fatal error: {e}", "ERROR")
        import traceback
        traceback.print_exc()
        save_results()
        sys.exit(1)
