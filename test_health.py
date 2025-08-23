#!/usr/bin/env python3
"""
Test script to verify health check endpoint
"""

import requests
import time
import sys

def test_health_endpoint():
    """Test the health check endpoint"""
    base_url = "http://localhost:8000"
    health_url = f"{base_url}/api/health"
    
    print(f"Testing health endpoint: {health_url}")
    
    # Wait a bit for server to start
    print("Waiting for server to be ready...")
    time.sleep(2)
    
    try:
        response = requests.get(health_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print("❌ Health check failed!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_health_endpoint()
    sys.exit(0 if success else 1)
