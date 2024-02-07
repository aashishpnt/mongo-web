from fastapi import FastAPI, HTTPException,Response, status
import torch
# import transformers
from Models import UserDetail
import bcrypt 
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder
from config import MONGO_URI, MONOGODB_URI_LOCALHOST
import jwt

app = FastAPI()

SECRET_KEY = "nepal123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

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


main_client = AsyncIOMotorClient(MONGO_URI)

client = AsyncIOMotorClient(MONOGODB_URI_LOCALHOST)

db = main_client["mydatabase"] 
Usercollection = db["users"]


# async def connect_to_mongo(CONNECTION_URI):
#     try:
#         main_client = AsyncIOMotorClient(CONNECTION_URI)
#         return main_client
#     except ServerSelectionTimeoutError:
#         return "Failed to connect to MongoDB Atlas!"

# tokenizer = transformers.T5Tokenizer.from_pretrained("D:\\tokenizer")
# model = transformers.T5ForConditionalGeneration.from_pretrained('D:\\model')

async def get_all_emails():
    emails = []
    async for document in Usercollection.find({}, {"email": 1, "_id": 0}):
        emails.append(document.get("email"))
    return emails

@app.post("/users/register")
async def register_user(user: UserDetail, response: Response):
    emails = await get_all_emails()
    if user.email not in emails:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt)
        hashed_password_str = hashed_password.decode('utf-8')
        salt_str = salt.hex()
        
        result = Usercollection.insert_one({"name" : user.name,"username": user.username, "email": user.email, 
                                                  "Password" : hashed_password_str , "Key" : salt_str})
        print("Registered")
        return {"message": "User created successfully"} , 200
    else:
        print("email already taken")
        response.status_code = status.HTTP_409_CONFLICT
        return {"message": "Email already taken"}


@app.post("/users/login")
async def login_user(user: UserDetail, response: Response):
    data = jsonable_encoder(user)
    result = await Usercollection.find_one({"username": user.username})
    if result:
        stored_hashed_password = result['Password']
        stored_random_key_str = result['Key']
        stored_random_key_bytes = bytes.fromhex(stored_random_key_str)
        hashed_input_password = bcrypt.hashpw(user.password.encode('utf-8'), stored_random_key_bytes)

        if hashed_input_password == stored_hashed_password.encode('utf-8'):
            encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
            # newUser = await get_user(user.username)
            # newUser.pop('Password', None)
            # newUser.pop('Key', None)
            return {"message": "Welcome to your dashboard", "token": encoded_jwt}
        else:
            # response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"message": "Incorrect password"}
    else:
        # response.status_code = status.HTTP_403_FORBIDDEN
        return {"message": "Username Not Found"}


# @app.get("/users/getSingleUser/{email}")
# async def get_user(email: str):
#     user = await Usercollection.find_one({"email": email},{'_id': 0})
#     if user:
#         return user
#     else:
#         raise HTTPException(status_code=404, detail="User not found")

@app.post("/createCollection")
def create_collection(userId:int, collectionName:str):
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[collectionName+str(userId)]
    return db

@app.get("/databases")
async def get_databases():
    try:
        databases = await client.list_database_names()
        return {"databases": databases}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/GetAllCollections/{client_db_name}")
async def GetAllCollection(user_id:str, client_db_name: str):
    db = client[client_db_name]
    collection_names = await db.list_collection_names()
    return collection_names

@app.post("/processQuery")
def GetUserQuery(str):
#     input_text = [str]
#     input_ids = tokenizer(input_text, return_tensors="pt").input_ids

#     output = model.generate(input_ids)

#     output_text = tokenizer.decode(output[0], skip_special_tokens=True)
    # return output_text
    return 0