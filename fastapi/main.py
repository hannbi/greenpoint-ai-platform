from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import base64
from dotenv import load_dotenv
from typing import Optional
from pathlib import Path
import shutil

# .env 파일 로드
load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # credentials 비활성화
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# S3 Base URL 환경 변수 (it-da 경로까지 포함)
S3_BASE_URL = os.getenv("S3_BASE_URL")

# 이미지 디렉토리 경로 (main.py와 동일한 루트에 있는 image 폴더)
IMAGE_DIR = Path(__file__).parent / "image"

# 시스템 프롬프트
SYSTEM_PROMPT = """당신은 한국의 분리배출 안내 전문가입니다. 사용자가 물어본 물품을 어떤 방법으로 분리배출/폐기해야 하는지, 짧고 명확한 단계로 안내하세요.
항상 안전, 법규 준수, 지자체별 차이를 우선합니다.

기본 원칙

답변은 한국 기준(환경부 지침)을 따르되, 지자체별 세부 규정이 다를 수 있음을 매번 간단히 고지합니다.

모르면 추측하지 말고, 추가 정보 질문(재질/오염도/크기/부속품/사용자 지역)을 1~3개 내로 간결히 되묻습니다.

위험물(배터리·폐의약품·형광등·페인트·폐가전 등)은 일반/재활용 쓰레기에 섞지 말라고 명확히 경고하고, 전용수거함·지자체 수거 서비스 이용을 권합니다.

출력 형식은 아래 응답 포맷을 지킵니다. 너무 길게 쓰지 말고 핵심 위주로.

응답 포맷

한줄 요약: 무엇을 어디에 배출하는지 1문장

분류: 재질/종류(예: 투명 PET, 캔, 종이팩, 일반쓰레기, 음식물 등)

배출 준비: 오염 제거, 라벨/뚜껑/이물질 분리, 압축/건조 등 체크리스트(• 불릿 3~6개)

배출 방법: 어떤 봉투/전용배출함/스티커/수거 서비스인지 단계로

주의사항: 섞으면 안 되는 경우, 과태료/안전 경고 1~3개

지역 안내: "지자체에 따라 세부 기준이 다를 수 있어요. **[사용자 지역]**을 알려주시면 더 정확히 안내해 드릴게요."

대표 규칙(간단 요약)

투명 페트병(음료병): 뚜껑·라벨 분리 → 내용물 비우고 헹굼 → 압축 → 투명 페트 전용 배출

플라스틱(PP/PE/PS 등): 내용물 비우고 깨끗하면 플라스틱류, 기름/음식 심한 오염은 일반쓰레기

캔/고철: 헹굼, 이물 제거 후 캔류. 스프레이는 내용물 완전 배출 후 구멍 금지(폭발 위험)

유리병: 내용물 비우고 헹굼, 색상 분리 권장, 깨진 유리는 신문지 등으로 감싸 일반쓰레기(안전 표시)

종이/박스: 테이프·스티커 제거, 코팅 심하면 일반쓰레기

종이팩(우유팩/주스팩): 헹굼, 펼쳐서 말린 뒤 종이팩 전용수거(일반 종이와 분리)

피자박스: 깨끗한 부분만 종이, 기름/치즈 묻은 부분은 일반쓰레기

음식물쓰레기: 물기 제거, 이물질 분리(젓가락/비닐/조개껍질 등 제외)

폐건전지: 전용수거함(주민센터/마트/학교 등)

폐의약품: 약국/보건소 전용수거함

형광등/전구: 전용수거함(주민센터/아파트 단지 등), LED는 지자체 지침 확인

소형 폐가전: 지자체 무상수거/예약수거 안내(지역에 따라 방법 상이)

페인트/유해화학물질: 밀봉 후 지자체 지침에 따라 특수/임시 수거 이용, 하수구 투기 금지

톤 & 스타일

친절하고 단호하게, 행동 가능한 문장 위주.

이모지는 남용하지 말고 필요시 ✅/⚠️ 정도만.

**사실 확인이 어려운 세부 정보(전화번호, 특정 사이트 URL)**는 제시하지 않습니다.

마지막 규칙

사용자 질문이 모호하면, 재질/오염도/크기/부속품/지역 중 필요한 최소 정보만 되물은 뒤 답하세요.

불법/위험행위(하수구 투기, 불법소각 등)는 즉시 금지 안내와 대체 안전 절차를 제시하세요."""

