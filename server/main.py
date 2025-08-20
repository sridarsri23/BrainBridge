#!/usr/bin/env python3
"""
FastAPI backend for BrainBridge - Job matching platform for neurodivergent professionals
"""

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import uvicorn
import os
from typing import Dict, Any, Optional

from server.database import init_db, get_db
from server.models import UserRole
from server.auth import verify_token, get_current_user
from server.routers import auth, users, profiles, jobs, admin
from sqlalchemy.orm import Session

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="BrainBridge API", 
    version="1.0.0",
    description="A comprehensive job matching platform for neurodivergent professionals",
    lifespan=lifespan
)

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler for validation errors to provide user-friendly messages"""
    errors = []
    for error in exc.errors():
        field = error.get("loc", [])[-1] if error.get("loc") else "field"
        msg = error.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": f"Validation error: {', '.join(errors)}"}
    )

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["profiles"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "BrainBridge API"}

# Root API endpoint (only for direct API access)
@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Welcome to BrainBridge API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Serve static files (both development and production)
static_files_dir = "dist/public" if os.path.exists("dist/public") else "client/dist"
assets_dir = f"{static_files_dir}/assets" if os.path.exists(f"{static_files_dir}/assets") else f"{static_files_dir}/assets"

if os.path.exists(static_files_dir):
    # Mount static assets
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Serve the React SPA for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the React SPA for all non-API routes"""
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        index_file = f"{static_files_dir}/index.html"
        if os.path.exists(index_file):
            return FileResponse(index_file)
        else:
            raise HTTPException(status_code=404, detail="Frontend not built")
else:
    print("Warning: Frontend static files not found. Please run 'npm run build' first.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") == "development" else False,
        log_level="info"
    )