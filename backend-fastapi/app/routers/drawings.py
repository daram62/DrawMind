from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import base64
import io
from PIL import Image
import random

router = APIRouter(prefix="/api/drawings", tags=["drawings"])

# 임시 시나리오 데이터
SCENARIOS = [
    {
        "id": "1",
        "text": "숲 속에서 토끼와 여우가 만났어요. 무슨 일이 일어날까요?",
        "category": "동물"
    },
    {
        "id": "2",
        "text": "마법사가 성에서 새로운 주문을 연습하고 있어요.",
        "category": "마법"
    },
    {
        "id": "3",
        "text": "바닷속 인어 공주가 보물을 찾고 있어요.",
        "category": "바다"
    },
    {
        "id": "4",
        "text": "용감한 기사가 드래곤을 만났어요.",
        "category": "모험"
    },
    {
        "id": "5",
        "text": "요정들이 꽃밭에서 춤을 추고 있어요.",
        "category": "요정"
    },
]

@router.post("/process")
async def process_drawing(
    image: UploadFile = File(...),
    scenario: str = Form(...)
):
    """
    그림을 처리하고 AI 분석 결과를 반환합니다.
    
    TODO: 실제 AI 모델 통합
    - 이미지 분석 (객체 인식, 색상 분석 등)
    - 스토리 생성 (GPT 등)
    - 이미지 향상 (Stable Diffusion 등)
    """
    try:
        # 이미지 읽기
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        
        # 이미지를 base64로 변환
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        original_image = f"data:image/png;base64,{img_base64}"
        
        # TODO: 실제 AI 처리
        # 1. 이미지 분석
        # analysis = analyze_image(img)
        
        # 2. 스토리 생성
        # story = generate_story(scenario, analysis)
        
        # 3. 이미지 향상 (선택적)
        # enhanced_img = enhance_image(img, scenario)
        
        # 임시 응답
        story = f"""{scenario}

당신이 그린 그림 속에서 마법 같은 이야기가 펼쳐졌어요!

캔버스 위의 선들이 살아 움직이며, 상상했던 장면이 현실이 되었습니다.
색색의 물감들이 어우러져 아름다운 하모니를 만들어냈어요.

이 그림은 당신만의 특별한 이야기를 담고 있습니다.
계속해서 새로운 이야기를 그려나가 보세요! ✨

[AI 분석]
- 감지된 요소: 선, 도형, 색상
- 분위기: 창의적이고 자유로운
- 스타일: 독창적인 표현"""

        return {
            "originalImage": original_image,
            "enhancedImage": original_image,  # TODO: 실제 향상된 이미지
            "story": story,
            "analysis": {
                "objects": ["drawing", "shapes", "colors"],
                "colors": ["various"],
                "mood": "creative"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.get("/scenarios/random")
async def get_random_scenario():
    """랜덤 시나리오를 반환합니다."""
    return random.choice(SCENARIOS)


@router.get("/scenarios")
async def get_all_scenarios():
    """모든 시나리오를 반환합니다."""
    return SCENARIOS


@router.post("/save")
async def save_drawing(data: dict):
    """
    그림을 저장합니다.
    
    TODO: 실제 저장소 연동 (S3, DB 등)
    """
    try:
        # TODO: 실제 저장 로직
        # - S3에 이미지 업로드
        # - DB에 메타데이터 저장
        
        drawing_id = f"drawing_{random.randint(1000, 9999)}"
        
        return {
            "id": drawing_id,
            "url": f"/api/drawings/{drawing_id}",
            "message": "Drawing saved successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving drawing: {str(e)}")


@router.get("")
async def get_saved_drawings():
    """
    저장된 그림 목록을 반환합니다.
    
    TODO: 실제 DB 조회
    """
    # 임시 데이터
    return [
        {
            "id": "1",
            "title": "숲 속의 친구들",
            "scenario": "숲 속에서 토끼와 여우가 만났어요.",
            "thumbnail": "/placeholder.png",
            "createdAt": "2025-10-10T10:00:00Z"
        }
    ]
