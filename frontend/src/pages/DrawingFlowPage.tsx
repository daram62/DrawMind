import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SketchbookCanvas } from '../components/SketchbookCanvas';
import { generateFairyTale, getReport, generateSessionAggregate } from '../services/drawingService';

type FlowStep = 'story' | 'drawing' | 'processing' | 'result' | 'finalResult';

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
    title: '프롤로그 : 항해의 시작',
    chapterName: '1_1',
    storyDialogues: [
      '여기, 잃어버린 빛의 바다.',
      '수많은 별이 바다 밑으로 떨어지고,\n남은 건 단 하나… 너의 빛.',
      '이 항해는 누군가를 찾기 위한 여정이 아니야.\n잊고 있던 너를 다시 만나는 길이야.',
      '너만의 배를 그려봐.\n어떤 배를 타고 이 바다를 건널까?',
    ],
    scenario: '감정의 바다를 건널 너만의 배를 그려봐. 어떤 모양일까? 어떤 색일까?',
    feedback: '이 배는 네 마음을 담은 그릇이야.\n이제 항해를 시작할 시간이야.',
  },
  {
    id: 2,
    title: '첫 번째 이야기 : 새의 섬',
    chapterName: '2_2',
    storyDialogues: [
      '첫 번째 섬에 도착했어.',
      '이 섬엔 오래된 둥지가 있어.\n한때 새들이 머물렀지만, 지금은 비어 있지.',
      '하늘 위의 둥지를 그려봐.\n그 안엔 무엇이 있을까? 알, 새, 혹은 아무것도.',
    ],
    scenario: '하늘 위의 둥지를 그려봐. 그 안엔 무엇이 있을까? 알, 새, 혹은 너 자신?',
    feedback: '둥지는 마음의 쉼터야.\n너는 지금, 네 안의 어린 새를 품고 있어.',
  },
  {
    id: 3,
    title: '두 번째 이야기 : 불의 섬',
    chapterName: '3_2',
    storyDialogues: [
      '두 번째 섬에 도착했어.',
      '이곳은 불의 섬.\n나무는 타오르고, 사과는 붉게 익어가.',
      '불타는 나무 아래에서 사과를 따는 사람을 그려봐.\n그는 어떤 얼굴을 하고 있을까?',
    ],
    scenario: '불타는 사과나무 아래에서 사과를 따는 사람을 그려봐. 그는 어떤 표정일까?',
    feedback: '분노는 파괴가 아니라, 네가 다시 빛나려는 몸부림이야.\n불길 속에서도, 사과는 붉게 익어가고 있지.',
  },
  {
    id: 4,
    title: '세 번째 이야기 : 다리의 섬',
    chapterName: '4_2',
    storyDialogues: [
      '세 번째 섬이야.',
      '이 섬의 끝에서 저 멀리 별의 섬이 반짝이고 있어.',
      '다리를 그려봐.\n이 섬에서 저 별의 섬까지 가는 다리를.\n다리 위엔 누가 서 있을까?',
    ],
    scenario: '이 섬에서 저 멀리 반짝이는 별의 섬까지 가는 다리를 그려봐. 다리는 어떤 모습일까?',
    feedback: '다리는 믿음의 선으로 그려지지.\n네가 건너면, 그 길은 빛으로 변할 거야.',
  },
  {
    id: 5,
    title: '네 번째 이야기 : 비의 섬',
    chapterName: '5_2',
    storyDialogues: [
      '네 번째 섬에 비가 내리고 있어.',
      '이곳은 비의 섬.\n감정이 흠뻑 젖는 곳.',
      '비 속에 서 있는 사람을 그려봐.\n그는 비를 피하고 있을까, 그냥 맞고 있을까?',
    ],
    scenario: '비 속에 서 있는 사람을 그려봐. 그는 비를 피하고 있을까, 그냥 맞고 있을까?',
    feedback: '젖은 어깨는 슬픔이 아니라, 용기의 흔적이야.\n감정은 흠뻑 젖을 때 비로소 맑아진단다.',
  },
  {
    id: 6,
    title: '다섯 번째 이야기 : 가족의 섬',
    chapterName: '6_2',
    storyDialogues: [
      '마지막 섬이야.',
      '가족의 섬.\n네가 찾던 빛이 여기 있어.',
      '이 여정을 끝낸 지금, 너와 함께 있는 사람들을 그려봐.\n누가 네 곁에 있니?',
    ],
    scenario: '여정을 마친 지금, 너와 함께 있는 가족이나 소중한 사람들을 그려봐.',
    feedback: '너는 항해를 마친 게 아니야.\n여섯 섬은 네 마음의 일부였고,\n이 바다는 네가 만든 세계야.\n그리고 네 곁엔 언제나 함께할 사람들이 있어.',
  },
];

