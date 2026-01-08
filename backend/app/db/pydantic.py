from pydantic import BaseModel

class Products(BaseModel):
  id: int
  name: str
  description: str
  price: float
  quantity: int

class Customer(BaseModel):
  id: int
  name: str
  product_id : int

  #test