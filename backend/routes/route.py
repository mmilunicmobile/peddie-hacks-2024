from fastapi import APIRouter, HTTPException
import database 
from models.user import User
from schemas import list_serial
from bson import ObjectId
from enum import Enum
import jwt

router = APIRouter()

#Database references for level leaderboards.
levelCollections = {
    1: database.one_collection,
    2: database.two_collection,
    3: database.three_collection,
    4: database.four_collection,
    5: database.five_collection,
    6: database.endless_collection
}

# Load the JWT_SECRET from the .env file.
load_dotenv()
JWT_SECRET = os.getenv('JWT_SECRET', 'your_jwt_secret')

#A simple get request if we need one.
@router.get("/getuser/{level}/{username}")
async def get_user(username: str, level: int):
    user = list_serial(levelCollections[level].find(dict({"username": username})))
from dotenv import load_dotenv
import os

#A method to post scores that overwrites past scores if the submitted one is higher.
@router.post("/postscore/{level}")
async def post_userScore(token: str, level: int, score: int):
    decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user_data = {
        'login': decoded['login'],
        'user_id': decoded['user_id']
    }

    #Find and replace past scores if higher.
    user = User(name=user_data['login'], score=score)
    userEntry = levelCollections[level].find_one({'name': user.name})
    if userEntry:
        if user.score > userEntry.get('score'):
            levelCollections[level].update_one({'name': user.name}, {'$set': {'score': user.score}}, upsert=True)
    else:
        levelCollections[level].update_one({'name': user.name}, {'$set': {'score': user.score}}, upsert=True)

    
    return

#A method to retrieve the top ten users of a leaderboard.
@router.get("/leaderboard/{level}/{username}")
async def get_leaderboard(level: int, username:str):
    leaderboard = list_serial(levelCollections[level].find().sort("score", -1))
    del leaderboard[10:]
    return leaderboard