# Design Document

## Overview

"The Forest Within"은 감정 치유를 위한 인터랙티브 AI 경험으로, 사용자가 그린 그림을 통해 5개의 감정 챕터를 여행하며 자기 이해와 회복을 경험합니다. 텔레스트레이션/갈틱폰 스타일의 귀여운 스케치북 UI에서 Gemini AI가 그림을 분석하고 치유적 내러티브를 생성하며, 최종적으로 Sora2가 전체 여정을 쇼츠 영상으로 만들어줍니다.

**핵심 플로우:**
```
시작 → 프롤로그(동반자 생성) → 챕터 1~5(그림+분석+내러티브) → 에필로그(그래프+영상) → 완료
```

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Sketchbook  │  │   Chapter    │  │   Emotion    │          │
│  │   Canvas     │  │  Navigation  │  │    Graph     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                  React + Canvas API                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Server                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Journey    │  │   Emotion    │  │    Video     │          │
│  │   Manager    │  │   Analyzer   │  │  Generator   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                  FastAPI + Python                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │   Gemini     │  │    Sora2     │  │   AWS S3     │
      │   Vision     │  │    Video     │  │   Storage    │
      │   + Pro      │  │  Generation  │  │              │
      └──────────────┘  └──────────────┘  └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  PostgreSQL  │
                      │   Journey    │
                      │    Data      │
                      └──────────────┘
```

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Canvas API (드로잉)
- Framer Motion (애니메이션)
- React Router (챕터 네비게이션)
- Tailwind CSS + Custom 스케치북 테마
- Howler.js (배경음악/효과음)
- Chart.js (감정 그래프)

**Backend:**
- Python + FastAPI
- WebSocket (실시간 AI 응답)
- SQLAlchemy ORM (PostgreSQL)
- Google Generative AI SDK (google-generativeai)
- OpenAI SDK (Sora2 API)
- Boto3 (AWS S3 이미지 저장)
- Pillow (이미지 처리)

**AI Services:**
- Gemini 1.5 Flash (이미지 분석)
- Gemini 1.5 Pro (내러티브 생성)
- Sora2 (영상 생성)

**Infrastructure:**
- AWS S3 (이미지 저장)
- AWS CloudFront (CDN)
- AWS EC2/ECS (백엔드)
- PostgreSQL (여정 데이터)

## Components and Interfaces

### Frontend Components

#### 1. SketchbookCanvas Component
```typescript
interface SketchbookCanvasProps {
  chapterTheme: ChapterTheme;
  onDrawingComplete: (imageData: string) => void;
  onDrawingChange: (hasContent: boolean) => void;
}

interface ChapterTheme {
  backgroundColor: string;
  borderColor: string;
  paperTexture: string;
  prompt: string;
}

