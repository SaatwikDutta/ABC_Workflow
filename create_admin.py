
#create_admin.py

from Api.database import sessionLocal, engine
from Api.database_models import User, Base
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)   

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── admin  credentials ─────────────────────
ADMIN_NAME        = "Neil"
ADMIN_EMAIL       = "TIC@company.com"
ADMIN_EMPLOYEE_ID = "EMP002"
ADMIN_PASSWORD    = "Password@123"
ADMIN_DIVISION    = "Corporate"


db = sessionLocal()

existing = db.query(User).filter(User.employee_id == ADMIN_EMPLOYEE_ID).first()
if existing:
    print(f"Admin with employee ID {ADMIN_EMPLOYEE_ID} already exists. So, Skipping...")
else:
    admin = User(
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        employee_id=ADMIN_EMPLOYEE_ID,
        password=password_context.hash(ADMIN_PASSWORD), 
        division=ADMIN_DIVISION,
        role="admin"
    )
    db.add(admin)
    db.commit()
    print(f"✅ Admin account created for {ADMIN_NAME} ({ADMIN_EMPLOYEE_ID})")

db.close()