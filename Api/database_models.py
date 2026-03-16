from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from Api.database import Base


# ── User ──────────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150))
    email       = Column(String(150), unique=True, index=True)
    employee_id = Column(String(50), unique=True, index=True)
    password    = Column(String(255))
    division    = Column(String(100))
    role        = Column(String(50))
    created_at  = Column(DateTime, default=datetime.utcnow)


# ── Travel Workflow ───────────────────────────────────────────────────────────
class TravelWorkflow(Base):
    __tablename__ = "travel_workflows"

    id           = Column(Integer, primary_key=True, index=True)
    report_type  = Column(String(100))
    division     = Column(String(100))
    workflowType = Column(String(100))
    initiator    = Column(String(100))
    approver1    = Column(String(150))
    approver2    = Column(String(150))
    approver3    = Column(String(150))
    approver4    = Column(String(150))


# ── Non-Travel Workflow ───────────────────────────────────────────────────────
class NonTravelWorkflow(Base):
    __tablename__ = "nontravel_workflows"

    id           = Column(Integer, primary_key=True, index=True)
    report_type  = Column(String(200))
    division     = Column(String(100))
    workflowType = Column(String(200))
    initiator    = Column(String(150))
    approver1    = Column(String(150))
    approver2    = Column(String(150))
    approver3    = Column(String(150))
    approver4    = Column(String(150))


# ── Advance Workflow ──────────────────────────────────────────────────────────
class AdvanceWorkflow(Base):
    __tablename__ = "advance_workflows"

    id           = Column(Integer, primary_key=True, index=True)
    advance_type = Column(String(200))
    initiator    = Column(String(150))
    approver1    = Column(String(150))
    approver2    = Column(String(150))
    approver3    = Column(String(150))
    approver4    = Column(String(150))


# ── Change Request ────────────────────────────────────────────────────────────
class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id             = Column(Integer, primary_key=True, index=True)
    cr_number      = Column(String(50), unique=True)
    division       = Column(String(100))
    change_type    = Column(String(100))
    description    = Column(Text)
    raised_by      = Column(String(150))
    raised_on      = Column(DateTime, default=datetime.utcnow)
    effective_from = Column(DateTime, nullable=True)
    status         = Column(String(50), default="Open")


# ── Division Master ───────────────────────────────────────────────────────────
class DivisionMaster(Base):
    __tablename__ = "division_master"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    div_name    = Column(String(50), nullable=False, unique=True)
    div_code    = Column(String(50), nullable=False)
    status      = Column(Integer, default=1)
    created_at  = Column(DateTime, server_default=func.now())
    created_by  = Column(String(100))
    modified_at = Column(DateTime, onupdate=func.now())
    modified_by = Column(String(100))

    level_grade_mappings = relationship("LevelGradeMapping", back_populates="division")


# ── Level Master ──────────────────────────────────────────────────────────────
class LevelMaster(Base):
    __tablename__ = "level_master"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    level_name  = Column(String(50), nullable=False)  
    level_code  = Column(String(50), nullable=False)
    status      = Column(Integer, default=1)
    created_at  = Column(DateTime, server_default=func.now())
    created_by  = Column(String(100))
    modified_at = Column(DateTime, onupdate=func.now())
    modified_by = Column(String(100))

    level_grade_mappings = relationship("LevelGradeMapping", back_populates="level")


# ── Grade Master ──────────────────────────────────────────────────────────────
class GradeMaster(Base):
    __tablename__ = "grade_master"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    grade_name  = Column(String(50), nullable=False)   # "E", "F", "E+" etc.
    grade_code  = Column(String(50), nullable=False)
    status      = Column(Integer, default=1)
    created_at  = Column(DateTime, server_default=func.now())
    created_by  = Column(String(100))
    modified_at = Column(DateTime, onupdate=func.now())
    modified_by = Column(String(100))

    level_grade_mappings = relationship("LevelGradeMapping", back_populates="grade")


# ── Level Grade Mapping ───────────────────────────────────────────────────────
# Key table — each row = one valid Division + Level + Grade combo.
# SamplingEntitlement points to this, so amounts are division-specific.
class LevelGradeMapping(Base):
    __tablename__ = "level_grade_mapping"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status      = Column(Integer, default=1)
    created_at  = Column(DateTime, server_default=func.now())
    created_by  = Column(String(100))
    modified_at = Column(DateTime, onupdate=func.now())
    modified_by = Column(String(100))

    div_id = Column(Integer, ForeignKey("division_master.id"), nullable=False)
    lvl_id = Column(Integer, ForeignKey("level_master.id"),    nullable=False)
    grd_id = Column(Integer, ForeignKey("grade_master.id"),    nullable=False)

    division = relationship("DivisionMaster", back_populates="level_grade_mappings")
    level    = relationship("LevelMaster",    back_populates="level_grade_mappings")
    grade    = relationship("GradeMaster",    back_populates="level_grade_mappings")

    sampling_entitlements = relationship("SamplingEntitlement", back_populates="level_grade_mapping")


# ── Sampling Entitlement ──────────────────────────────────────────────────────
# Division isolation happens through level_grade_mapping.div_id.
# Editing Corporate's amount only touches rows linked to Corporate's mapping.
class SamplingEntitlement(Base):
    __tablename__ = "sampling_entitlement"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    amount      = Column(String(50), nullable=False)
    status      = Column(Integer, default=1)
    created_at  = Column(DateTime, server_default=func.now())
    created_by  = Column(String(100))
    modified_at = Column(DateTime, onupdate=func.now())
    modified_by = Column(String(100))

    lvl_grd_id = Column(Integer, ForeignKey("level_grade_mapping.id"), nullable=False)

    level_grade_mapping = relationship("LevelGradeMapping", back_populates="sampling_entitlements")