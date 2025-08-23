#!/bin/bash

echo "Starting BrainBridge application..."

# Run debug script first
echo "Running debug script..."
python railway-debug.py

# Check if we're in the right directory
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Check if the server directory exists
if [ ! -d "server" ]; then
    echo "Error: server directory not found"
    exit 1
fi

# Check if main.py exists
if [ ! -f "server/main.py" ]; then
    echo "Error: server/main.py not found"
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "Error: requirements.txt not found"
    exit 1
fi

# Check if dist directory exists (frontend build)
if [ ! -d "dist" ] && [ ! -d "client/dist" ]; then
    echo "Warning: Frontend build not found, but continuing..."
fi

echo "Starting FastAPI server..."
echo "PORT environment variable: $PORT"
python -m uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
