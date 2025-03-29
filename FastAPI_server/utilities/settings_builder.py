class SettingsBuilder:

    def __init__(self, task, model_name, compute_profile):
        self.model_name = model_name
        self.task = task
        self.fine_tuned_name = None
        self.output_dir = f"../cache/{model_name}_{task}"
        self.num_train_epochs = 1
        self.dataset = None
        self.compute_profile = compute_profile
        self.lora_r = 16
        self.lora_alpha = 16
        self.lora_dropout = 0.1
        self.use_4bit = True
        self.bnb_4bit_compute_dtype = "nf4"
        self.save_steps = 0
        self.logging_steps = 25
        self.max_seq_length = None

        # BitsAndBytes Advanced
        self.bnb_4bit_use_quant_type = True
        self.use_nested_quant = True
        self.bnb_4bit_quant_type = "nf4"

        # Trainer Advanced
        self.fp16 = False
        self.bf16 = False
        self.per_device_train_batch_size = 1
        self.per_device_eval_batch_size = 4
        self.gradient_accumulation_steps = 4
        self.gradient_checkpointing = True
        self.max_grad_norm = 0.3
        self.learning_rate = 2e-4
        self.weight_decay = 0.001
        self.optim = "paged_adamw_32bit"
        self.lr_scheduler_type = "cosine"
        self.max_steps = -1
        self.warmup_ratio = 0.03
        self.group_by_length = True

        # SFT Advanced
        self.packing = False
        self.device_map = {"": 0}

    def set_settings(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
            else:
                continue

    def get_settings(self):
        return {
            "task": self.task,
            "model_name": self.model_name,
            "num_train_epochs": self.num_train_epochs,
            "compute_specs": self.compute_profile,
            "lora_r": self.lora_r,
            "lora_alpha": self.lora_alpha,
            "lora_dropout": self.lora_dropout,
            "use_4bit": self.use_4bit,
            "bnb_4bit_compute_dtype": self.bnb_4bit_compute_dtype,
            "bnb_4bit_use_quant_type": self.bnb_4bit_use_quant_type,
            "use_nested_quant": self.use_nested_quant,
            "bnb_4bit_quant_type": self.bnb_4bit_quant_type,
            "fp16": self.fp16,
            "bf16": self.bf16,
            "per_device_train_batch_size": self.per_device_train_batch_size,
            "per_device_eval_batch_size": self.per_device_eval_batch_size,
            "gradient_accumulation_steps": self.gradient_accumulation_steps,
            "gradient_checkpointing": self.gradient_checkpointing,
            "max_grad_norm": self.max_grad_norm,
            "learning_rate": self.learning_rate,
            "weight_decay": self.weight_decay,
            "optim": self.optim,
            "lr_scheduler_type": self.lr_scheduler_type,
            "max_steps": self.max_steps,
            "warmup_ratio": self.warmup_ratio,
            "group_by_length": self.group_by_length,
            "packing": self.packing,
            "device_map": self.device_map,
            "max_seq_length": self.max_seq_length,
        }