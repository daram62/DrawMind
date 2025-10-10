import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/draw');
  };

  return (
    <div className="relative">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
          filter: 'brightness(0.7)'
        }}
      ></div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[calc(100vh-9rem)]">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 타이틀 */}
          <div className="text-center">
            <h1 className="font-sketch text-5xl sm:text-6xl text-sketch-brown mb-4 drop-shadow-lg">
              꿈의 항해
            </h1>
            <p className="font-hand text-2xl sm:text-3xl text-sketch-brown/90 drop-shadow-lg">
              감정의 바다로
            </p>
          </div>

          {/* 프롤로그 텍스트 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-sketch-brown/30 p-6 sm:p-8">
            <div className="space-y-4 text-sketch-brown/90 font-bold" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
              <p className="text-lg sm:text-xl leading-relaxed text-center italic">
                "감정의 바다는, 네가 그린 선으로 이어진단다."
              </p>

              <div className="h-px bg-sketch-brown/20 my-3"></div>

              <p className="text-base sm:text-lg leading-relaxed">
                당신은 지금 <span className="text-sketch-orange">빛을 잃은 바다</span>에 표류한 존재입니다.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                하늘은 별이 가라앉고, 파도는 감정처럼 밀려옵니다.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                이 바다엔 <span className="text-sketch-orange">다섯 개의 섬</span>이 있습니다.<br />
                그 섬을 모두 건너면, 당신의 마음이 별처럼 다시 빛날 것입니다.
              </p>

              <div className="h-px bg-sketch-brown/20 my-3"></div>

              <p className="text-base sm:text-lg leading-relaxed">
                각 섬은 서로 다른 감정의 상태를 상징하며,<br />
                당신은 그림을 그려서 바다를 건너고, 다리를 세우며 항로를 완성합니다.
              </p>
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="text-center">
            <button onClick={handleStart} className="sketch-button text-xl sm:text-2xl px-12 py-4 shadow-2xl">
              항해 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
