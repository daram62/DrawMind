# Implementation Plan

## Phase 1: 사전 인프라 세팅 (해커톤 전)
> 주제와 무관하게 미리 구축해둘 범용 인프라

- [x] 1. 프로젝트 초기 설정 및 기본 구조 생성
  - 프론트엔드와 백엔드 디렉토리 구조 생성
  - package.json 및 기본 설정 파일 작성
  - TypeScript, ESLint, Prettier 설정
  - Docker 및 Docker Compose 설정 파일 작성
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. 프론트엔드 기본 환경 구축
  - [x] 2.1 React + Vite 프로젝트 초기화 및 기본 설정
    - Vite로 React + TypeScript 프로젝트 생성
    - Tailwind CSS 설정
    - React Router 설정
    - 기본 레이아웃 컴포넌트 작성
    - API 클라이언트 유틸리티 (Axios/Fetch)
    - _Requirements: 1.1, 1.4_

  - [x] 2.2 공통 UI 컴포넌트 라이브러리 구축
    - Button, Input, Card 등 기본 컴포넌트
    - Loading Spinner
    - Modal/Dialog
    - Toast 알림
    - _Requirements: 6.5_

  - [x] 2.3 이미지 처리 유틸리티 구현
    - 클라이언트 사이드 이미지 압축
    - Base64 변환 함수
    - 이미지 크기 검증
    - 파일 업로드 헬퍼
    - _Requirements: 6.2_

- [x] 3. 백엔드 API 서버 구축
  - [x] 3.1 Express 서버 초기화 및 미들웨어 설정
    - Express + TypeScript 프로젝트 설정
    - CORS 설정 (환경 변수로 Origin 관리)
    - Body parser, Multer 설정
    - 에러 핸들링 미들웨어
    - Rate limiting 미들웨어
    - Health check 엔드포인트 (/health)
    - _Requirements: 2.1, 2.5_

  - [x] 3.2 파일 업로드 엔드포인트 구현
    - POST /api/upload 엔드포인트
    - Multer로 멀티파트 파일 처리
    - Base64 이미지 수신 처리
    - 이미지 포맷 및 크기 검증
    - Sharp로 이미지 리사이징/최적화
    - _Requirements: 2.2, 2.5_

  - [x] 3.3 범용 AI API 서비스 구조 구현
    - AI 서비스 인터페이스 정의 (추상화)
    - 환경 변수로 AI 제공자 선택 (OpenAI/Claude/Gemini)
    - 에러 핸들링 및 재시도 로직
    - 타임아웃 설정
    - _Requirements: 2.6, 2.7_

- [x] 4. AWS S3 통합 및 파일 저장
  - [x] 4.1 AWS SDK 설정 및 S3 서비스 구현
    - AWS SDK v3 설치
    - S3Client 초기화 (환경 변수로 설정)
    - 파일 업로드 함수 작성
    - 공개 URL 생성 함수
    - 파일 삭제 함수
    - _Requirements: 2.5_

  - [x] 4.2 파일 저장 API 엔드포인트 구현
    - POST /api/files/upload - S3에 파일 업로드
    - GET /api/files/:id - 파일 URL 조회
    - DELETE /api/files/:id - 파일 삭제
    - _Requirements: 3.2_

- [x] 5. 데이터베이스 설정 및 CRUD API
  - [x] 5.1 Prisma 설정 및 기본 스키마 정의
    - Prisma 설치 및 초기화
    - SQLite 데이터베이스 설정 (개발용)
    - PostgreSQL 설정 준비 (환경 변수)
    - 범용 데이터 모델 정의 (User, Project, File 등)
    - 마이그레이션 실행
    - _Requirements: 3.1, 3.4_

  - [x] 5.2 기본 CRUD API 구현
    - POST /api/projects - 프로젝트 생성
    - GET /api/projects - 프로젝트 목록
    - GET /api/projects/:id - 프로젝트 상세
    - PUT /api/projects/:id - 프로젝트 수정
    - DELETE /api/projects/:id - 프로젝트 삭제
    - _Requirements: 3.2, 3.3_

- [x] 6. 프론트엔드-백엔드 통합 테스트
  - [x] 6.1 API 클라이언트 서비스 작성
    - Axios 기반 API 클라이언트
    - 파일 업로드, 프로젝트 CRUD 함수
    - 에러 핸들링 및 재시도 로직
    - _Requirements: 2.1_

  - [x] 6.2 기본 프로젝트 관리 UI 구현
    - 프로젝트 목록 페이지
    - 프로젝트 생성 폼
    - 파일 업로드 UI
    - 로딩 및 에러 상태 표시
    - _Requirements: 1.4_

