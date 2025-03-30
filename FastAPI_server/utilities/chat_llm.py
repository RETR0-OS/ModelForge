from transformers import AutoModelForCausalLM, AutoTokenizer
import argparse

class PlaygroundModel:
    def __init__(self, model_path: str):
        self.device = "cuda"
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForCausalLM.from_pretrained(model_path).to(self.device)

    def generate_response(self, prompt: str):
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response

    def chat(self):
        print("Chat with the model! Type '/bye' to stop.")
        while True:
            user_input = input("You>> ")
            if user_input.lower() == "/bye":
                print("Ending chat.")
                break
            response = self.generate_response(user_input)
            print(f"Model>> {response}")
        print("Chat ended.")

parser = argparse.ArgumentParser(description="Chat with a fine-tuned model")
parser.add_argument("--model_path", type=str, required=True, help="Path to the fine-tuned model")
args = parser.parse_args()

model = PlaygroundModel(model_path=args.model_path)
model.chat()