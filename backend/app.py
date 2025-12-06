import logging, os
from modules.auth import login, register
from fastapi import FastAPI, Depends
from psycopg import connect
from contextlib import asynccontextmanager
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
                        id SERIAL PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                logger.info("Database initialized: 'users' table checked.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    yield

app = FastAPI(lifespan=lifespan, docs_url="/api/v1/docs")


@app.post("api/v1/login", tags=["auth"])
def login_ep(data, conn = Depends(get_db)):
    login(data,conn)

@app.post("api/v1/register", tags=["auth"])
def register_ep(data,conn = Depends(get_db)):
    register(data,conn)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
