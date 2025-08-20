"""
Authentication routes
"""

from datetime import timedelta, datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import Token, UserLogin, UserCreate, UserResponse
from server.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login endpoint"""
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address. Please check your email or register for a new account.",
        )
    
    if not verify_password(user_credentials.password, str(user.password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please check your password and try again.",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@router.post("/register", response_model=UserResponse)
async def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    # Log raw request body to see what FastAPI receives
    body = await request.body()
    print(f"\n=== RAW REQUEST DEBUG ===")
    print(f"Raw request body: {body.decode('utf-8')}")
    print(f"Content-Type: {request.headers.get('content-type')}")
    print(f"Request method: {request.method}")
    print(f"========================\n")
    """Register a new user"""
    print(f"\n=== BACKEND REGISTRATION DEBUG ===")
    print(f"Received user_data type: {type(user_data)}")
    print(f"Raw request data: {user_data.model_dump()}")
    print(f"user_role field: '{user_data.user_role}'")
    print(f"user_role type: {type(user_data.user_role)}")
    print(f"email: {user_data.email}")
    print(f"first_name: {user_data.first_name}")
    print(f"last_name: {user_data.last_name}")
    print(f"phone: {user_data.phone}")
    print(f"===================================\n")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please use a different email or try logging in."
        )
    
    # Validate password strength
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        user_role=user_data.user_role,
        phone=user_data.phone,
        password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    
    # Return simple success response
    return UserResponse(
        id=str(uuid.uuid4()),
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        user_role=user_data.user_role,
        phone=user_data.phone,
        is_active=True,
        created_at=datetime.now()
    )

@router.get("/user", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.model_validate(current_user)

@router.post("/logout")
async def logout():
    """Logout endpoint (token invalidation handled client-side)"""
    return {"message": "Successfully logged out"}