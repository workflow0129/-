import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body-parser with increased limit for PDF upload (base64)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Helper to get Gemini Client with optional user-supplied API key
const getAiClient = (req: express.Request) => {
  const userKey = req.headers["x-gemini-api-key"] as string;
  const apiKey = userKey && userKey.trim() !== "" ? userKey.trim() : null;
  if (!apiKey) {
    throw new Error("Gemini API Key가 설정되지 않았거나 비활성화 상태입니다. 앱 상단의 'Gemini Key 등록필요' 버튼을 클릭하여 API Key를 등록하고 인증해 주세요.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * API: Gemini API Key 유효성 검증
 */
app.post("/api/verify-api-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || apiKey.trim() === "") {
      return res.status(400).json({ error: "API Key를 입력해 주세요." });
    }
    
    const testAi = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // 빠른 유효성 테스트를 위해 초경량 호출 시도
    const response = await testAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "API Key verification. Reply only with OK.",
    });

    if (response && response.text) {
      return res.json({ success: true, message: "Gemini API Key 인증에 성공했습니다!" });
    } else {
      throw new Error("인증 서비스 응답을 받지 못했습니다.");
    }
  } catch (error: any) {
    console.error("API Key 인증 오류:", error);
    res.status(400).json({ 
      error: "유효하지 않은 API Key입니다. 올바른 Gemini API Key를 다시 한 번 확인하고 입력해 주세요.",
      details: error.message || String(error)
    });
  }
});

/**
 * API: PDF 파일 분석 (직업선호도검사 결과지)
 * 클라이언트에서 PDF 파일을 Base64로 전송하면, Gemini 3.5 Flash가 이를 읽어 분석 결과를 JSON으로 반환합니다.
 */
app.post("/api/analyze-pdf", async (req, res) => {
  try {
    const { pdfData, fileName } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: "PDF 데이터가 제공되지 않았습니다." });
    }

    // Base64 데이터에서 헤더 제거 (있을 경우)
    const base64Clean = pdfData.replace(/^data:application\/pdf;base64,/, "");

    const prompt = `
      당신은 대한민국 국민취업지원제도 전문 상담사의 비서입니다.
      제공된 직업선호도검사(L형 또는 S형) 결과지 PDF 파일을 꼼꼼히 분석하여, 상담일지 작성에 필요한 핵심 정보를 정확히 추출해 주세요.
      
      반드시 다음 항목들을 분석해 한국어 JSON 형식으로 반환해 주십시오:
      1. 흥미코드 (두 자리 영어 코드, 예: 'SA', 'RI', 'EI' 등. 코드 앞뒤 설명 없이 딱 영어 두 글자만 추출)
      2. 흥미유형 설명 (해당 코드의 간략한 의미)
      3. 유형별 점수 및 안내 (각 핵심 흥미 점수 및 검사 소견 요약)
      4. 성격검사 수치 또는 요약 (외향성, 호감성, 성실성, 정서적 불안정성, 경험에 대한 개방성 등의 수치나 종합 평가)
      5. 생활사검사 요약 (결과지에 있을 경우, 생활사 부분 요약. 없으면 빈칸)
      6. 추천 상담 계획 또는 직무 역량 강화 방향 제안
      
      반환값은 반드시 다음 구조의 JSON이어야 합니다:
      {
        "interestCode": "흥미코드 영어 2글자",
        "interestType": "흥미유형 이름 및 설명",
        "typeGuide": "대표 유형별 점수 분석과 검사결과 세부 안내",
        "personalityTest": "성격 5요인 검사 수치 또는 성격 특징 요약",
        "biographyTest": "생활사 검사 결과 요약 (없을 시 빈칸)"
      }
    `;

    const aiClient = getAiClient(req);
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Clean,
            mimeType: "application/pdf",
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interestCode: { type: Type.STRING, description: "Two-letter English interest code, e.g. SA" },
            interestType: { type: Type.STRING, description: "Brief description of the vocational interest code" },
            typeGuide: { type: Type.STRING, description: "Detailed guide or score analysis for the interest types" },
            personalityTest: { type: Type.STRING, description: "Scores or summaries of the 5-factor personality test" },
            biographyTest: { type: Type.STRING, description: "Summary of biography test, or empty string if not applicable" }
          },
          required: ["interestCode", "interestType", "typeGuide", "personalityTest", "biographyTest"]
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini로부터 분석 결과를 얻지 못했습니다.");
    }

    const jsonResult = JSON.parse(resultText.trim());
    res.json(jsonResult);
  } catch (error: any) {
    console.error("PDF 분석 오류:", error);
    res.status(500).json({ error: error.message || "PDF 분석 중 오류가 발생했습니다." });
  }
});

