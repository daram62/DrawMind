# FastAPI Backend

## 🚀 빠른 시작 (Docker 추천)

### Docker로 실행 (가장 쉬움)

```bash
# 1. 빌드
docker build -t hackathon-api .

# 2. 실행
docker run -p 8000:8000 hackathon-api

# 3. 브라우저에서 확인
# http://localhost:8000/docs
```

### 로컬 실행 (Python 가상환경)

```bash
# 1. 가상환경 생성
python3 -m venv venv

# 2. 활성화
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📍 접속 URL

- **API**: http://localhost:8000
- **문서 (Swagger)**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## �  API 추가하기

`app/main.py` 파일을 열고 엔드포인트 추가:

```python
from pydantic import BaseModel

# Request 모델 정의
class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 1000

# API 엔드포인트 추가
@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    # TODO: AI API 호출
    result = f"AI 응답: {request.prompt}"
    
    return {
        "success": True,
        "result": result
    }
```

저장하면 자동으로 재시작됩니다 (--reload 옵션)

## 🔑 환경 변수 설정

`.env` 파일에 API 키 추가:

```env
# AI API Keys
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
```

코드에서 사용:

```python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
```

## 🐳 Docker 명령어

```bash
# 빌드
docker build -t hackathon-api .

# 실행
docker run -p 8000:8000 hackathon-api

# 백그라운드 실행
docker run -d -p 8000:8000 --name api hackathon-api

# 로그 확인
docker logs -f api

# 중지
docker stop api

# 재시작
docker start api
```

## 📦 라이브러리 추가

`requirements.txt`에 추가:

```txt
openai==1.10.0
google-generativeai==0.3.2
anthropic==0.18.0
```

그리고 재빌드:

```bash
docker build -t hackathon-api .
```

## 📚 참고 문서

- **FastAPI**: https://fastapi.tiangolo.com/
- **Swagger UI**: http://localhost:8000/docs (자동 생성)
- **OpenAI**: https://platform.openai.com/docs
- **Gemini**: https://ai.google.dev/docs

## 🐛 트러블슈팅

### 포트 이미 사용 중
```bash
# 다른 포트 사용
docker run -p 8001:8000 hackathon-api
```

### 코드 변경이 반영 안됨
```bash
# Docker 재빌드
docker build -t hackathon-api .
docker run -p 8000:8000 hackathon-api
```

### pip 설치 에러
```bash
# 가상환경 사용 (권장)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
