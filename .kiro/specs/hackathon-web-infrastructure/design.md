# Design Document

## Overview

해커톤 전에 미리 구축해둘 웹 인프라는 학생 드로잉 기반 AI 교육 툴과 과학 시뮬레이션을 빠르게 개발할 수 있는 풀스택 환경입니다. Google Gemini API를 활용한 이미지 분석/생성, 인터랙티브 시각화, 그리고 AWS 기반 배포 파이프라인을 포함합니다.

**핵심 기능:**
- 캔버스 드로잉 인터페이스
- Gemini Vision으로 그림 분석
- Gemini 2.5 Flash Image로 아이템 생성
- Three.js/Matter.js 기반 과학 시뮬레이션
- AWS 원클릭 배포

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Canvas     │  │   Three.js   │  │  Matter.js   │      │
│  │   Drawing    │  │   3D Viz     │  │   Physics    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    React Frontend                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS CloudFront (CDN)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   AWS S3 (Static Site)   │  │   Backend API Server     │
│   - HTML/CSS/JS          │  │   (EC2/ECS/Lambda)       │
│   - Built Assets         │  │   - Express/Fastify      │
└──────────────────────────┘  └──────────────────────────┘
                                          │
                        ┌─────────────────┼─────────────────┐
                        │                 │                 │
                        ▼                 ▼                 ▼
              ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
              │ Google       │  │   AWS S3     │  │   SQLite/    │
              │ Gemini API   │  │ (Image Store)│  │  PostgreSQL  │
              │ - Vision     │  │              │  │              │
              │ - Image Gen  │  │              │  │              │
              └──────────────┘  └──────────────┘  └──────────────┘
```

### Technology Stack

**Frontend:**
- React 18 + Vite (빠른 개발 서버)
- TypeScript (타입 안정성)
- Canvas API (드로잉)
- Three.js (3D 시각화)
- Matter.js (2D 물리 엔진)
- Tailwind CSS (빠른 스타일링)
- React Query (서버 상태 관리)

**Backend:**
- Node.js + Express (또는 Fastify)
- TypeScript
- Multer (파일 업로드)
- Sharp (이미지 처리)
- Google Generative AI SDK (@google/generative-ai)
- AWS SDK v3 (S3 업로드)
- Prisma (ORM, SQLite → PostgreSQL 전환 가능)

**Infrastructure:**
- AWS S3 (정적 호스팅 + 이미지 저장)
- AWS CloudFront (CDN)
- AWS EC2/ECS (백엔드 호스팅, 해커톤용 간단 설정)
- Docker + Docker Compose (로컬 개발)
- GitHub Actions (선택적 CI/CD)

**Database:**
- SQLite (로컬 개발, 빠른 시작)
- PostgreSQL (프로덕션, 필요시)

## Components and Interfaces

### Frontend Components

#### 1. DrawingCanvas Component
```typescript
interface DrawingCanvasProps {
  width: number;
  height: number;
  onSave: (imageData: string) => void;
  tools: DrawingTool[];
}

type DrawingTool = 'pen' | 'eraser' | 'fill' | 'clear';
```

**기능:**
- 터치/마우스 드로잉
- 색상 선택
- 브러시 크기 조절
- Undo/Redo
- PNG/JPEG export

#### 2. SimulationViewer Component
```typescript
interface SimulationViewerProps {
  type: 'solar-system' | 'circuit' | 'chemistry' | 'physics';
  parameters: Record<string, any>;
  interactive: boolean;
}
```

**기능:**
- Three.js 3D 렌더링
- Matter.js 물리 시뮬레이션
- 실시간 파라미터 조절
- 애니메이션 제어

#### 3. ImageGallery Component
```typescript
interface ImageGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

interface GeneratedImage {
  id: string;
  originalDrawing: string;
  generatedImage: string;
  prompt: string;
  createdAt: Date;
}
```

### Backend API Endpoints

#### Image Analysis & Generation

```typescript
// POST /api/analyze-drawing
interface AnalyzeDrawingRequest {
  image: string; // base64
}

