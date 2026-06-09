# 🎨 DrawMind
[ENG](#english) | [KOR](#korean)

<img width="892" height="591" alt="image" src="https://github.com/user-attachments/assets/dc47fc60-8a07-4b65-bba9-666509514372" />

<a id="english"></a>
**AI-powered gamified art-therapy psychological assessment service**

(Winner of the 5th SKKU AI Hackathon)

DrawMind is a gamified art-therapy inspired web experience that turns a user's hand-drawn sketch into an AI-generated story and emotional report. The flow is built around a six-stage journey, where each stage presents a narrative prompt, captures a drawing on a canvas, sends the sketch to the backend as base64 image data, and then displays the generated image, story, and feedback.

This workspace contains the frontend implementation. API requests are routed through Vercel to the deployed backend used by the project, and the frontend can also be configured locally by setting the API base URL.

### Demo

- Live demo: https://drawmind-omega.vercel.app
- Demo video: https://www.youtube.com/watch?v=0UD_bNDpvCU&feature=youtu.be
- Presentation: https://www.canva.com/design/DAG1arh0yVQ/mPAa7bRD_Uxd_5Dhyr1CpQ/view?utm_content=DAG1arh0yVQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha2ce3e4367#11

### Key Features

- Story-driven drawing flow with six themed stages
- HTML5 canvas sketchbook with pen, eraser, color selection, and clear/save actions
- AI-powered image generation and stage-by-stage feedback
- Session-based report aggregation for the full journey
- PDF export for the final emotional analysis report
- Background music that changes by stage

### Stage Overview

1. Prologue: The Start of the Voyage
2. Bird Island
3. Fire Island
4. Bridge Island
5. Rain Island
6. Family Island

### Architecture
![Architecture Diagram](image.png)

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- html2canvas
- jsPDF

### Project Structure

- frontend/: React application
- frontend/src/pages/: Home, start, drawing flow, and analysis pages
- frontend/src/components/: Layout and sketchbook canvas
- frontend/src/services/: API, audio, and drawing service helpers
- frontend/public/: stage visuals, sounds, and fonts

### API Notes

- POST /api/generate-fairy-tale
- POST /api/generate-fairy-tale/session-aggregate
- GET /api/report/:sessionId
- GET /api/session/:sessionId/images

The frontend uses VITE_API_BASE_URL or VITE_API_URL when provided, and falls back to http://localhost:8000.

### Local Development

1. Install dependencies in frontend/
2. Set the API base URL if the backend is running elsewhere
3. Run the Vite dev server

Example:

```bash
cd frontend
npm install
npm run dev
```
---
<a id="korean"></a>
**AI 기반 게이미피케이션 미술심리진단 서비스**

제 5회 SKKU AI Hackathon 수상

DrawMind는 사용자가 직접 그린 그림을 AI가 해석해 이야기와 감정 리포트로 확장해주는 게이미피케이션 기반 웹 서비스입니다. 총 6개의 스테이지로 구성되어 있으며, 각 단계마다 스토리 프롬프트를 보고 캔버스에 그림을 그리면, 이미지가 백엔드로 전송되어 결과 이미지와 해석이 생성됩니다.

이 워크스페이스에는 프론트엔드 구현이 포함되어 있습니다. API 요청은 Vercel 설정을 통해 배포된 백엔드로 라우팅되며, 로컬에서도 API 주소를 설정하면 프론트엔드를 실행할 수 있습니다.

### 데모

- 데모 사이트: https://drawmind-omega.vercel.app
- 시연 영상: https://www.youtube.com/watch?v=0UD_bNDpvCU&feature=youtu.be
- 발표 자료: https://www.canva.com/design/DAG1arh0yVQ/mPAa7bRD_Uxd_5Dhyr1CpQ/view?utm_content=DAG1arh0yVQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha2ce3e4367#11


### 핵심 기능

- 6단계 스토리 기반 드로잉 진행
- 연필, 지우개, 색상 선택, 초기화, 완성 기능을 갖춘 HTML5 캔버스
- AI 기반 이미지 생성 및 단계별 피드백
- 세션 단위 리포트 누적 및 최종 분석
- 최종 감정 분석 리포트 PDF 내보내기
- 단계별 배경음악 전환

### 스테이지 구성

1. 프롤로그: 항해의 시작
2. 새의 섬
3. 불의 섬
4. 다리의 섬
5. 비의 섬
6. 가족의 섬

### 아키텍쳐
![Architecture Diagram](image.png)

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- html2canvas
- jsPDF

### 프로젝트 구조

- frontend/: React 애플리케이션
- frontend/src/pages/: 홈, 시작, 드로잉 플로우, 분석 페이지
- frontend/src/components/: 레이아웃과 스케치북 캔버스
- frontend/src/services/: API, 오디오, 드로잉 관련 서비스
- frontend/public/: 스테이지 이미지, 사운드, 폰트

### API 참고

- POST /api/generate-fairy-tale
- POST /api/generate-fairy-tale/session-aggregate
- GET /api/report/:sessionId
- GET /api/session/:sessionId/images

프론트엔드는 VITE_API_BASE_URL 또는 VITE_API_URL이 있으면 그 값을 사용하고, 없으면 기본값으로 http://localhost:8000을 사용합니다.

### 로컬 실행

1. frontend/에서 의존성을 설치합니다.
2. 백엔드가 다른 주소에서 실행 중이라면 API 주소를 설정합니다.
3. Vite 개발 서버를 실행합니다.

예시:

```bash
cd frontend
npm install
npm run dev
```

## 📘 참고 문헌
- 홍선미 (2016). 미술심리진단 및 평가, 원광대학교 KOCW.
- Machover, K. (1949). Projective Drawings of Human Figures.
- Buck, J. N. (1948). House-Tree-Person Technique.
- Burns, R. C. & Kaufman, S. H. (1970). Kinetic Family Drawing (KFD).
- Koch, K. (1952). Der Baumtest (The Tree Test).

---
Made with 핵허톤!
SKKU AI Hackathon 2025