/**
 * API: 상담 메모를 격식체 일지문장으로 세련되게 다듬기
 * 상담사가 캐주얼하게 작성한 노트나 문장을 국민취업지원제도 규정에 부합하는 격식체 공문서 문장으로 변환합니다.
 */
app.post("/api/refine-text", async (req, res) => {
  try {
    const { text, fieldName, formType } = req.body;

    if (!text) {
      return res.status(400).json({ error: "다듬을 텍스트가 없습니다." });
    }

    const systemInstruction = `
      당신은 대한민국 국민취업지원제도 전문 행정 조력자입니다.
      사용자가 제공하는 투박한 메모나 구어체 문장을 공문서에 알맞은 격식체 상담일지 톤으로 변환해 주십시오.
      
      ■ 규칙 (절대 준수):
      1. 문장 종결은 반드시 격식체(~하였음 / ~확인함 / ~안내함 / ~독려함 / ~함)를 사용하며, 온점(.)으로 끝냅니다.
      2. 1인칭 표현('내가', '저희가'), 구어체, 존댓말(~해요, ~했습니다), 이모지는 절대 금지합니다.
      3. 전문적이고 정제된 행정 및 공문서 어투를 유지합니다.
      4. 사용자가 제공한 원본 사실(일정, 장소, 행위 등)을 절대 왜곡하거나 없는 내용을 허위로 추가하지 말고, 어조와 가독성만 고도로 개선합니다.
      5. 만약 값이 완결된 문장이 아닌 단순 단어나 항목값(예: "서울", "정보통신")인 경우, 온점(.)을 붙이지 않고 깔끔한 단어만 반환합니다.
      6. 추가적인 설명이나 인사말 없이 오직 '변환된 결과 텍스트'만 그대로 출력하십시오.
    `;

    const prompt = `
      양식명: ${formType}
      항목명: ${fieldName}
      원본 메모: ${text}
      
      위 메모를 격식체 공문서 상담일지 한 줄 텍스트로 깔끔하게 변환하십시오.
    `;

    const aiClient = getAiClient(req);
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const refinedText = response.text?.trim() || text;
    res.json({ refinedText });
  } catch (error: any) {
    console.error("텍스트 정제 오류:", error);
    res.status(500).json({ error: "텍스트 변환 중 오류가 발생했습니다." });
  }
});

/**
 * API: 채용공고, 직업훈련, 초기상담, IAP 등 텍스트 혹은 캡처 이미지 분석하여 양식 정보 자동 추출
 */
