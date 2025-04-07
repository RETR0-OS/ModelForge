import torch
from datasets import load_dataset
from trl import SFTTrainer
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TrainingArguments, DataCollatorForLanguageModeling
from typing import Dict, Optional
from Finetuner import Finetuner


class CausalLLMFinetuner(Finetuner):
    def __init__(self, model_name: str, compute_specs="low_end") -> None:
        super().__init__(model_name, compute_specs)
        self.task = TaskType.CAUSAL_LM

    @staticmethod
    def format_example(example: dict, specs:str) -> Optional[Dict[str, str]]:
        # Concatenate the context, question, and answer into a single text field.

        if specs == "low_end":
            # LLama-3.2-1B chat template-based formatting
            return {"text": f"""
                <|start_header_id|>system<|end_header_id|>
                You are a helpful text-generation assistant that helps the user to generate text based on the input prompt.
                <|eot_id|><|start_header_id|>user<|end_header_id|>
                {example['input']}
                <|eot_id|><|start_header_id|>assistant<|end_header_id|>
                {example['output']}
                <|eot_id|>
            """}
        elif specs == "mid_range":
            return {"text": f"""
                <s>[INST]You are a helpful text-generation assistant that helps the user to generate text based on the input prompt.[/INST]
                   {example['input']}
                </s>
                <s>[ASSISTANT] {example['output']} [/ASSISTANT]</s>
            """}
        elif specs == "high_end":
            return {"text": f"""
                <s>[INST]You are a helpful text-generation assistant that helps the user to generate text based on the input prompt.[/INST]
                   {example['input']}
                </s>
                <s>[ASSISTANT] {example['output']} [/ASSISTANT]</s>
            """}

    def load_dataset(self, dataset_path:str) -> None:
        dataset = load_dataset("json", data_files={"train": dataset_path})
        dataset = dataset.map(lambda example: self.format_example(example, self.compute_specs))['train']
        print(dataset)
        self.dataset = dataset

    def set_settings(self, **kwargs) -> None:
        """
        Set model training settings from keyword arguments.
        Groups settings by category for better organization.
        """
        super().set_settings(**kwargs)

    def finetune(self) -> bool:
        try:
            compute_dtype = getattr(torch, self.bnb_4bit_compute_dtype)

            if self.use_4bit:
                bits_n_bytes_config = BitsAndBytesConfig(
                    load_in_4bit=self.use_4bit,
                    bnb_4bit_quant_type=self.bnb_4bit_quant_type,
                    bnb_4bit_compute_dtype=compute_dtype,
                    bnb_4bit_use_double_quant=self.use_nested_quant,
                )
            elif self.use_8bit:
                bits_n_bytes_config = BitsAndBytesConfig(
                    load_in_8bit=self.use_8bit,
                    bnb_8bit_quant_type=self.bnb_8bit_quant_type,
                    bnb_8bit_compute_dtype=compute_dtype,
                    bnb_8bit_use_double_quant=self.use_nested_quant,
                )

            if self.use_4bit or self.use_8bit:
                model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    quantization_config=bits_n_bytes_config,
                    device_map=self.device_map,
                    use_cache=False,
                )
            else:
                model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    device_map=self.device_map,
                    use_cache=False,
                )

            tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
            tokenizer.pad_token = tokenizer.eos_token
            tokenizer.padding_side = "right"

            peft_config = LoraConfig(
                lora_alpha=self.lora_alpha,
                lora_dropout=self.lora_dropout,
                r=self.lora_r,
                bias="none",
                task_type=self.task,
            )

            training_arguments = TrainingArguments(
                output_dir=self.output_dir,
                num_train_epochs=self.num_train_epochs,
                per_device_train_batch_size=self.per_device_train_batch_size,
                gradient_accumulation_steps=self.gradient_accumulation_steps,
                optim=self.optim,
                save_steps=self.save_steps,
                logging_steps=self.logging_steps,
                learning_rate=self.learning_rate,
                warmup_ratio=self.warmup_ratio,
                weight_decay=self.weight_decay,
                fp16=self.fp16,
                bf16=self.bf16,
                max_grad_norm=self.max_grad_norm,
                max_steps=self.max_steps,
                group_by_length=self.group_by_length,
                lr_scheduler_type=self.lr_scheduler_type,
                report_to="tensorboard",
                logging_dir=self.logging_dir,
            )

            model = get_peft_model(model, peft_config)

            trainer = SFTTrainer(
                model=model,
                train_dataset=self.dataset,
                args=training_arguments,
                data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
            )

            trainer.train()
            trainer.model.save_pretrained(self.fine_tuned_name)
            tokenizer.save_pretrained(self.fine_tuned_name)
            print(f"Model saved to: {self.fine_tuned_name}")
            super().report_finish()
            return True
        except Exception as e:
            print(f"An error occurred during training: {e}")
            super().report_finish(error=True, message=e)
            return False
