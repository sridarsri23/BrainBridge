#!/usr/bin/env python3
"""Fix database initialization with proper permissions"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment variables")
    sys.exit(1)

# Create engine with superuser credentials for this operation
superuser_url = DATABASE_URL.replace("brainbridge:brainbridge", "postgres:postgres")
engine = create_engine(superuser_url)

# SQL to grant necessary permissions
sql_commands = [
    "DROP DATABASE IF EXISTS brainbridge;",
    "CREATE DATABASE brainbridge;",
    "GRANT ALL PRIVILEGES ON DATABASE brainbridge TO brainbridge;"
]

# Execute SQL commands
with engine.connect() as conn:
    for cmd in sql_commands:
        try:
            conn.execute(text(cmd))
            conn.commit()
            print(f"✓ Executed: {cmd[:50]}...")
        except Exception as e:
            print(f"✗ Error executing '{cmd}': {e}")
            conn.rollback()

print("\nNow run: python init_db.py")
print("Then verify with: PGPASSWORD=brainbridge psql -h 127.0.0.1 -U brainbridge -d brainbridge -c \"\\dt\"")
