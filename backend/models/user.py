from pydantic import BaseModel

class User(BaseModel):
    userid: int
    name: str
    score: int

