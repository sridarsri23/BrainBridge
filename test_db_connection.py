#!/usr/bin/env python3
"""
Test database connection and create tables
"""

import os
import sys
from sqlalchemy import text

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server.database import engine, Base
from server.models import User, JobPosting, Trait, Strength

def test_connection():
    """Test database connection"""
    try:
        print("Testing database connection...")
        
        # Test basic connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful")
            
            # Check if tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            existing_tables = [row[0] for row in result]
            print(f"Existing tables: {existing_tables}")
            
            if not existing_tables:
                print("No tables found. Creating tables...")
                Base.metadata.create_all(bind=engine)
                print("✓ Tables created successfully")
            else:
                print("✓ Tables already exist")
                
        return True
        
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
