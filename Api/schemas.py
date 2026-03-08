#schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    # Used by admin to create a new user. No self-registration allowed.
    name:        str
    email:       EmailStr
    employee_id: str
    password:    str
    division:    str
    role:        str        # 'admin' or 'user'

class UserResponse(BaseModel):
    id:          int
    name:        str
    email:       str
    employee_id: str
    division:    str
    role:        str
    created_at:  datetime

    class Config:
        from_attributes = True



class LoginRequest(BaseModel):
    # a ccepts either email or employee_id as identifier for login.
    identifier: str
    password:   str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    role:         str
    name:         str




# ── Travel Workflow ────────────

class TravelWorkflowResponse(BaseModel):
    report_type:  Optional[str]
    division:     Optional[str]
    workflowType: Optional[str]
    initiator:    Optional[str]
    approver1:    Optional[str]
    approver2:    Optional[str]
    approver3:    Optional[str]
    approver4:    Optional[str]

    class Config:
        from_attributes = True


# ── Non-Travel Workflow ─────────────

class NonTravelWorkflowResponse(BaseModel):
    report_type:  Optional[str]
    division:     Optional[str]
    workflowType: Optional[str]
    initiator:    Optional[str]
    approver1:    Optional[str]
    approver2:    Optional[str]
    approver3:    Optional[str]
    approver4:    Optional[str]

    class Config:
        from_attributes = True


# ── Advance Workflow ──────────

class AdvanceWorkflowResponse(BaseModel):
    advance_type: Optional[str]
    initiator:    Optional[str]
    approver1:    Optional[str]
    approver2:    Optional[str]
    approver3:    Optional[str]
    approver4:    Optional[str]

    class Config:
        from_attributes = True


# ── Wworkflow update (pathcing)  ─────────

class WorkflowUpdate(BaseModel):
    initiator:    Optional[str] = None
    approver1:    Optional[str] = None
    approver2:    Optional[str] = None
    approver3:    Optional[str] = None
    approver4:    Optional[str] = None


# ── SPOC ──────────────────────────────────────────────────────────────────────

class SPOCResponse(BaseModel):
    division: Optional[str]
    name:     Optional[str]
    role:     Optional[str]
    email:    Optional[str]
    phone:    Optional[str]

    class Config:
        from_attributes = True


# ── Change Request ────────────────────────────────────────────────────────────

class ChangeRequestCreate(BaseModel):
    cr_number:      str
    division:       str
    change_type:    str
    description:    str
    raised_by:      str
    effective_from: Optional[datetime] = None
    remarks:        Optional[str] = None


class ChangeRequestResponse(BaseModel):
    cr_number:      Optional[str]
    division:       Optional[str]
    change_type:    Optional[str]
    description:    Optional[str]
    raised_by:      Optional[str]
    raised_on:      Optional[datetime]
    effective_from: Optional[datetime]
    status:         Optional[str]
    remarks:        Optional[str]

    class Config:
        from_attributes = True