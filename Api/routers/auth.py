# auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from Api.dependencies import get_db, get_current_user, require_admin, SECRET_KEY, ALGORITHM
from Api.database_models import User
from Api.schemas import UserCreate, UserResponse, LoginRequest, TokenResponse
from typing import List

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context= CryptContext(schemes=['bcrypt'], deprecated='auto')

ACCESS_TOKEN_EXPIRE_MINUTES= 480 # 8 hours


# helper functions

def hash_pw(pw:str):
    return pwd_context.hash(pw)

def verify_pw(plain:str, hashed:str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(user_id:int) -> str:
    expire  = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={"user_id":user_id, "exp":expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post('/register', response_model=UserResponse)
def register(data: UserCreate, db: Session= Depends(get_db)):
    if db.query(User).filter(User.email==data.email).first():
        raise HTTPException(status=404, detail='Employee with this email ID already exists')
    if db.query(User).filter(User.employee_id==data.employee_id).first():
        raise HTTPException(status=404, detail='Employee with this employee ID already exists')
    
    new_user=User(
        name=data.name,
        email=data.email,
        employee_id=data.employee_id,
        password=hash_pw(data.password),
        division=data.division,
        role="user"  #always forced to 'user' by default
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)    
    return new_user


@router.post('/login', response_model=TokenResponse)
def login(data:LoginRequest, db: Session= Depends(get_db)):
    user = db.query(User).filter(User.email == data.identifier).first()
    if not user:
        user = db.query(User).filter(User.employee_id == data.identifier).first()

    if not user or not verify_pw(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Check your email/employee ID and password."
        )
    
    '''
    the token is never "passed' by the backend, the frontend is responsible for attaching it to every single request it makes after login. 
    the backend just reads it from the header each time.
    '''
    token=create_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name
    }   


# admin: create user with any role

@router.post("/users", response_model=UserResponse)
def create_user_admin(
    data: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    # admin-only endpoint to create a user with any role. cna be used if a new member joins our team and would have to create an account for them. 
    
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")
    if db.query(User).filter(User.employee_id == data.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already registered.")

    new_user = User(
        name=data.name,
        email=data.email,
        employee_id=data.employee_id,
        password=hash_pw(data.password),
        division=data.division,
        role=data.role       # admin can set any role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# admin: see all users

@router.get('/users', response_model=List[UserResponse])
def get_user(db:Session = Depends(get_db), _:User = Depends(require_admin)):
    return db.query(User).all()


# admin: can delete user
@router.delete("/users/{employee_id}")
def delete_user(employee_id: str,db: Session = Depends(get_db),_: User = Depends(require_admin)):
    user = db.query(User).filter(User.employee_id == employee_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()
    return {"message": f"User {employee_id} deleted."}

