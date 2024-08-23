from pymongo.mongo_client import MongoClient
import os

# Connect to MongoDP through Pymongo
client = MongoClient(os.getenv("MONGO_DATABASE"))

# Connect to the leaderboard database.
db = client.leaderboard_db


# Level leaderboard connections.
one_collection = None; # db["level1_leaderboard"]
two_collection = None; # db["level2_leaderboard"]
three_collection = None; # db["level3_leaderboard"]
four_collection = None; # db["level4_leaderboard"]
five_collection = None; # db["level5_leaderboard"]
endless_collection = None; # db["endless_leaderboard"]
