/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FormType =
  | '초기상담'
  | '검사해석'
  | 'IAP'
  | '수당'
  | '컨설팅'
  | '알선'
  | '채용정보'
  | '직업훈련'
  | '채용확정'
  | '종료_풀'
  | '종료_간단';

export interface BaseFormData {
  type: FormType;
}

export interface ChoiceItem {
  id: number;
  text: string;
}

export interface SuggestionA {
  category: string;
  items: ChoiceItem[];
}

export const REFER_A_CLASSIFICATION: ChoiceItem[] = [
  { id: 1, text: '취업 의사가 높고 관련 자격·역량이 높음' },
  { id: 2, text: '직무분석으로 직업정보 탐색, 빠른 취업 위해 노력 중' },
  { id: 3, text: '취업 의욕 높고 상담에 성실히 임함' },
  { id: 4, text: '희망분야를 어느 정도 계획하나 확실한 진로설정에 어려움' },
  { id: 5, text: '경력·경험 부족하나 관련 자격증 취득 등 의욕 높음' },
  { id: 6, text: '경험 부족 보완 위해 일경험 참여 의지 있음' },
];

export const REFER_A_GOALS_STRATEGY: ChoiceItem[] = [
  { id: 1, text: '직업심리검사로 흥미·성격 파악, 직무 맞춤 자소서 지원' },
  { id: 2, text: '희망분야 필요 역량·NCS 정보 안내' },
  { id: 3, text: '취업 확률 제고 위한 각종 클리닉 실시' },
  { id: 4, text: '강점 부각, 연계 구인처 안내·진로설정 지원' },
  { id: 5, text: '자소서·입사서류 작성 상담' },
  { id: 6, text: '희망 직무 역량강화 위한 일경험 연계' },
  { id: 7, text: '안정적 취업 준비 위한 정서적 지지' },
];

export const REFER_B_RIASEC: Record<string, string> = {
  R: '명확·체계적·질서정연한 일을 좋아하고 눈에 보이는 결과물을 선호하며 작동하지 않던 것이 작동될 때 희열을 느끼는 편임. 이성적·냉정하다는 평을 듣기도 함.',
  I: '혼자 주도적으로 하는 일을 선호하고 깊이 연구하는 활동을 좋아하며 지적호기심이 강해 끝까지 파고드는 성향임.',
  A: '다양한 분야에 얕은 호기심이 있고 성과·목표를 자율적으로 정하고 싶어하며 창의적·유연한 사고를 선호함.',
  S: '힐링·치유에 관심 있고 표정·감정을 빠르게 캐치하며 함께 어울려 일하기를 좋아함. 사람을 좋아하나 받는 상처도 큰 편임.',
  E: '리더십 있고 성과지향적이며 인정욕구가 강함. 대인관계를 목표 성취 수단으로 두는 편임.',
  C: '안정적인 일을 선호하고 불안정한 것을 싫어해 계획을 세움. 계획적·안정적·완벽성 키워드, 스트레스 취약성이 높을 수 있음.',
};

// 양식별 필드 정의
export interface InitialConsultFormData extends BaseFormData {
  agreement: string; // 동의서·안내문 서명
  counselContent: string; // 상담내용
  family: string; // 가족사항 (생략가능)
  education: string; // 학력사항 (생략가능)
  license: string; // 자격사항 (생략가능)
  experience: string; // 경력사항 (생략가능)
  workHistory: string; // 근로내역확인 (생략가능)
  wishJob: string; // 희망직무
  wishRegion: string; // 희망지역
  capacityScore: string; // 취업역량평가등급 및 점수
  nextSchedule: string; // 다음상담일정
  expectedLicense: string; // 취득예정자격증 (생략가능)
  // 참고 A 선택값들 (번호 및 내용 결합)
  selectedClassificationIds: number[];
  selectedStrategyIds: number[];
}

export interface TestInterpretationFormData extends BaseFormData {
  interviewed: string; // 대면으로 상담함. (고정)
  interestCode: string; // 흥미코드
  interestType: string; // 흥미유형
  typeGuide: string; // 유형별 안내
  personalityTest: string; // 성격검사
  biographyTest: string; // 생활사검사 (생략가능)
  guideNotice: string; // 흥미를 살펴보는 검사이므로... 안내문구
  nextSchedule: string; // 다음 상담일정
}

