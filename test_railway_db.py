#!/usr/bin/env python3
"""
Test Railway database connection specifically
"""

import os
import sys
from sqlalchemy import create_engine, text

def test_railway_db():
    """Test Railway database connection"""
    try:
        # Set the DATABASE_URL (you can also set this as environment variable)
        DATABASE_URL = "postgresql://postgres:evHUrTVJBEqXOSsOiFrWLWUTulfAtxIL@web.railway.internal:5432/railway"
        
        print(f"Testing connection to: postgresql://***@{DATABASE_URL.split('@')[-1]}")
        
        # Create engine
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=5,
            max_overflow=10
        )
        
        # Test connection
        with engine.connect() as conn:
            # Test basic connection
            result = conn.execute(text("SELECT 1"))
            print("✓ Basic connection successful")
            
            # Test database info
            result = conn.execute(text("SELECT current_database(), current_user"))
            db_info = result.fetchone()
            print(f"✓ Connected to database: {db_info[0]} as user: {db_info[1]}")
            
            # Check if tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            existing_tables = [row[0] for row in result]
            
            if existing_tables:
                print(f"✓ Found {len(existing_tables)} existing tables:")
                for table in existing_tables:
                    print(f"  - {table}")
            else:
                print("⚠ No tables found in database")
                
            # Test creating a simple table
            print("\nTesting table creation...")
            try:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS test_table (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                conn.commit()
                print("✓ Test table created successfully")
                
                # Clean up
                conn.execute(text("DROP TABLE IF EXISTS test_table"))
                conn.commit()
                print("✓ Test table cleaned up")
                
            except Exception as e:
                print(f"⚠ Table creation test failed: {e}")
                
        return True
        
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_railway_db()
    sys.exit(0 if success else 1)
