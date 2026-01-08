from pydantic import BaseModel, Field

class User(BaseModel):
  id: int
  name: str
  sex: str
  major: str
  about: str = Field(max_length = 500)
  email: str
  password: str

class Customer(BaseModel):
  id: int
  name: str
  sex: str
  major: str
  about: str = Field(max_length = 500)
  email: str
  password: str