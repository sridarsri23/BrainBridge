#!/usr/bin/env python3
"""
Railway Database Debug Script
Run this on Railway to debug database connection issues
"""

import os
import sys
import traceback
from sqlalchemy import create_engine, text

def debug_railway_db():
    """Debug Railway database connection"""
    print("=== Railway Database Debug ===")
    
    # Check environment variables
    print(f"PORT: {os.getenv('PORT', 'NOT SET')}")
    print(f"DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")
    
    if os.getenv('DATABASE_URL'):
        db_url = os.getenv('DATABASE_URL')
        safe_url = db_url.split('@')[-1] if '@' in db_url else db_url
        print(f"Database URL (safe): postgresql://***@{safe_url}")
    
    try:
        # Get DATABASE_URL
        DATABASE_URL = os.getenv("DATABASE_URL")
        if not DATABASE_URL:
            print("❌ DATABASE_URL not set")
            return False
            
        # Fix DATABASE_URL for Railway
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
            print("✓ Fixed DATABASE_URL format")
        
        print(f"Using DATABASE_URL: postgresql://***@{DATABASE_URL.split('@')[-1]}")
        
        # Create engine
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=5,
            max_overflow=10,
            echo=True  # Enable SQL logging
        )
        
        print("✓ Engine created successfully")
        
        # Test connection
        print("\n--- Testing Connection ---")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Basic connection successful")
            
            # Get database info
            result = conn.execute(text("SELECT current_database(), current_user, version()"))
            db_info = result.fetchone()
            print(f"✓ Database: {db_info[0]}")
            print(f"✓ User: {db_info[1]}")
            print(f"✓ PostgreSQL version: {db_info[2].split()[1]}")
            
            # Check tables
            print("\n--- Checking Tables ---")
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]
            
            if tables:
                print(f"✓ Found {len(tables)} tables:")
                for table in tables:
                    print(f"  - {table}")
            else:
                print("⚠ No tables found")
                
            # Test table creation
            print("\n--- Testing Table Creation ---")
            try:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS debug_test (
                        id SERIAL PRIMARY KEY,
                        test_field VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                conn.commit()
                print("✓ Test table created successfully")
                
                # Insert test data
                conn.execute(text("""
                    INSERT INTO debug_test (test_field) VALUES ('test_value')
                """))
                conn.commit()
                print("✓ Test data inserted successfully")
                
                # Query test data
                result = conn.execute(text("SELECT * FROM debug_test"))
                test_data = result.fetchall()
                print(f"✓ Retrieved {len(test_data)} test records")
                
                # Clean up
                conn.execute(text("DROP TABLE debug_test"))
                conn.commit()
                print("✓ Test table cleaned up")
                
            except Exception as e:
                print(f"❌ Table creation test failed: {e}")
                traceback.print_exc()
        
        print("\n=== Database Debug Complete ===")
        return True
        
    except Exception as e:
        print(f"\n❌ Database debug failed: {e}")
        print(f"Error type: {type(e).__name__}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = debug_railway_db()
    sys.exit(0 if success else 1)
