#!/usr/bin/env python3
"""
Initialize the database with tables
"""

from server.database import engine, Base
from server.models import User, ProfileNDAdult, JobPosting, Trait, Strength, IndividualTrait, IndividualStrength, JobMatch

def init_database():
    """Create all database tables"""
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully")
        return True
    except Exception as e:
        print(f"✗ Error creating database tables: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    if success:
        print("Database initialization completed")
    else:
        print("Database initialization failed")