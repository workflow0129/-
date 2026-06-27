/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import SmartJobParser from './components/SmartJobParser';
import {
  FileText,
  Clipboard,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  User,
  Award,
  BookOpen,
  Clock,
  AlertTriangle,
  ChevronRight,
  ClipboardCheck,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Lock,
  ChevronDown
} from 'lucide-react';
import {
  FormType,
  InitialConsultFormData,
  TestInterpretationFormData,
  IAPFormData,
  AllowanceFormData,
  ConsultingFormData,
  PlacementFormData,
  JobInfoFormData,
  VocationalTrainingFormData,
  EmploymentConfirmedFormData,
  ExitFullFormData,
  ExitSimpleFormData,
  REFER_A_CLASSIFICATION,
  REFER_A_GOALS_STRATEGY,
  REFER_B_RIASEC,
} from './types';
import { buildDiaryText } from './templateEngine';

// 초기 상태값 정의
const initialFormStates = {
  초기상담: {
    type: '초기상담',
    agreement: '초기상담 질문지, 취업역량평가 설문지, 내일을 위한 약속, 개인경력카드, 국민취업지원제도 사전 체크리스트, 개인정보·민감정보·고유식별정보 수집·이용 및 제공 동의서, 행정정보 공동이용 동의서, 프로그램 안내, 재참여 제한기간 안내, 부정수급 안내, 구직촉진수당·가족수당·취업 후 수당 안내, 체크리스트 안내, 구직신청 1년 연장 동의서 안내 후 서명 받음',
    counselContent: '',
    family: '',
    education: '',
    license: '',
    experience: '',
    workHistory: '',
    wishJob: '',
    wishRegion: '',
    capacityScore: '',
    nextSchedule: '',
    expectedLicense: '',
    selectedClassificationIds: [],
    selectedStrategyIds: [],
  } as InitialConsultFormData,

  검사해석: {
    type: '검사해석',
    interviewed: '대면으로 상담함',
    interestCode: '',
    interestType: '',
    typeGuide: '',
    personalityTest: '',
    biographyTest: '',
    guideNotice: '흥미를 살펴보는 검사이므로 적성 및 능력적인 부분은 배제되어 있음을 안내함. (이후 협의된 취업지원계획 방향 이어서 기재)',
    nextSchedule: '',
  } as TestInterpretationFormData,

  IAP: {
    type: 'IAP',
    wishJob: '',
    wishSalary: '',
    wishRegion: '',
    wishWorkTime: '',
    wishCompanySize: '',
    iapCopyGiven: '개인별 취업활동계획서(IAP)사본 교부함',
    allowanceApplied: '구직촉진수당 1회차 신청함. 접수일로부터 처리기한 14일 소요 안내함',
    license: '',
    specialNotes: '',
    plan2: '',
    plan3: '',
    plan4: '',
    plan5: '',
    plan6: '',
    expiryNotice: '기간만료일은 구직촉진수당 6회차 수당 수료 후 결정하기로 함',
    allowanceAppliedPeriod: '',
    familyAllowance: '해당사항 없음',
    trainingPlan: '직무역량 강화를 위해 적절한 직업훈련이 있을 경우 참여 희망함',
  } as IAPFormData,

  수당: {
    type: '수당',
    round: '2',
    contactType: '유선상담',
    appliedText: '구직촉진수당 2회차 신청함',
    performedWell: '취업활동계획대로 성실히 이행함',
    activityCheck: '',
    depositNotice: '접수일로부터 14일 이내 수당 입금됨을 안내함',
    incomeDeclaration: '없음',
    trainingIntention: '역량 강화를 위한 직업훈련 참여의사 있음',
  } as AllowanceFormData,

  컨설팅: {
    type: '컨설팅',
    time: '',
    wishJobField: '',
    consultingReason: '관련 직무 입사지원서 작성 경험이 없어 관련 컨설팅 지원함',
    ncsGuide: 'NCS를 통해 직무분석 후 작성하라고 안내함',
    resumeGuide: '빠짐없이 최신순으로 모든 서식을 동일하게, 오타 없이 작성하여야 하며, 사진은 최근 6개월 내 촬영본, 이메일·휴대폰 번호 확실히 검토, 희망 직무 관련 경력·활동사항은 자세히, 자격증은 취득일을 정확하게 작성하여야 함을 안내함',
    selfIntroGuide: 'NCS로 직무분석 후 관련 키워드로 주제에 맞게 작성하도록 안내하고, 성장과정은 어린시절이 아닌 내면적 성장 중심으로, 성격 장단점은 직무에 필요한 태도 중심으로(단점은 극복사례와 함께), 경력사항은 직무역량 평가를 고려하여, 지원동기 및 입사 후 포부는 기업분석이 드러나도록 작성하여야 함을 안내함',
  } as ConsultingFormData,

  알선: {
    type: '알선',
    infoProvider: '고용24',
    companyName: '',
    jobTitle: '',
    placementType: '외부구인(추천가능)',
    hasConsulting: false,
    location: '',
    duty: '',
    education: '학력무관',
    experience: '경력무관',
    employmentType: '정규직',
    recruitsCount: '1명',
    salary: '',
    workTime: '',
    requiredDocuments: '이력서, 자기소개서',
    managerName: '',
    managerContact: '',
  } as PlacementFormData,

  채용정보: {
    type: '채용정보',
    guideText: '지원 가능한 채용정보가 있어 참여자 지원할 수 있도록 안내함',
    companyName: '',
    workRegion: '',
    jobTitle: '',
    salaryCondition: '',
    workType: '정규직',
    workCondition: '',
    deadline: '채용시까지',
  } as JobInfoFormData,

  직업훈련: {
    type: '직업훈련',
    wishJob: '',
    applyReason: '역량강화를 위해 필요한 직업훈련이 있어 신청서 작성 후 훈련 신청함',
    operationGuide: '출석률 80% 이상 시 훈련수당 지급 및 중도탈락 시 불이익 등에 대해 안내하고 성실하게 참여할 수 있도록 지지해드림',
    roundChange: '',
    instName: '',
    courseName: '',
    period: '',
  } as VocationalTrainingFormData,

  채용확정: {
    type: '채용확정',
    company: '',
    congratsText: '취업 성공을 축하드리며 취업성공수당 관련하여 안내하고 근속 유지 잘 할 수 있도록 지지해드림',
  } as EmploymentConfirmedFormData,

  종료_풀: {
    type: '종료_풀',
    introText: '내담자의 취업성공으로 취업지원 서비스 종료되어 안내차 연락을 드림',
    resignNotice: '취업 후 1개월 미만 근무 후 퇴직 시, 퇴직일 기준 1개월 이내 지속 참여 신청으로 취업지원서비스에 지속 참여 가능함을 안내함(1회 한정)',
    allowanceTargetNotice: '',
    reparticipationNotice: '국민취업지원제도 재참여 유예기간 등을 안내드리며, 가급적 1년 이상 근속하여 경력을 형성하도록 적극 독려함(1년 근무자는 퇴사 후 즉시 재참여 가능)',
    contactNotice: '문의사항은 언제든 연락달라고 하였고, 취업일로부터 3개월간 근무 적응도 확인 등을 위해 사후관리 연락을 드리기로 함',
    agreementNotice: '해당 사업장에서 계속근로 의지를 확인한 뒤 내담자의 동의 하에 취업처리를 진행함',
    endDate: '',
    followUpPeriod: '',
    issueMethod: '직접교부',
    successAllowanceTarget: '대상',
    earlySuccessAllowanceTarget: '해당사항 없음',
    exitCategory: '취업',
    companyName: '',
    jobTitle: '',
    weeklyWorkHours: '주 40시간',
    monthlySalary: '',
    jobCloseType: '취업자진행마감',
    insuranceAcquired: '취득확인',
  } as ExitFullFormData,

  종료_간단: {
    type: '종료_간단',
    exitConfirmationText: '',
    allowanceNotice: '취업성공수당 대상임을 안내함',
  } as ExitSimpleFormData,
};

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'editor'>('landing');
  
  // Gemini API Key 설정 상태
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [isKeyVerified, setIsKeyVerified] = useState<boolean>(() => {
    return localStorage.getItem('gemini_api_key_verified') === 'true';
  });
  const [apiKeyInput, setApiKeyInput] = useState<string>(apiKey);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiVerificationError, setApiVerificationError] = useState<string | null>(null);

  // 모달을 열고 닫을 때나 API Key가 바뀔 때 에러 상태 및 입력값 초기화
  useEffect(() => {
    if (showKeyModal) {
      setApiKeyInput(apiKey);
      setApiVerificationError(null);
    }
  }, [showKeyModal, apiKey]);

  const handleVerifyApiKey = async (keyInput: string) => {
    if (!keyInput.trim()) {
      const errMsg = 'Gemini API Key를 입력해 주세요.';
      setApiVerificationError(errMsg);
      alert(errMsg);
      return;
    }
    setIsVerifyingKey(true);
    setApiVerificationError(null);
    try {
      const res = await fetch('/api/verify-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: keyInput.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || '유효하지 않은 API Key입니다. 올바른 API Key를 다시 한 번 확인하고 입력해 주세요.';
        throw new Error(errMsg);
      }

      localStorage.setItem('gemini_api_key', keyInput.trim());
      localStorage.setItem('gemini_api_key_verified', 'true');
      setApiKey(keyInput.trim());
      setIsKeyVerified(true);
      setApiVerificationError(null);
      alert('Gemini API Key 인증에 성공하였습니다! 이제 모든 AI 행정 보조 기능이 승인되었습니다.');
      setShowKeyModal(false);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || '인증에 실패했습니다. 유효한 API Key를 다시 입력해 주세요.';
      setApiVerificationError(errMsg);
      alert(errMsg);
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('gemini_api_key_verified');
    setApiKey('');
    setApiKeyInput('');
    setIsKeyVerified(false);
    setApiVerificationError(null);
  };

  const [selectedForm, setSelectedForm] = useState<FormType>('초기상담');
  const [formData, setFormData] = useState<any>({ ...initialFormStates });
  const [pdfAnalyzing, setPdfAnalyzing] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [refiningField, setRefiningField] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('김철수');
  const [clientType, setClientType] = useState<string>('1유형 (요건심사형)');
  const [clientBirth, setClientBirth] = useState<string>('1995.05.20');
  const [todayWrittenCount, setTodayWrittenCount] = useState<number>(3);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼이 변경될 때마다 생성될 다이어리 텍스트
  const currentFormState = formData[selectedForm] || {};
  const [diaryOutput, setDiaryOutput] = useState<string>('');

  useEffect(() => {
    // 폼 변경될 때마다 자동 업데이트
    setDiaryOutput(buildDiaryText(selectedForm, currentFormState));
  }, [selectedForm, formData]);

  // 특정 필드 상태 업데이트 도우미
  const updateField = (formKey: FormType, fieldName: string, value: any) => {
    setFormData((prev: any) => {
      const updatedForm = {
        ...prev[formKey],
        [fieldName]: value,
      };

      // 수당 등의 연동 텍스트 실시간 반영 도우미
      if (formKey === '수당' && fieldName === 'round') {
        updatedForm.appliedText = `구직촉진수당 ${value}회차 신청함`;
      }

      return {
        ...prev,
        [formKey]: updatedForm,
      };
    });
  };

  // 양식 초기화
  const resetForm = () => {
    setFormData((prev: any) => ({
      ...prev,
      [selectedForm]: { ...initialFormStates[selectedForm] },
    }));
  };

  // AI를 통한 텍스트 문장 다듬기 (격식체화)
  const handleRefineField = async (fieldName: string, currentValue: string) => {
    if (!currentValue.trim()) return;
    if (!apiKey) {
      setShowKeyModal(true);
      alert('AI 문장 정제 기능을 사용하려면 먼저 Gemini API Key를 설정하고 승인해 주세요.');
      return;
    }
    setRefiningField(fieldName);
    try {
      const res = await fetch('/api/refine-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey,
        },
        body: JSON.stringify({
          text: currentValue,
          fieldName,
          formType: selectedForm,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '네트워크 응답에 문제가 있습니다.');
      }

      const data = await res.json();
      if (data.refinedText) {
        updateField(selectedForm, fieldName, data.refinedText);
      }
    } catch (err: any) {
      console.error(err);
      alert(`AI 문장 변환 중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setRefiningField(null);
    }
  };

  // PDF 드롭/업로드 처리 (직업선호도검사 결과)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드해 주세요.');
      return;
    }
    if (!apiKey) {
      setShowKeyModal(true);
      alert('PDF 분석 기능을 사용하려면 먼저 Gemini API Key를 설정하고 승인해 주세요.');
      return;
    }

    setPdfFileName(file.name);
    setPdfAnalyzing(true);

    try {
      // FileReader로 파일을 Base64로 인코딩
      const reader = new FileReader();
      reader.onload = async () => {
         const base64 = reader.result as string;
         try {
           const res = await fetch('/api/analyze-pdf', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'x-gemini-api-key': apiKey,
             },
             body: JSON.stringify({
               pdfData: base64,
               fileName: file.name,
             }),
           });

           if (!res.ok) {
             const errData = await res.json().catch(() => ({}));
             throw new Error(errData.error || 'PDF 분석에 실패했습니다.');
           }

           const data = await res.json();

           // 반환받은 결과로 검사해석 필드 자동 완성
           setFormData((prev: any) => {
             const updatedInterpret = {
               ...prev['검사해석'],
               interestCode: data.interestCode || '',
               interestType: data.interestType || '',
               typeGuide: data.typeGuide || '',
               personalityTest: data.personalityTest || '',
               biographyTest: data.biographyTest || '',
             };
             return {
               ...prev,
               '검사해석': updatedInterpret,
             };
           });

           alert('직업선호도검사지 PDF를 성공적으로 분석하여 필드에 자동 입력했습니다!');
         } catch (error: any) {
           console.error(error);
           alert(`Gemini를 통한 PDF 분석 중 오류가 발생했습니다: ${error.message || error}`);
         } finally {
           setPdfAnalyzing(false);
         }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('파일 읽기 오류가 발생했습니다.');
      setPdfAnalyzing(false);
    }
  };

  // 클립보드 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(diaryOutput).then(() => {
      setCopySuccess(true);
      setTodayWrittenCount(prev => prev + 1);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // [참고 A] 선택 핸들러 (초기상담용)
  const handleClassificationClick = (id: number, text: string) => {
    const currentList: number[] = currentFormState.selectedClassificationIds || [];
    let newList: number[] = [];
    if (currentList.includes(id)) {
      newList = currentList.filter(item => item !== id);
    } else {
      newList = [...currentList, id];
    }
    updateField('초기상담', 'selectedClassificationIds', newList);

    // 상담내용 또는 전략 문구 조합에 자동 추가/업데이트 처리
    const newEvidenceStr = newList
      .map(idNum => {
        const found = REFER_A_CLASSIFICATION.find(item => item.id === idNum);
        return found ? `${idNum}. ${found.text}` : '';
      })
      .filter(Boolean)
      .join(', ');

    // 상담일지 골격에 추가할 텍스트 실시간 반영을 위해 counselContent 또는 적절히 가공
    if (newList.length > 0) {
      updateField('초기상담', 'counselContent', `유형분류근거: ${newEvidenceStr}.`);
    } else {
      updateField('초기상담', 'counselContent', '');
    }
  };

  const handleStrategyClick = (id: number, text: string) => {
    const currentList: number[] = currentFormState.selectedStrategyIds || [];
    let newList: number[] = [];
    if (currentList.includes(id)) {
      newList = currentList.filter(item => item !== id);
    } else {
      newList = [...currentList, id];
    }
    updateField('초기상담', 'selectedStrategyIds', newList);

    const newStrategyStr = newList
      .map(idNum => {
        const found = REFER_A_GOALS_STRATEGY.find(item => item.id === idNum);
        return found ? `${idNum}. ${found.text}` : '';
      })
      .filter(Boolean)
      .join(', ');

    // 다음상담일정에 결합하거나 상담전략 설명 필드 생성 시 활용
    if (newList.length > 0) {
      updateField('초기상담', 'expectedLicense', `상담목표·전략 수립: ${newStrategyStr}`);
    } else {
      updateField('초기상담', 'expectedLicense', '');
    }
  };

  // RIASEC 코드 바로 넣기 도우미 (검사해석용)
  const applyRiasecCode = (code: string) => {
    if (selectedForm !== '검사해석') return;
    const desc = REFER_B_RIASEC[code] || '';
    updateField('검사해석', 'interestCode', code);
    updateField('검사해석', 'interestType', `${code}유형: ${desc}`);
  };

  // 카테고리별 일지 폼 그룹화
  const formTabs = [
    { id: '초기상담', label: '초기상담', badge: '초기', color: 'bg-indigo-50 text-indigo-700' },
    { id: '검사해석', label: '직업선호도검사 해석', badge: '심리검사', color: 'bg-sky-50 text-sky-700' },
    { id: 'IAP', label: 'IAP 수립', badge: 'IAP', color: 'bg-emerald-50 text-emerald-700' },
    { id: '수당', label: '구직촉진수당 신청', badge: '수당', color: 'bg-amber-50 text-amber-700' },
    { id: '컨설팅', label: '입사지원서 클리닉', badge: '클리닉', color: 'bg-teal-50 text-teal-700' },
    { id: '알선', label: '채용 알선', badge: '추천', color: 'bg-violet-50 text-violet-700' },
    { id: '채용정보', label: '채용정보 제공', badge: '매칭', color: 'bg-pink-50 text-pink-700' },
    { id: '직업훈련', label: '직업훈련 신청', badge: '국민내일배움카드', color: 'bg-orange-50 text-orange-700' },
    { id: '채용확정', label: '채용확정', badge: '취업', color: 'bg-green-50 text-green-700 font-bold' },
    { id: '종료_풀', label: '종료 (풀버전)', badge: '행정', color: 'bg-slate-100 text-slate-700' },
    { id: '종료_간단', label: '종료 (간단)', badge: '종료', color: 'bg-red-50 text-red-700' },
  ];

  if (viewMode === 'landing') {
    return <LandingPage onStart={() => setViewMode('editor')} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 overflow-x-hidden antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Professional Glass Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3" id="app-logo-area">
          <div 
            onClick={() => setViewMode('landing')}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-transform hover:rotate-6 cursor-pointer"
            title="소개 페이지로 이동"
          >
            N
          </div>
          <div>
            <h1 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              국민취업지원제도 상담일지 보조기
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wide uppercase shadow-sm">
                Pro
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">상담사 스마트 행정 지원 & 공문서 문장 자동 정제 시스템</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Gemini API Key 인증 버튼 */}
          <button
            onClick={() => {
              setApiKeyInput(apiKey);
              setShowKeyModal(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isKeyVerified 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
            }`}
            title="Gemini API Key 승인 설정"
          >
            <Sparkles size={13} className={isKeyVerified ? 'text-emerald-600' : 'text-amber-500 animate-spin'} />
            {isKeyVerified ? (
              <>
                <span className="hidden sm:inline">Gemini API</span> 승인완료
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Gemini</span> Key 등록필요
              </>
            )}
          </button>

          <button
            onClick={() => setViewMode('landing')}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            가이드 & 기능 소개
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-[11px] font-semibold text-indigo-700 border border-indigo-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            업무용 프리미엄 라이센스 활성화됨
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200" title="상담사 프로필">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </header>

      {/* Main Content Layout - Beautiful Bento Grid */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-12 gap-6 max-w-[1700px] w-full mx-auto">
        
        {/* Left Bento: Interactive Navigation Index */}
        <nav className="col-span-12 md:col-span-4 xl:col-span-3 flex flex-col gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]" id="form-selector-card">
            <div className="flex items-center justify-between mb-4 px-2 border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                업무 단계별 양식
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">11개 서식</span>
            </div>
            
            <div className="flex flex-col gap-1 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
              {formTabs.map((tab) => {
                const isActive = selectedForm === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedForm(tab.id as FormType)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100 translate-x-1 scale-[1.01]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
                    }`}
                    id={`tab-btn-${tab.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-300 group-hover:bg-indigo-500'} transition-all`}></span>
                      <span className="tracking-tight text-[12.5px]">{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold transition-all ${isActive ? 'bg-indigo-700 text-white' : tab.color}`}>
                        {tab.badge}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'translate-x-0.5 opacity-100' : 'opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Performance & Goal Dashboard */}
          <div className="bg-indigo-950 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden shrink-0" id="daily-stats-card">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.06] pointer-events-none transform rotate-12">
              <Calendar size={150} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300/90 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                오늘의 행정 성과
              </div>
              <p className="text-3xl font-black tracking-tight flex items-baseline gap-1">
                {todayWrittenCount} 
                <span className="text-sm font-medium text-indigo-200">건 완성</span>
              </p>
              
              <div className="mt-4 h-2 bg-indigo-900 rounded-full overflow-hidden border border-indigo-800">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                  style={{ width: `${Math.min(todayWrittenCount * 10, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-3 text-[10px] text-indigo-200">
                <span className="font-semibold">오늘 목표달성률 {Math.round(Math.min((todayWrittenCount / 10) * 100, 100))}%</span>
                <span className="text-emerald-400 font-bold">+1건 복사 완료</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Middle Bento: Participant Profile & Core Form Editor */}
        <div className="col-span-12 md:col-span-8 xl:col-span-6 flex flex-col gap-6">
          
          {/* Client Profile Information Bento Badge */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]" id="client-info-bento">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                현재 상담 참여자 프로필
              </h3>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded">실시간 일지 연동</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Profile Avatar Badge */}
              <div className="md:col-span-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  {clientName ? clientName.slice(0, 2) : '내담'}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-800">{clientName || '이름 미입력'}</div>
                  <div className="text-[10px] text-slate-500">{clientBirth || '생년월일 미입력'}</div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">참여자 이름</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="성함"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">생년월일</label>
                  <input
                    type="text"
                    value={clientBirth}
                    onChange={(e) => setClientBirth(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">지원 유형</label>
                  <div className="relative">
                    <select
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none pr-7"
                    >
                      <option value="1유형 (요건심사형)">1유형 (요건심사형)</option>
                      <option value="1유형 (선발형-비경제활동)">1유형 (선발형-비경제활동)</option>
                      <option value="1유형 (선발형-청년)">1유형 (선발형-청년)</option>
                      <option value="2유형 (특정계층)">2유형 (특정계층)</option>
                      <option value="2유형 (청년)">2유형 (청년)</option>
                      <option value="2유형 (중장년)">2유형 (중장년)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content Bento Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex-1 flex flex-col min-h-[480px]" id="dynamic-inputs-panel">
            
            {/* Header with Title and Mode */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                <span>
                  {selectedForm === '종료_풀' ? '종료 (풀버전)' : selectedForm === '종료_간단' ? '종료 (간단)' : selectedForm} 정보 입력
                </span>
              </h3>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={resetForm}
                  className="bg-slate-50 hover:bg-slate-100 hover:text-rose-600 text-slate-500 py-1 px-2 rounded-lg text-[11px] font-bold transition-all border border-slate-200/60 flex items-center gap-1 cursor-pointer"
                  id="btn-reset-form"
                  title="해당 양식의 내용을 모두 초기화합니다."
                >
                  <RefreshCw size={11} className="transition-transform active:rotate-180" />
                  리셋
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-4 custom-scrollbar">
              
              {/* === 1. 초기상담 폼 === */}
              {selectedForm === '초기상담' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="초기상담"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('초기상담', key, val);
                      });
                    }}
                  />

                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-100/60 rounded-xl">
                    <label className="block text-[11px] font-bold text-indigo-950 mb-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-500" />
                      동의서·안내문 서명 조항 (골격 고정)
                    </label>
                    <textarea
                      value={currentFormState.agreement}
                      onChange={(e) => updateField('초기상담', 'agreement', e.target.value)}
                      className="w-full text-xs p-2.5 bg-white/70 border border-slate-200/80 rounded-lg text-slate-600 h-16 resize-none focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>상담내용 (필수)</span>
                        <button
                          onClick={() => handleRefineField('counselContent', currentFormState.counselContent)}
                          disabled={refiningField === 'counselContent'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                          title="작성된 키워드를 격식체로 고급스럽게 다듬습니다."
                        >
                          <Sparkles size={11} className={refiningField === 'counselContent' ? 'animate-spin' : ''} />
                          {refiningField === 'counselContent' ? '변환중...' : 'AI 문장정제'}
                        </button>
                      </label>
                      <textarea
                        value={currentFormState.counselContent}
                        onChange={(e) => updateField('초기상담', 'counselContent', e.target.value)}
                        placeholder="예: 오랜 공백 후 방문, 향후 일정 및 구인촉진수당 등의 제도 안내를 하였습니다"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">가족사항 (생략가능)</label>
                      <textarea
                        value={currentFormState.family}
                        onChange={(e) => updateField('초기상담', 'family', e.target.value)}
                        placeholder="예: 부모님과 동거"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">학력사항 (생략가능)</label>
                      <input
                        type="text"
                        value={currentFormState.education}
                        onChange={(e) => updateField('초기상담', 'education', e.target.value)}
                        placeholder="예: 한국대학교 컴퓨터공학 졸업"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">자격사항 (생략가능)</label>
                      <input
                        type="text"
                        value={currentFormState.license}
                        onChange={(e) => updateField('초기상담', 'license', e.target.value)}
                        placeholder="예: 정보처리기사, 한글"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">취득예정자격증 (생략가능)</label>
                      <input
                        type="text"
                        value={currentFormState.expectedLicense}
                        onChange={(e) => updateField('초기상담', 'expectedLicense', e.target.value)}
                        placeholder="예: ERP정보관리사"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>경력사항 (생략가능)</span>
                        <button
                          onClick={() => handleRefineField('experience', currentFormState.experience)}
                          disabled={refiningField === 'experience'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'experience' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <input
                        type="text"
                        value={currentFormState.experience}
                        onChange={(e) => updateField('초기상담', 'experience', e.target.value)}
                        placeholder="예: OO유통 1년 영업 근무"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>근로내역확인 (생략가능)</span>
                        <button
                          onClick={() => handleRefineField('workHistory', currentFormState.workHistory)}
                          disabled={refiningField === 'workHistory'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'workHistory' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <input
                        type="text"
                        value={currentFormState.workHistory}
                        onChange={(e) => updateField('초기상담', 'workHistory', e.target.value)}
                        placeholder="예: 고용보험 가입내역 확인 완료"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망직무 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishJob}
                        onChange={(e) => updateField('초기상담', 'wishJob', e.target.value)}
                        placeholder="예: IT 개발직무"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망지역 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishRegion}
                        onChange={(e) => updateField('초기상담', 'wishRegion', e.target.value)}
                        placeholder="예: 서울 구로구, 가산동"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">취업역량평가등급 및 점수 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.capacityScore}
                        onChange={(e) => updateField('초기상담', 'capacityScore', e.target.value)}
                        placeholder="예: B등급 / 72점"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">다음상담일정 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.nextSchedule}
                        onChange={(e) => updateField('초기상담', 'nextSchedule', e.target.value)}
                        placeholder="예: 2026-07-05 14:00"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* 참고 A 클릭 안내 UI */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">우측 [참고 A] 선택형 자동 완성 연동</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">오른쪽 패널에 준비된 실시간 유형분류 근거 및 상담목표를 클릭하면, 상담내용(counselContent)과 자격증(expectedLicense) 필드에 적절한 고품질 서술형 문장으로 자동 반영됩니다.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* === 2. 검사해석 폼 === */}
              {selectedForm === '검사해석' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="검사해석"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('검사해석', key, val);
                      });
                    }}
                  />

                  {/* PDF Upload Area */}
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-5 bg-indigo-50/20 text-center transition-all duration-300">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePdfUpload}
                      accept="application/pdf"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 transition-transform hover:scale-105">
                        {pdfAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {pdfAnalyzing ? 'AI가 직업선호도검사 PDF를 고정밀 분석하는 중...' : '직업선호도검사결과 PDF 업로드'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {pdfFileName ? `선택된 검사지: ${pdfFileName}` : '여기를 클릭하거나 파일을 끌어다 놓으세요'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500">대면으로 상담함 (골격 고정)</label>
                      <input
                        type="text"
                        disabled
                        value={currentFormState.interviewed}
                        className="w-full text-xs p-2.5 bg-slate-100/70 border border-slate-200/80 rounded-lg text-slate-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">흥미코드 (필수)</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={currentFormState.interestCode}
                          onChange={(e) => updateField('검사해석', 'interestCode', e.target.value.toUpperCase())}
                          placeholder="예: SA"
                          maxLength={2}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold uppercase tracking-widest text-center"
                        />
                        <div className="flex gap-1">
                          {['R', 'I', 'A', 'S', 'E', 'C'].map(c => (
                            <button
                              key={c}
                              onClick={() => applyRiasecCode(c)}
                              className="px-2 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-lg transition-colors border border-slate-200/60"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>흥미유형 설명 (필수)</span>
                      <button
                        onClick={() => handleRefineField('interestType', currentFormState.interestType)}
                        disabled={refiningField === 'interestType'}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                      >
                        <Sparkles size={11} className={refiningField === 'interestType' ? 'animate-spin' : ''} /> AI 정제
                      </button>
                    </label>
                    <textarea
                      value={currentFormState.interestType}
                      onChange={(e) => updateField('검사해석', 'interestType', e.target.value)}
                      placeholder="예: 사회형(S) 및 예술형(A) 중심 성향으로 대인관계 업무 선호"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-16"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>유형별 안내 (필수)</span>
                      <button
                        onClick={() => handleRefineField('typeGuide', currentFormState.typeGuide)}
                        disabled={refiningField === 'typeGuide'}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                      >
                        <Sparkles size={11} className={refiningField === 'typeGuide' ? 'animate-spin' : ''} /> AI 정제
                      </button>
                    </label>
                    <textarea
                      value={currentFormState.typeGuide}
                      onChange={(e) => updateField('검사해석', 'typeGuide', e.target.value)}
                      placeholder="예: 흥미유형에 따른 세부 점수 및 타인 대비 특징 안내"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-16"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>성격검사 (필수)</span>
                        <button
                          onClick={() => handleRefineField('personalityTest', currentFormState.personalityTest)}
                          disabled={refiningField === 'personalityTest'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'personalityTest' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <textarea
                        value={currentFormState.personalityTest}
                        onChange={(e) => updateField('검사해석', 'personalityTest', e.target.value)}
                        placeholder="예: 성실성 요인이 65점으로 가장 높게 확인됨"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-16"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>생활사검사 (생략가능)</span>
                        <button
                          onClick={() => handleRefineField('biographyTest', currentFormState.biographyTest)}
                          disabled={refiningField === 'biographyTest'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'biographyTest' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <textarea
                        value={currentFormState.biographyTest}
                        onChange={(e) => updateField('검사해석', 'biographyTest', e.target.value)}
                        placeholder="기본 요약내용 기술"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-16"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500">검사 유의사항 안내 (골격 고정)</label>
                      <textarea
                        disabled
                        value={currentFormState.guideNotice}
                        className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 h-16 resize-none focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">다음 상담일정 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.nextSchedule}
                        onChange={(e) => updateField('검사해석', 'nextSchedule', e.target.value)}
                        placeholder="예: 2026-07-12 15:00"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-[64px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === 3. IAP 폼 === */}
              {selectedForm === 'IAP' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="IAP"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('IAP', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망직무 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishJob}
                        onChange={(e) => updateField('IAP', 'wishJob', e.target.value)}
                        placeholder="예: 일반사무, 기획"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망급여 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishSalary}
                        onChange={(e) => updateField('IAP', 'wishSalary', e.target.value)}
                        placeholder="예: 월 250만원 이상"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망지역 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishRegion}
                        onChange={(e) => updateField('IAP', 'wishRegion', e.target.value)}
                        placeholder="예: 서울 구로구"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망근무시간 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishWorkTime}
                        onChange={(e) => updateField('IAP', 'wishWorkTime', e.target.value)}
                        placeholder="예: 주 5일, 09:00~18:00"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망기업규모 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishCompanySize}
                        onChange={(e) => updateField('IAP', 'wishCompanySize', e.target.value)}
                        placeholder="예: 기업규모무관"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">자격사항 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.license}
                        onChange={(e) => updateField('IAP', 'license', e.target.value)}
                        placeholder="예: 컴퓨터활용능력 1급"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>상담내용(특이사항) (필수)</span>
                        <button
                          onClick={() => handleRefineField('specialNotes', currentFormState.specialNotes)}
                          disabled={refiningField === 'specialNotes'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'specialNotes' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <input
                        type="text"
                        value={currentFormState.specialNotes}
                        onChange={(e) => updateField('IAP', 'specialNotes', e.target.value)}
                        placeholder="특이사항 입력"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      취업활동계획 (2~6회차 수립 상세)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {['2', '3', '4', '5', '6'].map(round => (
                        <div key={round} className="space-y-0.5">
                          <label className="block text-[10px] font-bold text-slate-500">{round}회차 계획</label>
                          <input
                            type="text"
                            value={(currentFormState as any)[`plan${round}`]}
                            onChange={(e) => updateField('IAP', `plan${round}`, e.target.value)}
                            placeholder={`${round}차 구직활동 이행`}
                            className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">1회차 촉진수당 정보 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.allowanceAppliedPeriod}
                        onChange={(e) => updateField('IAP', 'allowanceAppliedPeriod', e.target.value)}
                        placeholder="예: 2026-06-26 신청함. 기간 내 소득 없음"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">가족수당 정보 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.familyAllowance}
                        onChange={(e) => updateField('IAP', 'familyAllowance', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">직업훈련 참여 계획 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.trainingPlan}
                        onChange={(e) => updateField('IAP', 'trainingPlan', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === 4. 수당 폼 === */}
              {selectedForm === '수당' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="수당"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('수당', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">수당 신청 회차</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={currentFormState.round}
                        onChange={(e) => updateField('수당', 'round', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">상담 형태</label>
                      <div className="flex gap-2 h-[41px]">
                        {['유선상담', '대면상담'].map((t) => (
                          <button
                            key={t}
                            onClick={() => updateField('수당', 'contactType', t)}
                            className={`flex-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              currentFormState.contactType === t
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">수당신청 명칭</label>
                      <input
                        type="text"
                        value={currentFormState.appliedText}
                        onChange={(e) => updateField('수당', 'appliedText', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-100 text-slate-600 font-semibold border border-slate-200/80 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>구직활동 확인 내용 (필수)</span>
                        <button
                          onClick={() => handleRefineField('activityCheck', currentFormState.activityCheck)}
                          disabled={refiningField === 'activityCheck'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'activityCheck' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <textarea
                        value={currentFormState.activityCheck}
                        onChange={(e) => updateField('수당', 'activityCheck', e.target.value)}
                        placeholder="예: 워크넷을 통해 입사지원 2건 완료 확인 및 증빙서류 적정 검토"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">소득신고 상태 (필수)</label>
                      <textarea
                        value={currentFormState.incomeDeclaration}
                        onChange={(e) => updateField('수당', 'incomeDeclaration', e.target.value)}
                        placeholder="소득신고 내역 기술"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === 5. 입사 컨설팅 폼 === */}
              {selectedForm === '컨설팅' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="컨설팅"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('컨설팅', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">소요 시간 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.time}
                        onChange={(e) => updateField('컨설팅', 'time', e.target.value)}
                        placeholder="예: 14:00 ~ 15:00 (60분)"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망 직무 분야 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishJobField}
                        onChange={(e) => updateField('컨설팅', 'wishJobField', e.target.value)}
                        placeholder="예: 유통 및 총무 관리"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500">이력서 컨설팅 가이드 내용 (골격 고정)</label>
                    <textarea
                      value={currentFormState.resumeGuide}
                      onChange={(e) => updateField('컨설팅', 'resumeGuide', e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 h-24 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500">자기소개서 컨설팅 가이드 내용 (골격 고정)</label>
                    <textarea
                      value={currentFormState.selfIntroGuide}
                      onChange={(e) => updateField('컨설팅', 'selfIntroGuide', e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 h-24 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* === 6. 알선 폼 === */}
              {selectedForm === '알선' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="알선"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('알선', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 space-y-1">
                      <label className="block text-xs font-bold text-slate-700">알선 종류 (최우선 문구 연동)</label>
                      <div className="flex gap-1">
                        {['외부구인(추천가능)', '외부구인(추천불가)', '센터알선'].map((p) => (
                          <button
                            key={p}
                            onClick={() => updateField('알선', 'placementType', p)}
                            className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                              currentFormState.placementType === p
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p.replace('외부구인', '외부')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="block text-xs font-bold text-slate-700">정보 제공처 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.infoProvider}
                        onChange={(e) => updateField('알선', 'infoProvider', e.target.value)}
                        placeholder="예: 고용24"
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="md:col-span-3 flex items-end pb-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80 hover:bg-slate-100 transition-colors w-full justify-center">
                        <input
                          type="checkbox"
                          checked={currentFormState.hasConsulting}
                          onChange={(e) => updateField('알선', 'hasConsulting', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        +컨설팅 가능 추가
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">알선 대상 회사명 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.companyName}
                        onChange={(e) => updateField('알선', 'companyName', e.target.value)}
                        placeholder="예: (주)한솔로지스틱스"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">모집 직종명 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.jobTitle}
                        onChange={(e) => updateField('알선', 'jobTitle', e.target.value)}
                        placeholder="예: 물류관리팀 총무사무"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* 세부 채용정보 입력 영역 */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      상세 채용 조건 기재
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">위치 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.location}
                          onChange={(e) => updateField('알선', 'location', e.target.value)}
                          placeholder="서울 구로구"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">업무 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.duty}
                          onChange={(e) => updateField('알선', 'duty', e.target.value)}
                          placeholder="총무자재 관리 및 ERP"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">급여 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.salary}
                          onChange={(e) => updateField('알선', 'salary', e.target.value)}
                          placeholder="연봉 3,200만원"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">근무시간 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.workTime}
                          onChange={(e) => updateField('알선', 'workTime', e.target.value)}
                          placeholder="09:00 ~ 18:00"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">채용담당자 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.managerName}
                          onChange={(e) => updateField('알선', 'managerName', e.target.value)}
                          placeholder="인사팀 차장"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">연락처 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.managerContact}
                          onChange={(e) => updateField('알선', 'managerContact', e.target.value)}
                          placeholder="02-123-4567"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">학력</label>
                        <input
                          type="text"
                          value={currentFormState.education}
                          onChange={(e) => updateField('알선', 'education', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">경력</label>
                        <input
                          type="text"
                          value={currentFormState.experience}
                          onChange={(e) => updateField('알선', 'experience', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === 7. 채용정보 (단순 정보제공) 폼 === */}
              {selectedForm === '채용정보' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="채용정보"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('채용정보', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500">인내 및 가이드 문구 (골격 고정)</label>
                      <input
                        type="text"
                        disabled
                        value={currentFormState.guideText}
                        className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">기업명 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.companyName}
                        onChange={(e) => updateField('채용정보', 'companyName', e.target.value)}
                        placeholder="예: (주)현대글로비스"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">근무지역 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.workRegion}
                        onChange={(e) => updateField('채용정보', 'workRegion', e.target.value)}
                        placeholder="예: 서울 구로구"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">모집 직종 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.jobTitle}
                        onChange={(e) => updateField('채용정보', 'jobTitle', e.target.value)}
                        placeholder="예: 지입 물류 관리사"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">임금조건 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.salaryCondition}
                        onChange={(e) => updateField('채용정보', 'salaryCondition', e.target.value)}
                        placeholder="예: 월급 280만원 이상"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">근무조건 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.workCondition}
                        onChange={(e) => updateField('채용정보', 'workCondition', e.target.value)}
                        placeholder="예: 주 5일 근무, 기숙사 제공"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">접수마감 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.deadline}
                        onChange={(e) => updateField('채용정보', 'deadline', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === 8. 직업훈련 폼 === */}
              {selectedForm === '직업훈련' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="직업훈련"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('직업훈련', key, val);
                      });
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">희망 직종 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.wishJob}
                        onChange={(e) => updateField('직업훈련', 'wishJob', e.target.value)}
                        placeholder="예: 웹퍼블리셔 및 프론트엔드"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">변경할 이행과제 회차 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.roundChange}
                        onChange={(e) => updateField('직업훈련', 'roundChange', e.target.value)}
                        placeholder="예: 3회차 및 4회차"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* 내일배움카드 직업훈련 세부 정보 */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      내일배움카드 직업훈련 과정 상세 기재
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">훈련기관명 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.instName}
                          onChange={(e) => updateField('직업훈련', 'instName', e.target.value)}
                          placeholder="한국직업전문학교"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">훈련과정명 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.courseName}
                          onChange={(e) => updateField('직업훈련', 'courseName', e.target.value)}
                          placeholder="UI/UX 웹퍼블리셔 인재양성"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">훈련기간 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.period}
                          onChange={(e) => updateField('직업훈련', 'period', e.target.value)}
                          placeholder="2026-07-01 ~ 2026-10-31"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === 9. 채용확정 폼 === */}
              {selectedForm === '채용확정' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* 스마트 AI 파서 추가 */}
                  <SmartJobParser
                    targetForm="채용확정"
                    apiKey={apiKey}
                    onShowKeyModal={() => setShowKeyModal(true)}
                    onParsed={(parsedData) => {
                      Object.entries(parsedData).forEach(([key, val]) => {
                        updateField('채용확정', key, val);
                      });
                    }}
                  />

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>채용 합격 및 출근 정보 (필수)</span>
                      <button
                        onClick={() => handleRefineField('company', currentFormState.company)}
                        disabled={refiningField === 'company'}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                      >
                        <Sparkles size={11} className={refiningField === 'company' ? 'animate-spin' : ''} /> AI 정제
                      </button>
                    </label>
                    <textarea
                      value={currentFormState.company}
                      onChange={(e) => updateField('채용확정', 'company', e.target.value)}
                      placeholder="예: (주)삼표산업에 물류사무로 6월 24일 면접 응시하였고 당일 합격하여 7월 1일부터 정식 출근하기로 연락받음"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-24"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500">성공 축하 및 성공수당 조항 가이드 (골격 고정)</label>
                    <textarea
                      disabled
                      value={currentFormState.congratsText}
                      className="w-full text-xs p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 h-20 resize-none focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* === 10. 종료 (풀버전) 폼 === */}
              {selectedForm === '종료_풀' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>성공수당 지급안내 정보 (필수)</span>
                        <button
                          onClick={() => handleRefineField('allowanceTargetNotice', currentFormState.allowanceTargetNotice)}
                          disabled={refiningField === 'allowanceTargetNotice'}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                        >
                          <Sparkles size={11} className={refiningField === 'allowanceTargetNotice' ? 'animate-spin' : ''} /> AI 정제
                        </button>
                      </label>
                      <input
                        type="text"
                        value={currentFormState.allowanceTargetNotice}
                        onChange={(e) => updateField('종료_풀', 'allowanceTargetNotice', e.target.value)}
                        placeholder="예: 국취 1유형, 중위소득 60% 이하 취업성공수당 지급대상(해당)을 안내함"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">취업지원 종료일 (취업일자) (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.endDate}
                        onChange={(e) => updateField('종료_풀', 'endDate', e.target.value)}
                        placeholder="예: 2026-06-26"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">사후관리 기간 (3개월) (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.followUpPeriod}
                        onChange={(e) => updateField('종료_풀', 'followUpPeriod', e.target.value)}
                        placeholder="예: 2026-06-27 ~ 2026-09-26"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">통지서 발행 방법 (필수)</label>
                      <input
                        type="text"
                        value={currentFormState.issueMethod}
                        onChange={(e) => updateField('종료_풀', 'issueMethod', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">종료 구분</label>
                      <input
                        type="text"
                        value={currentFormState.exitCategory}
                        onChange={(e) => updateField('종료_풀', 'exitCategory', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">취업성공수당 지급대상 여부</label>
                      <input
                        type="text"
                        value={currentFormState.successAllowanceTarget}
                        onChange={(e) => updateField('종료_풀', 'successAllowanceTarget', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">조기취업성공수당 지급대상</label>
                      <input
                        type="text"
                        value={currentFormState.earlySuccessAllowanceTarget}
                        onChange={(e) => updateField('종료_풀', 'earlySuccessAllowanceTarget', e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* 세부 취업 사업장 정보 */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">종료 증빙 세부 취업 사업장 정보</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">사업장명 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.companyName}
                          onChange={(e) => updateField('종료_풀', 'companyName', e.target.value)}
                          placeholder="(주)웅진시스템"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">직종명 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.jobTitle}
                          onChange={(e) => updateField('종료_풀', 'jobTitle', e.target.value)}
                          placeholder="정보기술 부문 총무직"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">소정 근로시간 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.weeklyWorkHours}
                          onChange={(e) => updateField('종료_풀', 'weeklyWorkHours', e.target.value)}
                          placeholder="주 40시간"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">월 평균 보수액 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.monthlySalary}
                          onChange={(e) => updateField('종료_풀', 'monthlySalary', e.target.value)}
                          placeholder="월 260만원"
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">구직마감 유형</label>
                        <input
                          type="text"
                          value={currentFormState.jobCloseType}
                          onChange={(e) => updateField('종료_풀', 'jobCloseType', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">고용보험 취득여부 (필수)</label>
                        <input
                          type="text"
                          value={currentFormState.insuranceAcquired}
                          onChange={(e) => updateField('종료_풀', 'insuranceAcquired', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200/80 rounded focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === 11. 종료 (간단) 폼 === */}
              {selectedForm === '종료_간단' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>종료처리 확인 내용 (필수)</span>
                      <button
                        onClick={() => handleRefineField('exitConfirmationText', currentFormState.exitConfirmationText)}
                        disabled={refiningField === 'exitConfirmationText'}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 transition-colors"
                      >
                        <Sparkles size={11} className={refiningField === 'exitConfirmationText' ? 'animate-spin' : ''} /> AI 정제
                      </button>
                    </label>
                    <textarea
                      value={currentFormState.exitConfirmationText}
                      onChange={(e) => updateField('종료_간단', 'exitConfirmationText', e.target.value)}
                      placeholder="예: 내담자는 2026-06-25 (주)삼양사에 취업하여 고용보험 취득 확인 후 정상적으로 구직 활동 종료처리함"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none h-24"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">수당 안내 요약 (필수)</label>
                    <input
                      type="text"
                      value={currentFormState.allowanceNotice}
                      onChange={(e) => updateField('종료_간단', 'allowanceNotice', e.target.value)}
                      placeholder="수당 안내 내용"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Simulated Premium Coding Terminal/Output Preview */}
          <div className="flex flex-col bg-[#0b101d] rounded-2xl border border-[#1b253c] shadow-xl p-5 font-mono text-xs leading-relaxed relative min-h-[320px] max-h-[420px] group transition-all shrink-0" id="diary-terminal-card">
            
            {/* Terminal Top Window Control Rail */}
            <div className="absolute top-0 left-0 right-0 h-9 bg-[#080d1a] rounded-t-2xl border-b border-[#141b2b] flex items-center justify-between px-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#ff5f56] rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-[#ffbd2e] rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-[#27c93f] rounded-full"></div>
                <span className="ml-2.5 text-[10px] font-bold text-slate-400 font-mono tracking-tight flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  counseling_assistant_v4.md
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[9px] bg-[#1a253c] text-emerald-400 px-2.5 py-0.5 rounded font-extrabold tracking-wide">
                  실시간 출력 활성화
                </span>
              </div>
            </div>

            {/* Terminal Inner Content */}
            <div className="mt-7 flex-1 overflow-auto pr-2 text-slate-300 font-mono text-[11px] md:text-xs leading-relaxed custom-scrollbar-dark select-text">
              <pre className="whitespace-pre-wrap font-mono py-2 text-indigo-200/90 leading-relaxed font-medium">
                {diaryOutput || `// 대기 중입니다. 좌측 서식 데이터를 입력해주세요.`}
              </pre>
            </div>

            {/* Terminal Action Area */}
            <div className="mt-4 pt-3.5 border-t border-[#141b2b] flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">※ 복사 시 자동 완성 기록 카운트가 즉시 반영됩니다.</span>
              <button
                onClick={copyToClipboard}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-bold active:scale-[0.97] transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer text-xs"
                id="btn-copy-diary"
              >
                {copySuccess ? <ClipboardCheck className="w-4 h-4 animate-bounce" /> : <Clipboard className="w-4 h-4" />}
                {copySuccess ? '클립보드 복사완료!' : '공문서 일지 복사하기'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Bento: Contextual Library References & Smart Helpers */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          
          {/* Main Reference Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1 flex flex-col min-h-[400px]" id="reference-info-bento">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
              {selectedForm === '초기상담' ? '[참고 A] 선택 라이브러리' : '스마트 상담 가이드'}
            </h3>

            <div className="flex-1 overflow-y-auto max-h-[550px] text-xs text-slate-600 space-y-4 pr-1 custom-scrollbar">
              
              {/* 초기상담용 클릭형 참고 라이브러리 */}
              {selectedForm === '초기상담' && (
                <>
                  <div className="space-y-2">
                    <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">유형분류 근거 (클릭 시 상담내용에 자동 조합)</p>
                    <ul className="space-y-1.5">
                      {REFER_A_CLASSIFICATION.map((item) => {
                        const isSelected = (currentFormState.selectedClassificationIds || []).includes(item.id);
                        return (
                          <li
                            key={item.id}
                            onClick={() => handleClassificationClick(item.id, item.text)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-[11px] leading-relaxed flex items-start gap-1.5 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm shadow-indigo-100'
                                : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-700 border-slate-200/70 hover:border-indigo-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-white' : 'bg-slate-400'}`}></span>
                            <span className="flex-1">{item.id}. {item.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">상담목표 · 전략 (클릭 시 자격사항에 자동 조합)</p>
                    <ul className="space-y-1.5">
                      {REFER_A_GOALS_STRATEGY.map((item) => {
                        const isSelected = (currentFormState.selectedStrategyIds || []).includes(item.id);
                        return (
                          <li
                            key={item.id}
                            onClick={() => handleStrategyClick(item.id, item.text)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-[11px] leading-relaxed flex items-start gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-sm shadow-emerald-100'
                                : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-700 border-slate-200/70 hover:border-emerald-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-white' : 'bg-slate-400'}`}></span>
                            <span className="flex-1">{item.id}. {item.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}

              {/* 검사해석용 RIASEC 안내 */}
              {selectedForm === '검사해석' && (
                <div className="space-y-3">
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">RIASEC 대표 흥미유형 설명 (클릭 자동입력)</p>
                  <div className="space-y-2 text-[11px]">
                    {Object.entries(REFER_B_RIASEC).map(([code, desc]) => (
                      <div
                        key={code}
                        onClick={() => applyRiasecCode(code)}
                        className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-indigo-200"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block w-5 h-5 rounded-lg bg-indigo-600 text-white font-black text-center leading-5 text-[10px]">
                            {code}
                          </span>
                          <span className="font-bold text-slate-800">{code}형 특징</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 알선용 가이드 */}
              {selectedForm === '알선' && (
                <div className="space-y-3 text-[11px]">
                  <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200/50 leading-relaxed">
                    <h5 className="font-bold flex items-center gap-1 mb-1 text-xs">
                      <AlertTriangle size={13} className="text-amber-600" />
                      외부구인(추천불가) 행정 원칙
                    </h5>
                    <p className="font-medium text-amber-800">
                      인사담당자와의 별도 유선 추천이 불가능한 대기업이나 블라인드 채용 건의 경우 추천불가를 선택하세요. 상담사 채용정보제공 행정 코드로 일관되게 치환됩니다.
                    </p>
                  </div>
                  <div className="p-3.5 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200/50 leading-relaxed">
                    <h5 className="font-bold mb-1 text-xs">◆ 고용24 정밀 매칭 원칙</h5>
                    <p className="font-medium text-indigo-800">센터알선 진행 시 참여자 동의하에 매칭 적합성을 고용24 시스템에 선반영 및 심사 진행한 내용을 기준으로 행정 처리합니다.</p>
                  </div>
                </div>
              )}

              {/* 기본 안내 (타 양식) */}
              {selectedForm !== '초기상담' && selectedForm !== '검사해석' && selectedForm !== '알선' && (
                <div className="space-y-3 leading-relaxed text-[11.5px] text-slate-500 font-medium">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <h5 className="font-bold text-slate-700 mb-1 text-[12px]">공문서 어미 종결 지침</h5>
                    <p>행정 공문서 및 상담일지 작성 시에는 주관적 어조를 지양하며, <strong className="text-indigo-600">"~하였음", "~함", "~안내함", "~완료함"</strong> 등 기계적이고 명확한 건조체를 일관되게 활용하여 신뢰도를 확보합니다.</p>
                  </div>
                  
                  <div className="p-3.5 bg-emerald-50/50 text-emerald-900 rounded-xl border border-emerald-100">
                    <h5 className="font-bold mb-1 text-[12px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      필수 입력 검증 기능
                    </h5>
                    <p className="text-emerald-800">각 서식의 필수 요건이 미입력된 경우 일지 하단에 <strong className="text-rose-600">"미입력 필수항목 경고"</strong>가 실시간으로 자동 기재됩니다. 복사 전 이를 면밀히 점검하십시오.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Circular Hover RIASEC Helper */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.03)]" id="riasec-circles-bento">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-500" />
              RIASEC 흥미 검사 퀵코드
            </h3>
            <div className="flex justify-between gap-1.5">
              {[
                { c: 'R', label: '실재형', color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100' },
                { c: 'I', label: '탐구형', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100' },
                { c: 'A', label: '예술형', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100' },
                { c: 'S', label: '사회형', color: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100' },
                { c: 'E', label: '진취형', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100' },
                { c: 'C', label: '관습형', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100' },
              ].map(({ c, label, color }) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedForm('검사해석');
                    applyRiasecCode(c);
                  }}
                  title={`${c}형 (${label}) 상세설명 자동반영`}
                  className={`flex-1 h-12 rounded-xl ${color} border flex flex-col items-center justify-center transition-all transform hover:scale-[1.05] active:scale-95 cursor-pointer`}
                >
                  <span className="font-black text-sm">{c}</span>
                  <span className="text-[8px] font-bold tracking-tighter opacity-80">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Gemini API Key 승인 및 인증</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">AI 실시간 문장 다듬기 및 PDF 자동완성 활성화</p>
                </div>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                이 서비스의 실시간 AI 문장 정제 및 직업선호도검사 PDF 원클릭 분석 기능은 <strong>Google Gemini API</strong>를 사용합니다. 
                본인의 Gemini API Key를 입력하시면 앱의 모든 AI 기능을 즉시 활성화하여 승인된 상태로 사용할 수 있습니다.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">Gemini API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value);
                      if (apiVerificationError) setApiVerificationError(null);
                    }}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500 focus:bg-white transition-all pr-10"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  * API Key는 귀하의 브라우저 로컬 저장소(localStorage)에만 안전하게 보관되며, 서버 외부로 무단 수집되지 않고 오직 전용 프록시 API 호출에만 직접 사용됩니다.
                </p>
              </div>

              {apiVerificationError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-800 text-xs font-bold animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-extrabold text-rose-900 mb-0.5">인증 실패</p>
                    <p className="text-[11px] font-medium leading-relaxed text-rose-700">{apiVerificationError}</p>
                  </div>
                </div>
              )}

              {isKeyVerified && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>현재 API Key가 인증 및 활성화되어 있습니다.</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              {isKeyVerified ? (
                <button
                  type="button"
                  onClick={handleClearApiKey}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Key 삭제 / 로그아웃
                </button>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400">인증을 먼저 진행해 주세요.</span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyApiKey(apiKeyInput)}
                  disabled={isVerifyingKey}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  {isVerifyingKey ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      검증 중...
                    </>
                  ) : (
                    '인증 및 승인하기'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
