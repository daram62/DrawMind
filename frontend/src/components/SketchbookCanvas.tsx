import { useRef, useState, useEffect } from 'react';

interface SketchbookCanvasProps {
  onDrawingComplete?: (imageData: string) => void;
  scenario?: string;
}

export const SketchbookCanvas = ({ onDrawingComplete, scenario }: SketchbookCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#2c3e50');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 스케치북 배경 설정
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
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

  const colors = [
    '#2c3e50', '#e74c3c', '#3498db', '#2ecc71', 
    '#f39c12', '#9b59b6', '#1abc9c', '#34495e'
  ];

  return (
    <div className="space-y-4">
      {/* 시나리오 안내 */}
      {scenario && (
        <div className="storybook-card bg-storybook-sky/30 border-dream-300">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h3 className="font-storybook text-xl text-dream-700 mb-2">
                오늘의 이야기
              </h3>
              <p className="font-fairy text-lg text-gray-700">
                {scenario}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 스케치북 캔버스 */}
      <div className="relative">
        {/* 스케치북 테두리 효과 */}
        <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-200 rounded-lg shadow-2xl"></div>
        
        <div className="relative bg-white p-6 rounded-lg shadow-inner">
          {/* 스케치북 구멍 장식 */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-300 shadow-inner"></div>
            ))}
          </div>

          {/* 캔버스 */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-dashed border-gray-300 rounded cursor-crosshair ml-6"
            style={{ 
              background: '#fffef9',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </div>

      {/* 도구 모음 */}
      <div className="storybook-card">
        <div className="flex flex-wrap items-center gap-4">
          {/* 도구 선택 */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`px-4 py-2 rounded-full font-fairy transition-all ${
                tool === 'pen'
                  ? 'bg-fairy-400 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✏️ 펜
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`px-4 py-2 rounded-full font-fairy transition-all ${
                tool === 'eraser'
                  ? 'bg-fairy-400 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🧹 지우개
            </button>
          </div>

          {/* 색상 선택 */}
          <div className="flex gap-2 items-center">
            <span className="font-fairy text-gray-700">색상:</span>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                  brushColor === color ? 'ring-4 ring-fairy-300 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* 브러시 크기 */}
          <div className="flex gap-2 items-center">
            <span className="font-fairy text-gray-700">굵기:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="font-fairy text-gray-700 w-8">{brushSize}</span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-fairy hover:bg-gray-300 transition-all"
            >
              🗑️ 지우기
            </button>
            <button
              onClick={saveDrawing}
              className="storybook-button bg-gradient-to-r from-fairy-400 to-dream-400"
            >
              ✨ 완성!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
