import psutil
import pynvml
from typing import Dict, List, Tuple, Union


class HardwareDetector:

    def __init__(self):
        self.model_profiles = {
          "low_end": {
            "text-generation": "meta-llama/Llama-3.2-1B",
            "summarization": "google-t5/t5-small",
            "question-answering": "google-t5/t5-small",
            "extractive-question-answering": "deepset/roberta-base-squad2",
            "possible_options": {"text-generation": ["meta-llama/Llama-3.2-1B"],
                                 "summarization": ["google-t5/t5-small"],
                                 "extractive-question-answering": ["deepset/roberta-base-squad2"]
                                 }
          },
          "mid_range": {
            "text-generation": "mistralai/Mistral-7B-Instruct-v0.3",
            "summarization": "facebook/bart-base",
            "question-answering": "facebook/bart-base",
            "extractive-question-answering": "facebook/bart-base",
            "possible_options": {"text-generation": ["mistralai/Mistral-7B-Instruct-v0.3", "meta-llama/Llama-3.2-1B"],
                                 "summarization": ["facebook/bart-base", "google-t5/t5-small"],
                                 "extractive-question-answering": ["facebook/bart-base", "deepset/roberta-base-squad2"]
                                 }
          },
          "high_end": {
            "text-generation": "bigscience/bloom-7b1",
            "summarization": "IlyaGusev/mbart_ru_sum_gazeta",
            "question-answering": "IlyaGusev/mbart_ru_sum_gazeta",
            "extractive-question-answering": "IlyaGusev/mbart_ru_sum_gazeta",
            "possible_options": {"text-generation": ["bigscience/bloom-7b1", "mistralai/Mistral-7B-Instruct-v0.3", "meta-llama/Llama-3.2-1B"],
                                 "summarization": ["IlyaGusev/mbart_ru_sum_gazeta", "facebook/bart-base", "google-t5/t5-small"],
                                 "extractive-question-answering": ["IlyaGusev/mbart_ru_sum_gazeta", "facebook/bart-base", "deepset/roberta-base-squad2"]
                                 }
          }
        }
        self.hardware_profile = {}
        self.model_requirements = {}
        self.model_recommendation = ""

    def get_gpu_specs(self) -> None:
        pynvml.nvmlInit()
        device_count = pynvml.nvmlDeviceGetCount()
        if device_count == 0:
            raise RuntimeError("No CUDA-enabled GPU detected. Please ensure that your system has a CUDA-enabled GPU and that you have the correct drivers installed.")
        gpu_handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        gpu_name = pynvml.nvmlDeviceGetName(gpu_handle)
        gpu_mem_info = pynvml.nvmlDeviceGetMemoryInfo(gpu_handle)
        gpu_total_mem = gpu_mem_info.total / (1024 ** 3)
        pynvml.nvmlShutdown()
        self.hardware_profile['gpu_name'] = gpu_name
        self.hardware_profile['gpu_total_memory_gb'] = round(gpu_total_mem, 2)
        pynvml.nvmlShutdown()

    def get_computer_specs(self) -> None:
        memory = psutil.virtual_memory()
        ram_total = memory.total
        available_diskspace = psutil.disk_usage('/').free / (1024 ** 3)
        cpu_cores = psutil.cpu_count(logical=True)
        self.hardware_profile['ram_total_gb'] = round(ram_total / (1024 ** 3), 0)
        self.hardware_profile['available_diskspace_gb'] = round(available_diskspace, 2)
        self.hardware_profile['cpu_cores'] = cpu_cores

    def run(self, task) -> Tuple[Dict[str, Union[str, float]], Dict[str, Union[str, float]], str, List[str]]:
        self.model_requirements['task'] = task
        self.get_computer_specs()
        self.get_gpu_specs()
        if self.hardware_profile['gpu_total_memory_gb'] < 7.2:
            self.model_requirements['profile'] = 'low_end'
        elif self.hardware_profile['gpu_total_memory_gb'] < 15.2:
            if self.hardware_profile['ram_total_gb'] < 15.2:
                self.model_requirements['profile'] = 'low_end'
            else:
                self.model_requirements['profile'] = 'mid_range'
        else:
            if self.hardware_profile['ram_total_gb'] < 15.2:
                self.model_requirements['profile'] = 'mid_range'
            else:
                self.model_requirements['profile'] = 'high_end'
        self.model_recommendation = self.model_profiles[self.model_requirements['profile']][self.model_requirements['task']]
        return self.model_requirements, self.hardware_profile, self.model_recommendation, self.model_profiles[self.model_requirements['profile']]["possible_options"][self.model_requirements['task']]