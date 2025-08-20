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
    # Get port from environment or default to 5000
    port = int(os.getenv("PORT", 5000))
    
    # Run FastAPI app
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        reload_dirs=["server"],
        log_level="info"
    )