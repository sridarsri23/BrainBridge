from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Get table information
inspector = inspect(engine)
tables = inspector.get_table_names()

print("Tables in the database:")
for table in tables:
    print(f"- {table}")

# Check if 'users' table exists
print("\nChecking 'users' table columns:")
if 'users' in tables:
    columns = inspector.get_columns('users')
    for column in columns:
        print(f"- {column['name']} ({column['type']})")
else:
    print("'users' table does not exist")
