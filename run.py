#!/usr/bin/env python3
"""
BrainBridge - Run Script

This script provides a unified way to start, stop, and manage the BrainBridge application.
It handles both the FastAPI backend and Vite frontend development server with proper cleanup.
"""

import os
import sys
import signal
import subprocess
import time
import atexit
import platform
from pathlib import Path
from typing import List, Optional

# Project paths
BASE_DIR = Path(__file__).parent.absolute()
CLIENT_DIR = BASE_DIR / "client"
SERVER_DIR = BASE_DIR / "server"

# Process handles
processes = []

class ProcessManager:
    """Manages subprocesses with proper cleanup."""
    
    def __init__(self):
        """Initialize the ProcessManager."""
        self.processes = []
        self._cleaning_up = False
        atexit.register(self.cleanup)
        
    def run_command(self, cmd: List[str], cwd: Optional[str] = None, env: Optional[dict] = None) -> subprocess.Popen:
        """Run a command and track the process."""
        try:
            # Merge with current environment
            process_env = os.environ.copy()
            if env:
                process_env.update(env)
                
            process = subprocess.Popen(
                cmd,
                cwd=str(cwd) if cwd else None,
                env=process_env,
                stdout=sys.stdout,
                stderr=sys.stderr,
                shell=platform.system() == "Windows",
                preexec_fn=os.setsid if platform.system() != "Windows" else None
            )
            self.processes.append(process)
            return process
        except Exception as e:
            print(f"Error starting process: {e}")
            self.cleanup()
            sys.exit(1)
    
    def cleanup(self, signum=None, frame=None):
        """Terminate all tracked processes."""
        # Prevent recursive calls
        if self._cleaning_up:
            return
            
        self._cleaning_up = True
        
        try:
            if signum is not None:
                print(f"\n🛑 Received signal {signum}. Cleaning up...")
            
            for process in self.processes[:]:  # Create a copy of the list
                if process.poll() is None:  # Process is still running
                    print(f"Terminating process {process.pid}...")
                    try:
                        if platform.system() == "Windows":
                            process.terminate()
                        else:
                            os.killpg(process.pid, signal.SIGTERM)
                        
                        # Give process a moment to terminate gracefully
                        process.wait(timeout=3)
                    except (ProcessLookupError, subprocess.TimeoutExpired):
                        try:
                            if platform.system() == "Windows":
                                process.kill()
                            else:
                                os.killpg(process.pid, signal.SIGKILL)
                            process.wait()
                        except:
                            pass
                    except Exception as e:
                        print(f"Error terminating process {process.pid}: {e}")
            
            self.processes.clear()
        finally:
            self._cleaning_up = False

def check_dependencies():
    """Check if required commands are available."""
    required_commands = ["node", "npm", "python3"]
    for cmd in required_commands:
        try:
            subprocess.run(
                [cmd, "--version"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=True
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"Error: {cmd} is not installed or not in PATH")
            sys.exit(1)

def run_backend(manager: ProcessManager):
    """Start the FastAPI backend server."""  # Fixed unterminated docstring
    print("\n🚀 Starting FastAPI backend...")
    return manager.run_command(
        ["python3", "run_fastapi.py"],
        cwd=BASE_DIR,
        env={"PYTHONPATH": str(BASE_DIR), "PORT": "8001"}
    )

def run_frontend(manager: ProcessManager):
    """Start the Vite development server."""
    print("\n🚀 Starting Vite frontend...")
    return manager.run_command(
        ["npm", "run", "dev"],
        cwd=CLIENT_DIR
    )

def install_dependencies():
    """Install project dependencies."""
    print("\n🔧 Installing Python dependencies...")
    subprocess.run(
        ["python3", "-m", "pip", "install", "-e", "."],
        cwd=BASE_DIR,
        check=True
    )
    
    print("\n🔧 Installing Node.js dependencies...")
    subprocess.run(
        ["npm", "install"],
        cwd=BASE_DIR,
        check=True
    )

def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="BrainBridge Run Script")
    parser.add_argument(
        "--install", 
        action="store_true", 
        help="Install dependencies before starting"
    )
    parser.add_argument(
        "--backend-only", 
        action="store_true", 
        help="Only start the backend server"
    )
    parser.add_argument(
        "--frontend-only", 
        action="store_true", 
        help="Only start the frontend development server"
    )
    
    args = parser.parse_args()
    
    # Check dependencies
    check_dependencies()
    
    # Install dependencies if requested
    if args.install:
        install_dependencies()
    
    # Initialize process manager
    manager = ProcessManager()
    
    # Register signal handlers for clean exit
    def signal_handler(sig, frame):
        print("\n🛑 Received shutdown signal. Cleaning up...")
        manager.cleanup()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Start backend and frontend
        backend = run_backend(manager)
        frontend = run_frontend(manager)
        
        print("\n✅ BrainBridge is running!")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8001")
        print("\n📌 Press Ctrl+C to stop all services")
        
        # Keep the main process alive
        while True:
            try:
                time.sleep(1)
                # Check if any child processes have died
                if backend.poll() is not None or frontend.poll() is not None:
                    print("\n❌ A service has stopped unexpectedly. Shutting down...")
                    break
            except KeyboardInterrupt:
                print("\nShutting down...")
                break
            except Exception as e:
                print(f"Error: {e}")
                break
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        manager.cleanup()

if __name__ == "__main__":
    main()
