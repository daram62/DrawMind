import { useRef, useState, useEffect } from 'react';

interface SketchbookCanvasProps {
  onDrawingComplete?: (imageData: string) => void;
  scenario?: string;
  stageTitle?: string;
}

export const SketchbookCanvas = ({ onDrawingComplete, scenario, stageTitle }: SketchbookCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize] = useState(8);
  const [brushColor, setBrushColor] = useState('#2c3e50');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [canvasSize, setCanvasSize] = useState(450);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 화면 높이 고려해서 스케치북 크기 결정
        const maxHeight = window.innerHeight - 320; // 상단 제목, 하단 대화창 제외
        const size = Math.min(Math.floor(containerWidth * 0.7 * 0.8), maxHeight, 480);
        setCanvasSize(size);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 스케치북 배경 설정
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasSize]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#fffef9' : brushColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    onDrawingComplete?.(imageData);
  };

  // 심리치료에 적합한 따뜻한 색상들
  const colors = [
    '#2c3e50', // 검정 (기본)
    '#e74c3c', // 따뜻한 빨강
    '#f39c12', // 주황
    '#2ecc71', // 초록
    '#3498db', // 파랑
  ];

  return (
    <div className="w-full h-full flex flex-col" ref={containerRef}>
      {/* 상단: 단계 표시 */}
      <div className="px-6 py-4">
        <h2 className="font-sketch text-2xl text-white drop-shadow-lg">
          {stageTitle || '첫 번째 이야기 : 새의 섬'}
        </h2>
      </div>

      {/* 중앙: 스케치북 */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="relative w-full max-w-3xl">
          {/* 스케치북 */}
          <div className="relative backdrop-blur-sm p-5 rounded-lg shadow-2xl" style={{ backgroundColor: 'rgba(250, 251, 255, 0.9)' }}>
            <div className="flex gap-5">
              {/* 왼쪽: 캔버스 - 1:1 비율, 70% 너비 */}
              <div className="flex-shrink-0" style={{ width: '70%' }}>
                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                  <canvas
                    ref={canvasRef}
                    width={canvasSize}
                    height={canvasSize}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded touch-none"
                    style={{
                      background: '#fffef9',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
                      cursor: tool === 'pen' ? "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><text y=\"20\" font-size=\"20\">✏️</text></svg>') 2 20, auto" : "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><text y=\"20\" font-size=\"20\">🧹</text></svg>') 12 12, auto"
                    }}
                  />
                </div>
              </div>

              {/* 오른쪽: 도구 모음, 30% 너비 */}
              <div className="flex-1 flex flex-col justify-center space-y-6 px-2">
                {/* 도구 선택 */}
                <div>
                  <h4 className="font-hand text-sm text-gray-600 mb-2">도구</h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setTool('pen')}
                      className={`px-4 py-2.5 rounded-lg font-hand text-sm transition-all ${tool === 'pen'
                        ? 'bg-indigo-800 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      연필
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className={`px-4 py-2.5 rounded-lg font-hand text-sm transition-all ${tool === 'eraser'
                        ? 'bg-indigo-800 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      지우개
                    </button>
                  </div>
                </div>

                {/* 색상 선택 */}
                <div>
                  <h4 className="font-hand text-sm text-gray-600 mb-2">색상</h4>
                  <div className="flex flex-col gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={`w-full h-11 rounded-lg transition-all hover:scale-105 border-2 ${brushColor === color
                          ? 'ring-3 ring-indigo-700 scale-105 border-indigo-700'
                          : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    onClick={clearCanvas}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-hand text-sm hover:bg-gray-200 transition-all"
                  >
                    지우기
                  </button>
                  <button
                    onClick={saveDrawing}
                    className="w-full sketch-button text-xs px-3 py-2"
                  >
                    완성
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 프롤로그 스타일 투명 말풍선 */}
      {scenario && (
        <div className="flex-shrink-0 px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            {/* 말풍선 */}
            <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/40 p-4 sm:p-6">
              {/* 말풍선 꼬리 */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white/40"></div>
              
              {/* 대화 텍스트 */}
              <p 
                className="text-xl sm:text-2xl text-white leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-lg"
                style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
              >
                {scenario}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
