import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import argparse
import torch.cuda as cuda

class PlaygroundModel:
    def __init__(self, model_path: str):
        self.device = "cuda"
        if not cuda.is_available():
            print("CUDA is not available. Exiting...")
            exit(1)
        print("Loading model...")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_path, torch_dtype=torch.bfloat16)
            self.model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16).to(self.device)
            print("Model loaded successfully.")
            print(f"Model Max Mem: {torch.cuda.max_memory_allocated(0) / (1024 ** 3)} GB")
            print(f"Model Total Mem: {self.model.get_memory_footprint() / (1024 ** 3)} GB")
        except Exception as e:
            print(f"An error occurred: {e}")

    def generate_response(self, prompt: str, max_length=100, temperature=0.2, top_p=0.9):
        inputs = self.tokenizer(prompt, return_tensors="pt", padding=True).to(self.device)
        outputs = self.model.generate(
            **inputs,
            max_length=max_length,
            temperature=temperature,
            top_p=top_p,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id
        )
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response

    def chat(self):
        try:
            print("Chat with the model! Type '/bye' to stop.")
            while True:
                user_input = input("You>> ")
                if user_input.lower() == "/bye":
                    print("Ending chat.")
                    break
                response = self.generate_response(user_input)
                print(f"Model>> {response}")
            print("Chat ended.")
            self.clean_up()
        except Exception as e:
            print("An error occured!")
            print(e)
            self.clean_up()

    def clean_up(self):
        self.model.cpu()
        del self.model
        del self.tokenizer
        print("Model and tokenizer cleaned up.")

parser = argparse.ArgumentParser(description="Chat with a fine-tuned model")
parser.add_argument("--model_path", type=str, required=True, help="Path to the fine-tuned model")
args = parser.parse_args()
print(f"Loading model from {args.model_path}...")
model = PlaygroundModel(model_path=args.model_path)
model.chat()
