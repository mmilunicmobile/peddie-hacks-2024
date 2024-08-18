from typing import List

def individual_serial(user) -> dict:
    return {
        "id": str(user["_id"]),
        "userid": user["id"],
        "name": user["name"],
        "score": user["score"]
    }

def list_serial(users) -> List[dict]:
    return [individual_serial(user) for user in users]