interface AnalyzeDrawingResponse {
  description: string;
  suggestedPrompt: string;
  detectedObjects: string[];
}

// POST /api/generate-image
interface GenerateImageRequest {
  prompt: string;
  style?: 'realistic' | 'cartoon' | 'educational';
  referenceImage?: string; // base64
}

interface GenerateImageResponse {
  imageUrl: string;
  prompt: string;
  generationTime: number;
}
```

#### Storage

```typescript
// POST /api/save-creation
interface SaveCreationRequest {
  originalDrawing: string;
  generatedImage: string;
  prompt: string;
  metadata: Record<string, any>;
}

// GET /api/creations
interface GetCreationsResponse {
  creations: Creation[];
  total: number;
}
```

### Gemini API Integration

#### Service Layer

```typescript
class GeminiService {
  private visionModel: GenerativeModel;
  private imageModel: GenerativeModel;

  async analyzeDrawing(imageBase64: string): Promise<AnalysisResult> {
    // Gemini Vision API 호출
    const prompt = "Analyze this child's drawing and describe what they drew...";
    const result = await this.visionModel.generateContent([prompt, imageBase64]);
    return this.parseAnalysis(result);
  }

  async generateImage(prompt: string, style: string): Promise<string> {
    // Gemini 2.5 Flash Image API 호출
    const enhancedPrompt = this.enhancePrompt(prompt, style);
    const result = await this.imageModel.generateImage(enhancedPrompt);
    return result.imageUrl;
  }

