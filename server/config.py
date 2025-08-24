"""
Centralized configuration for server environment variables
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Job Match threshold: when set to 0, show all ND profiles as matches
# Default to 0 for preview mode when not provided
JM_THRESHOLD = int(os.getenv("JM_THRESHOLD", "0") or "0")
