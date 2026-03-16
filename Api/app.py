import pandas as pd
import uvicorn 
from fastapi import FastAPI,HTTPException , Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from Database.db import SessionLocal, engine ,Base
import Database_Models.models as models
import Database_Schema.schema as schema


# Load .env only for local development

app = FastAPI()

# DEPENDENCY----
def get_db():
    db=SessionLocal() # open a new session for this request
    try:
        yield db  # give the session to the route function
    finally:
        db.close() # always close the session after request is done
# the above function is basically used in FASTAPI to ensure that every request gets it's own session and it's properly closed

# cors to connect client and api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ your React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# ─── HELPER: clean Excel cell values ─────────────────────────────────────────
def clean_value(value):
    if pd.isna(value):
        return None          # turn NaN into None (DB-friendly null)
    return str(value).strip() # remove extra whitespace



# with app.app_context():
#     db.create_all()



# First uploading the division excel file
# @app.post("/divisions/seed",response_model=list[schema.DivisionReponse])
# async def seed_divisions(db:Session = Depends(get_db)):
#     # First read the file 
#     try:
#         df = pd.read_excel("Divisions.xlsx")

#         # remove extra space
#         df.columns = df.columns.str.strip()

#         added = [] # track what we inserted

#         #iterate through excel row wise
#         for _,row in df.iterrows():
#             #removing white spce and handling NaN
#             division_name = clean_value(row["Division name"])

#             if not division_name:
#                 continue
            
#             # check if the divisions is already exists or not
#             existing = db.query(models.Divisions).filter(models.Divisions.division_name == division_name).first()
            
#             if existing:
#                 continue

#             new_division = models.Divisions(division_name = division_name)

#             db.add(new_division)
#             added.append(new_division)

#         db.commit()

#         for division in added:
#             db.refresh(division)

#         return added
#     except Exception as e:
#         db.rollback() # undo everything if any goes wrong 
#         raise HTTPException(status_code=500 , detail =f"Failed to seed division:{str(e)}")

# # The fetch the division from backend
    
# @app.get("/divisions",response_model=list[schema.DivisionReponse])
# # making session for this particular function 
# async def fetch_division(db:Session = Depends(get_db)):
    
#     divisions = db.query(models.Divisions).all()
#     # select all divisions
#     if not divisions:
#         raise HTTPException(status_code=404 , detail="No division found in the database")
#     return divisions
    


    
# @app.route("/")
# def home():
#     return "✅ Flask is working excellent!"


if __name__ == '__main__':
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
