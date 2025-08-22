#!/usr/bin/env python3
"""
Startup script for FastAPI backend
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get port from environment or default to 8001
    port = int(os.getenv("PORT", 8001))
    
    # Run FastAPI app
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        reload_dirs=["server"],
        log_level="info"
    )