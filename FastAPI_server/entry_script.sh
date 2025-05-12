#!/bin/bash
set -e

if [ -z "$HUGGINGFACE_TOKEN" ]; then
    echo "ERROR: HUGGINGFACE_TOKEN not set!"
    exit 1
fi

# Login to huggingface
/backend/venv/bin/huggingface-cli login --token "$HUGGINGFACE_TOKEN"

# Start the FastAPI server
exec /backend/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000 --reload
