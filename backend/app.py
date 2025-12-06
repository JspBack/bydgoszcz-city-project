# from modules.auth import .
import logging, os
from fastapi import FastAPI

PORT = int(os.getenv('PORT', 8000))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
