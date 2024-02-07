from fastapi import FastAPI, HTTPException
from Models import UserDetail
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
import jwt


SECRET_KEY = "nepal123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

dummy_user = {
    "username": "aashish",
    "password": "123456",
}

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
MONGO_URI = "mongodb+srv://kaustubniraula999:g2cnkEI8yt9GkfaF@cluster0.hysfwcm.mongodb.net/"
MONOGODB_URI_LOCALHOST = "mongodb://localhost:27017"
main_client = AsyncIOMotorClient(MONGO_URI)
client = AsyncIOMotorClient(MONOGODB_URI_LOCALHOST)

db = client.admin

class Loginclass(BaseModel):
   username: str
   password: str
    
@app.get("/databases")
async def get_databases():
    try:
        # Fetch the list of databases
        # admin_db = client.admin
        databases = await client.list_database_names()

        return {"databases": databases}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/collections/{database_name}")
async def get_collections(database_name: str):
    try:
        # Fetch the list of collections for a specific database
        db = client[database_name]
        collections = await db.list_collection_names()

        return {"collections": collections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/login")
async def login_user(login_item: Loginclass):
    data = jsonable_encoder(login_item)
    if dummy_user["username"] == data["username"] and dummy_user["password"] == data["password"]:
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return {'token':encoded_jwt}
    else:
        return {'message':'login failed'}