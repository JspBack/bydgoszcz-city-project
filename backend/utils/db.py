import os
from fastapi import  HTTPException
from psycopg import connect

def get_db():
    try:
        with connect(os.getenv("CONN_STR",""), autocommit=True) as conn:
            yield conn
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database connection failed")