app.post("/api/parse-job-post", async (req, res) => {
  try {
    const { inputText, imageData, mimeType, targetForm } = req.body;

    if (!inputText && !imageData) {
      return res.status(400).json({ error: "분석할 텍스트 혹은 이미지 데이터를 제공해 주세요." });
    }

    const formType = targetForm || "채용정보";

    let prompt = "";
    let responseSchema: any = null;

    if (formType === "채용정보") {
      prompt = `
        제공된 채용 공고 정보(텍스트 혹은 캡처 이미지)를 분석하여 국민취업지원제도의 '채용정보제공' 일지 작성에 필요한 핵심 정보들을 추출하십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "companyName": "기업명 또는 회사명 (예: (주)현대글로비스)",
          "workRegion": "근무지역 또는 상세 주소 (예: 서울시 구로구)",
          "jobTitle": "모집 직종 및 주요 업무명 (예: 지입 물류 관리사)",
          "salaryCondition": "임금조건 (예: 월급 280만원 이상 / 연봉 3500만원 등)",
          "workCondition": "근무형태 또는 근무조건 (예: 주 5일 근무, 기숙사 제공, 교대근무 등)",
          "deadline": "접수마감 기한 (예: 2026-07-15, 채용시까지 등)"
        }
        
        주의: 분석하기 어려운 정보는 빈 문자열 대신 유력한 추정치 또는 공고 내용을 바탕으로 최대한 자연스럽게 요약해 채워주세요.
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          workRegion: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          salaryCondition: { type: Type.STRING },
          workCondition: { type: Type.STRING },
          deadline: { type: Type.STRING },
        },
        required: ["companyName", "workRegion", "jobTitle", "salaryCondition", "workCondition", "deadline"],
      };
    } else if (formType === "알선") {
      prompt = `
        제공된 채용 공고 정보(텍스트 혹은 캡처 이미지)를 분석하여 국민취업지원제도의 '알선' 일지 작성에 필요한 핵심 정보들을 추출하십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "companyName": "기업명 또는 회사명",
          "jobTitle": "모집 직종",
          "location": "근무지역 또는 상세 주소 (예: 서울시 구로구)",
          "duty": "상세 담당업무 요약 (예: 자재 관리 및 배송 업무)",
          "salary": "급여 조건 (예: 월급 280만원)",
          "workTime": "근무 시간/요일 (예: 주 5일, 09:00~18:00)",
          "requiredDocuments": "구비 서류 (예: 이력서, 자기소개서. 없으면 기본 서류인 '이력서, 자기소개서'를 넣어주세요)",
          "deadline": "접수마감 기한 (예: 2026-07-15, 채용시까지)"
        }
        
        주의: 분석하기 어려운 정보는 빈 문자열 대신 유력한 추정치 또는 공고 내용을 바탕으로 최대한 자연스럽게 요약해 채워주세요.
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          location: { type: Type.STRING },
          duty: { type: Type.STRING },
          salary: { type: Type.STRING },
          workTime: { type: Type.STRING },
          requiredDocuments: { type: Type.STRING },
          deadline: { type: Type.STRING },
        },
        required: ["companyName", "jobTitle", "location", "duty", "salary", "workTime", "requiredDocuments", "deadline"],
      };
    } else if (formType === "직업훈련") {
      prompt = `
        제공된 정보(직업훈련 정보지, 포스터, 웹페이지 공고 텍스트, 수강 신청 상세 화면 캡처 등)를 분석하여 국민취업지원제도의 '직업훈련' 일지 작성에 필요한 핵심 정보들을 추출하십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "wishJob": "훈련을 통해 준비하고자 하는 희망 직종 (예: 웹디자이너 및 프론트엔드 개발자)",
          "roundChange": "변경할 이행과제 회차 (기본값으로 '3회차 및 4회차' 또는 언급된 회차가 있으면 추출, 없으면 '3회차 및 4회차')",
          "instName": "훈련기관명 (예: 한국직업전문학교, OO직업전문아카데미)",
          "courseName": "정확한 훈련과정명 (예: UI/UX 웹퍼블리셔 인재양성)",
          "period": "훈련 기간 (예: 2026-07-01 ~ 2026-10-31 등 훈련일정)"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          wishJob: { type: Type.STRING },
          roundChange: { type: Type.STRING },
          instName: { type: Type.STRING },
          courseName: { type: Type.STRING },
          period: { type: Type.STRING },
        },
        required: ["wishJob", "roundChange", "instName", "courseName", "period"],
      };
    } else if (formType === "초기상담") {
      prompt = `
        제공된 메모, 이력서, 면담 상담 기록 텍스트 또는 캡처 이미지로부터 '초기상담' 일지에 필요한 핵심 정보들을 추출해 내어 구조화된 JSON으로 채워 주십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "family": "가족상황 및 거주 환경 특징 요약",
          "education": "최종 학력 및 학교/전공 요약",
          "license": "보유 자격증 (없으면 '없음')",
          "expectedLicense": "취득 희망 또는 향후 목표로 하는 자격증",
          "experience": "상담 내용 기반의 주요 경력 활동 요약",
          "workHistory": "과거 고용 직무 형태 및 세부 이력 기록",
          "wishJob": "구직 희망 직종",
          "wishRegion": "희망하는 근무지/지역",
          "capacityScore": "구직 역량 평가 점수 또는 종합적 구직 의지 평가 의견",
          "nextSchedule": "차기 상담 약속 일시 및 준비 사항",
          "counselContent": "상담 시 나눈 전반적인 애로사항, 상담내용 및 희망사항 종합 요약"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          family: { type: Type.STRING },
          education: { type: Type.STRING },
          license: { type: Type.STRING },
          expectedLicense: { type: Type.STRING },
          experience: { type: Type.STRING },
          workHistory: { type: Type.STRING },
          wishJob: { type: Type.STRING },
          wishRegion: { type: Type.STRING },
          capacityScore: { type: Type.STRING },
          nextSchedule: { type: Type.STRING },
          counselContent: { type: Type.STRING },
        },
        required: ["family", "education", "license", "expectedLicense", "experience", "workHistory", "wishJob", "wishRegion", "capacityScore", "nextSchedule", "counselContent"],
      };
    } else if (formType === "IAP") {
      prompt = `
        제공된 정보로부터 구직자 취업활동계획(IAP) 수립 및 수립일지에 기재할 상세 희망조건과 이행과제 계획을 추출해 주십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "wishJob": "희망 직무/직종",
          "wishSalary": "희망 급여조건 (예: 월급 250만원 이상)",
          "wishRegion": "희망 근무 지역",
          "wishWorkTime": "희망 근무시간 (예: 주 5일, 09:00~18:00)",
          "wishCompanySize": "희망 기업 규모",
          "license": "구직 과정에서 취득할 목표 자격증 또는 직업훈련명",
          "specialNotes": "IAP 수립 과정의 특이사항 및 개별 상담 피드백 요약",
          "allowanceAppliedPeriod": "수당 신청 주기 및 관련 날짜 안내 문구",
          "plan2": "2회차 구직활동 이행과제 계획 (예: 직업훈련 참여 및 구직활동 1회)",
          "plan3": "3회차 구직활동 이행과제 계획 (예: 구직활동 2회 응시)",
          "plan4": "4회차 구직활동 이행과제 계획",
          "plan5": "5회차 구직활동 이행과제 계획",
          "plan6": "6회차 구직활동 이행과제 계획"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          wishJob: { type: Type.STRING },
          wishSalary: { type: Type.STRING },
          wishRegion: { type: Type.STRING },
          wishWorkTime: { type: Type.STRING },
          wishCompanySize: { type: Type.STRING },
          license: { type: Type.STRING },
          specialNotes: { type: Type.STRING },
          allowanceAppliedPeriod: { type: Type.STRING },
          plan2: { type: Type.STRING },
          plan3: { type: Type.STRING },
          plan4: { type: Type.STRING },
          plan5: { type: Type.STRING },
          plan6: { type: Type.STRING },
        },
        required: ["wishJob", "wishSalary", "wishRegion", "wishWorkTime", "wishCompanySize", "license", "specialNotes", "allowanceAppliedPeriod", "plan2", "plan3", "plan4", "plan5", "plan6"],
      };
    } else if (formType === "검사해석") {
      prompt = `
        제공된 직업심리검사 결과표 정보(RIASEC 흥미 검사 수치, 생활사 검사, 성격 5대 요인 등) 텍스트 및 이미지로부터 진단해석에 필요한 정보들을 분석 및 추출해 주십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "interestCode": "가장 높게 나타난 흥미 코드 2~3글자 (예: SEC 또는 RIs 등)",
          "interestType": "해당 흥미유형의 특징과 주요 추천 직업군 요약 기재",
          "personalityTest": "성격검사 결과 요인별(외향성, 친화성 등) 주요 해석 및 강단점 기재",
          "biographyTest": "생활사 검사 결과 해석 요약 기재",
          "nextSchedule": "차기 IAP 수립 및 상담 진행 일정 안내"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          interestCode: { type: Type.STRING },
          interestType: { type: Type.STRING },
          personalityTest: { type: Type.STRING },
          biographyTest: { type: Type.STRING },
          nextSchedule: { type: Type.STRING },
        },
        required: ["interestCode", "interestType", "personalityTest", "biographyTest", "nextSchedule"],
      };
    } else if (formType === "수당") {
      prompt = `
        제공된 정보로부터 구직촉진수당 2~6회차 이행 점검 일지 정보들을 분석 및 추출해 주십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "round": "이행보고 신청 회차 (예: 2회차, 3회차 등)",
          "appliedText": "구직촉진수당 신청 및 접수 처리 일지 요약 문구",
          "performedWell": "성실 이행 여부 판단 의견 (예: 취업활동계획에 맞춰 제출된 증빙서류 확인 결과 성실히 이행함)",
          "activityCheck": "이행한 세부 증빙활동 검토 요약 (예: OO기업 입사지원 2회 증빙서류 적격 제출 확인 등)"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          round: { type: Type.STRING },
          appliedText: { type: Type.STRING },
          performedWell: { type: Type.STRING },
          activityCheck: { type: Type.STRING },
        },
        required: ["round", "appliedText", "performedWell", "activityCheck"],
      };
    } else if (formType === "컨설팅") {
      prompt = `
        제공된 정보로부터 구직자 일대일 입사지원서 컨설팅 진행 세부 내용을 분석 및 추출해 주십시오.
        
        반드시 다음 구조 of JSON 형식으로 반환해야 합니다:
        {
          "time": "컨설팅 일시 및 시간 정보",
          "wishJobField": "컨설팅 진행 직무 및 이력서 목표 분야",
          "consultingReason": "이력서/자소서 작성 컨설팅이 필요하게 된 참여자의 애로사항 및 신청 원인"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          wishJobField: { type: Type.STRING },
          consultingReason: { type: Type.STRING },
        },
        required: ["time", "wishJobField", "consultingReason"],
      };
    } else if (formType === "채용확정") {
      prompt = `
        제공된 합격 통보 메시지, 입사 안내문, 근로계약서, 또는 캡처 사진으로부터 채용 및 출근 확정 세부 정보를 요약하여 추출하십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "company": "회사 합격 소식 및 상세 면접일, 합격여부, 출근 개시일 등의 전말 요약 (예: (주)삼표산업에 물류사무로 6월 24일 합격하여 7월 1일부터 정식 출근하기로 함)"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
        },
        required: ["company"],
      };
    } else {
      // 범용 폴백 (종료 등)
      prompt = `
        제공된 텍스트 및 이미지 정보로부터 취업 또는 사업 종료 처리에 필요한 핵심 정보를 파싱하여 주십시오.
        
        반드시 다음 구조의 JSON 형식으로 반환해야 합니다:
        {
          "endDate": "실제 취업일자 또는 종결일자 (YYYY-MM-DD 형식 권장)",
          "companyName": "취업한 기업명 또는 기관명",
          "workingHours": "주당 실무 근무 시간 정보",
          "salary": "월 평균 급여 또는 임금 조건"
        }
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          endDate: { type: Type.STRING },
          companyName: { type: Type.STRING },
          workingHours: { type: Type.STRING },
          salary: { type: Type.STRING },
        },
        required: ["endDate", "companyName", "workingHours", "salary"],
      };
    }

    const contents: any[] = [];

    // 이미지가 제공된 경우
    if (imageData) {
      const cleanBase64 = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || "image/png",
        },
      });
    }

    // 텍스트가 제공된 경우
    let textInput = "";
    if (inputText) {
      textInput += `[사용자 입력 텍스트]\n${inputText}\n\n`;
    }
    textInput += prompt;
    contents.push({ text: textInput });

    const aiClient = getAiClient(req);
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini로부터 분석 결과를 얻지 못했습니다.");
    }

    const jsonResult = JSON.parse(resultText.trim());
    res.json(jsonResult);
  } catch (error: any) {
    console.error("채용공고 파싱 오류:", error);
    res.status(500).json({ error: error.message || "채용공고 분석 중 오류가 발생했습니다." });
  }
});

// Setup Client/SPA hosting or Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