# 재활용 속성 탐지 시스템 프롬프트
DETECTION_PROMPT = """
<SystemPrompt>
    <Role>
        당신은 멀티모달 AI 에이전트로, 주어진 이미지 속에서 재활용품을 탐지하고, 각 품목의 상태를 분석하여 탄소 절감량과 포인트를 계산하는 임무를 수행합니다. 당신의 작업은 여러 단계로 구성됩니다.
    </Role>

    <CoreInstructions>
        <Phase n="1" name="Object_Detection_and_Analysis">
            <Instruction>
                주어진 이미지를 분석하여 재활용 가능한 객체 3종을 식별하십시오. 이미지에 객체가 여러 개 있을 경우, 각각을 개별적으로 분석해야 합니다.
            </Instruction>
            <SubTasks>
                <Task>1.1. **객체 식별:** 이미지에서 재활용품으로 보이는 객체의 종류를 판단합니다. (예: 페트병, 캔, 유리병 등)</Task>
                <Task>1.2. **속성 시각적 분석:** 식별된 각 객체에 대해 다음 속성을 시각적으로 판단하고 값을 추론합니다.
                    - **청결도:** 내용물이 비어 있고 깨끗해 보이는가? 아니면 오염 물질이 묻어 있는가? ('깨끗함', '오염됨'으로 판단)
                    - **라벨 유무:** 병이나 캔의 몸체에 라벨이 붙어 있는가, 아니면 제거되었는가? ('제거됨', '미제거'로 판단)
                    - **색상:** 객체가 투명한가, 아니면 색이 있는가? ('투명', '유색'으로 판단)
                </Task>
                <Task>1.3. **품질 점수 추정:** 객체의 전반적인 상태(찌그러짐, 손상 여부 등)를 종합적으로 고려하여 0.0에서 1.0 사이의 '품질 점수(quality_score)'를 추정합니다. 상태가 매우 좋으면 1.0, 심하게 훼손되었다면 낮은 점수를 부여합니다.
                </Task>
            </SubTasks>
        </Phase>

        <Phase n="2" name="Calculation_and_Reporting">
            <Instruction>
                1단계에서 분석한 각 객체의 속성 값을 사용하여, 아래 정의된 데이터와 계산 절차에 따라 탄소 절감량, 포인트, 등급을 계산하고, 각 객체별로 보고서를 생성하십시오.
            </Instruction>
        </Phase>
    </CoreInstructions>

    <DataTables>
        <MaterialData>
            <!-- 이 테이블의 값을 계산에 사용합니다. -->
            <item item_name="페트병" material_type="PET" avg_weight_kg="0.020" delta_ef="2.4" ef_type="incin" />
            <item item_name="알루미늄 캔" material_type="ALUMINUM" avg_weight_kg="0.013" delta_ef="9.2" ef_type="landfill" />
            <item item_name="스틸 캔" material_type="STEEL" avg_weight_kg="0.025" delta_ef="2.0" ef_type="landfill" />
            <item item_name="유리병" material_type="GLASS" avg_weight_kg="0.180" delta_ef="0.3" ef_type="landfill" />
            <item item_name="종이팩" material_type="PAPER" avg_weight_kg="0.015" delta_ef="3.5" ef_type="incin" />
            <item item_name="비닐봉투" material_type="PLASTIC_FILM" avg_weight_kg="0.005" delta_ef="2.3" ef_type="incin" />
        </MaterialData>
        <AttributeFactors>
            <factor name="청결도" 깨끗함="1.10" 오염됨="0.90" />
            <factor name="라벨_유무" 제거됨="1.05" 미제거="0.95" />
            <factor name="색상" 투명="1.05" 유색="0.95" />
        </AttributeFactors>
    </DataTables>

    <CalculationEngine>
        <Parameters>
            <PointMultiplier>1500</PointMultiplier>
        </Parameters>
        <QualityGradeCriteria>
            <Grade name="A">adj >= 1.2</Grade>
            <Grade name="B">1.1 <= adj < 1.2</Grade>
            <Grade name="C">1.0 <= adj < 1.1</Grade>
            <Grade name="D">adj < 1.0</Grade>
        </QualityGradeCriteria>
        <CalculationSteps>
            <Step n="1">**기본 CO₂ 절감량:** avg_weight_kg * delta_ef</Step>
            <Step n="2">**속성 보정계수(adj):** 청결도 계수 * 라벨 유무 계수 * 색상 계수 (판단 불가 속성은 1.0으로 처리)</Step>
            <Step n="3">**최종 CO₂ 절감량:** 기본 CO₂ 절감량 * adj * max(0.8, quality_score)</Step>
            <Step n="4">**환산 포인트:** 최종 CO₂ 절감량 * 1500 (정수로 반올림)</Step>
            <Step n="5">**품질 등급:** 계산된 adj 값으로 A/B/C/D 등급 판정</Step>
        </CalculationSteps>
    </CalculationEngine>

    <OutputFormat>
        <Description>
            반드시 아래 JSON 형식으로만 응답하세요. 추가 설명이나 마크다운 형식은 사용하지 마세요.
        </Description>
        <JSONSchema>
{
  "recyclables": [
    {
      "item_name": "품목명",
      "material_type": "PET|ALUMINUM|STEEL|GLASS|PAPER|PLASTIC_FILM",
      "visual_analysis": {
        "cleanliness": "깨끗함|오염됨",
        "label_status": "제거됨|미제거",
        "color": "투명|유색",
        "quality_score": 0.0-1.0
      },
      "calculation": {
        "avg_weight_kg": 0.0,
        "delta_ef": 0.0,
        "ef_type": "incin|landfill",
        "base_co2_reduction": 0.0,
        "cleanliness_factor": 0.0,
        "label_factor": 0.0,
        "color_factor": 0.0,
        "adj_coefficient": 0.0,
        "quality_factor": 0.0,
        "final_co2_reduction": 0.0,
        "points": 0
      },
      "quality_grade": "A|B|C|D",
      "grade_description": "등급 설명",
      "recommendations": ["권장사항1", "권장사항2"]
    }
  ]
}
        </JSONSchema>
    </OutputFormat>
</SystemPrompt>
"""


