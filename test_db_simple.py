#!/usr/bin/env python3
"""
Simple database connection test
"""

import os
import sys
from sqlalchemy import create_engine, text

def test_simple():
    """Simple database test"""
    try:
        DATABASE_URL = os.getenv("DATABASE_URL")
        if not DATABASE_URL:
            print("❌ DATABASE_URL not set")
            return False
            
        print(f"Testing: postgresql://***@{DATABASE_URL.split('@')[-1]}")
        
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Connection successful!")
            
            # Check tables
            result = conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result]
            print(f"✓ Found {len(tables)} tables: {tables}")
            
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_simple()
    sys.exit(0 if success else 1)
