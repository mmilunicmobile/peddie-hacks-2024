from pydantic import BaseModel

# A simple structure used for passing arguments into Mongo.
class User(BaseModel):
    name: str
    score: int

