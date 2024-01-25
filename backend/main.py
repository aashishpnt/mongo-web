# main.py
from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()


from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://aashishpnt:helloworld@cluster0.4rudedc.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
    
    
# origins = ["http://localhost:3000"]  # Update with your React app's address

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/signup")
# async def signup(user_data: dict):  # Add appropriate validation with Pydantic model
#     # Connect to MongoDB
#     client = AsyncIOMotorClient("mongodb://localhost:27017")
#     db = client["your_database_name"]
#     users_collection = db["users"]

#     # Perform signup logic (insert user_data into MongoDB)
#     result = await users_collection.insert_one(user_data)
#     return {"message": "User signed up successfully", "user_id": str(result.inserted_id)}

# @app.post("/login")
# async def login(login_data: dict):  # Add appropriate validation with Pydantic model
#     # Connect to MongoDB
#     client = AsyncIOMotorClient("mongodb://localhost:27017")
#     db = client["your_database_name"]
#     users_collection = db["users"]

#     # Perform login logic (query MongoDB with login_data)
#     user = await users_collection.find_one(login_data)
#     if user:
#         return {"message": "Login successful"}
#     else:
#         return {"message": "Invalid credentials"}
