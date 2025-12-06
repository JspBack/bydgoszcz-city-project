import os
from psycopg import connect

from dotenv import load_dotenv
load_dotenv()

def get_db():
    conn = connect(os.getenv("CONN_STR", ""), autocommit=True)
    try:
        yield conn
    finally:
        conn.close()