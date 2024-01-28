from pydantic import BaseModel

class UserDetail(BaseModel):
    name: str = None
    email: str
    username: str = None
    password : str
