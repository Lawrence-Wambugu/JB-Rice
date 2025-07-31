#!/bin/bash

# JB-Rice-Pro Background Keep-Alive Script
echo "🚀 Starting JB-Rice-Pro Keep-Alive in background..."
echo "📡 This will prevent your backend from sleeping"
echo "💾 Your inventory, customer, and order data will be retained!"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if requests is installed
if ! python3 -c "import requests" &> /dev/null; then
    echo "📦 Installing requests library..."
    pip3 install requests
fi

# Create log file
LOG_FILE="keep_alive.log"
echo "📝 Logs will be saved to: $LOG_FILE"

# Start the keep-alive script in background
echo "✅ Starting enhanced keep-alive script in background..."
echo "⏰ Will ping every 5 minutes to prevent sleep"
echo "🔄 To stop: kill the process or restart your computer"
echo ""

# Run in background and save logs
nohup python3 keep_alive_enhanced.py > "$LOG_FILE" 2>&1 &

# Get the process ID
KEEP_ALIVE_PID=$!
echo "✅ Keep-alive script started with PID: $KEEP_ALIVE_PID"
echo "📝 To view logs: tail -f $LOG_FILE"
echo "🛑 To stop: kill $KEEP_ALIVE_PID"
echo ""

# Save PID to file for easy stopping
echo $KEEP_ALIVE_PID > keep_alive.pid
echo "💾 PID saved to keep_alive.pid"
echo "🛑 To stop later: kill \$(cat keep_alive.pid)" 