#!/bin/bash

# Script to start FastAPI server while ensuring Node.js server is stopped

echo "Stopping any existing Node.js processes..."
pkill -f "tsx server" 2>/dev/null || true
pkill -f "node.*tsx" 2>/dev/null || true

# Wait for processes to stop
sleep 2

echo "Initializing database..."
python init_db.py

echo "Starting FastAPI server..."
python run_fastapi.py