  private enhancePrompt(prompt: string, style: string): string {
    // 교육용 스타일 적용
    const styleGuides = {
      educational: "child-friendly, colorful, clear, educational illustration",
      cartoon: "cartoon style, vibrant colors, fun and playful",
      realistic: "realistic, detailed, high quality"
    };
    return `${prompt}, ${styleGuides[style]}`;
  }
}
```

## Data Models

### Database Schema (Prisma)

```prisma
model Creation {
  id                String   @id @default(uuid())
  originalDrawing   String   // S3 URL or base64
  generatedImage    String   // S3 URL
  prompt            String
  analysis          String?  // Gemini Vision 분석 결과
  metadata          Json?    // 추가 정보
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Simulation {
  id          String   @id @default(uuid())
  type        String   // 'solar-system', 'circuit', etc.
  parameters  Json     // 시뮬레이션 파라미터
  snapshot    String?  // 스크린샷 URL
  createdAt   DateTime @default(now())
}
```

## Error Handling

### API Error Responses

```typescript
interface ApiError {
  error: string;
  message: string;
  code: string;
  details?: any;
}

// Error Codes
enum ErrorCode {
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  IMAGE_UPLOAD_FAILED = 'IMAGE_UPLOAD_FAILED',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  AWS_S3_ERROR = 'AWS_S3_ERROR',
}
```

### Error Handling Strategy

1. **Gemini API Errors**: Retry with exponential backoff (3회)
2. **Image Upload Errors**: 클라이언트에 명확한 에러 메시지
3. **Rate Limiting**: 429 응답 + Retry-After 헤더
4. **Validation Errors**: 400 응답 + 상세 필드 에러

## Testing Strategy

### Unit Tests (선택적, 해커톤용 최소화)

- Gemini API 서비스 모킹 테스트
- 이미지 처리 유틸리티 테스트
- API 엔드포인트 기본 테스트

### Integration Tests (선택적)

- Gemini API 실제 호출 테스트 (개발 중 수동)
- AWS S3 업로드 테스트

### Manual Testing Checklist

해커톤 전 반드시 확인:
- [ ] 캔버스 드로잉 → 이미지 저장
- [ ] Gemini Vision 분석 동작
- [ ] Gemini Image 생성 동작
- [ ] AWS S3 이미지 업로드
- [ ] Three.js 시뮬레이션 렌더링
- [ ] Matter.js 물리 엔진 동작
- [ ] 프론트엔드 빌드 및 S3 배포
- [ ] 백엔드 Docker 빌드 및 EC2 배포
- [ ] CORS 설정 확인
- [ ] 환경 변수 설정 확인

## Deployment Architecture

### AWS Infrastructure Setup

```yaml
# 사전 준비 리소스
Resources:
  # S3 Buckets
  - FrontendBucket: 정적 사이트 호스팅
  - ImageStorageBucket: 생성된 이미지 저장
  
  # CloudFront Distribution
  - CDN: S3 + API 통합
  
  # EC2 Instance (또는 ECS)
  - BackendServer:
      - Docker 컨테이너
      - Node.js API
      - Nginx 리버스 프록시
  
  # Security Groups
  - AllowHTTPS: 443 포트
  - AllowHTTP: 80 포트 (리다이렉트)
  - AllowSSH: 22 포트 (관리용)
```

### Deployment Scripts

```bash
# 프론트엔드 배포
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"

# 백엔드 배포
docker build -t hackathon-backend .
docker save hackathon-backend | gzip > backend.tar.gz
scp backend.tar.gz ec2-user@your-ec2-ip:/home/ec2-user/
ssh ec2-user@your-ec2-ip "docker load < backend.tar.gz && docker-compose up -d"
```

### Environment Variables

```bash
# .env.example (프론트엔드)
VITE_API_URL=https://api.yourdomain.com
VITE_AWS_REGION=ap-northeast-2

# .env.example (백엔드)
GEMINI_API_KEY=your_gemini_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-image-bucket
DATABASE_URL=file:./dev.db  # SQLite
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

## Development Workflow

### Quick Start (해커톤 당일)

```bash
# 1. 저장소 클론
git clone <repo-url>
cd hackathon-infrastructure

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (Gemini API Key 등)

# 3. Docker Compose로 전체 실행
docker-compose up

# 또는 개별 실행
cd frontend && npm install && npm run dev
cd backend && npm install && npm run dev
```

### Project Structure

```
hackathon-infrastructure/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DrawingCanvas.tsx
│   │   │   ├── SimulationViewer.tsx
│   │   │   └── ImageGallery.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── canvas.ts
│   │   │   └── image.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── analyze.ts
│   │   │   ├── generate.ts
│   │   │   └── storage.ts
│   │   ├── services/
│   │   │   ├── gemini.service.ts
│   │   │   ├── s3.service.ts
│   │   │   └── image.service.ts
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── deploy/
│   ├── deploy-frontend.sh
│   └── deploy-backend.sh
└── README.md
```

## Performance Considerations

### Image Optimization
- 클라이언트 사이드: 업로드 전 이미지 압축 (max 2MB)
- 서버 사이드: Sharp로 리사이징 (max 1024x1024)
- S3: CloudFront CDN으로 이미지 캐싱

### API Response Time
- Gemini API 호출: 평균 2-5초 (비동기 처리)
- 프론트엔드: 로딩 상태 표시
- 백엔드: 타임아웃 30초 설정

### Caching Strategy
- 정적 에셋: CloudFront 24시간 캐싱
- API 응답: 캐싱 없음 (실시간 생성)
- 생성된 이미지: S3 + CloudFront 영구 캐싱

## Security Considerations

### API Key Management
- Gemini API Key: 백엔드 환경 변수만
- AWS Credentials: IAM Role 사용 (EC2) 또는 환경 변수
- 프론트엔드: API Key 노출 금지

### CORS Configuration
```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Input Validation
- 이미지 크기: max 10MB
- 이미지 포맷: PNG, JPEG, WebP만 허용
- 프롬프트 길이: max 500자
- Rate Limiting: IP당 분당 10회

## Scalability Notes

해커톤용이므로 최소 스케일:
- EC2: t3.small (2 vCPU, 2GB RAM)
- S3: 무제한 (사용량 기반 과금)
- CloudFront: 자동 스케일
- Database: SQLite (단일 인스턴스)

필요시 확장:
- EC2 → ECS Fargate (컨테이너 오케스트레이션)
- SQLite → RDS PostgreSQL
- Load Balancer 추가
