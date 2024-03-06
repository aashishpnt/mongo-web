from pydantic import BaseModel

class UserDetail(BaseModel):
    name: str = None
    email: str = None
    username: str
    password : str

class Query(BaseModel):
    query: str = None
    
class QueryDB(BaseModel):
    query:str = None
    database:str = None