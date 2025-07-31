#!/usr/bin/env python3
"""
Keep-alive script for JB-Rice-Pro backend
This script pings the backend every 5 minutes to prevent it from sleeping
"""

import requests
import time
import datetime

# Backend URL
BACKEND_URL = "https://jb-rice-pro-backend.onrender.com"

def ping_backend():
    """Ping the backend to keep it alive"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/ping", timeout=10)
        if response.status_code == 200:
            data = response.json()
            timestamp = data.get('timestamp', 'unknown')
            print(f"✅ Ping successful at {timestamp}")
        else:
            print(f"⚠️ Ping failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Ping error: {e}")

def main():
    """Main function to run keep-alive"""
    print("🚀 Starting JB-Rice-Pro keep-alive script...")
    print(f"📡 Backend URL: {BACKEND_URL}")
    print("⏰ Pinging every 5 minutes to prevent sleep...")
    print("Press Ctrl+C to stop\n")
    
    while True:
        try:
            ping_backend()
            time.sleep(300)  # Wait 5 minutes
        except KeyboardInterrupt:
            print("\n🛑 Keep-alive script stopped by user")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    main() 