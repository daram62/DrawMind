# 🎨 DrawMind

AI 기반 게이미피케이션 미술심리진단 서비스
Developed for the 5th SKKU AI Hackathon

## 🌱 프로젝트 개요

DrawMind는 사용자가 직접 그린 **그림을 AI가 분석하여 감정과 심리 상태를 이야기**로 재구성하는 웹 서비스입니다.
미술심리진단 이론을 기반으로, **게이미피케이션(Gamification)** 을 통해
누구나 부담 없이 자신의 내면을 탐색하고 치유할 수 있도록 설계했습니다.

📍 팀 목표: 사람들이 자신의 내면을 이해하고 스스로를 치유할 수 있도록 돕는 것

## 🎮 핵심 기능

1. 게이미피케이션 기반 엔티티 생성 - 사용자가 그림을 그리고, 배경과 합성되는 과정을 통해 몰입과 자기표현을 유도
2. 심리기법 기반 Dynamic Context Injection - 심리이론에 기반한 Dynamic Context Prompt로 AI 해석의 신뢰도와 맥락 적합성을 강화

## 🏝️ 스테이지 구성 (6단계 꿈의 항해)

1. 프롤로그 : HTP 검사
2. 새의 섬 : 자유화
3. 불의 섬 : 별·파도 검사
4. 다리의 섬 : 가족화
5. 비의 섬 : 빗속의 사람 검사
6. 가족의 섬 : 풍경 구성법

각 스테이지는 학술적으로 검증된 그림 심리검사 기법을 바탕으로 구성되어 있으며,
사용자는 게임처럼 탐험하며 자신의 감정을 시각적으로 표현합니다.

## 🧠 아키텍처 개요
![Architecture Diagram](image.png)

```
User (Browser)
  → Draw on Canvas (Frontend)
  → POST base64 image → Backend (FastAPI)a
  → AI Processing (LLM / Vision Model)
  → Response: AI Image + Story + Report
  → Frontend Displays & PDF Export

Frontend (React + Vite + Tailwind)
	•	HTML5 Canvas 기반 드로잉
	•	단계별 스토리 페이지 및 감정 리포트 화면
	•	API 통신: Axios

Backend (FastAPI)
	•	AI 분석 및 이미지 합성
	•	세션별 context 관리 (그림 + 리포트 텍스트 통합)
	•	외부 AI 모델 연동

Deploy
	•	Frontend: Vercel
	•	Backend: AWS EC2 (Docker)
```

## 🎥 시연 자료
- 🌐 데모 사이트: https://drawmind-omega.vercel.app
- ▶️ 시연 영상: [YouTube Demo](https://www.youtube.com/watch?v=0UD_bNDpvCU&feature=youtu.be)
- 🖼️ 발표 자료: [Canva 발표자료](https://www.canva.com/design/DAG1arh0yVQ/mPAa7bRD_Uxd_5Dhyr1CpQ/view?utm_content=DAG1arh0yVQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha2ce3e4367#11)

## 📘 참고 문헌
- 홍선미 (2016). 미술심리진단 및 평가, 원광대학교 KOCW.
- Machover, K. (1949). Projective Drawings of Human Figures.
- Buck, J. N. (1948). House-Tree-Person Technique.
- Burns, R. C. & Kaufman, S. H. (1970). Kinetic Family Drawing (KFD).
- Koch, K. (1952). Der Baumtest (The Tree Test).

---
Made with 핵허톤!
SKKU AI Hackathon 2025
