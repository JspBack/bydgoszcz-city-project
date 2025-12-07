import logging
import os
from contextlib import asynccontextmanager
from uuid import UUID

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from models.auth import AuthRegister, AuthLogin
from models.locations import LocationCreate, LocationUpdate
from modules.auth import login, register
from modules.locations import (
    create_location,
    delete_location,
    get_all_locations,
    get_location_by_id,
    get_nearby_locations,
    mark_location_found,
    search_locations,
    update_location,
)
from modules.achievements import get_user_achievements, seed_achievements
from modules.progress import progress_check
from modules.qr import scan
from modules.user import delete_user, get_user
from psycopg import connect
from utils.db import get_db

load_dotenv()

PORT = int(os.getenv("PORT", 8000))

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
                        username VARCHAR(15) UNIQUE NOT NULL,
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
                        category VARCHAR(100),
                        zone VARCHAR(100) NOT NULL
                    );
                """)
                logger.info("Database initialized: 'locations' table checked.")

                cur.execute("""
                        CREATE TABLE IF NOT EXISTS achievements (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            threshold INT NOT NULL UNIQUE
                        );
                    """)
                logger.info("Database initialized: 'achievements' table checked.")

                cur.execute("""
                        CREATE TABLE IF NOT EXISTS user_achievements (
                            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                            achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
                            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (user_id, achievement_id)
                        );
                    """)
                logger.info("Database initialized: 'user_achievements' table checked.")

            # Seed achievements
            seed_achievements(conn)
            logger.info("Achievements seeded.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    yield


app = FastAPI(lifespan=lifespan, docs_url="/api/v1/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


@app.post("/api/v1/login", tags=["auth"])
def login_ep(data: AuthLogin, conn=Depends(get_db)):
    return login(data, conn)


@app.post("/api/v1/register", tags=["auth"])
def register_ep(data: AuthRegister, conn=Depends(get_db)):
    return register(data, conn)


# Qr endpoints
@app.post("/api/v1/scan", tags=["qr"])
def scan_qr(hashed_id: str, user_id: UUID, conn=Depends(get_db)):
    return scan(hashed_id, user_id, conn)


# Progress endpoints
@app.get("/api/v1/progress", tags=["progress"])
def get_progress(user_id: UUID, conn=Depends(get_db)):
    return progress_check(user_id, conn)


# User endpoints
@app.get("/api/v1/user/{user_id}", tags=["user"])
def get_user_ep(user_id: UUID, conn=Depends(get_db)):
    return get_user(user_id, conn)


@app.delete("/api/v1/user/{user_id}", tags=["user"])
def del_user_ep(user_id: UUID, conn=Depends(get_db)):
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
    conn=Depends(get_db),
):
    return get_all_locations(conn, include_secret, limit, offset)


@app.get("/api/v1/locations/search", tags=["locations"])
def search_locations_ep(
    q: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=200),
    conn=Depends(get_db),
):
    return search_locations(q, conn, limit)


@app.get("/api/v1/locations/nearby", tags=["locations"])
def get_nearby_locations_ep(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(5.0, ge=0.1, le=100),
    limit: int = Query(50, ge=1, le=200),
    conn=Depends(get_db),
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

# Achievement endpoints
@app.get("/api/v1/achievements/{user_id}", tags=["achievements"])
def get_achievements_ep(user_id: UUID, conn=Depends(get_db)):
    return get_user_achievements(user_id, conn)



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
