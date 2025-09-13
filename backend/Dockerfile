FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Upgrade pip + wheel biar install cepat dan pakai manylinux wheels
RUN pip install --no-cache-dir --upgrade pip wheel

# Layer cache untuk dependency
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

EXPOSE 5000

# (opsional) Healthcheck: pastikan ada /api/health di app.py
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python - <<'PY'\nimport urllib.request,sys\n\
try:\n\
  urllib.request.urlopen('http://localhost:5000/api/health', timeout=3)\n\
  sys.exit(0)\n\
except Exception:\n\
  sys.exit(1)\nPY

# Jalankan Gunicorn; pastikan modul:objek = app:app (file app.py, variabel app)
CMD ["gunicorn","-b","0.0.0.0:5000","app:app","--workers","2","--threads","4","--timeout","60"]
