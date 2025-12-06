from uuid import UUID
from psycopg import Connection

def progress_check(user_id: UUID, conn: Connection):
    with conn.cursor() as cur:
        cur.execute("SELECT found_locs FROM users WHERE id = %s;", (str(user_id),))
        result = cur.fetchone()
        if result is None:
            return {"error": "User not found"}, 404
        
        found_locations = result[0] if result[0] is not None else []
        
        cur.execute("SELECT COUNT(*) FROM locations;")
        total_locations = cur.fetchone()[0] # type: ignore
        
        progress = {
            "user_id": str(user_id),
            "found_locations_count": len(found_locations),
            "total_locations_count": total_locations,
            "found_locations": [str(loc_id) for loc_id in found_locations],
            "progress_percentage": (len(found_locations) / total_locations * 100) if total_locations > 0 else 0
        }
        
        return progress