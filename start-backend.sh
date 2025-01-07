#!/bin/bash

# Kill existing process
echo "Stopping existing backend server..."
pkill -f uvicorn

# Wait a moment to ensure process is terminated
sleep 2

# Start backend server
echo "Starting backend server..."
cd backend
source venv/bin/activate
echo -en "\033]0;AromaDB Backend Server\a"
uvicorn main:app --reload --host 0.0.0.0 --port 8000

echo "Backend will be available at: http://localhost:8000" 