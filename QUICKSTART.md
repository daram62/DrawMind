# 🚀 해커톤 당일 빠른 시작 가이드

이 가이드는 해커톤 당일 최대한 빠르게 개발을 시작할 수 있도록 작성되었습니다.

## ⏱️ 예상 소요 시간: 10분

## 📋 사전 준비 체크리스트

해커톤 전날까지 완료해야 할 항목:

- [ ] Node.js 18+ 설치
- [ ] Git 설치
- [ ] 코드 에디터 (VS Code 권장)
- [ ] AWS 계정 생성 및 자격증명 준비
- [ ] (선택) AI API 키 준비 (OpenAI, Gemini, Claude 등)

## 🎯 빠른 시작 (10분)

### 1단계: 프로젝트 설정 (3분)

\`\`\`bash
# 1. 저장소 클론
git clone <repository-url>
cd hackathon-infrastructure

# 2. 백엔드 의존성 설치
cd backend
npm install

# 3. 프론트엔드 의존성 설치
cd ../frontend
npm install
cd ..
\`\`\`

### 2단계: 환경 변수 설정 (3분)

**백엔드 환경 변수**
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

`.env` 파일을 열고 다음 값들을 입력:

\`\`\`env
# 필수 항목
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_S3_BUCKET=<your-s3-bucket-name>

# 선택 항목 (AI 기능 사용시)
AI_PROVIDER=gemini
GEMINI_API_KEY=<your-gemini-api-key>
\`\`\`

**프론트엔드 환경 변수**
\`\`\`bash
cd ../frontend
cp .env.example .env
\`\`\`

기본값 사용 (변경 불필요):
\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

### 3단계: 데이터베이스 초기화 (2분)

\`\`\`bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 4단계: 서버 실행 (2분)

**터미널 1 - 백엔드**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**터미널 2 - 프론트엔드**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 5단계: 확인 ✅

브라우저에서 다음 URL 접속:
- 프론트엔드: http://localhost:5173
- 백엔드 Health Check: http://localhost:3000/health

## 🎨 개발 시작하기

### 주요 페이지
- **Home**: http://localhost:5173/
- **Projects**: http://localhost:5173/projects
- **Demo (UI 컴포넌트)**: http://localhost:5173/demo

### 첫 프로젝트 생성
1. Projects 페이지로 이동
2. "Create Project" 버튼 클릭
3. 제목과 설명 입력
4. (선택) 이미지 업로드
5. "Create Project" 클릭

## 🔧 주제별 커스터마이징

### AI 기능 추가하기

**1. AI 서비스 선택**
\`\`\`env
# backend/.env
AI_PROVIDER=gemini  # 또는 openai, claude
GEMINI_API_KEY=your_key
\`\`\`

**2. AI 서비스 사용**
\`\`\`typescript
// backend/src/routes/ai.ts
import { AIServiceFactory } from '../services/ai/AIServiceFactory';

const aiService = AIServiceFactory.getService();
const response = await aiService.generateText({
  messages: [{ role: 'user', content: 'Hello!' }]
});
\`\`\`

### 새로운 페이지 추가하기

**1. 페이지 컴포넌트 생성**
\`\`\`typescript
// frontend/src/pages/MyPage.tsx
function MyPage() {
  return <div>My Custom Page</div>;
}
export default MyPage;
\`\`\`

**2. 라우트 추가**
\`\`\`typescript
// frontend/src/App.tsx
import MyPage from './pages/MyPage';

// Routes에 추가
<Route path="/my-page" element={<MyPage />} />
\`\`\`

**3. 네비게이션 추가**
\`\`\`typescript
// frontend/src/components/Layout.tsx
<Link to="/my-page">My Page</Link>
\`\`\`

### 새로운 API 엔드포인트 추가하기

**1. 라우트 생성**
\`\`\`typescript
// backend/src/routes/myRoute.ts
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Hello!' });
});

export default router;
\`\`\`

**2. 서버에 등록**
\`\`\`typescript
// backend/src/server.ts
import myRouter from './routes/myRoute.js';
app.use('/api/my-route', myRouter);
\`\`\`

## 🐛 자주 발생하는 문제

### 문제: "Cannot find module '@prisma/client'"
**해결:**
\`\`\`bash
cd backend
npx prisma generate
\`\`\`

### 문제: CORS 에러
**해결:**
\`\`\`env
# backend/.env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
\`\`\`

### 문제: 파일 업로드 실패
**해결:**
1. AWS 자격증명 확인
2. S3 버킷 존재 확인
3. S3 버킷 권한 확인 (public-read)

### 문제: 포트 이미 사용 중
**해결:**
\`\`\`bash
# 백엔드 포트 변경
# backend/.env
PORT=3001

# 프론트엔드 API URL 업데이트
# frontend/.env
VITE_API_URL=http://localhost:3001
\`\`\`

## 📚 유용한 명령어

\`\`\`bash
# Prisma Studio (데이터베이스 GUI)
cd backend && npx prisma studio

# 프론트엔드 빌드
cd frontend && npm run build

# 백엔드 빌드
cd backend && npm run build

# Docker로 전체 스택 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
\`\`\`

## 🎯 개발 팁

1. **UI 컴포넌트 재사용**: `/demo` 페이지에서 모든 컴포넌트 확인
2. **API 테스트**: Postman 또는 Thunder Client 사용
3. **타입 안전성**: TypeScript 에러 무시하지 말기
4. **에러 핸들링**: Toast 알림 적극 활용
5. **이미지 최적화**: 자동으로 처리되므로 신경 쓰지 않아도 됨

## 🚀 배포 (해커톤 마지막 날)

### 빠른 배포 (Vercel + Railway)

**프론트엔드 (Vercel)**
\`\`\`bash
cd frontend
npm install -g vercel
vercel
\`\`\`

**백엔드 (Railway)**
1. https://railway.app 접속
2. GitHub 연동
3. 프로젝트 배포
4. 환경 변수 설정

## 📞 도움이 필요하면

1. `README.md` 확인
2. 코드 내 주석 확인
3. GitHub Issues 검색
4. 팀원에게 문의

## ✅ 최종 체크리스트

해커톤 시작 전:
- [ ] 모든 의존성 설치 완료
- [ ] 환경 변수 설정 완료
- [ ] 로컬 서버 정상 작동 확인
- [ ] 프로젝트 생성/조회 테스트 완료
- [ ] 파일 업로드 테스트 완료

**준비 완료! 이제 멋진 프로젝트를 만들어보세요! 🎉**