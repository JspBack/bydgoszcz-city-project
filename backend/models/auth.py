from pydantic import BaseModel, Field, EmailStr

class AuthRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=6)

class AuthLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
