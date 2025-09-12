# Gunakan image Python resmi
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install pip terbaru dan library sistem yang dibutuhkan
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
 && rm -rf /var/lib/apt/lists/* \
 && pip install --upgrade pip

# Copy requirements.txt terlebih dahulu (layer caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file backend ke dalam container
COPY . .

# Expose port Flask
EXPOSE 5000

# Jalankan Flask
CMD ["python", "app.py"]
