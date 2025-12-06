from pydantic import BaseModel, Field

class UpdateUser(BaseModel):
    password: str = Field(..., min_length=6)

UserType = {
    0:"Admin",
    1:"Visitor"
}