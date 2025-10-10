# 🌟 동화책 스타일 UI 가이드

몽환적인 동화책 느낌의 UI 시스템입니다.

## 🎨 디자인 컨셉

- **색상**: 파스텔 톤과 부드러운 그라데이션
- **폰트**: 손글씨 느낌 (Caveat, Patrick Hand, Indie Flower)
- **애니메이션**: 플로팅, 반짝임, 페이지 넘김 효과
- **장식**: 이모지와 SVG를 활용한 동화책 요소들

## 📦 컴포넌트 사용법

### 1. StorybookPage (페이지 래퍼)

모든 페이지를 감싸는 기본 컨테이너입니다.

```tsx
import { StorybookPage } from '../components/StorybookDecorations';

function MyPage() {
  return (
    <StorybookPage>
      {/* 페이지 내용 */}
    </StorybookPage>
  );
}
```

### 2. StorybookTitle (제목)

```tsx
import { StorybookTitle } from '../components/StorybookComponents';

<StorybookTitle size="lg">
  ✨ 마법의 제목 ✨
</StorybookTitle>

// size: 'sm' | 'md' | 'lg' | 'xl'
```

### 3. StorybookButton (버튼)

```tsx
import { StorybookButton } from '../components/StorybookComponents';

<StorybookButton 
  variant="primary" 
  onClick={() => console.log('클릭!')}
>
  🚀 버튼 텍스트
</StorybookButton>

// variant: 'primary' | 'secondary' | 'magic'
```

### 4. StorybookCard (카드)

```tsx
import { StorybookCard } from '../components/StorybookComponents';

<StorybookCard>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</StorybookCard>
```

### 5. StorybookInput (입력 필드)

```tsx
import { StorybookInput } from '../components/StorybookComponents';

<StorybookInput
  placeholder="마법의 메시지를 입력하세요"
  icon="🔮"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### 6. StorybookBorder (테두리 장식)

```tsx
import { StorybookBorder } from '../components/StorybookDecorations';

<StorybookBorder>
  <div className="storybook-card">
    {/* 내용 */}
  </div>
</StorybookBorder>
```

### 7. MagicSpinner (로딩)

```tsx
import { MagicSpinner } from '../components/StorybookComponents';

{isLoading && <MagicSpinner />}
```

### 8. StorybookBadge (배지)

```tsx
import { StorybookBadge } from '../components/StorybookComponents';

<StorybookBadge color="fairy">
  새로운 기능
</StorybookBadge>

// color: 'fairy' | 'dream' | 'peach' | 'mint'
```

### 9. StorybookModal (모달)

```tsx
import { StorybookModal } from '../components/StorybookComponents';

<StorybookModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="마법의 창"
>
  <p>모달 내용</p>
</StorybookModal>
```

## 🎭 Tailwind 유틸리티 클래스

### 색상

```tsx
// 파스텔 색상
bg-storybook-cream    // 크림색 배경
bg-storybook-peach    // 복숭아색
bg-storybook-lavender // 라벤더색
bg-storybook-mint     // 민트색
bg-storybook-sky      // 하늘색
bg-storybook-rose     // 장미색

// 그라데이션 색상
text-fairy-500        // 보라-핑크 계열
text-dream-500        // 파란 계열
```

### 애니메이션

```tsx
animate-float         // 위아래로 떠다니는 효과 (6초)
animate-float-slow    // 느린 플로팅 (8초)
animate-wiggle        // 좌우로 흔들림
animate-sparkle       // 반짝임 효과
animate-page-turn     // 페이지 넘김 효과
```

### 배경 효과

```tsx
watercolor-bg         // 수채화 그라데이션 배경
paper-texture         // 종이 질감
```

### 그림자

```tsx
shadow-storybook      // 동화책 스타일 그림자
shadow-dreamy         // 몽환적인 그림자
```

## 🎨 커스텀 스타일 클래스

### 기본 스타일

```tsx
storybook-card        // 동화책 카드 스타일
storybook-button      // 동화책 버튼 스타일
storybook-title       // 동화책 제목 스타일
storybook-input       // 동화책 입력 필드 스타일
```

### 폰트

```tsx
font-storybook        // Caveat (손글씨)
font-fairy            // Patrick Hand
font-dream            // Indie Flower
```

## 💡 사용 예시

### 간단한 페이지

```tsx
import { StorybookPage } from '../components/StorybookDecorations';
import { 
  StorybookTitle, 
  StorybookCard, 
  StorybookButton 
} from '../components/StorybookComponents';

function ExamplePage() {
  return (
    <StorybookPage>
      <div className="container mx-auto px-4 py-12">
        <StorybookTitle>
          ✨ 환영합니다 ✨
        </StorybookTitle>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <StorybookCard>
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-storybook text-2xl text-fairy-600 mb-2">
              아름다운 디자인
            </h3>
            <p className="font-fairy text-gray-700">
              동화책 같은 UI로 사용자를 매료시키세요
            </p>
          </StorybookCard>
          
          <StorybookCard>
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="font-storybook text-2xl text-dream-600 mb-2">
              빠른 개발
            </h3>
            <p className="font-fairy text-gray-700">
              준비된 컴포넌트로 빠르게 구현하세요
            </p>
          </StorybookCard>
        </div>
        
        <div className="text-center mt-8">
          <StorybookButton variant="magic">
            🚀 시작하기
          </StorybookButton>
        </div>
      </div>
    </StorybookPage>
  );
}
```

### 폼 예시

```tsx
import { useState } from 'react';
import { StorybookInput, StorybookButton } from '../components/StorybookComponents';

function FormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="storybook-card max-w-md mx-auto">
      <h2 className="font-storybook text-3xl text-fairy-600 mb-6">
        🌟 마법의 등록
      </h2>
      
      <div className="space-y-4">
        <StorybookInput
          placeholder="이름을 입력하세요"
          icon="👤"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <StorybookInput
          type="email"
          placeholder="이메일을 입력하세요"
          icon="📧"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <StorybookButton variant="primary" className="w-full">
          ✨ 등록하기
        </StorybookButton>
      </div>
    </div>
  );
}
```

## 🎯 팁

1. **이모지 활용**: 각 섹션에 관련된 이모지를 추가하면 더 동화책 느낌이 납니다
2. **애니메이션 조합**: `animate-float`와 `hover:scale-105`를 함께 사용하면 생동감이 있습니다
3. **색상 조합**: 파스텔 톤을 섞어서 사용하면 부드러운 느낌을 줍니다
4. **여백**: 충분한 padding과 margin으로 여유로운 레이아웃을 만드세요
5. **그라데이션**: `bg-gradient-to-r`로 다채로운 색상 전환을 만들 수 있습니다

## 🔧 커스터마이징

`tailwind.config.js`에서 색상, 애니메이션, 폰트를 자유롭게 수정할 수 있습니다.

```js
// 새로운 색상 추가
colors: {
  mycolor: {
    50: '#...',
    // ...
  }
}

// 새로운 애니메이션 추가
animation: {
  'my-animation': 'myKeyframe 2s ease-in-out infinite',
}
```

즐거운 개발 되세요! ✨🎨🚀