export default function DrawingFlowPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<FlowStep>('story');
  const [currentStage, setCurrentStage] = useState(1);
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [finalResult, setFinalResult] = useState<FinalResultData | null>(null);
  const [allDrawings, setAllDrawings] = useState<string[]>([]); // 5개 그림 저장
  const [sessionId, setSessionId] = useState<string>(''); // 백엔드에서 생성된 session_id 저장

  useEffect(() => {
    // Map stage to track: stages 1..6 -> tracks 1..6, otherwise track 7
    const playForCurrent = () => {
      try {
        if (step === 'processing' || step === 'finalResult') {
          // play closing music
          import('../services/audioService').then(mod => mod.playTrack(7, { loop: true, volume: 0.6 }));
        } else if (currentStage >= 1 && currentStage <= 6) {
          const track = currentStage; // 1..6
          import('../services/audioService').then(mod => mod.playTrack(track, { loop: true, volume: 0.55 }));
        } else {
          import('../services/audioService').then(mod => mod.playTrack(7, { loop: true, volume: 0.6 }));
        }
      } catch (e) { }
    };

    playForCurrent();
  }, [step, currentStage]);

  // 현재 단계에 맞는 배경 이미지 반환
  const getBackgroundImage = () => {
    // bg0 ~ bg5 (6단계)
    // 1단계 → bg0, 2단계 → bg1, ..., 6단계 → bg5
    return `/bg${currentStage - 1}.webp`;
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

    try {
      const stage = STAGES[currentStage - 1];

      // 1. API 호출 - 동화 이미지 생성
      // data:image/png;base64, 접두사 제거 (백엔드는 순수 base64만 필요)
      const base64Image = imageData.includes(',')
        ? imageData.split(',')[1]
        : imageData;

      const payload: any = {
        chapter_name: stage.chapterName, // 백엔드가 기대하는 형식 (1_1, 2_2 등)
        user_image: base64Image, // 순수 base64 이미지
      };

      // 첫 번째 요청이 아니면 session_id 포함
      if (sessionId) {
        payload.session_id = sessionId;
      }

      const response = await generateFairyTale(payload);

      console.log('API Response:', response);
      console.log('Session ID from response:', response.session_id);

      // 응답에서 받은 session_id 저장 (첫 요청 시)
      if (response.session_id && !sessionId) {
        console.log('Setting new session ID:', response.session_id);
        setSessionId(response.session_id);
      }

      // 2. 리포트 API 호출 (비동기로 백그라운드에서 description 생성)
      // await 없이 호출만 하고 넘어감 - EmotionAnalysisPage에서 최종 결과 확인
      getReport(response.session_id).catch(err =>
        console.log('Background report generation:', err)
      );

      // base64 이미지에 data URL 접두사 추가
      const aiImageWithPrefix = response.result_image.startsWith('data:')
        ? response.result_image
        : `data:image/png;base64,${response.result_image}`;

      setResult({
        originalImage: imageData,
        aiImage: aiImageWithPrefix, // 백엔드에서 받은 AI 이미지 (접두사 추가)
        story: stage.feedback,
        currentStage: currentStage,
      });
      setStep('result');
    } catch (error: any) {
      console.error('Error generating fairy tale:', error);
      const errorMessage = error.response?.data?.detail || error.message || '알 수 없는 오류';
      console.error('Error details:', error.response?.data);
      alert(`API 호출 실패: ${JSON.stringify(errorMessage)}`);
      // 에러 발생 시 기본 이미지 사용
      const stage = STAGES[currentStage - 1];
      setResult({
        originalImage: imageData,
        aiImage: '/bg0.webp',
        story: stage.feedback,
        currentStage: currentStage,
      });
      setStep('result');
    }
  };

  const handleNextStage = async () => {
    if (currentStage < 6) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setDialogueIndex(0);
      setResult(null);
      setStep('story');
    } else {
      // 6단계 완료 - 최종 합성 이미지 생성 및 리포트 가져오기
      setStep('processing');

      try {
        // 1. 세션의 모든 이미지를 합쳐서 최종 이미지 생성
        const aggregateResponse = await generateSessionAggregate(sessionId);

        // base64 이미지에 data URL 접두사 추가
        const finalImageWithPrefix = aggregateResponse.result_image.startsWith('data:')
          ? aggregateResponse.result_image
          : `data:image/png;base64,${aggregateResponse.result_image}`;

        // 2. 리포트 API 호출
        console.log('Calling getReport with sessionId:', sessionId);
        const reportData = await getReport(sessionId);
        console.log('Report data received:', reportData);

        setFinalResult({
          finalImage: finalImageWithPrefix, // 합성된 최종 이미지
          storySummary: reportData.summary || '당신은 빛을 잃은 바다에서 시작해, 여섯 개의 섬을 건너며 자신을 다시 발견했습니다.\n\n배를 타고 시작된 여정은 둥지를 지나 불의 섬을 건너고, 다리를 세우고, 비를 맞으며, 마침내 소중한 사람들과 함께 별의 정원에 도착했습니다.\n\n이 모든 여정은 당신 마음속 감정의 항해였습니다.',
          emotionAnalysis: '', // EmotionAnalysisPage에서 사용
        });
        setStep('finalResult');
      } catch (error: any) {
        console.error('Error generating final result:', error);
        console.error('Error details:', error.response?.data);
        alert(`최종 결과 생성 실패: ${error.message}`);
        // 에러 발생 시 마지막 이미지 사용
        setFinalResult({
          finalImage: result?.aiImage || '/bg0.webp',
          storySummary: '당신은 빛을 잃은 바다에서 시작해, 여섯 개의 섬을 건너며 자신을 다시 발견했습니다.\n\n배를 타고 시작된 여정은 둥지를 지나 불의 섬을 건너고, 다리를 세우고, 비를 맞으며, 마침내 소중한 사람들과 함께 별의 정원에 도착했습니다.\n\n이 모든 여정은 당신 마음속 감정의 항해였습니다.',
          emotionAnalysis: '',
        });
        setStep('finalResult');
      }
    }
  };



  return (
    <div className="relative">
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
                {STAGES[currentStage - 1].title}
              </h1>
            </div>

            {/* 중앙 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center px-4">
              {/* 조건부 이미지 표시 */}
              {(currentStage === 1) ||
                (currentStage === 2 && dialogueIndex >= 1) ||
                (currentStage === 3 && dialogueIndex >= 2) ||
                (currentStage === 4 && dialogueIndex >= 2) ||
                (currentStage === 5 && dialogueIndex >= 2) ||
                (currentStage === 6 && dialogueIndex >= 2) ? (
                <img
                  src={
                    currentStage === 1
                      ? '/1-1.webp'
                      : currentStage === 2
                        ? '/2-1.webp'
                        : currentStage === 3
                          ? '/3-1.webp'
                          : currentStage === 4
                            ? '/4-1.webp'
                            : currentStage === 5
                              ? '/5-1.webp'
                              : '/6-1.webp'
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
                    className="text-xl sm:text-2xl text-white leading-relaxed text-center whitespace-pre-line font-bold pr-12 drop-shadow-lg"
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
        <div className="relative min-h-screen z-50">
          {/* 배경 이미지 + 따뜻한 남색 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${getBackgroundImage()})`,
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠: 스크롤 허용 */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-6 overflow-y-auto">
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
          {/* 배경 이미지 - 각 단계별 (6단계 완료 후에는 7.png) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/step/${currentStage === 6 && result ? '7' : currentStage}.webp)`,
              filter: 'brightness(0.6)'
            }}
          ></div>

          {/* 로딩 컨텐츠 */}
          <div className="relative z-10 max-w-lg mx-auto px-4">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/40 p-8">
              <h2 className="font-sketch text-2xl sm:text-3xl text-white text-center mb-6 drop-shadow-lg">
                {currentStage === 6 && result ? '별의 정원으로 가고 있어요...' :
                  currentStage === 1 ? '배가 바다를 건너고 있어요...' :
                    currentStage === 2 ? '새의 섬으로 향하고 있어요...' :
                      currentStage === 3 ? '불의 섬이 보여요...' :
                        currentStage === 4 ? '다리를 건너는 중이에요...' :
                          currentStage === 5 ? '비의 섬에 도착했어요...' :
                            '집으로 가는 중이에요...'}
              </h2>
              <div className="flex justify-center py-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-white/40"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-white animate-spin"></div>
                </div>
              </div>
              <p className="text-base sm:text-lg text-white text-center mt-3 drop-shadow-lg" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                AI가 당신의 그림으로 이야기를 만들고 있어요
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
              backgroundImage: 'url(/bg1.webp)',
              filter: 'brightness(0.6)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-blue-900/30"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 h-full flex flex-col">
            {/* 중앙 최종 완성 그림 */}
            <div className="flex-1 flex items-center justify-center px-4">
              <img
                src={finalResult.finalImage}
                alt="Final Journey"
                className="max-w-xl w-full h-auto object-contain max-h-[50vh] rounded-lg shadow-2xl border-4 border-white/80"
              />
            </div>

            {/* 하단 말풍선 - 스토리 요약 */}
            <div className="flex-shrink-0 px-4 pb-8">
              <div className="max-w-3xl mx-auto">
                <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/40 p-4 sm:p-6">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white/40"></div>

                  <p
                    className="text-xl sm:text-2xl text-white leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-lg"
                    style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
                  >
                    {finalResult.storySummary}
                  </p>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        navigate('/analysis', {
                          state: {
                            sessionId: sessionId,
                            finalImage: finalResult.finalImage,
                            storySummary: finalResult.storySummary,
                            emotionAnalysis: finalResult.emotionAnalysis,
                            allDrawings: allDrawings,
                          }
                        });
                      }}
                      className="sketch-button text-lg sm:text-xl px-10 py-4 shadow-md"
                    >
                      감정 분석 보기 →
                    </button>
                  </div>
                </div>
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
                {STAGES[currentStage - 1].title}
              </h1>
            </div>

            {/* 중앙 그림 영역 */}
            <div className="flex-1 flex items-center justify-center px-4 pb-4">
              <div className="w-full max-w-md aspect-square">
                <img
                  src={result.aiImage || result.originalImage}
                  alt="AI Generated Drawing"
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
                    className="text-xl sm:text-2xl text-white leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-lg"
                    style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}
                  >
                    {result.story}
                  </p>

                  {/* 버튼 영역 */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleNextStage}
                      className="sketch-button text-lg sm:text-xl px-10 py-4 shadow-md"
                    >
                      {currentStage < 6 ? '다음 섬으로 →' : '여정 완료'}
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