interface DrawingTool {
  type: 'pen' | 'eraser' | 'fill';
  color: string;
  size: number;
}
```

**기능:**
- 스케치북 스타일 캔버스 (종이 질감, 테두리)
- 크레용/색연필 스타일 브러시
- 색상 팔레트 (파스텔 톤)
- Undo/Redo 스택
- 터치/마우스 최적화
- PNG export

#### 2. ChapterNavigator Component
```typescript
interface ChapterNavigatorProps {
  currentChapter: number;
  totalChapters: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

interface Chapter {
  id: number;
  title: string;
  emotionTheme: EmotionType;
  prompt: string;
  backgroundColor: string;
  icon: string;
}

type EmotionType = 'anxiety' | 'regret' | 'anger' | 'self-doubt' | 'recovery';
```

**기능:**
- 페이지 넘김 애니메이션
- 챕터 진행 표시 (1/5, 2/5...)
- 이전/다음 버튼
- 챕터 테마별 배경색

#### 3. CompanionDialogue Component
```typescript
interface CompanionDialogueProps {
  character: CompanionCharacter;
  message: string;
  isTyping: boolean;
  onComplete: () => void;
}

interface CompanionCharacter {
  name: string;
  avatar: string; // Gemini가 생성한 설명 기반 이미지
  personality: string;
}
```

**기능:**
- 타이핑 애니메이션
- 말풍선 스타일 대화창
- 캐릭터 아바타 표시
- 부드러운 페이드 인/아웃

#### 4. EmotionGraph Component
```typescript
interface EmotionGraphProps {
  journeyData: JourneyData[];
  onChapterClick: (chapterId: number) => void;
}

interface JourneyData {
  chapterId: number;
  emotionScore: EmotionScore;
  drawing: string; // S3 URL
  timestamp: Date;
}

interface EmotionScore {
  anxiety: number; // 0-100
  positivity: number; // 0-100
  energy: number; // 0-100
}
```

**기능:**
- 감정 변화 곡선 그래프
- 챕터별 그림 썸네일
- 인터랙티브 호버 효과
- 애니메이션 그래프 그리기

#### 5. VideoPlayer Component
```typescript
interface VideoPlayerProps {
  videoUrl: string;
  isGenerating: boolean;
  progress: number;
  onDownload: () => void;
}
```

**기능:**
- 영상 재생 컨트롤
- 생성 진행 상황 표시
- 다운로드 버튼
- 공유 버튼 (선택적)

### Backend API Endpoints

#### Journey Management

```python
# POST /api/journeys/start
class StartJourneyRequest(BaseModel):
    user_id: Optional[str] = None  # 선택적 (익명 가능)

class StartJourneyResponse(BaseModel):
    journey_id: str
    session_token: str
    prologue: dict  # {"message": str, "prompt": str}

# POST /api/journeys/{journey_id}/chapters/{chapter_id}/submit
class SubmitChapterRequest(BaseModel):
    drawing: str  # base64
    session_token: str

class SubmitChapterResponse(BaseModel):
    analysis: dict  # EmotionAnalysis
    narrative: str
    next_chapter: Optional[dict] = None
```

#### Emotion Analysis

```python
# POST /api/analyze/drawing
class AnalyzeDrawingRequest(BaseModel):
    image: str  # base64
    chapter_theme: str  # EmotionType
    previous_context: Optional[str] = None

class ColorAnalysis(BaseModel):
    color: str
    percentage: float
    emotional_meaning: str

class ShapeAnalysis(BaseModel):
    shape: str
    symbolism: str

class EmotionScore(BaseModel):
    anxiety: int  # 0-100
    positivity: int  # 0-100
    energy: int  # 0-100

class AnalyzeDrawingResponse(BaseModel):
    colors: List[ColorAnalysis]
    shapes: List[ShapeAnalysis]
    emotion_keywords: List[str]
    emotion_score: EmotionScore
    interpretation: str
```

#### Narrative Generation

```python
# POST /api/generate/narrative
class GenerateNarrativeRequest(BaseModel):
    journey_id: str
    chapter_id: int
    emotion_analysis: dict
    companion_character: dict

class GenerateNarrativeResponse(BaseModel):
    narrative: str
    companion_dialogue: List[str]
    healing_message: str
```

#### Video Generation

```python
# POST /api/generate/video
class GenerateVideoRequest(BaseModel):
    journey_id: str
    session_token: str

class GenerateVideoResponse(BaseModel):
    video_id: str
    status: str  # 'queued' | 'processing' | 'completed' | 'failed'
    estimated_time: int  # seconds

# GET /api/generate/video/{video_id}/status
class VideoStatusResponse(BaseModel):
    status: str
    progress: int  # 0-100
    video_url: Optional[str] = None  # S3 URL when completed
    error: Optional[str] = None
```

### Gemini Integration

#### Emotion Analysis Service

```typescript
class EmotionAnalyzer {
  private visionModel: GenerativeModel;
  private proModel: GenerativeModel;

  async analyzeDrawing(
    imageBase64: string,
    chapterTheme: EmotionType
  ): Promise<EmotionAnalysis> {
    const prompt = this.buildAnalysisPrompt(chapterTheme);
    const result = await this.visionModel.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: 'image/png' } }
    ]);
    
    return this.parseEmotionAnalysis(result.response.text());
  }

  private buildAnalysisPrompt(theme: EmotionType): string {
    const themePrompts = {
      anxiety: `Analyze this drawing created during an anxiety-themed chapter. 
                Focus on: colors (dark vs light), shapes (chaotic vs structured), 
                pressure (heavy vs light strokes). Extract emotional keywords.`,
      regret: `Analyze this drawing about regret. Look for: muted colors, 
               closed shapes, symbols of the past. Identify healing potential.`,
      // ... 다른 테마들
    };
    
    return themePrompts[theme] + `
      Return JSON format:
      {
        "colors": [{"color": "blue", "percentage": 40, "meaning": "sadness"}],
        "shapes": [{"shape": "circle", "symbolism": "completeness"}],
        "keywords": ["isolated", "searching", "hope"],
        "emotionScore": {"anxiety": 65, "positivity": 30, "energy": 45}
      }
    `;
  }
}
```

#### Narrative Generator Service

```typescript
class NarrativeGenerator {
  private proModel: GenerativeModel;

