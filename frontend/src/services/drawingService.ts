import apiClient from './api';

export interface GenerateFairyTaleRequest {
  session_id: string;
  chapter_name: string;
  user_image: string; // base64 encoded image
}

export interface GenerateFairyTaleResponse {
  success: boolean;
  session_id: string;
  chapter_name: string;
  result_image: string; // base64 encoded image
  generation_time: number;
  total_images: number;
}

export interface ReportResponse {
  session_id: string;
  chapters: Array<{
    chapter_name: string;
    user_image: string;
    result_image: string;
    description: string;
  }>;
  summary: string;
  created_at: string;
}

export interface ProcessDrawingRequest {
  image: string; // base64 encoded image
  scenario: string;
}

export interface ProcessDrawingResponse {
  originalImage: string;
  enhancedImage?: string;
  story: string;
  analysis?: {
    objects: string[];
    colors: string[];
    mood: string;
  };
}

export interface Scenario {
  id: string;
  text: string;
  category: string;
}

/**
 * 동화 이미지 생성 API 호출
 */
export const generateFairyTale = async (
  request: GenerateFairyTaleRequest
): Promise<GenerateFairyTaleResponse> => {
  try {
    const response = await apiClient.post<GenerateFairyTaleResponse>(
      '/api/generate-fairy-tale',
      request
    );
    return response; // apiClient.post가 이미 response.data를 리턴함
  } catch (error) {
    console.error('Error generating fairy tale:', error);
    throw error;
  }
};

/**
 * 세션 리포트 조회
 */
export const getReport = async (sessionId: string): Promise<ReportResponse> => {
  try {
    const response = await apiClient.get<ReportResponse>(
      `/api/report/${sessionId}`
    );
    return response; // apiClient.get이 이미 response.data를 리턴함
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

/**
 * 세션의 모든 이미지 조회
 */
export const getSessionImages = async (sessionId: string): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>(
      `/api/session/${sessionId}/images`
    );
    return response; // apiClient.get이 이미 response.data를 리턴함
  } catch (error) {
    console.error('Error fetching session images:', error);
    throw error;
  }
};

/**
 * 세션의 모든 이미지를 합쳐서 최종 이미지 생성
 */
export const generateSessionAggregate = async (
  sessionId: string
): Promise<GenerateFairyTaleResponse> => {
  try {
    const response = await apiClient.post<GenerateFairyTaleResponse>(
      '/api/generate-fairy-tale/session-aggregate',
      {
        session_id: sessionId,
        chapter_name: 'aggregate_final',
      }
    );
    return response;
  } catch (error) {
    console.error('Error generating session aggregate:', error);
    throw error;
  }
};

/**
 * 그림을 백엔드로 전송하고 AI 처리 결과를 받아옵니다
 */
export const processDrawing = async (
  request: ProcessDrawingRequest
): Promise<ProcessDrawingResponse> => {
  try {
    // base64를 Blob으로 변환
    const base64Data = request.image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // FormData 생성
    const formData = new FormData();
    formData.append('image', blob, 'drawing.png');
    formData.append('scenario', request.scenario);

    const response = await apiClient.post<ProcessDrawingResponse>(
      '/api/drawings/process',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error processing drawing:', error);
    throw error;
  }
};

/**
 * 랜덤 시나리오를 가져옵니다
 */
export const getRandomScenario = async (): Promise<Scenario> => {
  try {
    const response = await apiClient.get<Scenario>('/api/scenarios/random');
    return response;
  } catch (error) {
    console.error('Error fetching scenario:', error);
    throw error;
  }
};

/**
 * 모든 시나리오 목록을 가져옵니다
 */
export const getAllScenarios = async (): Promise<Scenario[]> => {
  try {
    const response = await apiClient.get<Scenario[]>('/api/scenarios');
    return response;
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    throw error;
  }
};

/**
 * 그림을 저장합니다
 */
export const saveDrawing = async (
  imageData: string,
  metadata?: {
    scenario?: string;
    story?: string;
    title?: string;
  }
): Promise<{ id: string; url: string }> => {
  try {
    const response = await apiClient.post<{ id: string; url: string }>('/api/drawings/save', {
      image: imageData,
      ...metadata,
    });
    return response;
  } catch (error) {
    console.error('Error saving drawing:', error);
    throw error;
  }
};

/**
 * 저장된 그림 목록을 가져옵니다
 */
export const getSavedDrawings = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>('/api/drawings');
    return response;
  } catch (error) {
    console.error('Error fetching saved drawings:', error);
    throw error;
  }
};
