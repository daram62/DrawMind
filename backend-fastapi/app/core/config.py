from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server
    DEBUG: bool = True
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    
    # Database
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # AWS
    AWS_REGION: str = "ap-northeast-2"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: str = "hackathon-infra-files-1760091778"
    
    # AI
    AI_PROVIDER: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
