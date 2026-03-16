from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
import io

from Api.database import sessionLocal
from Api.database_models import (
    User, DivisionMaster, LevelMaster, GradeMaster,
    LevelGradeMapping, SamplingEntitlement
)
from Api.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/entitlement", tags=["Entitlement"])


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()


def clean(value):
    if pd.isna(value):
        return None
    return str(value).strip()


# helper to get or create a division row
def get_or_create_division(db: Session, div_name: str, user_name: str) -> DivisionMaster:
    div = db.query(DivisionMaster).filter(func.lower(DivisionMaster.div_name) == func.lower(div_name)).first()
    if not div:
        div = DivisionMaster(
            div_name=div_name,
            div_code=div_name.upper()[:10],
            created_by=user_name
        )
        db.add(div)
        db.flush()  
    return div


def get_or_create_level(db: Session, level_name: str, user_name: str) -> LevelMaster:
    lvl = db.query(LevelMaster).filter(func.lower(LevelMaster.level_name) == func.lower(level_name)).first() 
    if not lvl:
        lvl = LevelMaster(
            level_name=level_name,
            level_code=level_name.replace(" ", "").upper(),
            created_by=user_name
        )
        db.add(lvl)
        db.flush()
    return lvl


def get_or_create_grade(db: Session, grade_name: str, user_name: str) -> GradeMaster:
    grd = db.query(GradeMaster).filter(func.lower(GradeMaster.grade_name) == func.lower(grade_name)).first()
    if not grd:
        grd = GradeMaster(
            grade_name=grade_name,
            grade_code=grade_name.upper(),
            created_by=user_name
        )
        db.add(grd)
        db.flush()
    return grd


#MASTER DATA endpoints (admin, available from dashboard) 

@router.get("/levels", response_model=List[dict])
def get_all_levels(db: Session = Depends(get_db),_: User = Depends(get_current_user)):
    levels = db.query(LevelMaster).filter(LevelMaster.status == 1).all()
    return [{"id": l.id, "level_name": l.level_name} for l in levels]


@router.get("/grades", response_model=List[dict])
def get_all_grades(db: Session = Depends(get_db),_: User = Depends(get_current_user)):
    grades = db.query(GradeMaster).filter(GradeMaster.status == 1).all()
    return [{"id": g.id, "grade_name": g.grade_name} for g in grades]


#SAMPLING — get levels available for a division 

@router.get("/sampling/levels")
def get_sampling_levels(division: str,db: Session = Depends(get_db),_: User = Depends(get_current_user)):
    # Find division row
    div = db.query(DivisionMaster).filter(func.lower(DivisionMaster.div_name) == func.lower(division)).first()
    if not div:
        raise HTTPException(status_code=404, detail="No entitlement data found for this division.")

    # get all levels that have a sampling entitlement for this division
    rows = (
        db.query(LevelMaster.level_name)
        .join(LevelGradeMapping, LevelGradeMapping.lvl_id == LevelMaster.id)
        .join(SamplingEntitlement, SamplingEntitlement.lvl_grd_id == LevelGradeMapping.id)
        .filter(
            LevelGradeMapping.div_id == div.id,
            LevelGradeMapping.status == 1,
            SamplingEntitlement.status == 1
        )
        .distinct()
        .all()
    )

    if not rows:
        raise HTTPException(status_code=404, detail="No entitlement data found for this division.")

    return [r[0] for r in rows]


#SAMPLING— get grades for  division + level combo

