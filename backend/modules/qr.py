from psycopg import Connection
from fastapi import status
from fastapi.responses import JSONResponse
from utils.hash import encode, decode
from uuid import UUID

def scan(hashed_id: str, user_id: UUID, conn: Connection):
    try:
        id = decode(hashed_id)
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id FROM locations WHERE id = %s",
                (id,)
            )
            location = cur.fetchone()
            if location is None:
                return {"error": "Location not found"}
            
            cur.execute(
                """UPDATE users SET found_locs = array_append(found_locs, %s) WHERE id = %s""",
                (location[0], str(user_id))
            )

            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Location scanned successfully"})

    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)})