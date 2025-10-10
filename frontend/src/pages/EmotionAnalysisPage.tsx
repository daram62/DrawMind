import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getReport, ReportResponse } from '../services/drawingService';

interface FinalResultData {
  sessionId: string;
  finalImage: string;
  storySummary: string;
  emotionAnalysis: string;
  allDrawings: string[];
}

const STAGES = [
  { id: 1, title: '프롤로그 : 항해의 시작', isPrologue: true },
  { id: 2, title: '첫 번째 이야기 : 새의 섬' },
  { id: 3, title: '두 번째 이야기 : 불의 섬' },
  { id: 4, title: '세 번째 이야기 : 다리의 섬' },
  { id: 5, title: '네 번째 이야기 : 비의 섬' },
  { id: 6, title: '다섯 번째 이야기 : 가족의 섬' },
];

export default function EmotionAnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const finalResult = location.state as FinalResultData;

  // [패턴] 형식을 찾아서 줄바꿈하고 볼드체로 변환하는 함수
  const formatDescription = (text: string) => {
    // [패턴] 형식을 찾아서 **[패턴]**로 변환하고 앞에 줄바꿈 추가
    const formatted = text.replace(/\[([^\]]+)\]/g, '\n**[$1]**');
    return formatted.trim();
  };

  // 데이터가 없으면 홈으로 리다이렉트
  if (!finalResult) {
    navigate('/');
    return null;
  }

  // 리포트 데이터 가져오기
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReport(finalResult.sessionId);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [finalResult.sessionId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const button = document.activeElement as HTMLButtonElement;
      const originalText = button?.textContent || '';
      if (button) button.textContent = '생성 중...';

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
      });

      const imgData = canvas.toDataURL('image/png');
      
      // 캔버스 크기에 맞춰 PDF 페이지 크기 설정
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // A4 너비 기준으로 스케일 조정
      const pdfWidth = 210; // A4 width in mm
      const ratio = pdfWidth / imgWidth;
      const pdfHeight = imgHeight * ratio;

      // 커스텀 페이지 크기로 PDF 생성 (하나의 긴 페이지)
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      
      // 이미지를 페이지 전체에 맞춤
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const date = new Date().toISOString().split('T')[0];
      pdf.save(`감정항해_분석리포트_${date}.pdf`);

      if (button) button.textContent = originalText;
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-warm-50 to-sketch-sand">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-sketch-sand"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-sketch-orange animate-spin"></div>
          </div>
          <p className="text-sketch-brown font-bold" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
            분석 리포트를 생성하고 있어요...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-warm-50 to-sketch-sand">
      <div className="min-h-full flex flex-col items-center justify-start px-4 py-12">
        <div ref={reportRef} className="max-w-4xl w-full space-y-8">
          {/* 헤더 */}
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

          {/* 감정 분석 */}
          <div className="bg-white rounded-2xl shadow-sketch border-2 border-sketch-brown/20 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-sketch-brown mb-6">심리 분석</h2>
            <div className="space-y-8">
              {/* 전체 요약 */}

              {/* 각 단계별 분석 - 프롤로그와 aggregate_final 제외 (1~5단계만) */}
              {reportData?.chapters
                .filter((chapter, idx) => idx > 0 && chapter.chapter_name !== 'aggregate_final')
                .map((chapter, index) => {
                  // 원본 인덱스 계산 (프롤로그 제외했으므로 +1)
                  const originalIndex = reportData.chapters.findIndex(c => c.chapter_name === chapter.chapter_name);
                  return (
                    <div key={index} className="border-t border-sketch-brown/20 pt-6">
                      <h3 className="text-xl font-bold text-sketch-orange mb-4">
                        {STAGES[originalIndex]?.title || chapter.chapter_name}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="flex justify-center">
                          <img
                            src={chapter.result_image || finalResult.allDrawings[originalIndex] || '/bg0.webp'}
                            alt={`${chapter.chapter_name} 그림`}
                            className="w-full max-w-xs rounded-lg shadow-sketch border-2 border-sketch-brown/20"
                          />
                        </div>
                        <div>
                          <div className="text-sketch-brown/90 leading-relaxed" style={{ fontFamily: 'Cafe24Oneprettynight, cursive' }}>
                            {formatDescription(chapter.description ||
                              (index === 0 ? '둥지를 그린 당신의 선택은 안전과 보호에 대한 욕구를 나타냅니다. 당신은 지금 자신만의 안식처를 찾고 있으며, 내면의 어린 자아를 돌보고 있습니다.' :
                                index === 1 ? '불타는 나무와 사과는 변화와 성장의 상징입니다. 당신은 어려움 속에서도 성숙해지고 있으며, 분노를 건설적인 에너지로 전환하는 법을 배우고 있습니다.' :
                                  index === 2 ? '다리는 연결과 신뢰를 의미합니다. 당신은 과거와 미래, 현실과 꿈을 이어주는 다리를 만들고 있습니다. 이는 당신의 용기와 믿음을 보여줍니다.' :
                                    index === 3 ? '비를 맞는 모습은 감정을 받아들이는 당신의 태도를 나타냅니다. 당신은 슬픔을 회피하지 않고 직면하며, 이를 통해 정화되고 있습니다.' :
                                      '별의 정원에서 당신은 자신의 빛을 되찾았습니다. 이 여정을 통해 당신은 자신의 가치를 재발견했으며, 이제 새로운 시작을 할 준비가 되었습니다.')
                            ).split('\n').map((line, i) => {
                              // 빈 줄은 건너뛰기
                              if (!line.trim()) return null;

                              // **[패턴]** 형식을 찾아서 볼드 처리
                              const boldPattern = /\*\*\[([^\]]+)\]\*\*/g;
                              if (boldPattern.test(line)) {
                                const parts = line.split(/(\*\*\[[^\]]+\]\*\*)/g);
                                return (
                                  <p key={i} className="mb-3 mt-4">
                                    {parts.map((part, j) => {
                                      if (part.match(/\*\*\[([^\]]+)\]\*\*/)) {
                                        const text = part.replace(/\*\*/g, '');
                                        return <strong key={j} className="text-sketch-orange">{text}</strong>;
                                      }
                                      return part;
                                    })}
                                  </p>
                                );
                              }
                              return <p key={i} className="mb-2">{line}</p>;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

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
              레포트 내보내기
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-lg bg-white text-sketch-brown font-semibold hover:bg-warm-100 transition-colors shadow-sketch border-2 border-sketch-brown/20"
            >
              처음으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
