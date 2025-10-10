# 🎨 그리기 플로우 가이드

동화책 스타일의 그리기 애플리케이션 구현 가이드입니다.

## 📋 플로우 구조

```
시작 화면 (Welcome)
    ↓
시나리오 안내 + 그리기 화면 (Drawing)
    ↓
AI 처리 중 (Processing)
    ↓
완성 결과 (Result)
```

## 🎯 주요 기능

### 1. 시작 화면 (Welcome)
- 애플리케이션 소개
- 사용 방법 안내
- "모험 시작하기" 버튼

### 2. 그리기 화면 (Drawing)
- **시나리오 카드**: 상단에 오늘의 이야기 표시
- **스케치북 캔버스**: 
  - 800x600 크기의 캔버스
  - 스케치북 테두리 효과 (노란색 그라데이션)
  - 왼쪽에 구멍 장식 (스케치북 느낌)
  - 종이 질감 배경 (#fffef9)
- **도구 모음**:
  - 펜/지우개 선택
  - 8가지 색상 팔레트
  - 브러시 굵기 조절 (1-20)
  - 전체 지우기 버튼
  - 완성 버튼

### 3. 처리 화면 (Processing)
- 마법 스피너 애니메이션
- 처리 중 메시지

### 4. 결과 화면 (Result)
- 원본 그림 표시
- AI 향상 그림 (옵션)
- AI가 생성한 이야기
- 다시 그리기 / 저장하기 버튼

## 🔧 기술 구현

### Frontend

#### 컴포넌트 구조
```
DrawingFlowPage.tsx          # 메인 플로우 관리
├── StorybookPage            # 페이지 래퍼 (배경, 장식)
├── SketchbookCanvas         # 그리기 캔버스
└── StorybookComponents      # UI 컴포넌트들
```

#### 캔버스 기능
```typescript
// 그리기 시작
const startDrawing = (e: MouseEvent) => {
  setIsDrawing(true);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

// 그리기
const draw = (e: MouseEvent) => {
  if (!isDrawing) return;
  ctx.lineTo(x, y);
  ctx.stroke();
};

// 이미지 저장
const saveDrawing = () => {
  const imageData = canvas.toDataURL('image/png');
  onDrawingComplete(imageData);
};
```

### Backend

#### API 엔드포인트

**POST /api/drawings/process**
```python
# 그림 처리
- Input: image (file), scenario (string)
- Output: {
    originalImage: string,
    enhancedImage: string,
    story: string,
    analysis: object
  }
```

**GET /api/scenarios/random**
```python
# 랜덤 시나리오
- Output: { id, text, category }
```

**POST /api/drawings/save**
```python
# 그림 저장
- Input: { image, scenario, story, title }
- Output: { id, url }
```

**GET /api/drawings**
```python
# 저장된 그림 목록
- Output: [{ id, title, thumbnail, createdAt }]
```

## 🚀 실행 방법

### 1. 백엔드 실행

```bash
cd backend-fastapi

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

### 2. 프론트엔드 실행

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 3. 접속

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🎨 스타일 커스터마이징

### 캔버스 배경색 변경
```typescript
// SketchbookCanvas.tsx
ctx.fillStyle = '#fffef9';  // 원하는 색상으로 변경
```

### 스케치북 테두리 색상
```typescript
// SketchbookCanvas.tsx
<div className="absolute -inset-4 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-200">
```

### 색상 팔레트 수정
```typescript
const colors = [
  '#2c3e50',  // 검정
  '#e74c3c',  // 빨강
  '#3498db',  // 파랑
  // ... 원하는 색상 추가
];
```

## 🔮 AI 통합 가이드

### 1. 이미지 분석 (예: OpenAI Vision API)

```python
import openai

async def analyze_image(image_data: bytes):
    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "이 그림을 분석해주세요."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_data}"}}
            ]
        }]
    )
    return response.choices[0].message.content
```

### 2. 스토리 생성 (예: GPT-4)

```python
async def generate_story(scenario: str, image_analysis: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": "당신은 동화 작가입니다. 아이들을 위한 따뜻한 이야기를 만들어주세요."
        }, {
            "role": "user",
            "content": f"시나리오: {scenario}\n그림 분석: {image_analysis}\n\n이를 바탕으로 짧은 동화를 만들어주세요."
        }]
    )
    return response.choices[0].message.content
```

### 3. 이미지 향상 (예: Stable Diffusion)

```python
from diffusers import StableDiffusionImg2ImgPipeline

async def enhance_image(image: Image, scenario: str):
    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5"
    )
    
    prompt = f"beautiful storybook illustration, {scenario}, watercolor style"
    enhanced = pipe(prompt=prompt, image=image, strength=0.5).images[0]
    
    return enhanced
```

## 📝 TODO 리스트

### 필수 기능
- [ ] 실제 AI 모델 통합
- [ ] 이미지 저장소 연동 (S3)
- [ ] 데이터베이스 연동
- [ ] 사용자 인증

### 추가 기능
- [ ] 터치 디바이스 지원
- [ ] 실행 취소/다시 실행
- [ ] 레이어 기능
- [ ] 스탬프/스티커 추가
- [ ] 배경 템플릿
- [ ] 그림 공유 기능
- [ ] 갤러리 페이지

### 최적화
- [ ] 이미지 압축
- [ ] 로딩 상태 개선
- [ ] 에러 처리 강화
- [ ] 반응형 디자인 개선

## 🎯 사용 예시

### 기본 사용
```typescript
import DrawingFlowPage from './pages/DrawingFlowPage';

// App.tsx에서
<Route path="/draw" element={<DrawingFlowPage />} />
```

### 커스텀 시나리오
```typescript
// 특정 시나리오로 시작
<DrawingFlowPage initialScenario="마법의 숲에서..." />
```

### 콜백 처리
```typescript
<DrawingFlowPage 
  onComplete={(result) => {
    console.log('그림 완성!', result);
    // 저장, 공유 등의 추가 작업
  }}
/>
```

## 💡 팁

1. **성능 최적화**: 큰 캔버스는 성능에 영향을 줄 수 있어요. 필요에 따라 크기를 조절하세요.

2. **모바일 지원**: 터치 이벤트를 추가하려면 `onTouchStart`, `onTouchMove`, `onTouchEnd`를 구현하세요.

3. **브러시 효과**: `ctx.globalCompositeOperation`을 사용하면 다양한 블렌딩 효과를 만들 수 있어요.

4. **이미지 품질**: `canvas.toDataURL('image/png', 1.0)`에서 두 번째 인자로 품질을 조절할 수 있어요.

5. **백엔드 타임아웃**: AI 처리가 오래 걸릴 수 있으니 적절한 타임아웃을 설정하세요.

## 🐛 문제 해결

### CORS 에러
```python
# backend-fastapi/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 이미지 업로드 실패
```python
# requirements.txt에 추가
python-multipart==0.0.6
```

### 캔버스가 흐릿하게 보임
```typescript
// 고해상도 지원
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
ctx.scale(dpr, dpr);
```

즐거운 개발 되세요! 🎨✨
