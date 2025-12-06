from fastapi import  HTTPException, status
from fastapi.responses import JSONResponse
from psycopg import errors, Connection

from utils.hash import get_password_hash, verify_password
from models.auth import UserAuth

def register(user: UserAuth, conn: Connection):
    hashed_pwd = get_password_hash(user.password)
    
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id, email",
                (user.email, hashed_pwd)
            )

            new_user = cur.fetchone()                    

            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "message": "User registered successfully",
                    "user_id": str(new_user[0]), # type: ignore
                    "email": new_user[1] # type: ignore
                }
            )

    except errors.UniqueViolation:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def login(user: UserAuth, conn: Connection):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, email, password_hash FROM users WHERE email = %s", 
            (user.email,)
        )
        record = cur.fetchone()

    if not record:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id, email, stored_hash = record

    if not verify_password(user.password, stored_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Login successful", 
            "user_id": str(user_id), 
            "email": email
        }
    )