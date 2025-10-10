import { StorybookPage, StorybookBorder } from '../components/StorybookDecorations';

function HomePage() {
  return (
    <StorybookPage>
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* 메인 타이틀 */}
        <div className="text-center mb-12 animate-float">
          <h1 className="storybook-title mb-6">
            ✨ 마법의 해커톤 세계에 오신 것을 환영합니다 ✨
          </h1>
          <p className="font-fairy text-2xl text-fairy-700">
            당신의 꿈을 현실로 만드는 여정이 시작됩니다
          </p>
        </div>

        {/* 기능 카드들 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <StorybookBorder>
            <div className="storybook-card group">
              <div className="text-5xl mb-4 group-hover:animate-wiggle">⚛️</div>
              <h3 className="font-storybook text-3xl text-fairy-600 mb-3">
                React 마법
              </h3>
              <p className="font-fairy text-lg text-gray-700">
                Vite와 TypeScript로 만드는 빠르고 안전한 마법의 주문들
              </p>
            </div>
          </StorybookBorder>

          <StorybookBorder>
            <div className="storybook-card group">
              <div className="text-5xl mb-4 group-hover:animate-wiggle">🎨</div>
              <h3 className="font-storybook text-3xl text-dream-600 mb-3">
                Tailwind 물감
              </h3>
              <p className="font-fairy text-lg text-gray-700">
                아름다운 색상과 스타일로 그려내는 당신만의 이야기
              </p>
            </div>
          </StorybookBorder>

          <StorybookBorder>
            <div className="storybook-card group">
              <div className="text-5xl mb-4 group-hover:animate-wiggle">🗺️</div>
              <h3 className="font-storybook text-3xl text-fairy-600 mb-3">
                Router 나침반
              </h3>
              <p className="font-fairy text-lg text-gray-700">
                페이지 사이를 자유롭게 여행하는 마법의 나침반
              </p>
            </div>
          </StorybookBorder>

          <StorybookBorder>
            <div className="storybook-card group">
              <div className="text-5xl mb-4 group-hover:animate-wiggle">🔮</div>
              <h3 className="font-storybook text-3xl text-dream-600 mb-3">
                API 수정구
              </h3>
              <p className="font-fairy text-lg text-gray-700">
                데이터의 세계와 소통하는 신비로운 수정구
              </p>
            </div>
          </StorybookBorder>
        </div>

        {/* CTA 버튼 */}
        <div className="text-center mt-12">
          <a href="/draw">
            <button className="storybook-button animate-float-slow">
              🚀 모험 시작하기
            </button>
          </a>
        </div>
      </div>
    </StorybookPage>
  );
}

export default HomePage;
