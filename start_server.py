#!/usr/bin/env python3
"""
Startup script for BrainBridge FastAPI application
"""

import os
import sys
import uvicorn

def main():
    """Start the FastAPI server with proper port handling"""
    
    # Get port from environment variable, default to 8000
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting BrainBridge API on port {port}")
    print(f"Environment: PORT={os.getenv('PORT', 'NOT SET')}")
    
    # Start the server
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        reload=False  # Disable reload in production
    )

if __name__ == "__main__":
    main()
