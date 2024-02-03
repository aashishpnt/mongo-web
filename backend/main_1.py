from fastapi import FastAPI, HTTPException
from Models import UserDetail
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

MONOGODB_URI = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONOGODB_URI)
db = client.admin

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
