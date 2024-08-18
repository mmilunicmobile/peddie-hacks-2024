from fastapi import APIRouter, HTTPException
import database 
from models.user import User
from schemas import list_serial
from bson import ObjectId
from enum import Enum
import jwt

router = APIRouter()

levelCollections = {
    1: database.one_collection,
    2: database.two_collection,
    3: database.three_collection,
    4: database.four_collection,
    5: database.five_collection,
    6: database.endless_collection
}

@router.get("/getuser/{level}/{username}")
async def get_user(username: str, level: int):
    user = list_serial(levelCollections[level].find(dict({"username": username})))
from dotenv import load_dotenv
import os

router = APIRouter()

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET', 'your_jwt_secret')

@router.get("/getuser/{userID}")
async def get_user(userID: int):
    user = list_serial(levelCollections[level].find(dict({"userid": userID})))
    return user

@router.post("/postscore/{level}")
async def post_userScore(token: str, level: int, score: int):
    decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user_data = {
        'login': decoded['login'],
        'user_id': decoded['user_id']
    }
    user = User(name=user_data['login'], score=score)
    userEntry = levelCollections[level].find_one({'name': user.name})
    if userEntry:
        if user.score > userEntry.get('score'):
            levelCollections[level].update_one({'name': user.name}, {'$set': {'score': user.score}}, upsert=True)
    else:
        levelCollections[level].update_one({'name': user.name}, {'$set': {'score': user.score}}, upsert=True)

    
    return

@router.get("/leaderboard/{level}/{username}")
async def get_leaderboard(level: int, username:str):
    leaderboard = list_serial(levelCollections[level].find().sort("score", -1))
    # for x in range(len(leaderboard)):
    #     if(leaderboard[x].find(username) != -1):
    #         leaderboard.insert(10, leaderboard[x])
    del leaderboard[10:]
    return leaderboard