  async generateNarrative(
    analysis: EmotionAnalysis,
    chapter: Chapter,
    companion: CompanionCharacter,
    previousNarratives: string[]
  ): Promise<string> {
    const prompt = `
      You are ${companion.name}, a gentle companion guiding someone through 
      their emotional journey in a magical forest.
      
      Chapter: ${chapter.title} (${chapter.emotionTheme})
      Drawing Analysis: ${JSON.stringify(analysis)}
      Previous Journey: ${previousNarratives.join(' ')}
      
      Generate a healing narrative (2-3 paragraphs) that:
      1. Acknowledges the emotion expressed in the drawing
      2. Provides gentle, non-judgmental validation
      3. Offers a metaphor related to the forest/nature
      4. Encourages the next step in their journey
      
      Tone: Warm, poetic, hopeful, like a wise friend
      Style: Short sentences, vivid imagery, emotional resonance
    `;
    
    const result = await this.proModel.generateContent(prompt);
    return result.response.text();
  }

  async generateCompanionCharacter(firstDrawing: string): Promise<CompanionCharacter> {
    const prompt = `
      Based on this first drawing, create a companion character that will 
      guide the user through their emotional journey.
      
      Return JSON:
      {
        "name": "a gentle, nature-inspired name",
        "personality": "warm, wise, patient",
        "appearance": "description for image generation"
      }
    `;
    
    const result = await this.visionModel.generateContent([prompt, firstDrawing]);
    return JSON.parse(result.response.text());
  }
}
```

### Sora2 Integration

#### Video Generation Service

```typescript
class VideoGenerator {
  private openaiClient: OpenAI;

  async generateJourneyVideo(
    drawings: string[], // S3 URLs
    narratives: string[],
    emotionData: EmotionScore[]
  ): Promise<string> {
    const prompt = this.buildVideoPrompt(drawings, narratives, emotionData);
    
    const video = await this.openaiClient.videos.generate({
      model: 'sora-2',
      prompt: prompt,
      size: '1080x1920', // 9:16 세로
      duration: 60, // 1분
      style: 'cinematic',
    });
    
    return video.url;
  }

  private buildVideoPrompt(
    drawings: string[],
    narratives: string[],
    emotionData: EmotionScore[]
  ): string {
    return `
      Create a cinematic emotional journey video combining these hand-drawn images 
      into a flowing narrative about healing and self-discovery in a magical forest.
      
      Style: Soft, dreamy, watercolor-like transitions
      Mood: Starts melancholic, gradually becomes hopeful and bright
      Pacing: Slow, contemplative, with gentle transitions
      
      Sequence:
      1. Opening: Dark forest, user's first drawing appears as a light
      2. Journey: Each drawing transforms the forest (${drawings.length} scenes)
      3. Climax: Emotional graph visualization with nature metaphors
      4. Resolution: Forest fully restored, bathed in warm light
      
      Narration text overlay: "${narratives.join(' ... ')}"
      
      Music suggestion: Gentle piano, ambient forest sounds
      Final message: "Every color you drew was a step toward your light."
    `;
  }
}
```

## Data Models

### Database Schema (Prisma)

```prisma
model Journey {
  id            String   @id @default(uuid())
  userId        String?  // 익명 가능
  sessionToken  String   @unique
  status        String   // 'in_progress' | 'completed'
  startedAt     DateTime @default(now())
  completedAt   DateTime?
  
  companion     Json?    // CompanionCharacter
  chapters      JourneyChapter[]
  videoUrl      String?
  
  @@index([userId])
  @@index([sessionToken])
}

model JourneyChapter {
  id            String   @id @default(uuid())
  journeyId     String
  journey       Journey  @relation(fields: [journeyId], references: [id])
  
  chapterNumber Int      // 0=prologue, 1-5=chapters, 6=epilogue
  emotionTheme  String
  
  drawingUrl    String   // S3 URL
  drawingData   Json?    // 원본 base64 (선택적)
  
  analysis      Json     // EmotionAnalysis
  narrative     String   @db.Text
  
  createdAt     DateTime @default(now())
  
  @@index([journeyId, chapterNumber])
}

