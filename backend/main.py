import asyncio
import nest_asyncio
from fastapi import FastAPI, HTTPException,Response, status
import torch
from Models import UserDetail, Query, QueryDB
import bcrypt 
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from config import MONGO_URI, MONOGODB_URI_LOCALHOST
import jwt
import spacy
import numpy as np
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
nlp = spacy.load("en_core_web_sm")
import re
import json
import networkx as nx
import nltk
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

# Download NLTK resources (you only need to run this once)
nltk.download('punkt')

# Initialize the Porter Stemmer
porter = PorterStemmer()

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/collections/{database_name}")
async def get_collections(database_name: str):
    try:
        # Fetch the list of collections for a specific database
        db = client[database_name]
        collections = await db.list_collection_names()

        return {"collections": collections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.get("/fields/{database_name}/{collection_name}")
async def get_fields(database_name: str, collection_name: str):
    try:
        # Fetch the list of fields for a specific collection in a database
        db = client[database_name]
        collection = db[collection_name]
        

        # Fetch one document from the collection to get its keys (fields)
        sample_document = await collection.find_one()
        if sample_document:
            fields = list(sample_document.keys())
            return {"fields": fields}
        else:
            return {"fields": []}
        # fields = set()
        # documents = await collection.find()
        
        # if documents:
        #     for document in documents:
        #         fields.update(document.keys())
            
        #     return {"fields": fields}
        # else:
        #     return {'fields': []}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



@app.post("/query")
async def UserQuery(query: Query):
    print(query)
    try:
        print("goodmorning")
       
        user_input = query.query

        model_checkpoint_path = "../model/main_model/my5t-base.pth"
        checkpoint = torch.load(model_checkpoint_path,map_location=torch.device('cpu'))

        # Create a model instance and load the state dictionary
        model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-wikiSQL") 
        model.load_state_dict(checkpoint)

        # Load the tokenizer and model
        tokenizer = AutoTokenizer.from_pretrained("../model/Tokenizer")
        input_ids = tokenizer([user_input], return_tensors="pt").input_ids
        output = model.generate(input_ids)

        # Decode the model output
        generated_query = tokenizer.decode(output[0], skip_special_tokens=True)
        print("this is the main output")
        print(generated_query)
        return {"result": generated_query}
    except Exception as e:
        return {"message": str(e)}

def get_lemmatized_embedding(text):
    tokens = nlp(text)
    lemmatized_tokens = [token.lemma_ for token in tokens if not token.is_punct and not token.is_space]
    return nlp(" ".join(lemmatized_tokens)).vector
    
def select_collection_name(query, collections):
    query_embedding = get_lemmatized_embedding(query)
    
    similarities = []
    for collection in collections:
        collection_embedding = get_lemmatized_embedding(collection)
        similarity = np.dot(query_embedding,collection_embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(collection_embedding))
        similarities.append((collection, similarity))    
    sorted_similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    
    return sorted_similarities[0][0]



def select_model_and_output(user_input):
    # Check if the term "create" is present in the user input
    if "create" in user_input.lower():
        # Load the create_model checkpoint
        create_model_checkpoint_path = "../model/create_model/pytorch_model.pth"
        create_model_checkpoint = torch.load(create_model_checkpoint_path, map_location=torch.device('cpu'))

        # Create a model instance and load the state dictionary
        selected_model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-wikiSQL")
        selected_model.load_state_dict(create_model_checkpoint)

        # Load the tokenizer and generate output
        tokenizer = AutoTokenizer.from_pretrained("../model/create_model")
        input_ids = tokenizer([user_input], return_tensors="pt").input_ids
        output = selected_model.generate(input_ids)
        generated_query = tokenizer.decode(output[0], skip_special_tokens=True)

    else:
        # basic_model_checkpoint_path = "../model/main_model/my5t-base.pth"
        # basic_model_checkpoint = torch.load(basic_model_checkpoint_path, map_location=torch.device('cpu'))

        # # Create a model instance and load the state dictionary
        # basic_model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-wikiSQL") 
        # basic_model.load_state_dict(basic_model_checkpoint)

        # # Load the tokenizer and model
        # tokenizer = AutoTokenizer.from_pretrained("../model/Tokenizer")
        # input_ids = tokenizer([user_input], return_tensors="pt").input_ids
        # output = basic_model.generate(input_ids)
        # generated_query = tokenizer.decode(output[0], skip_special_tokens=True)
        model = AutoModelForSeq2SeqLM.from_pretrained("../model/final_model")
        tokenizer = AutoTokenizer.from_pretrained("../model/final_model")
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = model.to(device)
        def generate_query(
            textual_query: str,
            num_beams: int = 10,
            max_length: int = 128,
            repetition_penalty: int = 2.5,
            length_penalty: int = 1,
            early_stopping: bool = True,
            top_p: int = 0.95,
            top_k: int = 50,
            num_return_sequences: int = 1,
        ) -> str:
            input_ids = tokenizer.encode(
                textual_query, return_tensors="pt", add_special_tokens=True
            )
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            input_ids = input_ids.to(device)
            generated_ids = model.generate(
                input_ids=input_ids,
                num_beams=num_beams,
                max_length=max_length,
                repetition_penalty=repetition_penalty,
                length_penalty=length_penalty,
                early_stopping=early_stopping,
                top_p=top_p,
                top_k=top_k,
                num_return_sequences=num_return_sequences,
            )
            query = [
                tokenizer.decode(
                    generated_id,
                    skip_special_tokens=True,
                    clean_up_tokenization_spaces=True,
                )
                for generated_id in generated_ids
            ][0]
            return query
        
        
        generated_query = generate_query(user_input)

    return generated_query
    
# generate query for model from graph and query
def genquery(query,tree):

  # Create a directed graph
  G = nx.DiGraph()

# Add edges to the graph
  G.add_edges_from(tree)

# Find the root node(s)
  root_nodes = [n for n, d in G.in_degree() if d == 0]

# Find intermediate nodes
  intermediate_nodes = [n for n, d in G.degree() if d > 1 and n not in root_nodes]

  # Tokenize the text into words
  words = word_tokenize(query)

# Stem each word
  stemmed_words = [porter.stem(word) for word in words]


  i=0

  for stemmed_word in stemmed_words:
    for node in intermediate_nodes:
    
      words = node.split()
      word=porter.stem(words[-1])

      if stemmed_word==word and word!='''id''' and word!="ids":

        spec_node=node
        
        break
        
      i+=1

  m_input='''mongo: '''+query+''' | '''+spec_node+''' : '''
  # List to store nodes connected to the specific intermediate node except root nodes
  leaf_nodes = []

# Iterate through the edges
  for u, v in G.edges():

    if u == spec_node and v not in root_nodes:
        leaf_nodes.append(v.replace(" ", "_"))

  for nodes in leaf_nodes:
    if nodes!=leaf_nodes[-1]:
      m_input+=nodes+''', '''
    else:
      m_input+=nodes
  return m_input



nest_asyncio.apply()
async def get_collection_fields(collection):
    sample_document = await collection.find_one()
    return list(sample_document.keys()) if sample_document else []

async def get_collections_and_fields(database_name):
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client[database_name]

    # Get all collections in the database
    collections = await db.list_collection_names()

    # Create a dictionary to store collections and their fields
    collections_dict = {}

    for collection_name in collections:
        collection = db[collection_name]

        # Get fields for the current collection
        fields = await get_collection_fields(collection)

        # Add collection and fields to the dictionary
        collections_dict[collection_name] = fields

    return collections_dict

def convert_to_graph(root, nodes_dict):
    G = nx.DiGraph()
    
    # Add root node
    G.add_node(root)
    
    # Add intermediate nodes and edges to root
    for intermediate_node, leaf_nodes in nodes_dict.items():
        G.add_node(intermediate_node)
        G.add_edge(root, intermediate_node)
        
        # Add leaf nodes and edges to intermediate nodes
        for leaf_node in leaf_nodes:
            G.add_node(leaf_node)
            G.add_edge(intermediate_node, leaf_node)
            
    return G
    
@app.post("/schemaquery")
async def UserQuery(queryDB: QueryDB):
    try:
        print("goodmorning")
        database = queryDB.database
        user_input = queryDB.query
        print(user_input)
        db = client[database]
        collections = await db.list_collection_names()
        print(collections)
        # query_collection = select_collection_name(user_input,collections) 
        # print(query_collection)

        # basic_model_checkpoint_path = "../model/main_model/my5t-base.pth"
        # basic_model_checkpoint = torch.load(basic_model_checkpoint_path,map_location=torch.device('cpu'))

        # # Create a model instance and load the state dictionary
        # basic_model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-wikiSQL") 
        # basic_model.load_state_dict(basic_model_checkpoint)

        # # Load the tokenizer and model
        # tokenizer = AutoTokenizer.from_pretrained("../model/Tokenizer")
        # input_ids = tokenizer([user_input], return_tensors="pt").input_ids
        # output = basic_model.generate(input_ids)
        # print(output)
        # Decode the model output
        # generated_query = tokenizer.decode(output[0], skip_special_tokens=True)
        # print("this is the main output")
        # print(generated_query)
        if "create" in user_input.lower(): 
            generated_query = select_model_and_output(user_input)
        else:
            collections_and_fields = await get_collections_and_fields(database)
            graph = convert_to_graph(database,collections_and_fields)
            print(graph.edges())
            query_text = genquery(user_input,graph.edges())
            print(query_text)
            generated_query = select_model_and_output(query_text)
        
        result_json =None
        
        if "createCollection" in generated_query:
            pattern = r"db\.createCollection\(['\"](\w+)['\"]\)"
            collection_name = re.search(pattern, generated_query).group(1)
            schema_aware_query = generated_query
            if collection_name not in collections:
                await db.create_collection(collection_name)
                result_json = "Collection created successfully"
            else:
                result_json = "Collection already exists"
            # await schema_aware_query
        else:
            # schema_aware_query = re.sub(r'db\.\w+', f'db.{query_collection}', generated_query)
            schema_aware_query = generated_query
            output_cursor = eval(schema_aware_query)
            output_data = [document async for document in output_cursor]
            print(output_data)
            result_json = json.dumps(output_data, default=str)
        print(schema_aware_query)
        
        # stripped_query = re.search(r'db\.(\w+)\.(.*)', schema_aware_query).group(2).strip()
        # print(stripped_query)
        # print(result_json)
        try:
            print(result_json)
            if result_json == "[]":
                result_json = "No data found"
        except Exception as e:
            print(f"Error fetching data from MongoDB: {e}")
            raise HTTPException(status_code=500, detail="Error fetching data from MongoDB")

        return {"result": schema_aware_query, "output_data": result_json}

    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error")

# @app.post("/schemaquery")
# async def UserQuery(queryDB: QueryDB):
#     try:
#         print("goodmorning")

#         user_input = queryDB.query
#         database = queryDB.database
#         print(user_input)

#         # basic_model_checkpoint_path = "../model/main_model/my5t-base.pth"
#         # basic_model_checkpoint = torch.load(basic_model_checkpoint_path, map_location=torch.device('cpu'))

#         # # Create a model instance and load the state dictionary
#         # basic_model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-wikiSQL") 
#         # basic_model.load_state_dict(basic_model_checkpoint)

#         # # Load the tokenizer and model
#         # tokenizer = AutoTokenizer.from_pretrained("../model/Tokenizer")
#         # input_ids = tokenizer([user_input], return_tensors="pt").input_ids
#         # output = basic_model.generate(input_ids)
        
#         generated_query = select_model_and_output(user_input)
        
#         # Decode the model output
        
#         print("this is the main output")
#         print(generated_query)

#         client = MongoClient(MONOGODB_URI_LOCALHOST)  # Connect to the MongoDB server
#         db = client[database]
        
#         collections = db.list_collection_names()
#         print(collections)
#         query_collection = select_collection_name(user_input, collections)
#         print(query_collection)

#         if "createCollection" not in generated_query:
#             schema_aware_query = re.sub(r'db\.\w+', f'db.{query_collection}', generated_query)
#             print(schema_aware_query)

#             stripped_query = re.search(r'db\.(\w+)\.(.*)', schema_aware_query).group(2).strip()
#             print(stripped_query)

#         try:
#             # Use to execute the MongoDB query'
#             collection = db[query_collection]
#             cursor = collection."{stripped_query}"
#             print(cursor)
#             output_data = list(cursor)
#             print(output_data[0] if output_data else None)
#         except Exception as e:
#             print(f"Error: {e}")
#             output_data = []

#         client.close()  # Close the MongoDB connection

#         return {"result": schema_aware_query, "output_data": output_data[0]}
#     except Exception as e:
#         return {"message": str(e)}