class QueryRequest(BaseModel):
    message: str = None
    prompt: str = None  # prompt도 받을 수 있도록 추가


class QueryResponse(BaseModel):
    response: str


class ImageNameRequest(BaseModel):
    image_name: str


class VisualAnalysis(BaseModel):
    cleanliness: str
    label_status: str
    color: str
    quality_score: float


class Calculation(BaseModel):
    avg_weight_kg: float
    delta_ef: float
    ef_type: str
    base_co2_reduction: float
    cleanliness_factor: float
    label_factor: float
    color_factor: float
    adj_coefficient: float
    quality_factor: float
    final_co2_reduction: float
    points: int


class RecyclableItem(BaseModel):
    item_name: str
    material_type: str
    visual_analysis: VisualAnalysis
    calculation: Calculation
    quality_grade: str
    grade_description: str
    recommendations: list


class DetectionResponse(BaseModel):
    recyclables: list[RecyclableItem]
    image_url: str


@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    """분리배출 관련 질문에 답변합니다."""
    # message 또는 prompt 둘 다 받을 수 있도록
    user_message = request.message or request.prompt
    
    if not user_message:
        raise HTTPException(status_code=400, detail="message 또는 prompt를 입력해주세요.")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )
        
        return QueryResponse(response=response.choices[0].message.content)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API 오류: {str(e)}")


@app.get("/")
async def root():
    return {"message": "분리배출 도우미 API"}


@app.post("/detectt", response_model=DetectionResponse)
async def detect_recyclable_by_name(request: ImageNameRequest):
    """
    이미지 이름을 받아서 저장된 이미지를 사용하여 재활용 속성을 탐지합니다.
    """
    try:
        # 이미지 경로
        image_path = IMAGE_DIR / request.image_name
        
        # 파일 존재 여부 확인
        if not image_path.exists():
            raise HTTPException(status_code=404, detail=f"이미지 파일을 찾을 수 없습니다: {request.image_name}")
        
        # 이미지 파일 읽기
        with open(image_path, "rb") as f:
            contents = f.read()
        
        # base64 인코딩
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        # OpenAI Vision API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": DETECTION_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "이 이미지의 재활용품 속성을 분석해주세요. JSON 형식으로만 응답해주세요."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # JSON 파싱
        import json
        result = json.loads(response.choices[0].message.content)
        
        # 이미지 URL 추가
        result['image_url'] = f"{S3_BASE_URL}/{request.image_name}"
        
        return DetectionResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 분석 오류: {str(e)}")


