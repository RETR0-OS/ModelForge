from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from utilities.hardware_detector import HardwareDetector
from utilities.settings_builder import SettingsBuilder
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, field_validator

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
hardware_detector = HardwareDetector()
settings_builder = SettingsBuilder(None, None, None)
settings_cache = {}
app_name = "ModelForge"

class TaskFormData(BaseModel):
    task: str
    @field_validator("task")
    def validate_task(cls, task):
        if task not in ["text-generation", "summarization", "question-answering"]:
            raise ValueError("Invalid task. Must be one of 'text-generation', 'summarization', or 'question-answering'.")
        return task

class SelectedModelFormData(BaseModel):
    selected_model: str
    @field_validator("selected_model")
    def validate_selected_model(cls, selected_model):
        if not selected_model:
            raise ValueError("Selected model cannot be empty.")
        return selected_model

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        "landing.html",
        {
            "request": request,
            "app_name": app_name,
            "app_description": "No-code LLM finetuning for CUDA environments",
            "features": [
                "Intuitive no-code interface",
                "PEFT and LoRA-based finetuning",
                "4-bit/8-bit quantization",
                "GPU-accelerated performance"
            ]
        }
    )

@app.get("/finetune/detect", response_class=HTMLResponse)
def detect_hardware_page(request: Request):
    global settings_cache
    settings_cache.clear()  # Clear the cache to ensure fresh detection
    return templates.TemplateResponse(
        "detect_hardware.html",
        {
            "request": request,
            "app_name": app_name,
        }
    )

@app.post("/finetune/detect", response_class=JSONResponse)
async def detect_hardware(request: Request):
    global settings_cache
    try:
        form = await request.form()
        # print(form["task"])
        task = TaskFormData(task=form["task"])
        task = task.task
        settings_builder.task = task
        model_requirements, hardware_profile, model_recommendation, possible_options = hardware_detector.run(task)
        settings_builder.compute_profile = model_requirements["profile"]
        settings_cache = {
            "model_requirements": model_requirements,
            "hardware_profile": hardware_profile,
            "model_recommendation": model_recommendation,
            "selected_model": None
        }
        return JSONResponse(
            {
                "status_code": 200,
                "profile": model_requirements["profile"],
                "task": task,
                "gpu_name": hardware_profile.get("gpu_name"),
                "gpu_total_memory_gb": hardware_profile.get("gpu_total_memory_gb"),
                "ram_total_gb": hardware_profile.get("ram_total_gb"),
                "available_diskspace_gb": hardware_profile.get("available_diskspace_gb"),
                "cpu_cores": hardware_profile.get("cpu_cores"),
                "model_recommendation": model_recommendation,
                "possible_options": possible_options,

            }
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid task. Must be one of 'text-generation', 'summarization', or 'question-answering'."
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Error detecting hardware. Please try again later."
        )

@app.post("/finetune/set_model", response_class=JSONResponse)
async def set_model(request: Request):
    global settings_cache
    try:
        form = await request.json()
        selected_model = SelectedModelFormData(selected_model=form["selected_model"])
        settings_cache["selected_model"] = selected_model
        settings_builder.model_name = selected_model.selected_model
        return JSONResponse(
            {
                "status_code": 200,
                "selected_model": selected_model.selected_model,
            }
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Error setting model. Please try again later."
        )

@app.get("/finetune/load_settings", response_class=HTMLResponse)
async def load_settings_page(request: Request):
    global settings_cache
    if not settings_cache:
        raise HTTPException(
            status_code=400,
            detail="No hardware detection data available. Please run hardware detection first."
        )
    print(settings_builder.get_settings())
    return templates.TemplateResponse(
        "finetuning_settings.html",
        {
            "request": request,
            "app_name": app_name,
            "default_values": settings_builder.get_settings()
        }
    )

@app.post("/finetune/load_settings", response_class=JSONResponse)
async def load_settings(request: Request):
    global settings_cache
    try:
        form = await request.json()
        # The form is already a dictionary from request.json()
        print(form)
        settings = settings_builder.set_settings(form)
        return JSONResponse(
            {
                "status_code": 200,
                "settings": settings
            }
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Error loading settings. Please try again later."
        )

