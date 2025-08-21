#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Config
DB_NAME="brainbridge"
DB_USER="brainbridge"
DB_PASS="brainbridge"

cleanup() {
    echo -e "\n${YELLOW}🛑 Cleaning up...${NC}"
    
    # Kill background processes
    if [ -f "/tmp/brainbridge.pid" ]; then
        echo -e "${YELLOW}Stopping background processes...${NC}"
        kill $(cat /tmp/brainbridge.pid) 2>/dev/null || true
        rm -f /tmp/brainbridge.pid
    fi
    
    # Stop PostgreSQL if it was started by this script
    if [ "$POSTGRES_STARTED" = true ]; then
        echo -e "${YELLOW}Stopping PostgreSQL...${NC}"
        sudo systemctl stop postgresql
    fi
    
    echo -e "${GREEN}✓ Cleanup complete. Dependencies remain installed.${NC}"
}

trap cleanup INT TERM EXIT

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

install_pkg() {
    local pkg=$1
    if ! command_exists "$pkg"; then
        echo -e "${YELLOW}Installing $pkg...${NC}"
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y "$pkg"
        elif command_exists yum; then
            sudo yum install -y "$pkg"
        else
            echo -e "${RED}Package manager not found. Install $pkg manually.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}$pkg is installed.${NC}"
    fi
}

setup_python() {
    echo -e "\n${YELLOW}Setting up Python...${NC}"
    install_pkg python3
    install_pkg python3-pip
    install_pkg python3-venv
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install --upgrade pip
    
    # Install dependencies directly
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv \
                python-jose[cryptography] passlib[bcrypt] pydantic pydantic-settings
    
    # Create a temporary setup.py to handle the package installation
    if [ ! -f "setup.py" ]; then
        echo -e "${YELLOW}Creating temporary setup.py...${NC}"
        cat > setup.py << 'EOL'
from setuptools import setup, find_packages

setup(
    name="brainbridge",
    version="0.1.0",
    packages=find_packages(include=['server*']),
    install_requires=[
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'psycopg2-binary',
        'python-dotenv',
        'python-jose[cryptography]',
        'passlib[bcrypt]',
        'pydantic',
        'pydantic-settings',
    ],
)
EOL
        
        # Install in development mode using the temporary setup.py
        pip install -e .
        # Clean up the temporary setup.py
        rm setup.py
    else
        # If setup.py already exists, use it
        pip install -e .
    fi
}

setup_node() {
    echo -e "\n${YELLOW}Setting up Node.js...${NC}"
    if ! command_exists node; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        install_pkg nodejs
    fi
    
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd client
    npm install
    npm install -D tsx typescript @types/node
    cd ..
}

setup_postgres() {
    echo -e "\n${YELLOW}Setting up PostgreSQL...${NC}"
    
    # Check if PostgreSQL is already installed and running
    if ! command -v psql >/dev/null 2>&1; then
        install_pkg postgresql
        install_pkg postgresql-contrib
        install_pkg libpq-dev
    fi
    
    # Start PostgreSQL if not running
    if ! systemctl is-active --quiet postgresql; then
        echo -e "${YELLOW}Starting PostgreSQL...${NC}"
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
        export POSTGRES_STARTED=true
    else
        export POSTGRES_STARTED=false
    fi
    
    echo -e "${YELLOW}Configuring database...${NC}"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' CREATEDB;" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME WITH OWNER $DB_USER;" 2>/dev/null || true
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cat > .env <<EOL
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
SECRET_KEY=$(openssl rand -hex 32)
EOL
    fi
}

init_db() {
    echo -e "\n${YELLOW}Initializing database...${NC}"
    source venv/bin/activate
    
    # Create a temporary __init__.py in the server directory if it doesn't exist
    if [ ! -f "server/__init__.py" ]; then
        touch server/__init__.py
    fi
    
    # Initialize the database
    if [ -f "init_db.py" ]; then
        python init_db.py
    else
        echo -e "${YELLOW}init_db.py not found, skipping database initialization${NC}"
    fi
}

main() {
    echo -e "${GREEN}🚀 Starting BrainBridge setup...${NC}"
    
    setup_python
    setup_node
    setup_postgres
    init_db
    
    echo -e "\n${GREEN}✅ Setup complete!${NC}"
    echo -e "\nTo start the application:\n"
    echo -e "  source venv/bin/activate"
    echo -e "  python run.py\n"
}

main "$@"
