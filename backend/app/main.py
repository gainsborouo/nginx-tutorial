from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "OK"}

@app.get("/api/greet")
async def greet(name: str = "World"):
    return {"message": f"Hello, {name}!"}

class Item(BaseModel):
    title: str
    content: str

@app.post("/api/post")
async def create_post(item: Item):
    return {"received": item}
