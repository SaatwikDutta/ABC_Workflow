#databse.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DB URL missing")

engine=create_engine(DATABASE_URL)
sessionLocal=sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()