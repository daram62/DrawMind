import { useState } from 'react';
import { StorybookPage } from '../components/StorybookDecorations';
import { StorybookTitle, StorybookButton, StorybookCard, MagicSpinner } from '../components/StorybookComponents';
import { SketchbookCanvas } from '../components/SketchbookCanvas';

type FlowStep = 'welcome' | 'drawing' | 'processing' | 'result';

interface ResultData {
  originalImage: string;
  enhancedImage?: string;
  story?: string;
}

export default function DrawingFlowPage() {
  const [step, setStep] = useState<FlowStep>('welcome');
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);

  // 시작하기
  const handleStart = () => {
    // 랜덤 시나리오 선택 (실제로는 백엔드에서 가져올 수 있음)
    const scenarios = [
      '숲 속에서 토끼와 여우가 만났어요. 무슨 일이 일어날까요?',
      '마법사가 성에서 새로운 주문을 연습하고 있어요.',
      '바닷속 인어 공주가 보물을 찾고 있어요.',
      '용감한 기사가 드래곤을 만났어요.',
      '요정들이 꽃밭에서 춤을 추고 있어요.',
    ];
    setScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    setStep('drawing');
  };

  // 그림 완성
  const handleDrawingComplete = async (imageData: string) => {
    setStep('processing');

    try {
      // 실제 백엔드 API 호출
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', blob, 'drawing.png');
      formData.append('scenario', scenario);

      const response = await fetch('http://localhost:8000/api/drawings/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process drawing');
      }

      const data = await response.json();
      
      setResult({
        originalImage: data.originalImage,
        enhancedImage: data.enhancedImage,
        story: data.story,
      });
      
      setStep('result');
    } catch (error) {
      console.error('Error processing drawing:', error);
      alert('그림 처리 중 오류가 발생했어요. 다시 시도해주세요.');
      setStep('drawing');
    }
  };

  // 다시 시작
  const handleRestart = () => {
    setStep('welcome');
    setScenario('');
    setResult(null);
  };

  return (
    <StorybookPage>
      <div className="container mx-auto px-4 py-12">
        {/* Welcome 화면 */}
        {step === 'welcome' && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-page-turn">
            <div className="animate-float">
              <StorybookTitle>
                ✨ 마법의 스케치북 ✨
              </StorybookTitle>
            </div>

            <StorybookCard className="text-left">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-5xl">🎨</span>
                  <div>
                    <h3 className="font-storybook text-2xl text-fairy-600 mb-2">
                      당신만의 이야기를 그려보세요
                    </h3>
                    <p className="font-fairy text-lg text-gray-700">
                      마법의 스케치북에 그림을 그리면, AI가 당신의 그림을 
                      아름다운 동화로 만들어드려요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-5xl">📖</span>
                  <div>
                    <h3 className="font-storybook text-2xl text-dream-600 mb-2">
                      이야기가 시작됩니다
                    </h3>
                    <p className="font-fairy text-lg text-gray-700">
                      시나리오를 읽고 자유롭게 상상의 나래를 펼쳐보세요.
                      정답은 없어요. 당신의 상상이 곧 정답입니다!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-5xl">✨</span>
                  <div>
                    <h3 className="font-storybook text-2xl text-fairy-600 mb-2">
                      마법이 일어납니다
                    </h3>
                    <p className="font-fairy text-lg text-gray-700">
                      그림을 완성하면 AI가 당신의 작품을 분석하고 
                      멋진 이야기와 함께 보여드려요.
                    </p>
                  </div>
                </div>
              </div>
            </StorybookCard>

            <div className="animate-float-slow">
              <StorybookButton variant="magic" onClick={handleStart}>
                🚀 모험 시작하기
              </StorybookButton>
            </div>
          </div>
        )}

        {/* Drawing 화면 */}
        {step === 'drawing' && (
          <div className="max-w-6xl mx-auto animate-page-turn">
            <div className="text-center mb-8">
              <StorybookTitle size="md">
                🎨 자유롭게 그려보세요
              </StorybookTitle>
            </div>

            <SketchbookCanvas 
              scenario={scenario}
              onDrawingComplete={handleDrawingComplete}
            />
          </div>
        )}

        {/* Processing 화면 */}
        {step === 'processing' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-page-turn">
            <StorybookTitle size="md">
              ✨ 마법을 부리는 중... ✨
            </StorybookTitle>

            <StorybookCard>
              <MagicSpinner />
              <p className="font-fairy text-xl text-gray-700 mt-6">
                당신의 그림에 생명을 불어넣고 있어요...
              </p>
              <p className="font-fairy text-lg text-gray-500 mt-2">
                잠시만 기다려주세요 🌟
              </p>
            </StorybookCard>
          </div>
        )}

        {/* Result 화면 */}
        {step === 'result' && result && (
          <div className="max-w-5xl mx-auto space-y-8 animate-page-turn">
            <div className="text-center">
              <StorybookTitle size="md">
                🎉 완성되었어요! 🎉
              </StorybookTitle>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 원본 그림 */}
              <StorybookCard>
                <h3 className="font-storybook text-2xl text-fairy-600 mb-4 text-center">
                  당신의 그림
                </h3>
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-fairy-200 to-dream-200 rounded-lg"></div>
                  <img 
                    src={result.originalImage} 
                    alt="Original drawing"
                    className="relative w-full rounded-lg shadow-lg"
                  />
                </div>
              </StorybookCard>

              {/* AI 향상 그림 (옵션) */}
              {result.enhancedImage && (
                <StorybookCard>
                  <h3 className="font-storybook text-2xl text-dream-600 mb-4 text-center">
                    마법의 터치
                  </h3>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-br from-dream-200 to-fairy-200 rounded-lg"></div>
                    <img 
                      src={result.enhancedImage} 
                      alt="Enhanced drawing"
                      className="relative w-full rounded-lg shadow-lg"
                    />
                  </div>
                </StorybookCard>
              )}
            </div>

            {/* 이야기 */}
            {result.story && (
              <StorybookCard className="bg-gradient-to-br from-storybook-cream to-storybook-lavender/20">
                <div className="flex items-start gap-4">
                  <span className="text-5xl">📖</span>
                  <div className="flex-1">
                    <h3 className="font-storybook text-3xl text-fairy-600 mb-4">
                      당신의 이야기
                    </h3>
                    <p className="font-fairy text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                      {result.story}
                    </p>
                  </div>
                </div>
              </StorybookCard>
            )}

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-4">
              <StorybookButton variant="secondary" onClick={handleRestart}>
                🔄 다시 그리기
              </StorybookButton>
              <StorybookButton variant="primary" onClick={() => {
                // TODO: 저장 기능
                alert('그림이 저장되었어요! 📁');
              }}>
                💾 저장하기
              </StorybookButton>
            </div>
          </div>
        )}
      </div>
    </StorybookPage>
  );
}
