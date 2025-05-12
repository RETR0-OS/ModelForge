FROM nvidia/cuda:12.4.0-runtime-ubuntu22.04

WORKDIR /backend

RUN apt-get update -y
RUN apt-get install -y python3 python3-pip python3-venv

RUN python3 -m venv venv

COPY docker_requirements.txt .

RUN /backend/venv/bin/pip install --upgrade pip && \
    /backend/venv/bin/pip install -r docker_requirements.txt && \
    /backend/venv/bin/pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

COPY . .

COPY entry_script.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]