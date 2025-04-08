import torch
from torch.xpu import device
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, pipeline
from peft import PeftConfig, PeftModel, AutoPeftModelForCausalLM
import argparse


class PlaygroundModel:
    def __init__(self, model_path: str):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        if self.device == "cpu":
            print("CUDA is not available. Exiting...")
            exit(1)

        print("Loading model...")
        try:
            config = PeftConfig.from_pretrained(model_path)
            self.model = AutoModelForCausalLM.from_pretrained(config.base_model_name_or_path, return_dict=True, device_map="auto")
            self.tokenizer = AutoTokenizer.from_pretrained(config.base_model_name_or_path, trust_remote_code=True)
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model.eval()

        except Exception as e:
            print(f"Error loading model: {e}")
            exit(1)

    def generate_response(self, prompt: str, temperature=0.2, top_p=0.9):
        try:
            # Tokenize with attention mask
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
            ).to(self.device)

            outputs = self.model.generate(
                **inputs,
            )

            response = self.tokenizer.decode(
                outputs[0],
            )

            return response

        except KeyboardInterrupt:
            self.clean_up()


    def chat(self):
        print("Chat started. Type '/bye' to exit")
        try:
            while True:
                user_input = input("You: ")
                if user_input.lower() == "/bye":
                    break

                response = self.generate_response(user_input)
                print(f"Assistant: {response}")

        except KeyboardInterrupt:
            print("\nInterrupted by user")
        finally:
            self.clean_up()

    def clean_up(self):
        if hasattr(self, 'model'):
            del self.model
        if hasattr(self, 'tokenizer'):
            del self.tokenizer
        torch.cuda.empty_cache()
        print("Resources cleaned")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Chat with QLoRA fine-tuned model")
    parser.add_argument("--model_path", type=str, required=True,
                        help="Path to saved PEFT model directory")
    args = parser.parse_args()

    bot = PlaygroundModel(model_path=args.model_path)
    bot.chat()