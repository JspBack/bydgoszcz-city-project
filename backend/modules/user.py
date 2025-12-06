from uuid import UUID
from psycopg import Connection
from fastapi import  HTTPException, status
from fastapi.responses import JSONResponse
from models.user import UserType

def get_user(id: UUID, conn:Connection):
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, created_at, type FROM users WHERE id = %s", 
                (id,)
            )
            user = cur.fetchone()

            if user is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            return JSONResponse(
                        status_code=status.HTTP_200_OK,
                        content={
                        "id": str(user[0]),         
                        "email": user[1],
                        "created_at": str(user[2]),
                        "type": UserType[user[3]]
                        }
                    )

    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

def delete_user(id: UUID, conn:Connection):
    try:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM users WHERE id = %s RETURNING id", 
                (id,)
            )
            deleted_row = cur.fetchone()

            if deleted_row is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": f"User {id} deleted successfully"}
            )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
