from pydantic import BaseModel, Field, EmailStr

class UserAuth(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
