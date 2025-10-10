import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
      {/* 메인 타이틀 */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="font-sketch text-3xl sm:text-4xl md:text-5xl text-sketch-brown mb-3">
          나만의 이야기를 그려보세요
        </h1>
      </div>

      {/* 편지지 스타일 설명 */}
      <div className="bg-white rounded-lg shadow-sketch border-2 border-sketch-brown/20 p-6 sm:p-8 mb-8 relative">
        {/* 편지지 줄무늬 */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="h-full" style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139, 115, 85, 0.15) 31px, rgba(139, 115, 85, 0.15) 32px)',
          }}></div>
        </div>

        <div className="relative space-y-6 text-sketch-brown/90 font-bold" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
          <p className="text-base sm:text-lg leading-relaxed">
            안녕하세요!
          </p>

          <p className="text-base sm:text-lg leading-relaxed">
            이곳은 당신의 상상력이 이야기가 되는 특별한 공간입니다.
          </p>

          <p className="text-base sm:text-lg leading-relaxed">
            먼저, 스케치북에 자유롭게 그림을 그려보세요.<br />
            무엇을 그려도 좋아요. 당신의 상상력을 마음껏 펼쳐보세요.
          </p>

          <p className="text-base sm:text-lg leading-relaxed">
            그림을 완성하면, AI가 당신의 그림을 분석하고<br />
            멋진 이야기를 만들어드립니다.
          </p>

          <p className="text-base sm:text-lg leading-relaxed">
            당신만의 특별한 이야기가 완성됩니다!<br />
            저장하고 친구들과 공유해보세요.
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-right">
            그럼, 시작해볼까요?
          </p>
        </div>
      </div>

      {/* CTA 버튼 */}
      <div className="text-center">
        <Link to="/draw">
          <button className="sketch-button text-base sm:text-lg px-10 py-3">
            그리기
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