model Video {
  id            String   @id @default(uuid())
  journeyId     String   @unique
  
  status        String   // 'queued' | 'processing' | 'completed' | 'failed'
  progress      Int      @default(0)
  
  videoUrl      String?
  thumbnailUrl  String?
  duration      Int?     // seconds
  
  error         String?
  
  createdAt     DateTime @default(now())
  completedAt   DateTime?
  
  @@index([status])
}
```

## Chapter Configuration

### chapters.json

```json
{
  "prologue": {
    "id": 0,
    "title": "숲의 입구",
    "emotionTheme": "curiosity",
    "prompt": "당신을 안내할 빛의 정령을 그려주세요",
    "backgroundColor": "#F5F5DC",
    "instruction": "자유롭게 그려보세요. 이 정령이 당신의 여정을 함께할 거예요.",
    "music": "gentle-intro.mp3"
  },
  "chapters": [
    {
      "id": 1,
      "title": "흔들리는 다리",
      "emotionTheme": "anxiety",
      "prompt": "불안한 마음을 건널 다리를 그려주세요",
      "backgroundColor": "#E6F3FF",
      "instruction": "어떤 다리든 괜찮아요. 당신만의 방식으로 건너면 돼요.",
      "music": "gentle-tension.mp3",
      "geminiContext": "Focus on stability vs instability, colors representing calm vs chaos"
    },
    {
      "id": 2,
      "title": "메아리 동굴",
      "emotionTheme": "regret",
      "prompt": "동굴 벽에 새길 문장이나 상징을 그려주세요",
      "backgroundColor": "#F0E6FF",
      "instruction": "과거의 메아리가 사라지도록, 당신의 마음을 표현해보세요.",
      "music": "echo-cave.mp3",
      "geminiContext": "Look for symbols of release, letting go, transformation"
    },
    {
      "id": 3,
      "title": "불타는 숲",
      "emotionTheme": "anger",
      "prompt": "분노를 다스릴 무언가를 그려주세요",
      "backgroundColor": "#FFE6E6",
      "instruction": "불을 끄는 것도, 불과 함께하는 것도 당신의 선택이에요.",
      "music": "fire-calm.mp3",
      "geminiContext": "Analyze intensity, control vs chaos, transformation of anger"
    },
    {
      "id": 4,
      "title": "그림자 호수",
      "emotionTheme": "self-doubt",
      "prompt": "호수에 비친 당신의 모습을 그려주세요",
      "backgroundColor": "#E6E6FA",
      "instruction": "빛과 그림자, 둘 다 당신이에요. 모두 받아들여보세요.",
      "music": "reflection.mp3",
      "geminiContext": "Look for self-acceptance, integration of light and shadow"
    },
    {
      "id": 5,
      "title": "새로운 씨앗",
      "emotionTheme": "recovery",
      "prompt": "숲에 심을 씨앗이나 꽃을 그려주세요",
      "backgroundColor": "#E8F5E9",
      "instruction": "당신의 여정이 새로운 시작을 만들어냈어요.",
      "music": "hope-bloom.mp3",
      "geminiContext": "Focus on growth, hope, new beginnings, vibrant colors"
    }
  ],
  "epilogue": {
    "id": 6,
    "title": "회복된 숲",
    "emotionTheme": "completion",
    "message": "당신의 숲이 다시 빛나고 있어요",
    "backgroundColor": "#FFFACD",
    "music": "completion.mp3"
  }
}
```

## UI/UX Design System

### Sketchbook Theme

```css
/* 스케치북 스타일 변수 */
:root {
  --paper-white: #FFFEF7;
  --paper-cream: #F5F5DC;
  --pencil-gray: #4A4A4A;
  --crayon-red: #FF6B6B;
  --crayon-blue: #4ECDC4;
  --crayon-yellow: #FFE66D;
  --crayon-green: #95E1D3;
  --border-sketch: #8B7355;
  
  --font-handwriting: 'Caveat', 'Nanum Pen Script', cursive;
  --font-body: 'Noto Sans KR', sans-serif;
}

/* 종이 질감 */
.paper-texture {
  background-image: url('/textures/paper.png');
  background-blend-mode: multiply;
  box-shadow: 
    inset 0 0 50px rgba(0,0,0,0.05),
    0 4px 6px rgba(0,0,0,0.1);
}

