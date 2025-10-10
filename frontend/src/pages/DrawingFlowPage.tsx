import { useState, useRef } from 'react';
import { SketchbookCanvas } from '../components/SketchbookCanvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type FlowStep = 'welcome' | 'story' | 'drawing' | 'processing' | 'result' | 'finalResult' | 'emotionAnalysis';

interface ResultData {
  originalImage: string;
  aiImage?: string;
  story?: string;
  currentStage: number;
}

interface FinalResultData {
  finalImage: string; // 5개 그림이 합쳐진 최종 이미지
  storySummary: string; // 전체 여정 스토리 요약
  emotionAnalysis: string; // 감정 분석 결과
}

const STAGES = [
  {
    id: 1,
    title: '첫 번째 이야기 : 새의 섬',
    storyDialogues: [
      '여기, 잃어버린 빛의 바다.',
      '수많은 별이 바다 밑으로 떨어지고,\n남은 건 단 하나… 너의 빛.',
      '이 항해는 누군가를 찾기 위한 여정이 아니야.\n잊고 있던 너를 다시 만나는 길이야.',
      '이 섬엔 오래된 둥지가 있어.\n한때 새들이 머물렀지만, 지금은 비어 있지.',
      '하늘 위의 둥지를 그려봐.\n그 안엔 무엇이 있을까? 알, 새, 혹은 아무것도.',
    ],
    scenario: '하늘 위의 둥지를 그려봐. 그 안엔 무엇이 있을까? 알, 새, 혹은 너 자신?',
    feedback: '둥지는 마음의 쉼터야.\n너는 지금, 네 안의 어린 새를 품고 있어.',
  },
  {
    id: 2,
    title: '두 번째 이야기 : 불의 섬',
    storyDialogues: [
      '두 번째 섬에 도착했어.',
      '이곳은 불의 섬.\n나무는 타오르고, 사과는 붉게 익어가.',
      '불타는 나무 아래에서 사과를 따는 장면을 그려봐.\n너는 어떤 얼굴을 하고 있니?',
    ],
    scenario: '불타는 나무 아래에서 사과를 따는 장면을 그려봐. 너는 어떤 얼굴을 하고 있니?',
    feedback: '분노는 파괴가 아니라, 네가 다시 빛나려는 몸부림이야.\n불길 속에서도, 사과는 붉게 익어가고 있지.',
  },
  {
    id: 3,
    title: '세 번째 이야기 : 다리의 섬',
    storyDialogues: [
      '세 번째 섬이야.',
      '이 섬의 끝에서 저 멀리 별의 섬이 반짝이고 있어.',
      '다리를 그려봐.\n이 섬에서 저 별의 섬까지 가는 다리를.\n다리 위엔 누가 서 있을까?',
    ],
    scenario: '이 섬의 끝에서 저 멀리 반짝이는 별의 섬까지 가는 다리를 그려봐. 다리 위엔 누가 서 있을까?',
    feedback: '다리는 믿음의 선으로 그려지지.\n네가 건너면, 그 길은 빛으로 변할 거야.',
  },
  {
    id: 4,
    title: '네 번째 이야기 : 비의 섬',
    storyDialogues: [
      '네 번째 섬에 비가 내리고 있어.',
      '이곳은 비의 섬.\n감정이 흠뻑 젖는 곳.',
      '비 속에 서 있는 사람을 그려봐.\n그는 비를 피하고 있을까, 그냥 맞고 있을까?',
    ],
    scenario: '비 속에 서 있는 사람을 그려봐. 그는 비를 피하고 있을까, 그냥 맞고 있을까?',
    feedback: '젖은 어깨는 슬픔이 아니라, 용기의 흔적이야.\n감정은 흠뻑 젖을 때 비로소 맑아진단다.',
  },
  {
    id: 5,
    title: '다섯 번째 이야기 : 별의 정원',
    storyDialogues: [
      '마지막 섬이야.',
      '별의 정원.\n네가 찾던 빛이 여기 있어.',
      '이 여정을 끝낸 지금의 너를 그려봐.\n네 손엔 무엇이 있니? 네 주위엔 어떤 빛이 있니?',
    ],
    scenario: '이 여정을 끝낸 지금의 너를 그려봐. 네 손엔 무엇이 있니? 네 주위엔 어떤 빛이 있니?',
    feedback: '너는 항해를 마친 게 아니야.\n다섯 섬은 네 마음의 일부였고,\n이 바다는 네가 만든 세계야.',
  },
];

