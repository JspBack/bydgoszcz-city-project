import os

from fastapi import HTTPException
from utils.hash import get_password_hash


def create_default_admin(conn):
    email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@city.gov")
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")

    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        exists = cur.fetchone()

        if exists:
            return

        cur.execute(
            """
            INSERT INTO users (email, password_hash, is_admin)
            VALUES (%s, %s, TRUE)
            """,
            (email, get_password_hash(password)),
        )


def ensure_admin(user_id: str, conn):
    with conn.cursor() as cur:
        cur.execute("SELECT is_admin FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="User not found")

        if row[0] is not True:
            raise HTTPException(status_code=403, detail="Admin privileges required")


def set_admin(target_id: str, acting_admin_id: str, make_admin: bool, conn):
    ensure_admin(acting_admin_id, conn)  # sprawdza czy wywołujący jest adminem

    if target_id == acting_admin_id:
        raise HTTPException(
            status_code=400, detail="Admin cannot change their own admin status"
        )

    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE id = %s", (target_id,))
        if cur.fetchone() is None:
            raise HTTPException(status_code=404, detail="Target user not found")

        cur.execute(
            "UPDATE users SET is_admin = %s WHERE id = %s",
            (make_admin, target_id),
        )

    return {"message": "Admin rights updated", "is_admin": make_admin}
