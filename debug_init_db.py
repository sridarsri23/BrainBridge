#!/usr/bin/env python3
"""
Debug database initialization script
"""

import os
import logging
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
logger.info(f"Using DATABASE_URL: {DATABASE_URL}")

# Create engine with echo=True for SQL logging
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)

# Import models to ensure they are registered
from server.database import Base
from server import models

def init_database():
    """Initialize the database with tables"""
    try:
        logger.info("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables created successfully")
        
        # Verify tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"Tables in database: {tables}")
        
        return True
    except Exception as e:
        logger.error(f"Error creating database tables: {e}", exc_info=True)
        return False

if __name__ == "__main__":
    logger.info("Starting database initialization...")
    success = init_database()
    if success:
        logger.info("Database initialization completed successfully")
    else:
        logger.error("Database initialization failed")
