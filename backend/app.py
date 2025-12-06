import logging, os
from uuid import UUID
from fastapi import FastAPI, Depends, Query
from psycopg import connect
from contextlib import asynccontextmanager

from modules.auth import login, register
from modules.locations import create_location, get_all_locations, get_location_by_id, update_location, delete_location, search_locations, get_nearby_locations, mark_location_found
from models.auth import UserAuth
from models.locations import LocationCreate, LocationUpdate
from modules.user import get_user, delete_user
from modules.progress import progress_check

from utils.db import get_db

# Development specific
from dotenv import load_dotenv
load_dotenv(".env")

PORT = int(os.getenv('PORT', 8000))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with connect(os.getenv("CONN_STR", ""), autocommit=True) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        email VARCHAR(255) UNIQUE NOT NULL,
                        type INT NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        found_locs UUID[] DEFAULT ARRAY[]::UUID[]
                    );
                """)
                logger.info("Database initialized: 'users' table checked.")

                cur.execute("""
                    CREATE TABLE IF NOT EXISTS locations (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name VARCHAR(255) NOT NULL,
                        upload_date DATE DEFAULT CURRENT_DATE,
                        description TEXT,
                        long_description TEXT,
                        latitude DOUBLE PRECISION NOT NULL,
                        longitude DOUBLE PRECISION NOT NULL,
                        is_secret BOOLEAN DEFAULT FALSE,
                        created_by UUID REFERENCES users(id),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                logger.info("Database initialized: 'locations' table checked.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    yield

app = FastAPI(lifespan=lifespan, docs_url="/api/v1/docs")


@app.post("/api/v1/login", tags=["auth"])
def login_ep(data:UserAuth, conn = Depends(get_db)):
    return login(data,conn)

@app.post("/api/v1/register", tags=["auth"])
def register_ep(data: UserAuth, conn=Depends(get_db)):
    return register(data, conn)

# Progress endpoints
@app.get("/api/v1/progress", tags=["progress"])
def get_progress(user_id: UUID, conn=Depends(get_db)):
    return progress_check(user_id, conn)

# User endpoints
@app.get("/api/v1/user/{user_id}", tags=["user"])
def get_user_ep(user_id: UUID, conn = Depends(get_db)):
    return get_user(user_id, conn)

@app.delete("/api/v1/user/{user_id}", tags=["user"])
def del_user_ep(user_id: UUID, conn = Depends(get_db)):
    return delete_user(user_id, conn)


# Location endpoints
@app.post("/api/v1/locations", tags=["locations"])
def create_location_ep(data: LocationCreate, conn=Depends(get_db)):
    return create_location(data, conn)


@app.get("/api/v1/locations", tags=["locations"])
def get_locations_ep(
    include_secret: bool = Query(False),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    conn=Depends(get_db)
):
    return get_all_locations(conn, include_secret, limit, offset)


@app.get("/api/v1/locations/search", tags=["locations"])
def search_locations_ep(
    q: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=200),
    conn=Depends(get_db)
):
    return search_locations(q, conn, limit)


@app.get("/api/v1/locations/nearby", tags=["locations"])
def get_nearby_locations_ep(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(5.0, ge=0.1, le=100),
    limit: int = Query(50, ge=1, le=200),
    conn=Depends(get_db)
):
    return get_nearby_locations(lat, lng, radius, conn, limit)


@app.get("/api/v1/locations/{location_id}", tags=["locations"])
def get_location_ep(location_id: UUID, conn=Depends(get_db)):
    return get_location_by_id(location_id, conn)


@app.put("/api/v1/locations/{location_id}", tags=["locations"])
def update_location_ep(location_id: UUID, data: LocationUpdate, conn=Depends(get_db)):
    return update_location(location_id, data, conn)


@app.delete("/api/v1/locations/{location_id}", tags=["locations"])
def delete_location_ep(location_id: UUID, conn=Depends(get_db)):
    return delete_location(location_id, conn)

@app.patch("/api/v1/locations/{location_id}/found", tags=["locations"])
def mark_location_as_found(location_id: UUID, user_id: UUID, conn=Depends(get_db)):
    return mark_location_found(location_id, user_id, conn)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
