import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Connecting to database: {DATABASE_URL}")

# Create engine
engine = create_engine(DATABASE_URL)

# Test connection
try:
    with engine.connect() as conn:
        print("✅ Successfully connected to the database")
        
        # Get table information
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print("\nTables in the database:")
        if tables:
            for table in tables:
                print(f"- {table}")
                # Print columns for each table
                columns = inspector.get_columns(table)
                for column in columns:
                    print(f"  - {column['name']} ({column['type']})")
        else:
            print("No tables found in the database.")
            
        # Check if we can create a table
        print("\nAttempting to create a test table...")
        from sqlalchemy.sql import text
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS test_table (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            )
        """))
        conn.commit()
        print("✅ Successfully created test_table")
        
        # Verify the test table was created
        tables_after = inspector.get_table_names()
        if 'test_table' in tables_after:
            print("✅ Verified test_table exists in the database")
        else:
            print("❌ test_table was not created")
            
except Exception as e:
    print(f"❌ Error connecting to the database: {e}")
