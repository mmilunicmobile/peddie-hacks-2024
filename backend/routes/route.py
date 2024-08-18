from fastapi import APIRouter, HTTPException
from database import collection_name, db, client
from models.user import User
from schemas import list_serial
from bson import ObjectId

router = APIRouter()

@router.get("/getuser/{userID}")
async def get_user(userID: int):
    user = list_serial(collection_name.find(dict({"userid": userID})))
    return user
    

@router.post("/postscore")
async def post_userScore(user: User):
    collection_name.insert_one(dict(user))

@router.get("/leaderboard")
async def get_leaderboard():
    leaderboard = list_serial(collection_name.find().sort("score", -1))
    return leaderboard