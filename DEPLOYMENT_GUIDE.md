# 🚀 빠른 배포 가이드

이 가이드는 Vercel + Railway를 사용한 빠른 배포 방법을 설명합니다.

## ✅ 완료된 AWS 설정

- **S3 버킷**: `hackathon-infra-files-1760091778`
- **리전**: `ap-northeast-2`
- **용도**: 파일 저장 (이미지 업로드 등)

## 🎯 배포 옵션

### 옵션 1: Vercel + Railway (추천 - 5분)

가장 빠르고 쉬운 방법입니다.

#### 프론트엔드 (Vercel)

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 배포**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```

3. **환경 변수 설정** (Vercel 대시보드)
   - `VITE_API_URL`: Railway 백엔드 URL (다음 단계에서 얻음)

#### 백엔드 (Railway)

1. **Railway 계정 생성**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **프로젝트 배포**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 저장소 선택

3. **환경 변수 설정** (Railway 대시보드)
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://...  # Railway가 자동 생성
   
   # AWS S3
   AWS_REGION=ap-northeast-2
   AWS_ACCESS_KEY_ID=<your-key>
   AWS_SECRET_ACCESS_KEY=<your-secret>
   AWS_S3_BUCKET=hackathon-infra-files-1760091778
   
   # CORS
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   
   # AI (선택)
   AI_PROVIDER=gemini
   GEMINI_API_KEY=<your-key>
   ```

4. **PostgreSQL 추가**
   - Railway 대시보드에서 "New" → "Database" → "PostgreSQL"
   - 자동으로 `DATABASE_URL` 환경 변수 생성됨

5. **배포 URL 확인**
   - Railway 대시보드에서 배포 URL 복사
   - Vercel 환경 변수에 `VITE_API_URL` 업데이트

### 옵션 2: Netlify + Render

#### 프론트엔드 (Netlify)

1. **Netlify 계정 생성**
   - https://netlify.com 접속

2. **프로젝트 배포**
   ```bash
   cd frontend
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **빌드 설정**
   - Build command: `npm run build`
   - Publish directory: `dist`

#### 백엔드 (Render)

1. **Render 계정 생성**
   - https://render.com 접속

2. **Web Service 생성**
   - "New" → "Web Service"
   - GitHub 저장소 연결
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm start`

3. **PostgreSQL 추가**
   - "New" → "PostgreSQL"
   - 데이터베이스 URL을 `DATABASE_URL`에 설정

### 옵션 3: AWS 풀스택 (고급)

자세한 내용은 `AWS_DEPLOYMENT.md` 참조

## 🔧 배포 후 확인사항

### 1. 백엔드 Health Check
```bash
curl https://your-backend-url.com/health
```

예상 응답:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-01-10T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. 프론트엔드 접속
브라우저에서 Vercel URL 접속:
- Home 페이지 확인
- Projects 페이지 확인
- 프로젝트 생성 테스트

### 3. 파일 업로드 테스트
1. 프로젝트 생성
2. 이미지 업로드
3. S3 버킷에서 파일 확인

## 📊 배포 상태 모니터링

### Vercel
- 대시보드: https://vercel.com/dashboard
- 로그 확인: Deployments → Logs

### Railway
- 대시보드: https://railway.app/dashboard
- 로그 확인: Project → Deployments → Logs

### Render
- 대시보드: https://dashboard.render.com
- 로그 확인: Service → Logs

## 🐛 트러블슈팅

### 문제: CORS 에러
**해결**: 백엔드 `ALLOWED_ORIGINS`에 프론트엔드 URL 추가

### 문제: 데이터베이스 연결 실패
**해결**: `DATABASE_URL` 환경 변수 확인

### 문제: S3 업로드 실패
**해결**: 
- AWS 자격증명 확인
- S3 버킷 이름 확인
- CORS 설정 확인

### 문제: 빌드 실패
**해결**:
- `package.json` 의존성 확인
- Node.js 버전 확인 (18+ 필요)
- 빌드 로그 확인

## 💰 예상 비용

### 무료 티어
- **Vercel**: 무료 (Hobby 플랜)
- **Railway**: $5/월 크레딧 (무료 시작)
- **Netlify**: 무료 (Starter 플랜)
- **Render**: 무료 (Web Service)
- **AWS S3**: ~$0.23/월 (10GB 기준)

### 유료 플랜 (필요시)
- **Railway Pro**: $20/월
- **Render Starter**: $7/월
- **Vercel Pro**: $20/월

## 🎉 배포 완료!

축하합니다! 이제 프로덕션 환경에서 애플리케이션이 실행됩니다.

### 다음 단계
1. 커스텀 도메인 연결 (선택)
2. SSL 인증서 설정 (자동)
3. 모니터링 설정
4. 백업 설정

### 유용한 링크
- Vercel 문서: https://vercel.com/docs
- Railway 문서: https://docs.railway.app
- Render 문서: https://render.com/docs
- AWS S3 문서: https://docs.aws.amazon.com/s3/