export default function DrawingFlowPage() {
  const [step, setStep] = useState<FlowStep>('welcome');
  const [currentStage, setCurrentStage] = useState(1);
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [finalResult, setFinalResult] = useState<FinalResultData | null>(null);
  const [allDrawings, setAllDrawings] = useState<string[]>([]); // 5개 그림 저장
  const reportRef = useRef<HTMLDivElement>(null);

  // 현재 단계에 맞는 배경 이미지 반환
  const getBackgroundImage = () => {
    // 프롤로그 (첫 번째 섬의 처음 2개 대화)
    if (currentStage === 1 && dialogueIndex < 2) {
      return '/prologue0.png';
    }
    // 각 섬별 배경 (1~5)
    return `/prologue${currentStage}.png`;
  };

  const handleStart = () => {
    setCurrentStage(1);
    setDialogueIndex(0);
    setStep('story');
  };

  const handleNextDialogue = () => {
    const stage = STAGES[currentStage - 1];
    if (dialogueIndex < stage.storyDialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // 대화 끝 - 그리기 시작
      setScenario(stage.scenario);
      setStep('drawing');
    }
  };

  const handleDrawingComplete = async (imageData: string) => {
    setStep('processing');

    // 그림 저장
    const updatedDrawings = [...allDrawings, imageData];
    setAllDrawings(updatedDrawings);

    // TODO: 백엔드 API 호출
    await new Promise(resolve => setTimeout(resolve, 3000));

    const stage = STAGES[currentStage - 1];
    setResult({
      originalImage: imageData,
      aiImage: '/prologue.png', // TODO: 백엔드에서 받은 AI 이미지
      story: stage.feedback,
      currentStage: currentStage,
    });
    setStep('result');
  };

  const handleNextStage = async () => {
    if (currentStage < 5) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setDialogueIndex(0);
      setResult(null);
      setStep('story');
    } else {
      // 5단계 완료 - 최종 결과 생성
      setStep('processing');

      // TODO: 백엔드 API 호출 - 5개 그림을 합쳐서 최종 이미지 생성 + 스토리 요약 + 감정 분석
      await new Promise(resolve => setTimeout(resolve, 3000));

      setFinalResult({
        finalImage: '/prologue.png', // TODO: 백엔드에서 받은 최종 합성 이미지
        storySummary: '당신은 빛을 잃은 바다에서 시작해, 다섯 개의 섬을 건너며 자신을 다시 발견했습니다.\n\n둥지에서 시작된 여정은 불의 섬을 지나 다리를 건너고, 비를 맞으며, 마침내 별의 정원에 도착했습니다.\n\n이 모든 여정은 당신 마음속 감정의 항해였습니다.',
        emotionAnalysis: '당신의 그림에서 따뜻함과 희망이 느껴집니다.\n\n주요 감정: 평온함, 성찰, 희망\n\n당신은 자신의 감정을 잘 이해하고 있으며, 앞으로 나아갈 준비가 되어 있습니다.\n\n\n【 첫 번째 섬 - 새의 섬 】\n둥지를 그린 당신의 선택은 안전과 보호에 대한 욕구를 나타냅니다. 당신은 지금 자신만의 안식처를 찾고 있으며, 내면의 어린 자아를 돌보고 있습니다.\n\n\n【 두 번째 섬 - 불의 섬 】\n불타는 나무와 사과는 변화와 성장의 상징입니다. 당신은 어려움 속에서도 성숙해지고 있으며, 분노를 건설적인 에너지로 전환하는 법을 배우고 있습니다.\n\n\n【 세 번째 섬 - 다리의 섬 】\n다리는 연결과 신뢰를 의미합니다. 당신은 과거와 미래, 현실과 꿈을 이어주는 다리를 만들고 있습니다. 이는 당신의 용기와 믿음을 보여줍니다.\n\n\n【 네 번째 섬 - 비의 섬 】\n비를 맞는 모습은 감정을 받아들이는 당신의 태도를 나타냅니다. 당신은 슬픔을 회피하지 않고 직면하며, 이를 통해 정화되고 있습니다.\n\n\n【 다섯 번째 섬 - 별의 정원 】\n별의 정원에서 당신은 자신의 빛을 되찾았습니다. 이 여정을 통해 당신은 자신의 가치를 재발견했으며, 이제 새로운 시작을 할 준비가 되었습니다.\n\n\n당신의 그림들은 하나의 이야기를 만들어냅니다. 이는 단순한 그림이 아니라, 당신 내면의 목소리이자 치유의 과정입니다.\n\n앞으로도 당신의 감정을 표현하고, 자신과 대화하는 시간을 가지세요. 당신은 이미 충분히 강하고, 아름답습니다.',
      });
      setStep('finalResult');
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // 로딩 표시
      const button = document.activeElement as HTMLButtonElement;
      const originalText = button?.textContent || '';
      if (button) button.textContent = '생성 중...';

      // HTML을 캔버스로 변환
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
      });

      // PDF 생성 - 여백 최소화
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 여백 설정 (좌우 5mm)
      const margin = 5;
      const availableWidth = pdfWidth - (margin * 2);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = availableWidth / imgWidth;

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // 여러 페이지로 나누기
      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', margin, position, scaledWidth, scaledHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, scaledWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      // 파일명에 날짜 포함
      const date = new Date().toISOString().split('T')[0];
      pdf.save(`감정항해_분석리포트_${date}.pdf`);

      // 버튼 텍스트 복원
      if (button) button.textContent = originalText;
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };



  return (
    <div className="relative">
      {step === 'welcome' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/prologue.png)',
              filter: 'brightness(0.7)'
            }}
          ></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 px-4">
            {/* 타이틀 */}
            <div className="text-center">
              <h1 className="font-sketch text-4xl sm:text-5xl text-sketch-brown mb-3 drop-shadow-lg">
                꿈의 항해
              </h1>
              <p className="font-hand text-xl sm:text-2xl text-sketch-brown/90 drop-shadow-lg">
                감정의 바다로
              </p>
            </div>

            {/* 프롤로그 텍스트 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-sketch-brown/30 p-6 sm:p-8">
              <div className="space-y-4 text-sketch-brown/90 font-bold" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                <p className="text-base sm:text-lg leading-relaxed text-center italic">
                  "감정의 바다는, 네가 그린 선으로 이어진단다."
                </p>

                <div className="h-px bg-sketch-brown/20 my-4"></div>

                <p className="text-sm sm:text-base leading-relaxed">
                  당신은 지금 <span className="text-sketch-orange">빛을 잃은 바다</span>에 표류한 존재입니다.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  하늘은 별이 가라앉고, 파도는 감정처럼 밀려옵니다.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  이 바다엔 <span className="text-sketch-orange">다섯 개의 섬</span>이 있습니다.<br />
                  그 섬을 모두 건너면, 당신의 마음이 별처럼 다시 빛날 것입니다.
                </p>

                <div className="h-px bg-sketch-brown/20 my-4"></div>

                <p className="text-sm sm:text-base leading-relaxed">
                  각 섬은 서로 다른 감정의 상태를 상징하며,<br />
                  당신은 그림을 그려서 바다를 건너고, 다리를 세우며 항로를 완성합니다.
                </p>
              </div>
            </div>

            {/* 시작 버튼 */}
            <div className="text-center">
              <button onClick={handleStart} className="sketch-button text-base sm:text-lg px-10 py-3 shadow-2xl">
                항해 시작하기
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'story' && (
        <div className="fixed inset-0 z-50">
          {/* 배경 이미지 + 따뜻한 남색 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${getBackgroundImage()})`,
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 h-full flex flex-col">
            {/* 상단 타이틀 */}
            <div className="flex-shrink-0 pt-6 pb-4 px-4">
              <h1 className="font-sketch text-3xl sm:text-4xl text-white text-center drop-shadow-lg">
                {currentStage === 1 && dialogueIndex < 2 ? '프롤로그' : STAGES[currentStage - 1].title}
              </h1>
            </div>

            {/* 중앙 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center px-4">
              {/* 조건부 이미지 표시 */}
              {(currentStage === 1 && dialogueIndex < 2) ||
                (currentStage === 1 && dialogueIndex >= 3) ||
                (currentStage === 2 && dialogueIndex >= 1) ||
                (currentStage === 3 && dialogueIndex >= 2) ? (
                <img
                  src={
                    currentStage === 1 && dialogueIndex < 2
                      ? '/1-1.png'
                      : currentStage === 1
                        ? '/2-1.png'
                        : currentStage === 2
                          ? '/3-1.png'
                          : '/4-1.png'
                  }
                  alt="Island"
                  className="max-w-xl w-full h-auto object-contain max-h-[50vh]"
                />
              ) : null}
            </div>

            {/* 하단 말풍선 대화창 */}
            <div className="flex-shrink-0 px-4 pb-8">
              <div className="max-w-3xl mx-auto">
                {/* 말풍선 */}
                <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/40 p-4 sm:p-6">
                  {/* 말풍선 꼬리 */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white/40"></div>

                  {/* 대화 텍스트 */}
                  <p
                    className="text-base sm:text-lg text-white leading-relaxed text-center whitespace-pre-line font-bold pr-12 drop-shadow-lg"
                    style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
                  >
                    {STAGES[currentStage - 1].storyDialogues[dialogueIndex]}
                  </p>

                  {/* 오른쪽 화살표 버튼 */}
                  <button
                    onClick={handleNextDialogue}
                    className="absolute right-4 bottom-1/2 transform translate-y-1/2 text-white hover:text-sketch-orange transition-colors drop-shadow-lg"
                    aria-label="다음"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  {/* 진행 표시 (점) */}
                  <div className="flex justify-center gap-2 mt-4">
                    {STAGES[currentStage - 1].storyDialogues.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${index === dialogueIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'drawing' && (
        <div className="fixed inset-0 z-50">
          {/* 배경 이미지 + 따뜻한 남색 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/prologue${currentStage}.png)`,
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
            <SketchbookCanvas
              scenario={scenario}
              stageTitle={STAGES[currentStage - 1].title}
              onDrawingComplete={handleDrawingComplete}
            />
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/prologue.png)',
              filter: 'brightness(0.6)'
            }}
          ></div>

          {/* 로딩 컨텐츠 */}
          <div className="relative z-10 max-w-lg mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-sketch-brown/30 p-8">
              <h2 className="font-sketch text-3xl text-sketch-brown text-center mb-6">
                AI가 이야기를 만들고 있어요...
              </h2>
              <div className="flex justify-center py-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-sketch-sand"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-sketch-orange animate-spin"></div>
                </div>
              </div>
              <p className="font-hand text-base text-gray-700 text-center mt-3">
                잠시만 기다려주세요
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'finalResult' && finalResult && (
        <div className="fixed inset-0 z-50">
          {/* 배경 이미지 + 따뜻한 남색 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/prologue.png)',
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
            {/* 중앙 최종 완성 그림 */}
            <div className="mb-8">
              <img
                src={finalResult.finalImage}
                alt="Final Journey"
                className="max-w-xl w-full h-auto object-contain max-h-[50vh] rounded-lg shadow-2xl border-4 border-white/80"
              />
            </div>

            {/* 스토리 요약 - 어두운 글씨 */}
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-sketch-brown/30 p-6 sm:p-8">
                <p
                  className="text-base sm:text-lg text-sketch-brown leading-relaxed text-center whitespace-pre-line font-bold"
                  style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
                >
                  {finalResult.storySummary}
                </p>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setStep('emotionAnalysis')}
                    className="sketch-button text-sm sm:text-base px-6 py-2.5 shadow-md"
                  >
                    감정 분석 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'emotionAnalysis' && finalResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-warm-50 to-sketch-sand">
          {/* 컨텐츠 - 따뜻한 베이지 레포트 스타일 */}
          <div className="min-h-full flex flex-col items-center justify-start px-4 py-12">
            <div ref={reportRef} className="max-w-4xl w-full space-y-8">
              {/* 헤더 - 따뜻한 느낌 */}
              <div className="text-center space-y-4 mb-12">
                <div className="inline-block px-4 py-2 bg-warm-200 rounded-full mb-4">
                  <p className="text-sm text-sketch-brown font-semibold">감정 항해 분석 리포트</p>
                </div>
                <h1 className="font-sketch text-4xl sm:text-5xl text-sketch-brown">
                  당신의 여정 분석
                </h1>
                <p className="text-sketch-brown/70 text-sm">
                  {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* 최종 이미지 */}
              <div className="bg-white rounded-2xl shadow-sketch border-2 border-sketch-brown/20 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-sketch-brown mb-4 text-center">완성된 여정</h2>
                <div className="flex justify-center">
                  <img
                    src={finalResult.finalImage}
                    alt="Final Journey"
                    className="max-w-md w-full rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* 스토리 요약 */}
              <div className="bg-white rounded-2xl shadow-sketch border-2 border-sketch-brown/20 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-sketch-brown mb-4">여정 이야기</h2>
                <p className="text-sketch-brown/90 leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                  {finalResult.storySummary}
                </p>
              </div>

              {/* 감정 분석 - 각 단계별 이미지 포함 */}
              <div className="bg-white rounded-2xl shadow-sketch border-2 border-sketch-brown/20 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-sketch-brown mb-6">심리 분석</h2>
                <div className="space-y-8">
                  {/* 전체 요약 */}
                  <div>
                    <p className="text-sketch-brown/90 leading-relaxed mb-6" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                      당신의 그림에서 따뜻함과 희망이 느껴집니다.
                      <br /><br />
                      주요 감정: 평온함, 성찰, 희망
                      <br /><br />
                      당신은 자신의 감정을 잘 이해하고 있으며, 앞으로 나아갈 준비가 되어 있습니다.
                    </p>
                  </div>

                  {/* 각 단계별 분석 */}
                  {STAGES.map((stage, index) => (
                    <div key={stage.id} className="border-t border-sketch-brown/20 pt-6">
                      <h3 className="text-xl font-bold text-sketch-orange mb-4">
                        {stage.title}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 items-start">
                        {/* 그림 */}
                        <div className="flex justify-center">
                          <img
                            src={allDrawings[index] || '/prologue.png'}
                            alt={`${stage.title} 그림`}
                            className="w-full max-w-xs rounded-lg shadow-sketch border-2 border-sketch-brown/20"
                          />
                        </div>
                        {/* 분석 텍스트 */}
                        <div>
                          <p className="text-sketch-brown/90 leading-relaxed" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                            {index === 0 && '둥지를 그린 당신의 선택은 안전과 보호에 대한 욕구를 나타냅니다. 당신은 지금 자신만의 안식처를 찾고 있으며, 내면의 어린 자아를 돌보고 있습니다.'}
                            {index === 1 && '불타는 나무와 사과는 변화와 성장의 상징입니다. 당신은 어려움 속에서도 성숙해지고 있으며, 분노를 건설적인 에너지로 전환하는 법을 배우고 있습니다.'}
                            {index === 2 && '다리는 연결과 신뢰를 의미합니다. 당신은 과거와 미래, 현실과 꿈을 이어주는 다리를 만들고 있습니다. 이는 당신의 용기와 믿음을 보여줍니다.'}
                            {index === 3 && '비를 맞는 모습은 감정을 받아들이는 당신의 태도를 나타냅니다. 당신은 슬픔을 회피하지 않고 직면하며, 이를 통해 정화되고 있습니다.'}
                            {index === 4 && '별의 정원에서 당신은 자신의 빛을 되찾았습니다. 이 여정을 통해 당신은 자신의 가치를 재발견했으며, 이제 새로운 시작을 할 준비가 되었습니다.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 종합 메시지 */}
                  <div className="border-t border-sketch-brown/20 pt-6">
                    <p className="text-sketch-brown/90 leading-relaxed" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                      당신의 그림들은 하나의 이야기를 만들어냅니다. 이는 단순한 그림이 아니라, 당신 내면의 목소리이자 치유의 과정입니다.
                      <br /><br />
                      앞으로도 당신의 감정을 표현하고, 자신과 대화하는 시간을 가지세요. 당신은 이미 충분히 강하고, 아름답습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="flex justify-center gap-4 flex-wrap pb-8">
                <button
                  onClick={handleDownloadPDF}
                  className="sketch-button text-base px-8 py-3"
                >
                  📄 PDF로 저장하기
                </button>
                <button
                  onClick={() => {
                    setStep('welcome');
                    setCurrentStage(1);
                    setDialogueIndex(0);
                    setResult(null);
                    setFinalResult(null);
                    setAllDrawings([]);
                  }}
                  className="px-8 py-3 rounded-lg bg-white text-sketch-brown font-semibold hover:bg-warm-100 transition-colors shadow-sketch border-2 border-sketch-brown/20"
                >
                  처음으로
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="fixed inset-0 z-50">
          {/* 배경 이미지 + 따뜻한 남색 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/prologue${currentStage}.png)`,
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 h-full flex flex-col">
            {/* 상단 타이틀 */}
            <div className="flex-shrink-0 pt-6 pb-4 px-4">
              <h1 className="font-sketch text-3xl sm:text-4xl text-white text-center drop-shadow-lg">
                {STAGES[currentStage - 1].title}
              </h1>
            </div>

            {/* 중앙 그림 영역 */}
            <div className="flex-1 flex items-center justify-center px-4 pb-4">
              <div className="w-full max-w-md aspect-square">
                <img
                  src={result.originalImage}
                  alt="Your Drawing"
                  className="w-full h-full object-contain rounded-lg shadow-2xl border-4 border-white/80"
                />
              </div>
            </div>

            {/* 하단 말풍선 대화창 */}
            <div className="flex-shrink-0 px-4 pb-8">
              <div className="max-w-3xl mx-auto">
                {/* 말풍선 */}
                <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/40 p-4 sm:p-6">
                  {/* 말풍선 꼬리 */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white/40"></div>

                  {/* 대화 텍스트 */}
                  <p
                    className="text-base sm:text-lg text-white leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-lg"
                    style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
                  >
                    {result.story}
                  </p>

                  {/* 버튼 영역 */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleNextStage}
                      className="sketch-button text-sm sm:text-base px-6 py-2.5 shadow-md"
                    >
                      {currentStage < 5 ? '다음 섬으로 →' : '여정 완료 ✨'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