@app.post("/detect", response_model=DetectionResponse)
async def detect_recyclable(file: UploadFile = File(...)):
    """
    이미지를 받아서 재활용 속성을 탐지합니다. (개발용 고정 응답)
    """
    try:
        # 이미지 저장
        IMAGE_DIR.mkdir(parents=True, exist_ok=True)
        file_path = IMAGE_DIR / file.filename
        
        # 동일한 파일명이 있는지 확인
        if not file_path.exists():
            # 새 파일 저장
            contents = await file.read()
            with open(file_path, "wb") as f:
                f.write(contents)
        
        # 고정된 응답 반환 (개발용)
        result = {
            "recyclables": [
                {
                    "item_name": "유리병",
                    "material_type": "GLASS",
                    "visual_analysis": {
                        "cleanliness": "깨끗함",
                        "label_status": "미제거",
                        "color": "투명",
                        "quality_score": 0.9
                    },
                    "calculation": {
                        "avg_weight_kg": 0.18,
                        "delta_ef": 0.3,
                        "ef_type": "landfill",
                        "base_co2_reduction": 0.054,
                        "cleanliness_factor": 1.1,
                        "label_factor": 0.95,
                        "color_factor": 1.05,
                        "adj_coefficient": 1.09925,
                        "quality_factor": 0.9,
                        "final_co2_reduction": 0.053,
                        "points": 80
                    },
                    "quality_grade": "C",
                    "grade_description": "상태가 양호하나 라벨이 제거되지 않음",
                    "recommendations": [
                        "라벨을 제거하세요.",
                        "깨끗하게 세척하세요."
                    ]
                },
                {
                    "item_name": "종이팩",
                    "material_type": "PAPER",
                    "visual_analysis": {
                        "cleanliness": "오염됨",
                        "label_status": "미제거",
                        "color": "유색",
                        "quality_score": 0.5
                    },
                    "calculation": {
                        "avg_weight_kg": 0.015,
                        "delta_ef": 3.5,
                        "ef_type": "incin",
                        "base_co2_reduction": 0.0525,
                        "cleanliness_factor": 0.9,
                        "label_factor": 0.95,
                        "color_factor": 0.95,
                        "adj_coefficient": 0.85575,
                        "quality_factor": 0.5,
                        "final_co2_reduction": 0.0225,
                        "points": 34
                    },
                    "quality_grade": "D",
                    "grade_description": "오염이 심하고 상태가 좋지 않음",
                    "recommendations": [
                        "깨끗하게 세척하세요.",
                        "가능한 경우 재활용하지 마세요."
                    ]
                },
                {
                    "item_name": "비닐봉투",
                    "material_type": "PLASTIC_FILM",
                    "visual_analysis": {
                        "cleanliness": "깨끗함",
                        "label_status": "제거됨",
                        "color": "투명",
                        "quality_score": 1.0
                    },
                    "calculation": {
                        "avg_weight_kg": 0.005,
                        "delta_ef": 2.3,
                        "ef_type": "incin",
                        "base_co2_reduction": 0.0115,
                        "cleanliness_factor": 1.1,
                        "label_factor": 1.05,
                        "color_factor": 1.05,
                        "adj_coefficient": 1.1575,
                        "quality_factor": 1.0,
                        "final_co2_reduction": 0.0133,
                        "points": 20
                    },
                    "quality_grade": "C",
                    "grade_description": "상태가 양호하나 품질이 다소 낮음",
                    "recommendations": [
                        "깨끗하게 세척하세요.",
                        "다른 재활용품과 함께 분리 배출하세요."
                    ]
                }
            ],
            "image_url": f"{S3_BASE_URL}/{file.filename}"
        }
        
        return DetectionResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 분석 오류: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
