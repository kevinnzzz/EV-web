# API FastAPI (Render free: 0.1 CPU / 512 MB). Model dimuat sekali saat startup, RSS terukur ~410 MB.
FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:0.12.5 /uv /bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_NO_DEV=1 UV_PYTHON_DOWNLOADS=0 PYTHONUNBUFFERED=1
WORKDIR /app

# dependensi dulu: layer ini di-cache selama uv.lock tidak berubah
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project
COPY README.md ./
COPY src/ev_web src/ev_web
RUN uv sync --locked
COPY model model

RUN useradd --system --uid 999 app
USER app
ENV PATH="/app/.venv/bin:$PATH" MODEL_DIR=/app/model
EXPOSE 8000
# 1 worker: tiap worker memuat salinan model sendiri, 2 worker tidak muat di 512 MB
CMD ["sh", "-c", "exec uvicorn ev_web.api:app --host 0.0.0.0 --port ${PORT:-8000}"]
