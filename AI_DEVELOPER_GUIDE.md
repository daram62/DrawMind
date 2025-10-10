# 🤖 AI 개발자를 위한 가이드

이 문서는 AI API를 개발할 개발자를 위한 가이드입니다.

## 📋 배포된 인프라 정보

### API 서버
- **URL**: `http://<ECS-PUBLIC-IP>:8000` (배포 완료 후 제공)
- **프레임워크**: FastAPI
- **문서**: `http://<ECS-PUBLIC-IP>:8000/docs` (Swagger UI)
- **Health Check**: `http://<ECS-PUBLIC-IP>:8000/health`

### 기존 API 엔드포인트
- `GET /health` - 서버 상태 확인
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects` - 프로젝트 목록
- `POST /api/files/upload` - 파일 업로드 (S3)

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. 백엔드 디렉토리로 이동
```bash
cd backend-fastapi
```

### 3. 가상환경 생성 및 활성화
```bash
# 가상환경 생성
python -m venv venv

# 활성화 (Mac/Linux)
source venv/bin/activate
```

### 4. 의존성 설치
```bash
pip install -r requirements.txt
```

### 5. 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
# AI API 키 추가
```

### 6. 로컬 서버 실행
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

서버가 실행되면:
- API: http://localhost:8000
- 문서: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 📝 새로운 AI API 추가하기

### 1. 새 라우터 파일 생성

`backend-fastapi/app/api/ai.py` 파일 생성:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

# Request/Response 모델 정의
class AIRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class AIResponse(BaseModel):
    result: str
    tokens_used: int

# AI API 엔드포인트
@router.post("/generate", response_model=dict)
async def generate_text(request: AIRequest):
    """
    AI 텍스트 생성 API
    """
    try:
        # TODO: 여기에 AI API 호출 로직 추가
        # 예: Gemini
        
        # 예시 응답
        result = f"AI 응답: {request.prompt}"
        
        return {
            "success": True,
            "data": {
                "result": result,
                "tokens_used": 100
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-image")
async def analyze_image(image_url: str, prompt: str):
    """
    이미지 분석 API
    """
    try:
        # TODO: Vision API 호출 로직
        
        return {
            "success": True,
            "data": {
                "analysis": "이미지 분석 결과",
                "confidence": 0.95
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. 라우터 등록

`backend-fastapi/app/main.py`에 추가:

```python
from app.api import health, projects, files, upload, ai  # ai 추가

# 라우터 등록
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
```

### 3. 테스트

```bash
# 서버 재시작 (--reload 옵션이면 자동 재시작)
# http://localhost:8000/docs 에서 테스트
```

## 🔑 AI API 키 설정

### .env 파일에 추가

```env
# AI Provider
AI_PROVIDER=gemini  # 또는 openai, claude

# API Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 코드에서 사용

```python
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

## 📦 AI 라이브러리 추가

### requirements.txt에 추가

```txt
# Gemini
google-generativeai==0.3.2
```

### 설치

```bash
pip install -r requirements.txt
```

## 🔄 배포된 서버에 업데이트하기

### 방법 1: 자동 배포 (추천)

```bash
# 저장소 루트에서
./scripts/deploy-fastapi-to-aws.sh
```

### 방법 2: 수동 배포

```bash
# 1. 코드 커밋
git add .
git commit -m "Add AI API"
git push

# 2. ECS 서비스 업데이트
aws ecs update-service \
  --cluster hackathon-cluster \
  --service hackathon-service \
  --force-new-deployment \
  --region ap-northeast-2
```

## 🧪 API 테스트

### cURL로 테스트

```bash
# Health Check
curl http://<API-URL>:8000/health

# AI API 테스트
curl -X POST http://<API-URL>:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, AI!",
    "max_tokens": 100
  }'
```

### Python으로 테스트

```python
import requests

API_URL = "http://<API-URL>:8000"

# AI API 호출
response = requests.post(
    f"{API_URL}/api/ai/generate",
    json={
        "prompt": "Hello, AI!",
        "max_tokens": 100
    }
)

print(response.json())
```

### Swagger UI로 테스트

브라우저에서 `http://<API-URL>:8000/docs` 접속
- 모든 API를 GUI에서 테스트 가능
- Request/Response 예시 자동 생성

## 📁 프로젝트 구조

```
backend-fastapi/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py       # Health check
│   │   ├── projects.py     # 프로젝트 CRUD
│   │   ├── files.py        # 파일 관리
│   │   ├── upload.py       # 이미지 처리
│   │   └── ai.py          # ← 여기에 AI API 추가
│   ├── core/
│   │   └── config.py       # 설정
│   ├── models/
│   │   └── database.py     # DB 모델
│   ├── services/
│   │   └── s3_service.py   # S3 서비스
│   └── main.py             # FastAPI 앱
├── requirements.txt
├── Dockerfile
└── .env
```

## 🐛 트러블슈팅

### 문제: 모듈을 찾을 수 없음
```bash
# 해결: 의존성 재설치
pip install -r requirements.txt
```

### 문제: 포트 이미 사용 중
```bash
# 해결: 다른 포트 사용
uvicorn app.main:app --reload --port 8001
```

### 문제: CORS 에러
```bash
# 해결: .env에 프론트엔드 URL 추가
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 문제: AI API 키 에러
```bash
# 해결: .env 파일 확인
cat .env | grep API_KEY
```

## 📚 유용한 링크

- **FastAPI 문서**: https://fastapi.tiangolo.com/
- **Gemini API**: https://ai.google.dev/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Claude API**: https://docs.anthropic.com/

## 💡 개발 팁

1. **Swagger UI 활용**: `/docs`에서 모든 API를 테스트할 수 있습니다
2. **타입 힌팅**: Pydantic 모델로 자동 검증 및 문서화
3. **비동기 처리**: `async def`로 성능 향상
4. **에러 핸들링**: `HTTPException`으로 명확한 에러 메시지
5. **환경 변수**: 민감한 정보는 `.env`에 저장

## 🤝 협업 가이드

### Git 워크플로우

```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 새 브랜치 생성
git checkout -b feature/ai-api

# 3. 개발 및 커밋
git add .
git commit -m "Add AI generation API"

# 4. 푸시
git push origin feature/ai-api

# 5. Pull Request 생성
```

### 코드 리뷰 체크리스트

- [ ] API 문서화 (docstring)
- [ ] 에러 핸들링
- [ ] 타입 힌팅
- [ ] 환경 변수 사용
- [ ] 테스트 코드 (선택)

## 📞 문의

문제가 있으면:
1. Swagger UI에서 API 테스트
2. 로그 확인: `docker logs <container-id>`
3. 팀원에게 문의

---

**Happy Coding! 🚀**
