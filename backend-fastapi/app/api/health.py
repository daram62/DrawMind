from fastapi import APIRouter
from datetime import datetime
import time
import os

router = APIRouter()

start_time = time.time()

@router.get("/health")
async def health_check():
    return {
        "success": True,
        "message": "Server is healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": time.time() - start_time,
        "environment": os.getenv("NODE_ENV", "development")
    }
