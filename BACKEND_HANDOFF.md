# 🚀 백엔드 개발자 인수인계 문서

## 📍 배포된 서버 정보

### API 서버
- **URL**: http://13.125.237.117:8000
- **API 문서**: http://13.125.237.117:8000/docs (Swagger UI)
- **Health Check**: http://13.125.237.117:8000/health

### EC2 인스턴스
- **Instance ID**: i-04c2f78b36aa72319
- **Public IP**: 13.125.237.117
- **Region**: ap-northeast-2 (서울)
- **Instance Type**: t3.micro

### SSH 접속
```bash
ssh -i ~/.ssh/hackathon-key.pem ubuntu@13.125.237.117
```

**SSH 키 파일**: `~/.ssh/hackathon-key.pem` (전달 필요)

---

## 🛠️ 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. 백엔드 디렉토리로 이동
```bash
cd backend-fastapi
```

### 3. 로컬 개발 환경 (Docker 추천)
```bash
# Docker로 실행
docker build -t hackathon-api .
docker run -p 8000:8000 hackathon-api

# 브라우저에서 확인
# http://localhost:8000/docs
```

---

## 📝 API 개발 가이드

### 기본 구조
```
backend-fastapi/
├── app/
│   └── main.py          # 메인 FastAPI 앱
├── Dockerfile           # Docker 설정
├── requirements.txt     # Python 의존성
└── .env                # 환경 변수
```

### API 추가 예시

`app/main.py`에 엔드포인트 추가:

```python
from pydantic import BaseModel

# Request 모델
class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 1000

# API 엔드포인트
@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    # TODO: AI API 호출 로직
    result = f"AI 응답: {request.prompt}"
    
    return {
        "success": True,
        "result": result
    }
```

### 환경 변수 설정

`.env` 파일에 API 키 추가:
```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

코드에서 사용:
```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```

---

## 🚀 배포 프로세스

### 방법 1: 자동 배포 스크립트 (추천)

```bash
# 로컬에서 실행
./scripts/deploy-to-ec2.sh
```

### 방법 2: 수동 배포

```bash
# 1. 로컬에서 Docker 이미지 빌드 (EC2용)
docker buildx build --platform linux/amd64 -t hackathon-api:simple .

# 2. 이미지 저장
docker save hackathon-api:simple | gzip > hackathon-api.tar.gz

# 3. EC2로 전송
scp -i ~/.ssh/hackathon-key.pem hackathon-api.tar.gz ubuntu@13.125.237.117:~/

# 4. EC2에 SSH 접속
ssh -i ~/.ssh/hackathon-key.pem ubuntu@13.125.237.117

# 5. EC2에서 실행
docker stop api && docker rm api
docker load < hackathon-api.tar.gz
docker run -d -p 8000:8000 --name api --restart unless-stopped hackathon-api:simple

# 6. 로그 확인
docker logs -f api
```

---

## 🔧 유용한 명령어

### EC2에서

```bash
# 컨테이너 상태 확인
docker ps

# 로그 확인
docker logs -f api

# 컨테이너 재시작
docker restart api

# 컨테이너 중지
docker stop api

# 컨테이너 삭제
docker rm api
```

### 로컬에서

```bash
# API 테스트
curl http://13.125.237.117:8000/health

# Swagger UI에서 테스트
# http://13.125.237.117:8000/docs
```

---

## 📦 라이브러리 추가

### requirements.txt에 추가
```txt
openai==1.10.0
google-generativeai==0.3.2
anthropic==0.18.0
```

### 재배포
```bash
# 로컬에서
docker buildx build --platform linux/amd64 -t hackathon-api:simple .
# ... 배포 프로세스 반복
```

---

## 🐛 트러블슈팅

### API가 응답하지 않음
```bash
# EC2에서 컨테이너 상태 확인
docker ps
docker logs api

# 컨테이너 재시작
docker restart api
```

### 코드 변경이 반영 안됨
```bash
# 로컬에서 재빌드 필요
docker buildx build --platform linux/amd64 -t hackathon-api:simple .
# EC2로 재전송 및 재시작
```

### SSH 접속 안됨
```bash
# 키 파일 권한 확인
chmod 400 ~/.ssh/hackathon-key.pem

# 인스턴스 상태 확인
aws ec2 describe-instances --instance-ids i-04c2f78b36aa72319 --region ap-northeast-2
```

---

## 📚 참고 문서

- **FastAPI 공식 문서**: https://fastapi.tiangolo.com/
- **Swagger UI**: http://13.125.237.117:8000/docs
- **AI_DEVELOPER_GUIDE.md**: 상세 개발 가이드
- **backend-fastapi/README.md**: 로컬 개발 가이드

---

## 🔑 전달 필요한 파일

1. **SSH 키**: `~/.ssh/hackathon-key.pem`
2. **저장소 접근 권한**: GitHub/GitLab 등
3. **AWS 콘솔 접근** (선택): EC2 인스턴스 관리용

---

## 💡 개발 팁

1. **Swagger UI 활용**: `/docs`에서 모든 API를 GUI로 테스트 가능
2. **자동 재시작**: `--restart unless-stopped` 옵션으로 서버 재부팅시 자동 시작
3. **로그 모니터링**: `docker logs -f api`로 실시간 로그 확인
4. **환경 변수**: 민감한 정보는 `.env` 파일에 저장 (Git에 커밋 X)

---

## 📞 문의

문제 발생시:
1. `docker logs api`로 에러 로그 확인
2. Swagger UI에서 API 테스트
3. 팀원에게 문의

---

**배포 완료일**: 2025-10-10
**배포자**: [Your Name]
**서버 상태**: ✅ Running
