from fastapi import APIRouter, HTTPException
import database 
from models.user import User
from schemas import list_serial
from bson import ObjectId
from enum import Enum

router = APIRouter()

levelCollections = {
    0: database.one_collection,
    1: database.two_collection,
    2: database.three_collection,
    3: database.four_collection,
    4: database.five_collection,
    5: database.endless_collection
}

@router.get("/getuser/{level}/{username}")
async def get_user(username: str, level: int):
    user = list_serial(levelCollections[level].find(dict({"username": username})))
    return user
    

@router.post("/postscore/{level}")
async def post_userScore(user: User, level:int):
    levelCollections[level].insert_one(dict(user))

@router.get("/leaderboard/{level}/{username}")
async def get_leaderboard(level: int, username:str):
    leaderboard = list_serial(levelCollections[level].find().sort("score", -1))
    # for x in range(len(leaderboard)):
    #     if(leaderboard[x].find(username) != -1):
    #         leaderboard.insert(10, leaderboard[x])
    del leaderboard[10:]
    return leaderboard