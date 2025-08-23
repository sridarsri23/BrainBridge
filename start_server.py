#!/usr/bin/env python3
"""
Startup script for BrainBridge FastAPI application
"""

import os
import sys
import uvicorn
import signal
import time

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    print(f"Received signal {signum}, shutting down gracefully...")
    sys.exit(0)

def main():
    """Start the FastAPI server with proper port handling"""
    
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    # Get port from environment variable, default to 8000
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting BrainBridge API on port {port}")
    print(f"Environment: PORT={os.getenv('PORT', 'NOT SET')}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check if frontend is built
    static_dirs = ["dist/public", "client/dist"]
    for static_dir in static_dirs:
        if os.path.exists(static_dir):
            print(f"✓ Found frontend build in: {static_dir}")
            break
    else:
        print("⚠ No frontend build found")
    
    try:
        # Start the server
        uvicorn.run(
            "server.main:app",
            host="0.0.0.0",
            port=port,
            log_level="info",
            reload=False,  # Disable reload in production
            access_log=True
        )
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
