# Use official lightweight Node 22 on Alpine or Debian Bookworm Slim
FROM node:22-bookworm-slim

# Install system dependencies: python3, python3-pip, ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp in python
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000
ENV PYTHON_PATH=python3

EXPOSE 5000

CMD ["node", "server.js"]
