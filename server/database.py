"""
Database configuration and session management
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Fix DATABASE_URL for Railway (replace postgres:// with postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Using database URL: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

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
    try:
        # Test connection first
        print("Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection test successful")
        
        # Import all models to ensure they are registered
        from server import models
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully")
        
        # Verify tables were created
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result]
            print(f"✓ Found {len(tables)} tables: {', '.join(tables)}")
        
        # Non-destructive migration: ensure new columns exist on existing DBs
        try:
            with engine.begin() as conn:
                # users table: add location and availability_status if missing
                conn.execute(text("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS location VARCHAR"))
                conn.execute(text("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS availability_status VARCHAR"))
                print("✓ Database migration completed")
        except Exception as e:
            # Log but don't crash app startup
            print(f"Warning: init_db migration step failed: {e}")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        print(f"Error type: {type(e).__name__}")
        raise

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()