export interface IAPFormData extends BaseFormData {
  wishJob: string; // 희망직무
  wishSalary: string; // 희망급여
  wishRegion: string; // 희망지역
  wishWorkTime: string; // 희망근무시간
  wishCompanySize: string; // 희망기업규모
  iapCopyGiven: string; // 개인별 취업활동계획서(IAP)사본 교부함.
  allowanceApplied: string; // 구직촉진수당 1회차 신청함...
  license: string; // 자격사항
  specialNotes: string; // 상담내용(특이사항)
  plan2: string; // 2회차
  plan3: string; // 3회차
  plan4: string; // 4회차
  plan5: string; // 5회차
  plan6: string; // 6회차
  expiryNotice: string; // 기간만료일은...
  allowanceAppliedPeriod: string; // 1회차 구직촉진수당 신청함. (기간) 근로소득 발생내역 없음.
  familyAllowance: string; // 가족수당
  trainingPlan: string; // 직업훈련참여계획
}

export interface AllowanceFormData extends BaseFormData {
  round: string; // n회차 구직촉진수당 신청
  contactType: '유선상담' | '대면상담'; // 유선상담/대면상담 선택
  appliedText: string; // 구직촉진수당 n회차 신청함.
  performedWell: string; // 취업활동계획대로 성실히 이행함.
  activityCheck: string; // 구직활동 확인
  depositNotice: string; // 접수일로부터 14일 이내...
  incomeDeclaration: string; // 소득신고
  trainingIntention: string; // 역량 강화를 위한...
}

export interface ConsultingFormData extends BaseFormData {
  time: string; // 시간
  wishJobField: string; // 내담자는 (직무) 분야로 입사지원을 희망함.
  consultingReason: string; // 관련 직무 입사지원서 작성 경험이 없어...
  ncsGuide: string; // NCS를 통해 직무분석 후...
  resumeGuide: string; // 이력서: ...
  selfIntroGuide: string; // 자기소개서: ...
}

export type PlacementType = '외부구인(추천가능)' | '외부구인(추천불가)' | '센터알선';

export interface PlacementFormData extends BaseFormData {
  infoProvider: string; // 정보제공처
  companyName: string; // 회사명
  jobTitle: string; // 직종명
  placementType: PlacementType;
  hasConsulting: boolean; // +컨설팅 가능 여부
  location: string;
  duty: string;
  education: string;
  experience: string;
  employmentType: string;
  recruitsCount: string;
  salary: string;
  workTime: string;
  requiredDocuments: string;
  managerName: string;
  managerContact: string;
}

export interface JobInfoFormData extends BaseFormData {
  guideText: string; // 지원 가능한 채용정보가 있어...
  companyName: string;
  workRegion: string;
  jobTitle: string;
  salaryCondition: string;
  workType: string;
  workCondition: string;
  deadline: string;
}

export interface VocationalTrainingFormData extends BaseFormData {
  wishJob: string; // 참여자는 (희망직종)으로...
  applyReason: string; // 역량강화를 위해 필요한...
  operationGuide: string; // (운영방식 안내)...
  roundChange: string; // 직업훈련 일정으로...
  instName: string; // 훈련기관명
  courseName: string; // 훈련과정명
  period: string; // 훈련기간
}

export interface EmploymentConfirmedFormData extends BaseFormData {
  company: string; // 내담자는 (기업)...
  congratsText: string; // 취업 성공을 축하드리며...
}

export interface ExitFullFormData extends BaseFormData {
  introText: string; // 내담자의 취업성공으로...
  resignNotice: string; // 취업 후 1개월 미만...
  allowanceTargetNotice: string; // 국취 (유형), (소득기준)...
  reparticipationNotice: string; // 국민취업지원제도 재참여 유예기간...
  contactNotice: string; // 문의사항은 언제든...
  agreementNotice: string; // 해당 사업장에서 계속근로 의지를...
  endDate: string; // * 취업지원 서비스 기간 종료일(취업일자):
  followUpPeriod: string; // * 취업자 사후관리 기간(3개월):
  issueMethod: string; // * 종료통지서 발행 방법:
  successAllowanceTarget: string; // * 취업성공수당 지급대상:
  earlySuccessAllowanceTarget: string; // * 조기취업성공수당 지급대상:
  exitCategory: string; // * 종료구분: 취업
  companyName: string; // - 사업장명:
  jobTitle: string; // - 직종명:
  weeklyWorkHours: string; // - 주 소정 근로시간:
  monthlySalary: string; // - 월 평균 보수액:
  jobCloseType: string; // - 구직마감유형:
  insuranceAcquired: string; // - 고용보험 취득여부:
}

export interface ExitSimpleFormData extends BaseFormData {
  exitConfirmationText: string; // 내담자는 (일자) (기업)에...
  allowanceNotice: string; // 취업성공수당 (대상/비대상)임을...
}
