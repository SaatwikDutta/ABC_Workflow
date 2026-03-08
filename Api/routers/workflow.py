from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from Api.database import sessionLocal
from Api.database_models import TravelWorkflow, NonTravelWorkflow, AdvanceWorkflow, ChangeRequest, User
from Api.schemas import WorkflowUpdate, TravelWorkflowResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
from datetime import datetime
from Api.dependencies import get_current_user
from typing import List
from Api.dependencies import require_admin
import io

router=APIRouter(prefix='/workflow', tags=['Workflow']) # first we click on workflow and then we are redirected to another page where we are asked about our choices

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_value(value):
    if pd.isna(value):
        return None
    return str(value).strip()


# for creating CR logs whenenever we update somethig in the master data.

#add "changed_by: str" if you need to see who made the change in the CR log. for now, it is not added since only admin can edit workflow and we can easily identify the admin user from the CR description itself. But if you want to add changed_by, then you also need to pass it from the API endpoint whenver there is a change and then pass it to this function to log in DB.
def CR_LOG(db:Session, division:str, description: str, change_type: str = "Workflow Change"):
    cr_number = f"AUTO-CR-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    cr=ChangeRequest(
        cr_number=cr_number,
        division=division,
        change_type=change_type,
        description=description,
        # raised_by=changed_by,
        status="Closed",     # auto CRs are immediately closed since change is already done
    )

    db.add(cr)

@router.get('/travel/workflow-types', response_model=list[str])
def get_travel_workflow_types(
    report_type: str,
    division:    str,
    db: Session = Depends(get_db),
    _:  User    = Depends(get_current_user)
):
    rows = db.query(TravelWorkflow.workflowType).filter(
        func.lower(TravelWorkflow.report_type) == func.lower(report_type),
        func.lower(TravelWorkflow.division)    == func.lower(division),
    ).distinct().all()

    if not rows:
        raise HTTPException(status_code=404, detail="No workflow types found.")

    return [r[0] for r in rows if r[0]]


@router.get('/nontravel/workflow-types', response_model=list[str])
def get_nontravel_workflow_types(
    report_type: str,
    division:    str,
    db: Session = Depends(get_db),
    _:  User    = Depends(get_current_user)
):
    rows = db.query(NonTravelWorkflow.workflowType).filter(
        func.lower(NonTravelWorkflow.report_type) == func.lower(report_type),
        func.lower(NonTravelWorkflow.division)    == func.lower(division),
    ).distinct().all()

    if not rows:
        raise HTTPException(status_code=404, detail="No workflow types found.")

    return [r[0] for r in rows if r[0]]

@router.get('/travel', response_model=List[TravelWorkflowResponse]) 
def get_travel_workflow(report_type:str, division:str, workflowType:str, db:Session = Depends(get_db), _: User = Depends(get_current_user)):
    
    data=db.query(TravelWorkflow).filter(
        func.lower(TravelWorkflow.report_type)==func.lower(report_type),
        func.lower(TravelWorkflow.division)==func.lower(division),
        func.lower(TravelWorkflow.workflowType)==func.lower(workflowType),
    ).all()

    if not data:
        raise HTTPException(status_code=404, detail='No matching workflow')

    return data

@router.post('/travel/upload')
async def upload_travel_workflow(file:UploadFile = File(...), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    try:
        contents= await file.read()
        df=pd.read_excel(io.BytesIO(contents))
        df.columns = df.columns.str.strip()

        db.query(TravelWorkflow).delete()
        db.commit()

        for idx, row in df.iterrows():
            db.add(
                TravelWorkflow(
                    report_type=clean_value(row['Report Type']),
                    division=clean_value(row['Division']),
                    workflowType=clean_value(row['Workflow Type']),
                    initiator=clean_value(row['Initiator']),
                    approver1=clean_value(row['Approver 1']),
                    approver2=clean_value(row['Approver 2']),
                    approver3=clean_value(row['Approver 3']),
                    approver4=clean_value(row['Approver 4'])
                )
            )
        db.commit()

        return 'Travel Workflow uploaded'

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.patch('/travel/{id}')
def update_travel_workflow(id:int, data:WorkflowUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    row=db.query(TravelWorkflow).filter(TravelWorkflow.id==id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Workflow not found")

    changes=[]

    if data.initiator is not None and data.initiator !=row.initiator:
        changes.append(f"Initiator: '{row.initiator}' -> '{data.initiator}'")
        row.initiator=data.initiator
    
    if data.approver1 is not None and data.approver1!=row.approver1:
        changes.append(f"Initiator: '{row.approver1}' -> '{data.approver1}'")
        row.approver1=data.approver1
    
    if data.approver2 is not None and data.approver2!=row.approver2:
        changes.append(f"Approver 2: '{row.approver2}' -> '{data.approver2}'")
        row.approver2=data.approver2
    
    if data.approver3 is not None and data.approver3!=row.approver3:
        changes.append(f"Approver 3: '{row.approver3}' -> '{data.approver3}'")
        row.approver3=data.approver3

    if data.approver4 is not None and data.approver4!=row.approver4:
        changes.append(f"Approver 4: '{row.approver4}' -> '{data.approver4}'")
        row.approver4=data.approver4

    if changes:
        description = (
            f"Travel Workflow Updated | "
            f"Report Type: {row.report_type} | Division: {row.division} | "
            f"Workflow Type: {row.workflowType} | Changes: {', '.join(changes)}"
        )

        CR_LOG(db, row.division, description)

    db.commit()
    return f"Travel Workflow in {id} updated"