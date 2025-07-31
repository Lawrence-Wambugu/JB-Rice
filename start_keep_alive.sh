#!/bin/bash

# JB-Rice-Pro Keep-Alive Startup Script
echo "🚀 Starting JB-Rice-Pro Keep-Alive Script..."
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

# Start the keep-alive script
echo "✅ Starting enhanced keep-alive script..."
echo "⏰ Will ping every 5 minutes to prevent sleep"
echo "Press Ctrl+C to stop"
echo ""

python3 keep_alive_enhanced.py 