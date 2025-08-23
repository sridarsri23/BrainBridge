#!/usr/bin/env python3
"""
Test script to verify frontend build and static file serving
"""

import os
import subprocess
import sys

def test_frontend_build():
    """Test if frontend is built correctly"""
    print("=== Testing Frontend Build ===")
    
    # Check if package.json exists
    if not os.path.exists("package.json"):
        print("❌ package.json not found")
        return False
    
    # Check if node_modules exists
    if not os.path.exists("node_modules"):
        print("❌ node_modules not found - run 'npm install' first")
        return False
    
    # Try to build frontend
    print("Building frontend...")
    try:
        result = subprocess.run(["npm", "run", "build"], 
                              capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            print("✅ Frontend build successful")
        else:
            print(f"❌ Frontend build failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Build error: {e}")
        return False
    
    # Check if dist/public exists
    if os.path.exists("dist/public"):
        print("✅ dist/public directory exists")
        if os.path.exists("dist/public/index.html"):
            print("✅ index.html exists")
        else:
            print("❌ index.html not found")
            return False
    else:
        print("❌ dist/public directory not found")
        return False
    
    return True

def test_static_files():
    """Test static file serving"""
    print("\n=== Testing Static Files ===")
    
    static_dirs = ["dist/public", "client/dist"]
    for static_dir in static_dirs:
        if os.path.exists(static_dir):
            print(f"✅ Found static files in: {static_dir}")
            files = os.listdir(static_dir)
            print(f"Files: {files}")
            return True
    
    print("❌ No static files found")
    return False

if __name__ == "__main__":
    print("Testing BrainBridge build process...")
    
    success = test_frontend_build()
    if success:
        test_static_files()
    
    if success:
        print("\n✅ All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Tests failed!")
        sys.exit(1)
