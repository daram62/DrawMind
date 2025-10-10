// 동화책 장식 요소들
export const StorybookDecorations = () => {
  return (
    <>
      {/* 별 장식 */}
      <div className="floating-decoration top-20 left-10 text-6xl animate-float">
        ⭐
      </div>
      <div className="floating-decoration top-40 right-20 text-5xl animate-float-slow">
        ✨
      </div>
      <div className="floating-decoration bottom-32 left-1/4 text-4xl animate-float">
        🌙
      </div>
      
      {/* 구름 장식 */}
      <div className="floating-decoration top-10 right-1/3 text-7xl animate-float-slow">
        ☁️
      </div>
      <div className="floating-decoration bottom-20 right-10 text-6xl animate-float">
        ☁️
      </div>
      
      {/* 꽃 장식 */}
      <div className="floating-decoration top-1/3 left-5 text-5xl animate-sparkle">
        🌸
      </div>
      <div className="floating-decoration bottom-1/3 right-5 text-4xl animate-sparkle">
        🌺
      </div>
    </>
  );
};

// SVG 동화책 테두리
export const StorybookBorder = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        <rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          rx="24"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeDasharray="10,5"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5b3ff" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#ffd4b8" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </div>
  );
};

// 동화책 페이지 래퍼
export const StorybookPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative overflow-hidden watercolor-bg">
      <StorybookDecorations />
      <div className="relative z-10 animate-page-turn">
        {children}
      </div>
    </div>
  );
};
