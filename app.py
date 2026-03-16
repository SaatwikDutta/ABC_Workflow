#app.py

from fastapi import FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from Api.database_models import Base
from Api.database import engine
from Api.routers import auth, workflow, entitlement, users

security = HTTPBearer()

app = FastAPI(
    title="Happay Support App",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True}
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(workflow.router)
app.include_router(entitlement.router)
app.include_router(users.router)


@app.get("/")
def home():
    return "Support App is running!"