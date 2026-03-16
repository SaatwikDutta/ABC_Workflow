from fastapi import APIRouter, Depends, HTTPException
from Api.database import sessionLocal
from Api.dependencies import get_current_user, require_admin
import pandas as pd
from Api.database_models import User
from sqlalchemy.orm import Session
from sqlalchemy import func


router= APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean(value):
    if pd.isna(value):
        return None
    return str(value).strip()


@router.get("")
def get_users(division:str, db:Session = Depends(get_db), _: User = Depends(require_admin)):
    users=db.query(User).filter(func.lower(User.division) == func.lower(division)).all()

    if not users:
        raise HTTPException(status_code=404, detail=f"No user for {division} division")

    return users