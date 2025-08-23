#!/usr/bin/env python3
"""
Debug script to help identify Railway deployment issues
"""

import os
import sys

def debug_environment():
    """Print environment variables and test database connection"""
    print("=== Railway Debug Information ===")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python version: {sys.version}")
    print(f"PORT: {os.getenv('PORT', 'NOT SET')}")
    
    # Check for database URL
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        print(f"DATABASE_URL: {database_url[:20]}...")  # Only show first 20 chars for security
    else:
        print("DATABASE_URL: NOT SET")
    
    # Check for other important env vars
    print(f"SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'NOT SET'}")
    print(f"OPENAI_API_KEY: {'SET' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
    
    # List files in current directory
    print("\n=== Files in current directory ===")
    try:
        files = os.listdir('.')
        for file in files[:10]:  # Show first 10 files
            print(f"  {file}")
        if len(files) > 10:
            print(f"  ... and {len(files) - 10} more files")
    except Exception as e:
        print(f"Error listing files: {e}")
    
    # Check if server directory exists
    print("\n=== Server directory check ===")
    if os.path.exists('server'):
        print("✓ server directory exists")
        if os.path.exists('server/main.py'):
            print("✓ server/main.py exists")
        else:
            print("✗ server/main.py missing")
    else:
        print("✗ server directory missing")
    
    # Check if requirements.txt exists
    print("\n=== Requirements check ===")
    if os.path.exists('requirements.txt'):
        print("✓ requirements.txt exists")
    else:
        print("✗ requirements.txt missing")
    
    # Check if dist directory exists (frontend build)
    print("\n=== Frontend build check ===")
    if os.path.exists('dist'):
        print("✓ dist directory exists")
        if os.path.exists('dist/public'):
            print("✓ dist/public exists")
        if os.path.exists('dist/public/index.html'):
            print("✓ dist/public/index.html exists")
    elif os.path.exists('client/dist'):
        print("✓ client/dist exists")
    else:
        print("✗ No frontend build found")

if __name__ == "__main__":
    debug_environment()