@router.get("/sampling/grades")
def get_sampling_grades(division: str,level: str,db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    div = db.query(DivisionMaster).filter(
        func.lower(DivisionMaster.div_name) == func.lower(division)
    ).first()
    lvl = db.query(LevelMaster).filter(
        func.lower(LevelMaster.level_name) == func.lower(level)
    ).first()

    if not div or not lvl:
        raise HTTPException(status_code=404, detail="No data found.")

    rows = (
        db.query(GradeMaster.grade_name)
        .join(LevelGradeMapping, LevelGradeMapping.grd_id == GradeMaster.id)
        .join(SamplingEntitlement, SamplingEntitlement.lvl_grd_id == LevelGradeMapping.id)
        .filter(
            LevelGradeMapping.div_id == div.id,
            LevelGradeMapping.lvl_id == lvl.id,
            LevelGradeMapping.status == 1,
            SamplingEntitlement.status == 1
        )
        .distinct()
        .all()
    )

    if not rows:
        raise HTTPException(status_code=404, detail="No grades found for this level.")

    return [r[0] for r in rows]


#AMPLING— get amount

@router.get("/sampling")
def get_sampling_entitlement(division: str,level: str,grade: str,db: Session = Depends(get_db),_: User = Depends(get_current_user)):
    div = db.query(DivisionMaster).filter(func.lower(DivisionMaster.div_name) == func.lower(division)).first()
    lvl = db.query(LevelMaster).filter(func.lower(LevelMaster.level_name) == func.lower(level)).first()
    grd = db.query(GradeMaster).filter(func.lower(GradeMaster.grade_name) == func.lower(grade)).first()

    if not div or not lvl or not grd:
        raise HTTPException(status_code=404, detail="No entilement found.")

    mapping = db.query(LevelGradeMapping).filter(
        LevelGradeMapping.div_id == div.id,
        LevelGradeMapping.lvl_id == lvl.id,
        LevelGradeMapping.grd_id == grd.id,
        LevelGradeMapping.status == 1
    ).first()

    if not mapping:
        raise HTTPException(status_code=404, detail="no entitlement for this combination.")

    entitlement = db.query(SamplingEntitlement).filter(SamplingEntitlement.lvl_grd_id == mapping.id, SamplingEntitlement.status == 1).first()

    if not entitlement:
        raise HTTPException(status_code=404, detail="No entitlement for this combination.")

    return {
        "division": division,
        "level":    level,
        "grade":    grade,
        "amount":   entitlement.amount,
        "id":       entitlement.id   # needed for edit
    }


# SAMPLING— edit the sampling amt for that paritulcar div(admin only access) 

class EditAmountRequest(BaseModel):
    amount: str


@router.patch("/sampling/{entitlement_id}")
def edit_sampling_amount(entitlement_id: int,data: EditAmountRequest,db: Session = Depends(get_db),current_user: User = Depends(require_admin)):
    ent = db.query(SamplingEntitlement).filter(SamplingEntitlement.id == entitlement_id).first()
    if not ent:
        raise HTTPException(status_code=404, detail="Entitlement not found.")

    ent.amount      = data.amount
    ent.modified_by = current_user.name
    ent.modified_at = datetime.utcnow()
    db.commit()

    return {"message": f"Amount updated to {data.amount}", "modified_by": current_user.name}





# where we drop the excel file for sampling

@router.post("/sampling/upload")
async def upload_sampling(division: str,file: UploadFile = File(...),db: Session = Depends(get_db),current_user: User = Depends(require_admin)):
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        df.columns = df.columns.str.strip()

        div = get_or_create_division(db, division, current_user.name) # creatinhg the divsision if it doesn't exist
        
        # delete existing sampling entitlements for this division only
        # step 1: find all mapping IDs for this division
        mapping_ids = [
            m.id for m in db.query(LevelGradeMapping).filter(LevelGradeMapping.div_id == div.id).all()
        ]
        # step 2: delete sampling entitlements linked to those mappings
        if mapping_ids:
            db.query(SamplingEntitlement).filter(SamplingEntitlement.lvl_grd_id.in_(mapping_ids)).delete(synchronize_session=False)
            db.commit()

        # now we upload the new data
        for _, row in df.iterrows():
            level_name = clean(row.get("Level"))
            grade_name = clean(row.get("Grade"))
            amount     = clean(row.get("Amount"))

            if not level_name or not grade_name or not amount:
                continue

            lvl = get_or_create_level(db, level_name, current_user.name)
            grd = get_or_create_grade(db, grade_name, current_user.name)

            # get or create mapping for this div + level + grade
            mapping = db.query(LevelGradeMapping).filter(LevelGradeMapping.div_id == div.id,  LevelGradeMapping.lvl_id == lvl.id,LevelGradeMapping.grd_id == grd.id,).first()

            if not mapping:
                mapping = LevelGradeMapping(
                    div_id= div.id,
                    lvl_id= lvl.id,
                    grd_id= grd.id,
                    created_by= current_user.name
                )
                db.add(mapping)
                db.flush()

            # add the new samp entl
            db.add(SamplingEntitlement(
                lvl_grd_id = mapping.id,
                amount     = amount,
                created_by = current_user.name
            ))

        db.commit()
        return {"message": f"Sampling entitlement uploaded for {division}."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/master/upload")
async def upload_master(file: UploadFile = File(...),db: Session = Depends(get_db),current_user: User = Depends(require_admin)):
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        df.columns = df.columns.str.strip()
 
        added_levels = 0
        added_grades = 0
 
        for _, row in df.iterrows():
            level_name = clean(row.get("Level"))
            grade_name = clean(row.get("Grade"))
 
            if level_name:
                existing = db.query(LevelMaster).filter(
                    func.lower(LevelMaster.level_name) == func.lower(level_name)
                ).first()
                if not existing:
                    db.add(LevelMaster(
                        level_name = level_name,
                        level_code = level_name.replace(" ", "").upper(),
                        created_by = current_user.name
                    ))
                    added_levels += 1
 
            if grade_name:
                existing = db.query(GradeMaster).filter(
                    func.lower(GradeMaster.grade_name) == func.lower(grade_name)
                ).first()
                if not existing:
                    db.add(GradeMaster(
                        grade_name = grade_name,
                        grade_code = grade_name.upper(),
                        created_by = current_user.name
                    ))
                    added_grades += 1
 
        db.commit()
        return {"message": f"Master data uploaded. Added {added_levels} levels and {added_grades} grades."}
 
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


class UpdateNameRequest(BaseModel):
    name: str


@router.patch("/levels/{level_id}")
def update_level(level_id: int,data: UpdateNameRequest,db: Session = Depends(get_db),current_user: User = Depends(require_admin)):
    lvl = db.query(LevelMaster).filter(LevelMaster.id == level_id).first()
    if not lvl:
        raise HTTPException(status_code=404, detail="Level not found.")

    lvl.level_name  = data.name
    lvl.modified_by = current_user.name
    lvl.modified_at = datetime.utcnow()
    db.commit()

    return {"message": f"Level updated to '{data.name}'", "modified_by": current_user.name}


# updating the grade (admin only)

@router.patch("/grades/{grade_id}")
def update_grade(grade_id: int,data: UpdateNameRequest,db: Session = Depends(get_db),current_user: User = Depends(require_admin)):
    grd = db.query(GradeMaster).filter(GradeMaster.id == grade_id).first()
    if not grd:
        raise HTTPException(status_code=404, detail="Grade not found.")

    grd.grade_name  = data.name
    grd.modified_by = current_user.name
    grd.modified_at = datetime.utcnow()
    db.commit()

    return {"message": f"Grade updated to '{data.name}'", "modified_by": current_user.name}





@router.get("/sampling/all")
def get_all_sampling(division: str, db: Session = Depends(get_db),_: User = Depends(get_current_user)):

    div = db.query(DivisionMaster).filter(func.lower(DivisionMaster.div_name) == func.lower(division)).first()

    if not div:
        raise HTTPException(status_code=404, detail="No entitlement data found for this division.")

    rows = (
        db.query(
            SamplingEntitlement.id,
            SamplingEntitlement.amount,
            LevelMaster.level_name,
            GradeMaster.grade_name,
        )
        .join(LevelGradeMapping, LevelGradeMapping.id == SamplingEntitlement.lvl_grd_id)
        .join(LevelMaster,       LevelMaster.id       == LevelGradeMapping.lvl_id)
        .join(GradeMaster,       GradeMaster.id       == LevelGradeMapping.grd_id)
        .filter(
            LevelGradeMapping.div_id       == div.id,
            LevelGradeMapping.status       == 1,
            SamplingEntitlement.status     == 1,
        )
        .order_by(LevelMaster.level_name, GradeMaster.grade_name)
        .all()
    )
 
    if not rows:
        raise HTTPException(status_code=404, detail="No entitlement data found for this division.")

    return [
        {
            "id":     row.id,
            "level":  row.level_name,
            "grade":  row.grade_name,
            "amount": row.amount,
        }
        for row in rows
    ]