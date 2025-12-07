import base64
from io import BytesIO
from uuid import UUID

import qrcode
from fastapi import status
from fastapi.responses import JSONResponse
from psycopg import Connection
from utils.hash import decode, encode
from modules.achievements import check_and_unlock_achievements


def scan(hashed_id: str, user_id: UUID, conn: Connection):
    try:
        id = decode(hashed_id)
        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM locations WHERE id = %s", (id,))
            location = cur.fetchone()
            if location is None:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={"error": "Location not found"}
                )

            cur.execute(
                "SELECT %s = ANY(found_locs) FROM users WHERE id = %s",
                (location[0], str(user_id))
            )
            already_found = cur.fetchone()
            if already_found and already_found[0]:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "message": "Location already found",
                        "location_name": location[1],
                        "new_achievements": []
                    }
                )

            # Add location to user's found locations
            cur.execute(
                """UPDATE users SET found_locs = array_append(found_locs, %s) WHERE id = %s""",
                (location[0], str(user_id)),
            )
            conn.commit()

        # Check for newly unlocked achievements
        new_achievements = check_and_unlock_achievements(user_id, conn)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Location scanned successfully",
                "location_name": location[1],
                "new_achievements": new_achievements
            },
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )


def generate_qr_for_location(location_id: UUID) -> str:
    try:
        encrypted_id = encode(str(location_id))

        qr = qrcode.make(encrypted_id)
        buffer = BytesIO()

        qr.save(buffer, format="PNG")
        qr_bytes = buffer.getvalue()

        qr_base64 = base64.b64encode(qr_bytes).decode()

        return qr_base64
    except Exception as e:
        raise Exception(f"Failed to generate QR code: {e}")
