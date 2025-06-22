import os
import subprocess

from fastapi import APIRouter
from fastapi import Request
from starlette.responses import JSONResponse

from ..globals.globals_instance import global_manager

router = APIRouter(
    prefix="/playground",
)

@router.get("/model_path")
async def get_model_path(request: Request) -> JSONResponse:
    return JSONResponse({
        "app_name": global_manager.app_name,
        "model_path": global_manager.model_path
    })


@router.post("/new")
async def new_playground(request: Request) -> None:
    form = await request.json()
    print(form)
    model_path = form["model_path"]

    base_path = os.path.join(os.path.dirname(__file__), "utilities")
    chat_script = os.path.join(base_path, "chat_playground.py")
    if os.name == "nt":  # Windows
        command = ["cmd.exe", "/c", "start", "python", chat_script, "--model_path", model_path]
        subprocess.Popen(command, shell=True)
    else:  # Unix/Linux/Mac
        command = ["x-terminal-emulator", "-e", f"python {chat_script} --model_path {model_path}"]
        try:
            subprocess.Popen(command)
        except FileNotFoundError:
            # Fallback to gnome-terminal or xterm if x-terminal-emulator is not available
            try:
                subprocess.Popen(["gnome-terminal", "--", "python3", chat_script, "--model_path", model_path])
            except FileNotFoundError:
                subprocess.Popen(["xterm", "-e", f"python3 {chat_script} --model_path {model_path}"])
