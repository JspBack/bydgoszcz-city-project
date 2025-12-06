import base64
from io import BytesIO
from uuid import UUID

import qrcode
from fastapi import status
from fastapi.responses import JSONResponse
from psycopg import Connection
from utils.hash import decode, encode


def scan(hashed_id: str, user_id: UUID, conn: Connection):
    try:
        id = decode(hashed_id)
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM locations WHERE id = %s", (id,))
            location = cur.fetchone()
            if location is None:
                return {"error": "Location not found"}

            cur.execute(
                """UPDATE users SET found_locs = array_append(found_locs, %s) WHERE id = %s""",
                (location[0], str(user_id)),
            )

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Location scanned successfully"},
            )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )


def generate_qr_for_location(location_id: str) -> str:
    try:
        encrypted_id = encode(location_id)

        qr = qrcode.make(encrypted_id)
        buffer = BytesIO()

        qr.save(buffer, format="PNG")
        qr_bytes = buffer.getvalue()

        qr_base64 = base64.b64encode(qr_bytes).decode()

        return qr_base64
    except Exception as e:
        raise Exception(f"Failed to generate QR code: {e}")
