from pydantic import BaseModel
from datetime import date


class Location(BaseModel):
    id: int
    name: str
    upload_date: date
    description: str
    long_description: str
    latitude: float
    longitude: float
    is_secret: bool