# 🎨 AI 그림 동화 프로젝트

아이들이 그린 그림을 AI가 분석하고 동화로 만들어주는 웹 애플리케이션입니다.

## 🚀 기술 스택

- **React 18** + TypeScript
- **Vite** - 빠른 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 페이지 라우팅
- **HTML5 Canvas** - 그림 그리기
- **Axios** - API 통신

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/          # UI 컴포넌트
│   │   ├── Layout.tsx
│   │   └── SketchbookCanvas.tsx
│   ├── pages/               # 페이지
│   │   ├── StartPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── DrawingFlowPage.tsx
│   │   └── EmotionAnalysisPage.tsx
│   ├── services/            # API 클라이언트
│   │   ├── api.ts
│   │   └── drawingService.ts
│   └── App.tsx
├── public/
│   └── fonts/               # 한글 폰트
└── vercel.json              # Vercel 배포 설정
```

## 🛠️ 로컬 개발

### 설치 및 실행

```bash
cd frontend
npm install
npm run dev
```

접속: http://localhost:5173

### 빌드

```bash
npm run build
```

## 🌐 배포

### Backend API
- **URL**: http://43.200.181.143:8001
- **API 문서**: http://43.200.181.143:8001/docs

### Frontend (Vercel)

1. https://vercel.com 접속 및 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 설정:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. 환경 변수 추가:
   ```
   VITE_API_BASE_URL=http://43.200.181.143:8001
   ```
6. Deploy!

## 📦 주요 기능

- ✏️ **그림 그리기** - HTML5 Canvas 기반 드로잉
- 🎲 **시나리오 제공** - 창의적인 그림 주제
- 📤 **이미지 업로드** - 그림을 백엔드로 전송
- 📖 **스토리 생성** - 그림 기반 동화 생성
- �  **PDF 다운로드** - 완성된 작품 저장

## 🎯 API 엔드포인트

```
POST /api/drawings/process          # 그림 분석
GET  /api/drawings/scenarios/random # 랜덤 시나리오
GET  /api/drawings/scenarios        # 시나리오 목록
POST /api/drawings/save             # 그림 저장
GET  /api/drawings                  # 저장된 그림 목록
```

## 🐛 트러블슈팅

### 빌드 에러
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS 에러
백엔드 서버의 ALLOWED_ORIGINS에 프론트엔드 URL을 추가하세요.

## � 환경 변수

```env
VITE_API_BASE_URL=http://43.200.181.143:8001
```

---

Made with ❤️ for children's creativity
