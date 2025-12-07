from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class Achievement(BaseModel):
    id: UUID
    name: str
    description: str
    threshold: int


class UserAchievement(BaseModel):
    user_id: UUID
    achievement_id: UUID
    unlocked_at: datetime
