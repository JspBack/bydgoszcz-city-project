from psycopg import Connection
from fastapi.responses import JSONResponse
from fastapi import HTTPException, status
from typing import Optional
from uuid import UUID

from models.locations import LocationCreate, LocationUpdate


def create_location(loc: LocationCreate, conn: Connection, user_id: Optional[UUID] = None):
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO locations (name, description, long_description, latitude, longitude, is_secret, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name""",
                (loc.name, loc.description, loc.long_description, loc.latitude, loc.longitude, loc.is_secret, user_id)
            )
            new_location = cur.fetchone()

            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "message": "Location successfully created",
                    "location_id": str(new_location[0]), # type: ignore
                    "location_name": new_location[1] # type: ignore
                }
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def get_all_locations(conn: Connection, include_secret: bool = False, limit: int = 100, offset: int = 0):
    try:
        with conn.cursor() as cur:
            if include_secret:
                cur.execute(
                    """SELECT id, name, upload_date, description, long_description, latitude, longitude, is_secret, created_by
                    FROM locations
                    ORDER BY upload_date DESC
                    LIMIT %s OFFSET %s""",
                    (limit, offset)
                )
            else:
                cur.execute(
                    """SELECT id, name, upload_date, description, long_description, latitude, longitude, is_secret, created_by
                    FROM locations
                    WHERE is_secret = FALSE
                    ORDER BY upload_date DESC
                    LIMIT %s OFFSET %s""",
                    (limit, offset)
                )

            rows = cur.fetchall()

            locations = [
                {
                    "id": str(row[0]),
                    "name": row[1],
                    "upload_date": row[2].isoformat() if row[2] else None,
                    "description": row[3],
                    "long_description": row[4],
                    "latitude": row[5],
                    "longitude": row[6],
                    "is_secret": row[7],
                    "created_by": str(row[8]) if row[8] else None
                }
                for row in rows
            ]

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"locations": locations, "count": len(locations)}
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def get_location_by_id(location_id: UUID, conn: Connection):
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, name, upload_date, description, long_description, latitude, longitude, is_secret, created_by
                FROM locations
                WHERE id = %s""",
                (location_id,)
            )
            row = cur.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Location not found")

            location = {
                "id": str(row[0]),
                "name": row[1],
                "upload_date": row[2].isoformat() if row[2] else None,
                "description": row[3],
                "long_description": row[4],
                "latitude": row[5],
                "longitude": row[6],
                "is_secret": row[7],
                "created_by": str(row[8]) if row[8] else None
            }

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=location
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def update_location(location_id: UUID, loc: LocationUpdate, conn: Connection):
    try:
        update_fields = []
        values = []

        if loc.name is not None:
            update_fields.append("name = %s")
            values.append(loc.name)
        if loc.description is not None:
            update_fields.append("description = %s")
            values.append(loc.description)
        if loc.long_description is not None:
            update_fields.append("long_description = %s")
            values.append(loc.long_description)
        if loc.latitude is not None:
            update_fields.append("latitude = %s")
            values.append(loc.latitude)
        if loc.longitude is not None:
            update_fields.append("longitude = %s")
            values.append(loc.longitude)
        if loc.is_secret is not None:
            update_fields.append("is_secret = %s")
            values.append(loc.is_secret)

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        values.append(location_id)

        with conn.cursor() as cur:
            cur.execute(
                f"""UPDATE locations
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING id, name""",
                tuple(values)
            )
            updated = cur.fetchone()

            if not updated:
                raise HTTPException(status_code=404, detail="Location not found")

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "message": "Location updated successfully",
                    "location_id": str(updated[0]),
                    "location_name": updated[1]
                }
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def delete_location(location_id: UUID, conn: Connection):
    try:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM locations WHERE id = %s RETURNING id, name",
                (location_id,)
            )
            deleted = cur.fetchone()

            if not deleted:
                raise HTTPException(status_code=404, detail="Location not found")

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "message": "Location deleted successfully",
                    "location_id": str(deleted[0]),
                    "location_name": deleted[1]
                }
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def search_locations(query: str, conn: Connection, limit: int = 50):
    try:
        with conn.cursor() as cur:
            search_pattern = f"%{query}%"
            cur.execute(
                """SELECT id, name, upload_date, description, long_description, latitude, longitude, is_secret, created_by
                FROM locations
                WHERE (name ILIKE %s OR description ILIKE %s OR long_description ILIKE %s)
                AND is_secret = FALSE
                ORDER BY upload_date DESC
                LIMIT %s""",
                (search_pattern, search_pattern, search_pattern, limit)
            )

            rows = cur.fetchall()

            locations = [
                {
                    "id": str(row[0]),
                    "name": row[1],
                    "upload_date": row[2].isoformat() if row[2] else None,
                    "description": row[3],
                    "long_description": row[4],
                    "latitude": row[5],
                    "longitude": row[6],
                    "is_secret": row[7],
                    "created_by": str(row[8]) if row[8] else None
                }
                for row in rows
            ]

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"locations": locations, "count": len(locations), "query": query}
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


def get_nearby_locations(latitude: float, longitude: float, radius_km: float, conn: Connection, limit: int = 50):
    try:
        with conn.cursor() as cur:
            # Using Haversine formula approximation for distance calculation
            cur.execute(
                """SELECT id, name, upload_date, description, long_description, latitude, longitude, is_secret, created_by,
                (6371 * acos(cos(radians(%s)) * cos(radians(latitude)) * cos(radians(longitude) - radians(%s)) + sin(radians(%s)) * sin(radians(latitude)))) AS distance
                FROM locations
                WHERE is_secret = FALSE
                HAVING distance <= %s
                ORDER BY distance
                LIMIT %s""",
                (latitude, longitude, latitude, radius_km, limit)
            )

            rows = cur.fetchall()

            locations = [
                {
                    "id": str(row[0]),
                    "name": row[1],
                    "upload_date": row[2].isoformat() if row[2] else None,
                    "description": row[3],
                    "long_description": row[4],
                    "latitude": row[5],
                    "longitude": row[6],
                    "is_secret": row[7],
                    "created_by": str(row[8]) if row[8] else None,
                    "distance_km": round(row[9], 2)
                }
                for row in rows
            ]

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"locations": locations, "count": len(locations)}
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

def mark_location_found(location_id: UUID, user_id: UUID, conn: Connection):
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id FROM locations WHERE id = %s",
                (location_id,)
            )
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Location not found")

            cur.execute(
                """UPDATE users SET found_locs = array_append(found_locs, %s) WHERE id = %s""",
                (location_id, user_id)
            )

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": f"User {user_id} marked location {location_id} as found"}
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")