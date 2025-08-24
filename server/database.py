"""
Database configuration and session management
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Create engine with improved connection handling
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        pool_pre_ping=True,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

def init_db():
    """Initialize database tables"""
    # Import all models to ensure they are registered
    from server import models
    Base.metadata.create_all(bind=engine)
    # Non-destructive migration: ensure new columns exist on existing DBs
    try:
        from sqlalchemy import text, inspect
        inspector = inspect(engine)
        
        # Check if users table exists and add columns if missing
        if inspector.has_table('users'):
            columns = [col['name'] for col in inspector.get_columns('users')]
            with engine.begin() as conn:
                if 'location' not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN location VARCHAR"))
                if 'availability_status' not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN availability_status VARCHAR"))
    except Exception as e:
        # Log but don't crash app startup
        print(f"Warning: init_db migration step failed: {e}")

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()