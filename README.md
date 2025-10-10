# Hackathon Infrastructure

AI 해커톤을 위한 사전 구축된 풀스택 인프라입니다. React + Express + AWS S3 + Prisma를 기반으로 빠르게 프로젝트를 시작할 수 있습니다.

## 🚀 주요 기능

### 프론트엔드
- ⚡ **React 18 + Vite + TypeScript** - 빠른 개발 환경
- 🎨 **Tailwind CSS** - 유틸리티 기반 스타일링
- 🧩 **재사용 가능한 UI 컴포넌트** - Button, Input, Card, Modal, Toast 등
- 🖼️ **이미지 처리 유틸리티** - 클라이언트 사이드 압축, Base64 변환
- 🔄 **React Router** - SPA 라우팅

### 백엔드
- 🚂 **Express + TypeScript** - 타입 안전한 API 서버
- 📦 **Prisma ORM** - SQLite/PostgreSQL 지원
- ☁️ **AWS S3 통합** - 파일 저장 및 관리
- 🖼️ **Sharp** - 서버 사이드 이미지 최적화
- 🤖 **범용 AI API 구조** - OpenAI, Claude, Gemini 지원
- 🔒 **보안** - CORS, Rate Limiting, 에러 핸들링
- 🐳 **Docker** - 컨테이너화된 배포

### API 엔드포인트
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects` - 프로젝트 목록
- `GET /api/projects/:id` - 프로젝트 상세
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제
- `POST /api/files/upload` - 파일 업로드 (S3)
- `GET /api/files/:id` - 파일 조회
- `DELETE /api/files/:id` - 파일 삭제
- `POST /api/upload` - 이미지 업로드 및 처리
- `GET /health` - 헬스 체크

## 📋 기술 스택

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma
- SQLite (개발) / PostgreSQL (프로덕션)
- AWS SDK v3
- Sharp
- Multer

**Infrastructure:**
- Docker & Docker Compose
- AWS S3
- AWS CloudFront (선택)
- AWS EC2 (선택)

## 🛠️ 로컬 개발 환경 설정

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Docker & Docker Compose (선택)

### 1. 저장소 클론
\`\`\`bash
git clone <repository-url>
cd hackathon-infrastructure
\`\`\`

### 2. 환경 변수 설정

**백엔드 (.env)**
\`\`\`bash
cd backend
cp .env.example .env
# .env 파일을 편집하여 필요한 값 입력
\`\`\`

**프론트엔드 (.env)**
\`\`\`bash
cd frontend
cp .env.example .env
# VITE_API_URL을 백엔드 URL로 설정
\`\`\`

### 3. 의존성 설치 및 실행

**백엔드**
\`\`\`bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
\`\`\`

**프론트엔드**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 4. 접속
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3000
- Health Check: http://localhost:3000/health

## 🐳 Docker로 실행

\`\`\`bash
docker-compose up -d
\`\`\`

## 📁 프로젝트 구조

\`\`\`
.
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # UI 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── services/        # API 클라이언트
│   │   ├── utils/           # 유틸리티 함수
│   │   └── hooks/           # 커스텀 훅
│   └── package.json
│
├── backend/                  # Express 백엔드
│   ├── src/
│   │   ├── routes/          # API 라우트
│   │   ├── services/        # 비즈니스 로직
│   │   ├── middleware/      # 미들웨어
│   │   ├── config/          # 설정
│   │   └── server.ts        # 서버 엔트리포인트
│   ├── prisma/              # Prisma 스키마
│   └── package.json
│
├── scripts/                  # 배포 스크립트
├── docker-compose.yml
└── README.md
\`\`\`

## 🔑 환경 변수

### 백엔드 환경 변수

\`\`\`env
# Server
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173

# Database
DATABASE_URL=file:./dev.db

# AWS S3
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name

# AI Provider (선택)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key
# OPENAI_API_KEY=your_api_key
# ANTHROPIC_API_KEY=your_api_key
\`\`\`

### 프론트엔드 환경 변수

\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

## 🚢 배포

### 프론트엔드 배포 (S3 + CloudFront)

\`\`\`bash
# 환경 변수 설정
export AWS_S3_FRONTEND_BUCKET=your-frontend-bucket
export AWS_CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
export AWS_REGION=ap-northeast-2

# 배포 실행
./scripts/deploy-frontend.sh
\`\`\`

### 백엔드 배포 (EC2 + Docker)

\`\`\`bash
# 환경 변수 설정
export EC2_HOST=your-ec2-ip
export EC2_USER=ubuntu

# 배포 실행
./scripts/deploy-backend.sh
\`\`\`

## 📚 API 사용 예제

### 프로젝트 생성
\`\`\`javascript
import { projectService } from './services/projectService';

const project = await projectService.create({
  title: 'My Hackathon Project',
  description: 'An awesome AI project',
});
\`\`\`

### 파일 업로드
\`\`\`javascript
import { fileService } from './services/fileService';

const file = await fileService.upload(imageFile, {
  projectId: project.id,
  onProgress: (progress) => console.log(`${progress}%`),
});
\`\`\`

## 🎯 해커톤 당일 빠른 시작

1. **저장소 클론 및 의존성 설치** (5분)
   \`\`\`bash
   git clone <repo> && cd hackathon-infrastructure
   cd backend && npm install && cd ../frontend && npm install
   \`\`\`

2. **환경 변수 설정** (2분)
   - AWS 자격증명 입력
   - API 키 입력 (필요시)

3. **데이터베이스 마이그레이션** (1분)
   \`\`\`bash
   cd backend && npx prisma migrate dev
   \`\`\`

4. **서버 실행** (1분)
   \`\`\`bash
   # 터미널 1
   cd backend && npm run dev
   
   # 터미널 2
   cd frontend && npm run dev
   \`\`\`

5. **개발 시작!** 🚀

## 🔧 트러블슈팅

### CORS 에러
- `backend/.env`의 `ALLOWED_ORIGINS`에 프론트엔드 URL 추가

### 파일 업로드 실패
- AWS 자격증명 확인
- S3 버킷 권한 확인
- 파일 크기 제한 확인 (기본 10MB)

### 데이터베이스 에러
- Prisma 마이그레이션 실행: `npx prisma migrate dev`
- Prisma Client 재생성: `npx prisma generate`

### 포트 충돌
- `.env` 파일에서 `PORT` 변경
- 프론트엔드 `vite.config.ts`에서 포트 변경

## 📝 라이선스

MIT

## 🤝 기여

이슈와 PR을 환영합니다!

## 📧 문의

문제가 있으시면 이슈를 등록해주세요.
