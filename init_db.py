#!/usr/bin/env python3
"""
Initialize the database with tables
"""
import logging
import sys
import os
from sqlalchemy import inspect, text

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

from server.database import engine, Base, SessionLocal
from server.models import (
    User, JobPosting, Trait, Strength, IndividualTrait, 
    IndividualStrength, JobMatch, SupportRelationship,
    Assessment, AssessmentResponse, CognitiveProfile, AuditLog
)

def verify_table_creation(engine, expected_tables):
    """Verify that all expected tables were created"""
    with engine.connect() as conn:
        inspector = inspect(engine)
        created_tables = set(inspector.get_table_names())
        
        missing_tables = []
        for table in expected_tables:
            if table not in created_tables:
                missing_tables.append(table)
                
        return created_tables, missing_tables

def init_database():
    """Create all database tables"""
    try:
        # Log database URL (without password)
        db_url = str(engine.url)
        safe_url = db_url.split('@')[-1] if '@' in db_url else db_url
        logger.info(f"Connecting to database: postgresql://***@{safe_url}")
        
        # List of expected tables
        expected_tables = [
            'users', 'job_postings', 'traits', 'strengths',
            'individual_traits', 'individual_strengths', 'job_matches',
            'support_relationships', 'assessments', 'assessment_responses',
            'cognitive_profiles', 'audit_logs'
        ]
        
        # Create all tables
        logger.info("Creating database tables...")
        try:
            # Only create PostgreSQL-specific schema and permissions if using PostgreSQL
            if 'postgresql' in str(engine.url):
                with engine.begin() as connection:
                    # Create schema if not exists
                    connection.execute(text("CREATE SCHEMA IF NOT EXISTS public;"))
                    
                    # Grant all privileges on schema to brainbridge user
                    connection.execute(text("GRANT ALL ON SCHEMA public TO brainbridge;"))
                    connection.execute(text("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO brainbridge;"))
                
            # Create all tables
            Base.metadata.create_all(bind=engine)
            
            # Verify tables were created
            created_tables, missing_tables = verify_table_creation(engine, expected_tables)
            
            if missing_tables:
                logger.error(f"Missing tables: {', '.join(missing_tables)}")
                logger.info(f"Created tables: {', '.join(created_tables) if created_tables else 'None'}")
                return False
                
            logger.info("✓ All tables created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error during table creation: {str(e)}")
            return False
            
    except Exception as e:
        logger.error(f"✗ Unexpected error: {e}", exc_info=True)
        return False

if __name__ == "__main__":
    logger.info("Starting database initialization...")
    success = init_database()
    if success:
        logger.info("Database initialization completed successfully")
        sys.exit(0)
    else:
        logger.error("Database initialization failed")
        sys.exit(1)