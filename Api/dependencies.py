# dependencies.py

import os
from fastapi.security import OAuth2PasswordBearer
from Api.database import sessionLocal
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from Api.database_models import User

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM="HS256"
 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login', auto_error=False) # pulls the token out of Authorization header


def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # unlocks token with SECRET_KEY and gets user_id out
        user_id:int = payload.get('user_id') # gets user_id that was stored in the token when that token was created (check create token function in auth.py)

        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user=db.query(User).filter(User.id==user_id).first() 

    if not user:
        raise credentials_exception
    
    return user


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role!='admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins only. You do not have permission to perform this action."
        )
    return current_user