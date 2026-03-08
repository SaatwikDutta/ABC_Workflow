#databse_models.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from Api.database import Base


# ── User table────────────
class User(Base):

    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150))
    email       = Column(String(150), unique=True, index=True)
    employee_id = Column(String(50), unique=True, index=True)
    password    = Column(String(255))        # always hashed, never plain text
    division    = Column(String(100))
    role        = Column(String(50))         # 'admin' or 'user'
    created_at  = Column(DateTime, default=datetime.utcnow)


# ── Travel Workflow ────────────

class TravelWorkflow(Base):
    __tablename__='travel_workflows'

    id=Column(Integer, primary_key=True, index=True)
    report_type=Column(String(100))
    division= Column(String(100))
    workflowType= Column(String(100))
    initiator= Column(String(100))
    approver1= Column(String(150))
    approver2= Column(String(150))
    approver3= Column(String(150))
    approver4= Column(String(150))


# ── Non-Travel Workflow ─────────────

class NonTravelWorkflow(Base):

    __tablename__ = "nontravel_workflows"

    id= Column(Integer, primary_key=True, index=True)
    report_type = Column(String(200))  
    division = Column(String(100))   
    workflowType= Column(String(200)) 
    initiator = Column(String(150))
    approver1 = Column(String(150))
    approver2 = Column(String(150))
    approver3 = Column(String(150))
    approver4 = Column(String(150))



# ── Advance Workflow ──────────

class AdvanceWorkflow(Base):

    __tablename__ = "advance_workflows"

    id= Column(Integer, primary_key=True, index=True)
    advance_type= Column(String(200))
    initiator= Column(String(150))
    approver1= Column(String(150))
    approver2= Column(String(150))
    approver3= Column(String(150))
    approver4= Column(String(150))


# ── CR Table ──────────

class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id             = Column(Integer, primary_key=True, index=True)
    cr_number      = Column(String(50), unique=True)
    division       = Column(String(100))
    change_type    = Column(String(100))     # e.g. 'workflow chsnge', 'entitlement Change'
    description    = Column(Text)            # descp of change
    raised_by      = Column(String(150))     # HR who rasied the CR
    raised_on      = Column(DateTime, default=datetime.utcnow)
    effective_from = Column(DateTime, nullable=True)
    status         = Column(String(50), default="Open")   # open, in-prog, closed