from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class LocationCreate(BaseModel):
    name: str
    description: str
    long_description: Optional[str] = None
    latitude: float
    longitude: float
    is_secret: bool = False
    category: str = "general"


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_secret: Optional[bool] = None
    category: Optional[str] = None


class Location(BaseModel):
    id: UUID
    name: str
    upload_date: date
    description: str
    long_description: Optional[str]
    latitude: float
    longitude: float
    is_secret: bool
    category: str
