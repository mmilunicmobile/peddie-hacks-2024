from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
import requests
import os
from dotenv import load_dotenv
import jwt
import datetime
import logging

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get GitHub OAuth app credentials from environment variables
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
JWT_SECRET = os.getenv('JWT_SECRET', 'your_jwt_secret')

@router.get("/")
def home():
    return {"message": "Welcome to the GitHub OAuth App"}

@router.get("/login")
def login():
    github_authorize_url = f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}"
    return RedirectResponse(github_authorize_url)

@router.get("/callback")
def callback(request: Request):
    code = request.query_params.get('code')
    if not code:
        raise HTTPException(status_code=400, detail="Error: No code provided")

    token_url = 'https://github.com/login/oauth/access_token'
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    token_response = requests.post(token_url, data=token_data, headers=headers)
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    if not access_token:
        raise HTTPException(status_code=400, detail="Error: No access token received")

    user_info_url = 'https://api.github.com/user'
    user_info_response = requests.get(user_info_url, headers={'Authorization': f'token {access_token}'})
    user_info = user_info_response.json()
    print(user_info)
    user_id = user_info.get('id')
    username = user_info.get('login')

    # Generate JWT
    payload = {
        'login': user_info['login'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    # Set JWT in cookie
    response = RedirectResponse(url='http://localhost:4321')
    response.set_cookie(key='jwt', value=token, httponly=True, secure=True)
    response.set_cookie(key='user_id', value=str(user_id), httponly=True, secure=True)
    response.set_cookie(key='username', value=str(username), httponly=True, secure=True)

    return response

@router.get("/verify-token")
def verify_token(request: Request):
    token = request.cookies.get('jwt')
    if not token:
        raise HTTPException(status_code=401, detail="No token found")
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return JSONResponse(content=decoded)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")