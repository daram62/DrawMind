# 🚀 빠른 시작 가이드

동화책 스타일 그리기 애플리케이션을 바로 실행해보세요!

## 📦 설치 및 실행

### 1단계: 백엔드 실행

```bash
# 백엔드 디렉토리로 이동
cd backend-fastapi

# 가상환경 생성 (처음 한 번만)
python -m venv venv

# 가상환경 활성화
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

백엔드가 http://localhost:8000 에서 실행됩니다.

### 2단계: 프론트엔드 실행

새 터미널을 열고:

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 패키지 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 http://localhost:5173 에서 실행됩니다.

## 🎨 사용 방법

1. 브라우저에서 http://localhost:5173 접속
2. "🚀 모험 시작하기" 버튼 클릭
3. 시나리오를 읽고 자유롭게 그림 그리기
4. "✨ 완성!" 버튼을 눌러 AI 처리 시작
5. 완성된 그림과 이야기 감상하기!

## 🎯 주요 페이지

- **홈** (`/`): 소개 페이지
- **그리기** (`/draw`): 메인 그리기 플로우
- **프로젝트** (`/projects`): 프로젝트 관리
- **데모** (`/demo`): 데모 페이지

## 🔧 문제 해결

### 포트가 이미 사용 중인 경우

**백엔드:**
```bash
uvicorn app.main:app --reload --port 8001
```

**프론트엔드:**
```bash
npm run dev -- --port 5174
```

### CORS 에러가 발생하는 경우

`backend-fastapi/app/main.py`에서 CORS 설정 확인:
```python
origins = ["http://localhost:5173", "http://localhost:5174"]
```

### 패키지 설치 오류

**백엔드:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**프론트엔드:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 추가 문서

- [동화책 UI 가이드](frontend/STORYBOOK_UI_GUIDE.md)
- [그리기 플로우 가이드](DRAWING_FLOW_GUIDE.md)
- [백엔드 핸드오프](BACKEND_HANDOFF.md)
- [AI 개발자 가이드](AI_DEVELOPER_GUIDE.md)

## 🎨 커스터마이징

### 색상 변경
`frontend/tailwind.config.js`에서 색상 팔레트 수정

### 시나리오 추가
`backend-fastapi/app/routers/drawings.py`의 `SCENARIOS` 배열에 추가

### 캔버스 크기 변경
`frontend/src/components/SketchbookCanvas.tsx`에서 width/height 수정

## 🚀 배포

### Vercel (프론트엔드)
```bash
cd frontend
npm run build
vercel --prod
```

### AWS EC2 (백엔드)
```bash
./scripts/deploy-to-ec2.sh
```

자세한 내용은 각 가이드 문서를 참고하세요!

즐거운 개발 되세요! ✨🎨
