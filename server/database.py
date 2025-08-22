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
        from sqlalchemy import text
        with engine.begin() as conn:
            # users table: add location and availability_status if missing
            conn.execute(text("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS location VARCHAR"))
            conn.execute(text("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS availability_status VARCHAR"))
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