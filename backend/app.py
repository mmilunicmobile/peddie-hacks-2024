# Import FastAPI for backend server communication
import fastapi
import ly
from pydantic import BaseModel

# Create FastAPI app
app = fastapi.FastAPI()


# Define default root route
@app.get("/")
async def root():
    return {"message": "Hello World"}