/* 손그림 버튼 */
.sketch-button {
  border: 3px solid var(--border-sketch);
  border-radius: 15px;
  background: var(--paper-white);
  transform: rotate(-1deg);
  transition: transform 0.2s;
}

.sketch-button:hover {
  transform: rotate(0deg) scale(1.05);
}

/* 페이지 넘김 애니메이션 */
@keyframes page-turn {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(-90deg); }
  100% { transform: rotateY(-180deg); }
}
```

### Animation Patterns

```typescript
// Framer Motion 애니메이션 설정
const pageTransition = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.5, ease: 'easeInOut' }
};

const dialogueTyping = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const drawingComplete = {
  scale: [1, 1.05, 1],
  rotate: [0, 2, -2, 0],
  transition: { duration: 0.6 }
};
```

## Error Handling

### Error Types

```typescript
enum ErrorCode {
  DRAWING_ANALYSIS_FAILED = 'DRAWING_ANALYSIS_FAILED',
  NARRATIVE_GENERATION_FAILED = 'NARRATIVE_GENERATION_FAILED',
  VIDEO_GENERATION_FAILED = 'VIDEO_GENERATION_FAILED',
  JOURNEY_NOT_FOUND = 'JOURNEY_NOT_FOUND',
  INVALID_SESSION = 'INVALID_SESSION',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string; // 사용자 친화적 메시지
  retryable: boolean;
}
```

### Error Handling Strategy

1. **Gemini API 실패**: 3회 재시도, 실패 시 기본 감정 분석 사용
2. **Sora2 생성 실패**: 대기열에 재추가, 사용자에게 이메일 알림
3. **네트워크 오류**: 자동 재연결, 진행 상황 로컬 저장
4. **세션 만료**: 자동 복구, 마지막 챕터부터 재개

## Performance Optimization

### Image Optimization
- 클라이언트: Canvas를 800x800으로 리사이징
- 서버: Sharp로 WebP 변환 (S3 저장)
- CDN: CloudFront로 이미지 캐싱

### AI Response Time
- Gemini Vision: 평균 2-3초
- Gemini Pro: 평균 3-5초
- Sora2: 평균 2-3분 (비동기 처리)

### Caching Strategy
- 챕터 설정: 메모리 캐시
- 이전 여정: Redis 캐시 (1시간)
- 생성된 영상: S3 + CloudFront (영구)

## Testing Strategy

### Manual Testing Checklist

**해커톤 전 필수 테스트:**
- [ ] 프롤로그 → 챕터 1-5 → 에필로그 전체 플로우
- [ ] 각 챕터에서 그림 그리기 및 제출
- [ ] Gemini 감정 분석 응답 확인
- [ ] 내러티브 생성 및 표시
- [ ] 감정 그래프 렌더링
- [ ] Sora2 영상 생성 (최소 1회)
- [ ] 모바일/데스크톱 반응형
- [ ] 페이지 전환 애니메이션
- [ ] 오디오 재생

### Edge Cases
- 빈 캔버스 제출 방지
- Gemini API 타임아웃 처리
- Sora2 생성 실패 시 재시도
- 중간에 나갔다가 돌아오기
- 여러 여정 동시 진행

## Deployment

### Environment Variables

```bash
# Backend .env
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key_for_sora2
AWS_S3_BUCKET=forest-within-drawings
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Frontend .env
VITE_API_URL=https://api.theforestwithin.com
VITE_WS_URL=wss://api.theforestwithin.com
```

### Quick Deploy Script

```bash
# 해커톤 당일 빠른 배포
./scripts/deploy-forest-within.sh

# 1. 프론트엔드 빌드 & S3 업로드
# 2. 백엔드 Docker 빌드 & EC2 배포
# 3. 데이터베이스 마이그레이션
# 4. Health check
```

## Timeline (해커톤 18시간 기준)

**Phase 1 (0-6h): 핵심 기능**
- 스케치북 캔버스 구현
- 챕터 시스템 & 네비게이션
- Gemini 감정 분석 통합
- 기본 내러티브 생성

**Phase 2 (6-12h): 경험 완성**
- 동반자 캐릭터 시스템
- 감정 그래프
- UI/UX 폴리싱
- 애니메이션 추가

**Phase 3 (12-16h): 영상 & 마무리**
- Sora2 영상 생성
- 에필로그 완성
- 버그 수정
- 발표 준비

**Phase 4 (16-18h): 발표 & 데모**
- 발표 자료 준비
- 라이브 데모 리허설
- 최종 점검
