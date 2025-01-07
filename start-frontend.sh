#!/bin/bash

# Kill existing process
echo "Stopping existing frontend server..."
pkill -f vite

# Wait a moment to ensure process is terminated
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd frontend
echo -en "\033]0;AromaDB Frontend Server\a"
npm run dev

echo "Frontend will be available at: http://localhost:5173" 