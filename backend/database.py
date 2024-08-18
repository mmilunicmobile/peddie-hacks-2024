from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
import os

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL')

client = MongoClient("mongodb+srv://admin:IqDQW99dMffFm3se@cluster0.ljqdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.leaderboard_db

one_collection = db["level1_leaderboard"]
two_collection = db["level2_leaderboard"]
three_collection = db["level3_leaderboard"]
four_collection = db["level4_leaderboard"]
five_collection = db["level5_leaderboard"]
endless_collection = db["endless_leaderboard"]



# Probably not the best idea to hardcode database credentials. I would recommend using something like .env (esp since I've alr used it in the auth
# section) nevermind, I just did it for you