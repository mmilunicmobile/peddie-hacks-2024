from pymongo.mongo_client import MongoClient
import os

# Connect to MongoDP through Pymongo
client = MongoClient("mongodb+srv://admin:IqDQW99dMffFm3se@cluster0.ljqdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Connect to the leaderboard database.
db = client.leaderboard_db


# Level leaderboard connections.
one_collection = db["level1_leaderboard"]
two_collection = db["level2_leaderboard"]
three_collection = db["level3_leaderboard"]
four_collection = db["level4_leaderboard"]
five_collection = db["level5_leaderboard"]
endless_collection = db["endless_leaderboard"]
