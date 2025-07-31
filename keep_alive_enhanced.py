#!/usr/bin/env python3
"""
Enhanced Keep-alive script for JB-Rice-Pro backend
This script pings the backend every 5 minutes to prevent it from sleeping
"""

import requests
import time
import datetime
import sys
import os

# Backend URL
BACKEND_URL = "https://jb-rice-pro-backend.onrender.com"

def log_message(message, level="INFO"):
    """Log message with timestamp"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {level}: {message}")

def ping_backend():
    """Ping the backend to keep it alive"""
    try:
        log_message("Pinging backend...")
        response = requests.get(f"{BACKEND_URL}/api/ping", timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            timestamp = data.get('timestamp', 'unknown')
            log_message(f"✅ Ping successful - Backend is alive", "SUCCESS")
            log_message(f"📡 Server time: {timestamp}", "INFO")
            return True
        else:
            log_message(f"⚠️ Ping failed with status {response.status_code}", "WARNING")
            return False
            
    except requests.exceptions.Timeout:
        log_message("❌ Ping timeout - Backend might be sleeping", "ERROR")
        return False
    except requests.exceptions.ConnectionError:
        log_message("❌ Connection error - Backend might be down", "ERROR")
        return False
    except Exception as e:
        log_message(f"❌ Ping error: {e}", "ERROR")
        return False

def test_backend_health():
    """Test if backend is fully functional"""
    try:
        log_message("Testing backend health...")
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            log_message(f"✅ Backend health check passed", "SUCCESS")
            log_message(f"📊 Database status: {data.get('database', 'unknown')}", "INFO")
            return True
        else:
            log_message(f"⚠️ Health check failed with status {response.status_code}", "WARNING")
            return False
            
    except Exception as e:
        log_message(f"❌ Health check error: {e}", "ERROR")
        return False

def main():
    """Main function to run keep-alive"""
    log_message("🚀 Starting JB-Rice-Pro Enhanced Keep-Alive Script...")
    log_message(f"📡 Backend URL: {BACKEND_URL}")
    log_message("⏰ Pinging every 5 minutes to prevent sleep...")
    log_message("💡 This will help retain your inventory, customer, and order data!")
    log_message("Press Ctrl+C to stop\n")
    
    consecutive_failures = 0
    max_failures = 3
    
    while True:
        try:
            # Ping the backend
            ping_success = ping_backend()
            
            if ping_success:
                consecutive_failures = 0
                log_message("✅ Service is awake and responsive", "SUCCESS")
            else:
                consecutive_failures += 1
                log_message(f"⚠️ Consecutive failures: {consecutive_failures}/{max_failures}", "WARNING")
                
                if consecutive_failures >= max_failures:
                    log_message("🚨 Multiple consecutive failures - Backend might be sleeping", "ERROR")
                    log_message("🔄 Attempting to wake up backend...", "INFO")
                    
                    # Try to wake up the backend
                    for attempt in range(3):
                        log_message(f"🔄 Wake-up attempt {attempt + 1}/3...", "INFO")
                        time.sleep(10)  # Wait 10 seconds
                        
                        if ping_backend():
                            log_message("✅ Backend successfully woken up!", "SUCCESS")
                            consecutive_failures = 0
                            break
                    
                    if consecutive_failures >= max_failures:
                        log_message("❌ Failed to wake up backend after multiple attempts", "ERROR")
                        log_message("💡 Consider checking your Render dashboard", "INFO")
            
            # Test health every 10 minutes (every 2nd ping)
            if time.time() % 600 < 300:  # Every 10 minutes
                test_backend_health()
            
            log_message(f"⏳ Waiting 5 minutes until next ping...")
            time.sleep(300)  # Wait 5 minutes
            
        except KeyboardInterrupt:
            log_message("🛑 Keep-alive script stopped by user", "INFO")
            log_message("💡 Your backend may sleep after 15 minutes of inactivity", "WARNING")
            break
        except Exception as e:
            log_message(f"❌ Unexpected error: {e}", "ERROR")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    main() 