from pydantic import BaseModel

class UserDetail(BaseModel):
    name: str = None
    email: str = None
    username: str
    password : str
