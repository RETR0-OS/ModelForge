import os
import signal


from huggingface_hub import HfApi
from huggingface_hub import errors as hf_errors
import uvicorn
from dotenv import load_dotenv

load_dotenv()

## Validate HuggingFace login
try:
    api = HfApi()
    api.whoami()
except hf_errors.LocalTokenNotFoundError:
    print(f"""
    {'*' * 100}
    You are not logged in to the Hugging Face Hub. 
    1) Create an account on https://huggingface.co/
    2) Generate a finegrained API token from your account settings (https://huggingface.co/docs/hub/en/security-tokens).
    3) Run the command below to login:
        huggingface-cli login
    4) Paste the token when prompted.
    {'*' * 100}
    """)
    os.kill(os.getpid(), signal.SIGTERM)
except hf_errors.HTTPError:
    print(f"""
    {"*"*100}
    You are not connected to the internet.
    Please check your internet connection and try again.
    {"*" * 100}
    """)
    os.kill(os.getpid(), signal.SIGTERM)

## Globals imports
from globals.globals_instance import global_manager

## FastAPI imports
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers.finetuning_router import router as finetuning_router
from routers.playground_router import router as playground_router
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

## Static files
frontend_dir = os.path.join(os.path.dirname(__file__), "../Frontend/build")

## Server Global Configurations
app_name = "ModelForge"
app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(prefix="/api", router=finetuning_router)
app.include_router(prefix="/api", router=playground_router)


## Mount static files
app.mount(
    "/",
    StaticFiles(directory=frontend_dir, html=True),
    name="static"
)

app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    index_file = os.path.join(frontend_dir,"index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    else:
        return JSONResponse({"detail": "index.html not found"}, status_code=404)



## Server endpoints
@app.get("/")
async def home(request: Request) -> JSONResponse:
    return JSONResponse({
        "app_name": app_name,
        "app_description": "No-code LLM finetuning for CUDA environments",
        "features": [
            "Intuitive no-code interface",
            "PEFT and LoRA-based finetuning",
            "4-bit/8-bit quantization",
            "GPU-accelerated performance"
        ]
    })

@app.get("/api/models", response_class=JSONResponse)
async def list_models(request: Request) -> JSONResponse:
    try:
        models = global_manager.db_manager.get_all_models()  # Assumes this method returns a list of model dicts
        return JSONResponse({"models": models})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching models.")

@app.get("/api/models/{model_id}", response_class=JSONResponse)
async def get_model(model_id: int, request: Request) -> JSONResponse:
    try:
        model = global_manager.db_manager.get_model_by_id(model_id)  # Assumes this method exists
        if not model:
            raise HTTPException(status_code=404, detail="Model not found.")
        return JSONResponse(model)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching model.")

if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)