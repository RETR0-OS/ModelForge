from ModelForge.FastAPI_server.utilities.CausalLLMTuner import CausalLLMFinetuner

llm_tuner = CausalLLMFinetuner(model_name="llama-3.2-1B", compute_specs="low_end")
dataset = "C:/Users/aadit/Projects/ModelForge/ModelForge/FastAPI_server/test_datasets/med_construction.jsonl"

llm_tuner.load_dataset(dataset)
print(llm_tuner.dataset)
print(llm_tuner.dataset[0])
# print(llm_tuner.dataset.features["text"].shape)