# Import FastAPI for backend server communication
import fastapi
from pydantic import BaseModel
from enum import Enum
import abjad

# Create FastAPI app
app = fastapi.FastAPI()

class NoteType(Enum):
    QUARTER = "quarter"
    EIGHTH = "eighth"
    SIXTEENTH = "sixteenth"
    TRIPLET = "triplet"

class Note(BaseModel):
    noteType: NoteType

    


# Define default root route
@app.get("/")
async def root():
    return {"message": "Hello World"}