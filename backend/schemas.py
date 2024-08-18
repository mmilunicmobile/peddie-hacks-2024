from typing import List

def individual_serial(user) -> dict:
    return {
        "id": str(user["_id"]),
        "userid": user["id"],
        "name": user["name"],
        "score": user["score"]
    }

def list_serial(items):
    serialized_items = []
    for item in items:
        item['_id'] = str(item['_id'])
        serialized_items.append(item)
    return serialized_items