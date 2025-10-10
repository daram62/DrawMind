# 🎨 Draw-Mind (SKKU-AI Hackathon)

이 프로젝트는 성균관대학교 컴퓨터교육학과와 글로벌융합학부가 공동 주관한 "제5회 SKKU AI Hackathon"의 '사람 중심의 인공지능 서비스 개발 (Human-centered AI)' 주제로 만들어진 서비스입니다.

이 저장소는 "AI가 사용자의 그림을 해석해 동화(스토리)를 생성하는 웹 애플리케이션"의 프론트엔드와 관련 문서를 포함합니다.

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

참고: Vite 기본 포트(5173)가 사용 중이면 Vite가 자동으로 다른 포트(예: 5174)를 할당합니다. 터미널 출력을 확인해서 로컬 URL을 열어주세요.

### 빌드

```bash
npm run build
```
---

## 📌 주요 아이디어

- 사용자가 캔버스에서 그림을 그립니다.
- 그 그림은 백엔드 API로 전송되어 AI가 분석하고, 분석 결과를 바탕으로 짧은 동화(스토리)를 생성합니다.
- 완성된 그림과 스토리는 저장·공유·다운로드가 가능합니다.

이 서비스의 핵심은 "사람 중심" 관점에서 사용자가 창작 활동을 통해 감정과 이야기를 표현하도록 돕고, AI가 이를 보조·확장하는 데 있습니다.

---

## 🚀 기술 스택 (요약)

- 프론트엔드: React 18 + TypeScript, Vite
- 스타일: Tailwind CSS
- 라우팅: React Router
- 캔버스: HTML5 Canvas (custom drawing component)
- HTTP: Axios
- 빌드/배포: Vercel (프론트엔드), 백엔드 별도 운용

---

## 📁 저장소 구조 (중요 부분)

```
frontend/
├── public/                 # 이미지, 폰트, 정적 자원
├── src/
│   ├── components/         # SketchbookCanvas, Layout 등
│   ├── pages/              # StartPage, HomePage, DrawingFlowPage, EmotionAnalysisPage
│   ├── services/           # API 클라이언트 (drawingService 등)
│   └── main.tsx / App.tsx
└── package.json

README.md (this file)
```

---

## ⚙️ 로컬 개발 (빠른 시작)

1. 레포 클론 후 프론트엔드 디렉터리로 이동

```bash
cd frontend
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

참고: Vite 기본 포트(5173)가 사용 중이면 Vite가 자동으로 다른 포트(예: 5174)를 할당합니다. 터미널 출력을 확인해서 로컬 URL을 열어주세요.

---

## 📦 빌드 및 배포

빌드

```bash
npm run build
```

Vercel 설정 (프론트엔드)

- Framework: Vite
- Root Directory: frontend
- Build Command: npm run build
- Output Directory: dist
- 환경 변수: VITE_API_BASE_URL (백엔드 엔드포인트 URL)

---

## 🔗 백엔드 API

프론트엔드는 백엔드 API (별도 배포)를 호출하도록 구성되어 있습니다. 기본 예시:

- API Base URL: http://43.200.181.143:8001
- API 문서(예시): http://43.200.181.143:8001/docs

환경 변수로 실제 배포 URL을 설정하세요:

```env
VITE_API_BASE_URL=http://43.200.181.143:8001
```

---

## ✅ 주요 기능

- HTML5 Canvas 기반 드로잉 인터페이스 (SketchbookCanvas)
- 단계별 스토리 흐름(DrawingFlowPage)
- 그림 업로드 및 AI 기반 스토리 생성 (백엔드 연동)
- 최종 이미지 합성 및 감정 분석 결과 확인

---

## 📋 기여 가이드

1. 포크 후 브랜치 생성: `feature/<이름>`
2. 변경 사항 커밋
3. PR 생성 및 리뷰 요청

---

## 문제 및 주의사항

- 개발 중 `npm install` 후 보안 경고(audit)나 deprecated 경고가 뜰 수 있습니다. 실행에는 대개 영향이 없지만, 장기적으로 의존성 업데이트가 필요합니다.
- 모바일 터치에서 캔버스와 페이지 스크롤 충돌 문제가 있을 수 있어, 터치 이벤트 처리 로직을 일부 보완했습니다. 필요하면 더 엄격한 touch-action 정책을 적용할 수 있습니다.

---
## 연락 및 주최

이 프로젝트는 제5회 SKKU AI 해커톤(2025) 참가작이며, 성균관대학교 컴퓨터교육학과와 글로벌융합학부가 공동 주최하였습니다.

프로젝트 관련 문의는 저장소 이슈를 이용해 주세요.

---

Made with ❤️ for human-centered AI (SKKU Hackathon 2025)
