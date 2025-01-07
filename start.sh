#!/bin/bash

# Kill existing processes
echo "Stopping existing servers..."
pkill -f uvicorn
pkill -f vite

# Wait a moment to ensure processes are terminated
sleep 2

# Start backend server
echo "Starting backend server..."
cd backend
source venv/bin/activate
echo -en "\033]0;AromaDB Backend Server\a"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &

# Wait for backend to initialize
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
echo -en "\033]0;AromaDB Frontend Server\a"
npm run dev &

echo "Both servers are starting..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:5173"

# Keep the script running and maintain terminal titles
while true; do
    echo -en "\033]0;AromaDB Servers\a"
    sleep 10
done 