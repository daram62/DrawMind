from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import routers
try:
    from app.routers import drawings
    DRAWINGS_ROUTER_AVAILABLE = True
except ImportError:
    DRAWINGS_ROUTER_AVAILABLE = False

load_dotenv()

app = FastAPI(
    title="Hackathon API",
    description="FastAPI backend - Add your AI APIs here!",
    version="1.0.0"
)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
if DRAWINGS_ROUTER_AVAILABLE:
    app.include_router(drawings.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Hackathon API!",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API is running"
    }

# TODO: Add your AI API routes here
# Example:
# @app.post("/api/generate")
# async def generate_text(prompt: str):
#     return {"result": "AI response"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
