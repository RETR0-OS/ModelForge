from transformers import AutoModelForCausalLM, AutoTokenizer

class PlaygroundModel:
    def __init__(self, model_name: str, model_path: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = "cuda"
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForCausalLM.from_pretrained(model_path).to(device)

    def generate_response(self, prompt: str, max_length: int = 50):
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_length=max_length)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response