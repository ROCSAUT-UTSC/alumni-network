from backend.app.models.pydantic import BaseModel, Field, Emailstr

class User(BaseModel):
  id: int
  first_name: str
  last_name: str
  pronouns: str 
  graduation_year: int
  major: str
  university: str 
  school_email: Emailstr #Constraint 
  AlumniToBe: bool = None #o
  bio: str = None #o


class Alumni(BaseModel):
  id: int
  first_name: str
  last_name: str
  pronouns: str 
  industry: str 
  email: Emailstr #Constrain 
  password: str
  bio: str = Field(max_len=500)
  location: str = None #o
  position: str = None #o
  CurrentWorkDuration: str = None #o 
  AcademicHistory: str = None #0 
  LinkedIn: str = None #o