- [x] 7. AWS 배포 인프라 설정
  - [x] 7.1 S3 버킷 생성 및 정적 호스팅 설정
    - 프론트엔드용 S3 버킷 생성
    - 정적 웹사이트 호스팅 활성화
    - 버킷 정책 설정 (공개 읽기)
    - _Requirements: 4.1_

  - [x] 7.2 CloudFront 배포 설정
    - CloudFront Distribution 생성
    - S3를 Origin으로 설정
    - HTTPS 설정
    - _Requirements: 4.1_

  - [x] 7.3 파일 저장용 S3 버킷 생성
    - 이미지 저장용 별도 S3 버킷 생성
    - CORS 설정
    - 공개 읽기 정책 설정
    - _Requirements: 4.1_

  - [x] 7.4 EC2 인스턴스 설정 및 Docker 환경 구축
    - EC2 인스턴스 생성 (t3.small)
    - Security Group 설정 (80, 443, 22 포트)
    - Docker 및 Docker Compose 설치
    - Nginx 리버스 프록시 설정 (선택적)
    - _Requirements: 4.2_

- [x] 8. 배포 자동화 스크립트 작성
  - [x] 8.1 프론트엔드 배포 스크립트
    - 빌드 스크립트 (npm run build)
    - S3 sync 스크립트
    - CloudFront 캐시 무효화 스크립트
    - _Requirements: 4.3, 4.4_

  - [x] 8.2 백엔드 배포 스크립트
    - Docker 이미지 빌드 스크립트
    - EC2로 이미지 전송 스크립트
    - Docker Compose 실행 스크립트
    - _Requirements: 4.2, 4.4, 4.5_

- [x] 9. 환경 변수 및 설정 파일 준비
  - [x] 9.1 환경 변수 템플릿 작성
    - .env.example 파일 작성 (프론트엔드)
    - .env.example 파일 작성 (백엔드)
    - README에 환경 변수 설명 추가
    - _Requirements: 5.3_

  - [x] 9.2 Docker Compose 환경 변수 설정
    - docker-compose.yml에 환경 변수 매핑
    - 로컬 개발용 기본값 설정
    - _Requirements: 5.1_

- [x] 10. 문서화 및 Quick Start 가이드 작성
  - [x] 10.1 README.md 작성
    - 프로젝트 개요
    - 기술 스택
    - 로컬 개발 환경 설정 방법
    - 배포 방법
    - 환경 변수 설명
    - _Requirements: 5.2_

  - [x] 10.2 해커톤 당일 빠른 시작 가이드 작성
    - 사전 준비 항목
    - 빠른 시작 명령어
    - 트러블슈팅 가이드
    - _Requirements: 5.2_

- [x] 11. 통합 테스트 및 검증
  - [x] 11.1 로컬 환경 전체 플로우 테스트
    - Docker Compose로 전체 스택 실행
    - 프로젝트 생성/조회/수정/삭제 테스트
    - 파일 업로드 및 S3 저장 테스트
    - 데이터베이스 CRUD 테스트
    - _Requirements: 3.2, 4.2_

  - [x] 11.2 AWS 배포 환경 테스트
    - 프론트엔드 S3 + CloudFront 배포 테스트
    - 백엔드 EC2 배포 테스트
    - CORS 설정 확인
    - HTTPS 연결 확인
    - Health check 엔드포인트 확인
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 11.3 성능 및 에러 핸들링 검증
    - 파일 업로드 크기 제한 테스트
    - Rate limiting 테스트
    - 타임아웃 처리 테스트
    - 로딩 상태 UI 확인
    - _Requirements: 2.5_

## Phase 2: 해커톤 당일 구현 (주제 확정 후)
> 주제에 맞춰 빠르게 추가할 기능들

- [ ] 12. 주제별 기능 구현 (예: Gemini API 통합)
  - [ ] 12.1 Gemini API 서비스 구현
    - @google/generative-ai SDK 설치
    - GeminiService 클래스 작성
    - Vision API 연동
    - Image Generation API 연동
    - _Requirements: 2.3, 2.4_

  - [ ] 12.2 DrawingCanvas 컴포넌트 구현
    - Canvas API 드로잉 기능
    - 터치/마우스 이벤트
    - 색상/브러시 선택
    - PNG export
    - _Requirements: 1.2, 6.1_

  - [ ] 12.3 시각화 라이브러리 통합
    - Three.js 3D 씬 구현
    - Matter.js 물리 엔진 통합
    - 주제에 맞는 시뮬레이션 구현
    - _Requirements: 6.3, 6.4_

  - [ ] 12.4 AI 기능 API 엔드포인트 추가
    - POST /api/analyze - 이미지 분석
    - POST /api/generate - 이미지 생성
    - 프론트엔드 통합
    - _Requirements: 2.3, 2.4_
