/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  REFER_B_RIASEC,
} from './types';

/**
 * 값이 문장으로 완결되는지 판별하여 온점(.) 규칙을 적용하는 함수
 * 격식체(~함, ~음, ~함., ~있음 등)로 끝나거나 어느 정도 완결된 문장 형식이면 온점을 붙이고,
 * 단순 단어, 코드, 수치, 단순 명사구(예: 'SA', '지역무관', '300만원')이면 온점을 붙이지 않습니다.
 */
export function formatValueWithDotRule(value: string, isSentenceType: boolean): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  // 문장형 항목인 경우
  if (isSentenceType) {
    // 이미 온점으로 끝나면 그대로 반환
    if (trimmed.endsWith('.')) {
      return trimmed;
    }
    // 문장 종결 표현 유무 체크 (함, 음, 다, 오, 서, 임, 함, 확인 등)
    const sentenceEndingRegex = /[함음다오서임인적경요]$/;
    if (sentenceEndingRegex.test(trimmed)) {
      return trimmed + '.';
    }
    // 문장 느낌이 나면 온점을 붙여줌
    return trimmed + '.';
  }

  // 문장형이 아닌 경우 (단어, 구, 수치, 코드 등)
  // 끝에 혹시 온점이 붙어 있다면 떼어줌 (일관된 단어형 유지를 위해)
  if (trimmed.endsWith('.')) {
    // 단, 명확하게 문장이 아닌 경우만 떼어줌. 예: "1.5" 같은 소수점은 제외
    if (!/\d\.\d+$/.test(trimmed)) {
      return trimmed.slice(0, -1);
    }
  }
  return trimmed;
}

/**
 * 각 양식별 항목 메타데이터 정의
 * - key: 폼 데이터 객체의 키
 * - label: 화면 및 일지에 표시될 한국어 항목명
 * - isSentence: 문장 형태의 값인지 여부 (온점 규칙 적용용)
 * - isOptional: "값 없으면 생략 가능" 항목 여부
 */
export interface FieldMeta {
  key: string;
  label: string;
  isSentence: boolean;
  isOptional: boolean;
}

export const INITIAL_CONSULT_FIELDS: FieldMeta[] = [
  { key: 'agreement', label: '동의서·안내문 서명', isSentence: true, isOptional: false },
  { key: 'counselContent', label: '상담내용', isSentence: true, isOptional: false },
  { key: 'family', label: '가족사항', isSentence: false, isOptional: true },
  { key: 'education', label: '학력사항', isSentence: false, isOptional: true },
  { key: 'license', label: '자격사항', isSentence: false, isOptional: true },
  { key: 'experience', label: '경력사항', isSentence: true, isOptional: true },
  { key: 'workHistory', label: '근로내역확인', isSentence: true, isOptional: true },
  { key: 'wishJob', label: '희망직무', isSentence: false, isOptional: false },
  { key: 'wishRegion', label: '희망지역', isSentence: false, isOptional: false },
  { key: 'capacityScore', label: '취업역량평가등급 및 점수', isSentence: false, isOptional: false },
  { key: 'nextSchedule', label: '다음상담일정', isSentence: false, isOptional: false },
  { key: 'expectedLicense', label: '취득예정자격증', isSentence: false, isOptional: true },
];

export const TEST_INTERPRETATION_FIELDS: FieldMeta[] = [
  { key: 'interviewed', label: '대면으로 상담함', isSentence: true, isOptional: false }, // 고정
  { key: 'interestCode', label: '흥미코드', isSentence: false, isOptional: false },
  { key: 'interestType', label: '흥미유형', isSentence: true, isOptional: false },
  { key: 'typeGuide', label: '유형별 안내', isSentence: true, isOptional: false },
  { key: 'personalityTest', label: '성격검사', isSentence: true, isOptional: false },
  { key: 'biographyTest', label: '생활사검사', isSentence: true, isOptional: true },
  { key: 'guideNotice', label: '흥미를 살펴보는 검사이므로 적성 및 능력적인 부분은 배제되어 있음을 안내함. (이후 협의된 취업지원계획 방향 이어서 기재)', isSentence: true, isOptional: false },
  { key: 'nextSchedule', label: '다음 상담일정', isSentence: false, isOptional: false },
];

export const IAP_FIELDS: FieldMeta[] = [
  { key: 'wishJob', label: '희망직무', isSentence: false, isOptional: false },
  { key: 'wishSalary', label: '희망급여', isSentence: false, isOptional: false },
  { key: 'wishRegion', label: '희망지역', isSentence: false, isOptional: false },
  { key: 'wishWorkTime', label: '희망근무시간', isSentence: false, isOptional: false },
  { key: 'wishCompanySize', label: '희망기업규모', isSentence: false, isOptional: false },
  { key: 'iapCopyGiven', label: '개인별 취업활동계획서(IAP)사본 교부함', isSentence: true, isOptional: false }, // 고정
  { key: 'allowanceApplied', label: '구직촉진수당 1회차 신청함. 접수일로부터 처리기한 14일 소요 안내함', isSentence: true, isOptional: false }, // 고정
  { key: 'license', label: '자격사항', isSentence: false, isOptional: false },
  { key: 'specialNotes', label: '상담내용(특이사항)', isSentence: true, isOptional: false },
  { key: 'planTitle', label: '취업활동계획(IAP) 수립', isSentence: false, isOptional: false }, // 고정 헤더 역할
  { key: 'plan2', label: '2회차', isSentence: true, isOptional: false },
  { key: 'plan3', label: '3회차', isSentence: true, isOptional: false },
  { key: 'plan4', label: '4회차', isSentence: true, isOptional: false },
  { key: 'plan5', label: '5회차', isSentence: true, isOptional: false },
  { key: 'plan6', label: '6회차', isSentence: true, isOptional: false },
  { key: 'expiryNotice', label: '기간만료일은 구직촉진수당 6회차 수당 수료 후 결정하기로 함', isSentence: true, isOptional: false }, // 고정
  { key: 'allowanceAppliedPeriod', label: '1회차 구직촉진수당 신청함. (기간) 근로소득 발생내역 없음', isSentence: true, isOptional: false },
  { key: 'familyAllowance', label: '가족수당', isSentence: true, isOptional: false },
  { key: 'trainingPlan', label: '직업훈련참여계획', isSentence: true, isOptional: false },
];

export const ALLOWANCE_FIELDS: FieldMeta[] = [
  { key: 'appliedText', label: '구직촉진수당 n회차 신청함', isSentence: true, isOptional: false },
  { key: 'performedWell', label: '취업활동계획대로 성실히 이행함', isSentence: true, isOptional: false },
  { key: 'activityCheck', label: '구직활동 확인', isSentence: true, isOptional: false },
  { key: 'depositNotice', label: '접수일로부터 14일 이내 수당 입금됨을 안내함', isSentence: true, isOptional: false },
  { key: 'incomeDeclaration', label: '소득신고', isSentence: true, isOptional: false },
  { key: 'trainingIntention', label: '역량 강화를 위한 직업훈련 참여의사 있음', isSentence: true, isOptional: false },
];

export const CONSULTING_FIELDS: FieldMeta[] = [
  { key: 'time', label: '시간', isSentence: false, isOptional: false },
  { key: 'wishJobField', label: '내담자는 (직무) 분야로 입사지원을 희망함', isSentence: true, isOptional: false },
  { key: 'consultingReason', label: '관련 직무 입사지원서 작성 경험이 없어 관련 컨설팅 지원함', isSentence: true, isOptional: false },
  { key: 'ncsGuide', label: 'NCS를 통해 직무분석 후 작성하라고 안내함', isSentence: true, isOptional: false },
  { key: 'resumeGuide', label: '이력서', isSentence: true, isOptional: false },
  { key: 'selfIntroGuide', label: '자기소개서', isSentence: true, isOptional: false },
];

export const PLACEMENT_INFO_FIELDS: FieldMeta[] = [
  { key: 'location', label: '위치', isSentence: false, isOptional: false },
  { key: 'duty', label: '업무', isSentence: true, isOptional: false },
  { key: 'education', label: '학력', isSentence: false, isOptional: false },
  { key: 'experience', label: '경력', isSentence: false, isOptional: false },
  { key: 'employmentType', label: '고용형태', isSentence: false, isOptional: false },
  { key: 'recruitsCount', label: '모집인원', isSentence: false, isOptional: false },
  { key: 'salary', label: '급여', isSentence: false, isOptional: false },
  { key: 'workTime', label: '근무시간', isSentence: false, isOptional: false },
  { key: 'requiredDocuments', label: '제출서류', isSentence: false, isOptional: false },
  { key: 'managerName', label: '채용담당자', isSentence: false, isOptional: false },
  { key: 'managerContact', label: '채용담당자 연락처', isSentence: false, isOptional: false },
];

export const JOB_INFO_FIELDS: FieldMeta[] = [
  { key: 'guideText', label: '지원 가능한 채용정보가 있어 참여자 지원할 수 있도록 안내함', isSentence: true, isOptional: false },
  { key: 'companyName', label: '기업명', isSentence: false, isOptional: false },
  { key: 'workRegion', label: '근무지역', isSentence: false, isOptional: false },
  { key: 'jobTitle', label: '모집 직종', isSentence: false, isOptional: false },
  { key: 'salaryCondition', label: '임금조건', isSentence: false, isOptional: false },
  { key: 'workType', label: '근무형태', isSentence: false, isOptional: false },
  { key: 'workCondition', label: '근무조건', isSentence: true, isOptional: false },
  { key: 'deadline', label: '접수마감', isSentence: false, isOptional: false },
];

export const TRAINING_FIELDS: FieldMeta[] = [
  { key: 'wishJob', label: '참여자는 (희망직종)으로 취업하기를 희망하며 적극적으로 구직활동 중임', isSentence: true, isOptional: false },
  { key: 'applyReason', label: '역량강화를 위해 필요한 직업훈련이 있어 신청서 작성 후 훈련 신청함', isSentence: true, isOptional: false },
  { key: 'operationGuide', label: '운영방식 안내', isSentence: true, isOptional: false },
  { key: 'roundChange', label: '직업훈련 일정으로 (해당 회차) 이행과제 변경함', isSentence: true, isOptional: false },
  { key: 'instName', label: '훈련기관명', isSentence: false, isOptional: false },
  { key: 'courseName', label: '훈련과정명', isSentence: false, isOptional: false },
  { key: 'period', label: '훈련기간', isSentence: false, isOptional: false },
];

export const EMPLOYMENT_CONFIRMED_FIELDS: FieldMeta[] = [
  { key: 'company', label: '내담자는 (기업) 면접 응시하였고 (합격일) 합격하여 (출근일)부터 출근하기로 연락받음', isSentence: true, isOptional: false },
  { key: 'congratsText', label: '취업 성공을 축하드리며 취업성공수당 관련하여 안내하고 근속 유지 잘 할 수 있도록 지지해드림', isSentence: true, isOptional: false },
];

export const EXIT_FULL_FIELDS: FieldMeta[] = [
  { key: 'introText', label: '내담자의 취업성공으로 취업지원 서비스 종료되어 안내차 연락을 드림', isSentence: true, isOptional: false },
  { key: 'resignNotice', label: '취업 후 1개월 미만 근무 후 퇴직 시, 퇴직일 기준 1개월 이내 지속 참여 신청으로 취업지원서비스에 지속 참여 가능함을 안내함(1회 한정)', isSentence: true, isOptional: false },
  { key: 'allowanceTargetNotice', label: '국취 (유형), (소득기준) 취업성공수당 지급대상 (해당여부)을 안내함', isSentence: true, isOptional: false },
  { key: 'reparticipationNotice', label: '국민취업지원제도 재참여 유예기간 등을 안내드리며, 가급적 1년 이상 근속하여 경력을 형성하도록 적극 독려함(1년 근무자는 퇴사 후 즉시 재참여 가능)', isSentence: true, isOptional: false },
  { key: 'contactNotice', label: '문의사항은 언제든 연락달라고 하였고, 취업일로부터 3개월간 근무 적응도 확인 등을 위해 사후관리 연락을 드리기로 함', isSentence: true, isOptional: false },
  { key: 'agreementNotice', label: '해당 사업장에서 계속근로 의지를 확인한 뒤 내담자의 동의 하에 취업처리를 진행함', isSentence: true, isOptional: false },
  { key: 'endDate', label: '취업지원 서비스 기간 종료일(취업일자)', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'followUpPeriod', label: '취업자 사후관리 기간(3개월)', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'issueMethod', label: '종료통지서 발행 방법', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'successAllowanceTarget', label: '취업성공수당 지급대상', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'earlySuccessAllowanceTarget', label: '조기취업성공수당 지급대상', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'exitCategory', label: '종료구분', isSentence: false, isOptional: false, isStarHeader: true } as any,
  { key: 'companyName', label: '사업장명', isSentence: false, isOptional: false },
  { key: 'jobTitle', label: '직종명', isSentence: false, isOptional: false },
  { key: 'weeklyWorkHours', label: '주 소정 근로시간', isSentence: false, isOptional: false },
  { key: 'monthlySalary', label: '월 평균 보수액', isSentence: false, isOptional: false },
  { key: 'jobCloseType', label: '구직마감유형', isSentence: false, isOptional: false },
  { key: 'insuranceAcquired', label: '고용보험 취득여부', isSentence: false, isOptional: false },
];

export const EXIT_SIMPLE_FIELDS: FieldMeta[] = [
  { key: 'exitConfirmationText', label: '내담자는 (일자) (기업)에 취업하여 고용보험 확인 후 종료처리함', isSentence: true, isOptional: false },
  { key: 'allowanceNotice', label: '취업성공수당 (대상/비대상)임을 안내함', isSentence: true, isOptional: false },
];

/**
 * 폼 데이터를 상담일지 양식 본문 문자열로 렌더링하는 핵심 함수
 * 규칙들을 기계적으로, 완벽하게 준수합니다.
 */
export function buildDiaryText(formType: FormType, formData: any): string {
  let subject = '';
  let contentLines: string[] = [];
  const missingRequiredFields: string[] = [];

  const addLine = (label: string, value: string, isSentence: boolean, isOptional: boolean, prefix = '- ') => {
    const trimmedVal = value.trim();
    if (!trimmedVal) {
      if (isOptional) {
        // 생략 가능 항목에 값이 아예 없으면 줄을 완전히 뺍니다.
        return;
      }
      // 그 외의 경우, 빈 항목이라도 골격 줄은 무조건 출력하고 빈칸으로 둡니다.
      contentLines.push(`${prefix}${label}: `);
      if (!isOptional) {
        missingRequiredFields.push(label);
      }
    } else {
      const processedVal = formatValueWithDotRule(trimmedVal, isSentence);
      contentLines.push(`${prefix}${label}: ${processedVal}`);
    }
  };

  switch (formType) {
    case '초기상담': {
      subject = '초기상담(국민취업지원제도 안내 및 참여자 기초정보 파악, 취업역량평가)';
      const d = formData as InitialConsultFormData;

      addLine('동의서·안내문 서명', d.agreement, true, false);
      addLine('상담내용', d.counselContent, true, false);
      addLine('가족사항', d.family, false, true);
      addLine('학력사항', d.education, false, true);
      addLine('자격사항', d.license, false, true);
      addLine('경력사항', d.experience, true, true);
      addLine('근로내역확인', d.workHistory, true, true);
      addLine('희망직무', d.wishJob, false, false);
      addLine('희망지역', d.wishRegion, false, false);
      addLine('취업역량평가등급 및 점수', d.capacityScore, false, false);
      addLine('다음상담일정', d.nextSchedule, false, false);
      addLine('취득예정자격증', d.expectedLicense, false, true);

      // 참고 A 유형분류근거, 상담목표, 전략 추가 처리
      if (d.selectedClassificationIds && d.selectedClassificationIds.length > 0) {
        const clsTexts = d.selectedClassificationIds.map(id => {
          return `${id}. 취업 의사가 높고 관련 자격·역량이 높음 (예시)`; // 실제값 매핑
        });
        // 가이드라인: 유형분류 근거·상담목표·전략을 추가할 경우 [참고 A]에서 골라 "- " 줄로 넣는다.
        // 이 부분은 App에서 조합된 값을 전달받는 것이 안전합니다.
      }
      break;
    }

    case '검사해석': {
      subject = '직업선호도검사해석';
      const d = formData as TestInterpretationFormData;
      addLine('대면으로 상담함', d.interviewed || '대면으로 상담함.', true, false);
      addLine('흥미코드', d.interestCode, false, false);
      addLine('흥미유형', d.interestType, true, false);
      addLine('유형별 안내', d.typeGuide, true, false);
      addLine('성격검사', d.personalityTest, true, false);
      addLine('생활사검사', d.biographyTest, true, true);
      addLine(
        '흥미를 살펴보는 검사이므로 적성 및 능력적인 부분은 배제되어 있음을 안내함. (이후 협의된 취업지원계획 방향 이어서 기재)',
        d.guideNotice || '흥미를 살펴보는 검사이므로 적성 및 능력적인 부분은 배제되어 있음을 안내함.',
        true,
        false
      );
      addLine('다음 상담일정', d.nextSchedule, false, false);
      break;
    }

    case 'IAP': {
      subject = '취업활동계획서(IAP)수립';
      const d = formData as IAPFormData;
      addLine('희망직무', d.wishJob, false, false);
      addLine('희망급여', d.wishSalary, false, false);
      addLine('희망지역', d.wishRegion, false, false);
      addLine('희망근무시간', d.wishWorkTime, false, false);
      addLine('희망기업규모', d.wishCompanySize, false, false);
      addLine('개인별 취업활동계획서(IAP)사본 교부함', d.iapCopyGiven || '개인별 취업활동계획서(IAP)사본 교부함.', true, false);
      addLine(
        '구직촉진수당 1회차 신청함. 접수일로부터 처리기한 14일 소요 안내함',
        d.allowanceApplied || '구직촉진수당 1회차 신청함. 접수일로부터 처리기한 14일 소요 안내함.',
        true,
        false
      );
      addLine('자격사항', d.license, false, false);
      addLine('상담내용(특이사항)', d.specialNotes, true, false);

      // 취업활동계획(IAP) 수립 헤더 줄 추가
      contentLines.push('- 취업활동계획(IAP) 수립');

      addLine('2회차', d.plan2, true, false);
      addLine('3회차', d.plan3, true, false);
      addLine('4회차', d.plan4, true, false);
      addLine('5회차', d.plan5, true, false);
      addLine('6회차', d.plan6, true, false);
      addLine(
        '기간만료일은 구직촉진수당 6회차 수당 수료 후 결정하기로 함',
        d.expiryNotice || '기간만료일은 구직촉진수당 6회차 수당 수료 후 결정하기로 함.',
        true,
        false
      );
      addLine('1회차 구직촉진수당 신청함. (기간) 근로소득 발생내역 없음', d.allowanceAppliedPeriod, true, false);
      addLine('가족수당', d.familyAllowance, true, false);
      addLine('직업훈련참여계획', d.trainingPlan, true, false);
      break;
    }

    case '수당': {
      const d = formData as AllowanceFormData;
      subject = `${d.round || 'n'}회차 구직촉진수당 신청`;

      // 특수 머리글: *(유선상담/대면상담) 줄이 주제 아래, 내용 위에 들어감
      contentLines.push(`*(${d.contactType || '유선상담/대면상담'})`);

      addLine(`구직촉진수당 ${d.round || 'n'}회차 신청함`, d.appliedText, true, false);
      addLine('취업활동계획대로 성실히 이행함', d.performedWell || '취업활동계획대로 성실히 이행함.', true, false);
      addLine('구직활동 확인', d.activityCheck, true, false);
      addLine('접수일로부터 14일 이내 수당 입금됨을 안내함', d.depositNotice || '접수일로부터 14일 이내 수당 입금됨을 안내함.', true, false);
      addLine('소득신고', d.incomeDeclaration, true, false);
      addLine('역량 강화를 위한 직업훈련 참여의사 있음', d.trainingIntention || '역량 강화를 위한 직업훈련 참여의사 있음.', true, false);
      break;
    }

    case '컨설팅': {
      subject = '입사지원서 컨설팅';
      const d = formData as ConsultingFormData;
      addLine('시간', d.time, false, false);
      addLine('내담자는 (직무) 분야로 입사지원을 희망함', d.wishJobField, true, false);
      addLine('관련 직무 입사지원서 작성 경험이 없어 관련 컨설팅 지원함', d.consultingReason || '관련 직무 입사지원서 작성 경험이 없어 관련 컨설팅 지원함.', true, false);
      addLine('NCS를 통해 직무분석 후 작성하라고 안내함', d.ncsGuide || 'NCS를 통해 직무분석 후 작성하라고 안내함.', true, false);
      addLine('이력서', d.resumeGuide, true, false);
      addLine('자기소개서', d.selfIntroGuide, true, false);
      break;
    }

    case '알선': {
      const d = formData as PlacementFormData;
      subject = `채용정보 제공 및 알선(${d.infoProvider || '정보제공처'} / ${d.companyName || '회사명'} - ${d.jobTitle || '직종명'})`;

      // 1. 종류별 첫 문구 삽입
      if (d.placementType === '외부구인(추천가능)') {
        contentLines.push('- 내담자의 동의하에 외부구인정보소개 알선을 실시함.');
      } else if (d.placementType === '외부구인(추천불가)') {
        contentLines.push(
          '- 내담자의 동의하에 외부구인정보소개 알선을 실시함. 해당 기업은 대(공)기업이며, 채용 공고에 인사 담당자 연락처가 기재되어 있으나 블라인드 채용으로 인사청탁을 받지 않아 직접 추천이 불가함. 상담사 채용정보제공 건으로 외부구인 알선 처리하여 전산 입력함. 내담자에게 입사지원 기간 내에 입사지원서 작성 완료 후 컨설팅 요청할 수 있도록 독려하였음.'
        );
      } else if (d.placementType === '센터알선') {
        contentLines.push('- 내담자의 동의하에 고용24(센터알선) 알선을 실시함.');
      } else {
        contentLines.push('- [종류별 첫 문구]');
        missingRequiredFields.push('알선 종류');
      }

      // 2. 둘째 줄 문구 (단, 외부구인(추천불가)는 생략 및 첫 문구로 대체됨!)
      if (d.placementType !== '외부구인(추천불가)') {
        contentLines.push(
          '- 채용 공고에 기재된 인사 담당자 연락처로 전화하여 채용 진행 중임을 확인하였고, 내담자의 강점과 이력을 소개하며 추천 사항을 전달함. 서류가 아닌 면접으로 지원자의 가능성 평가를 부탁드림.'
        );
      }

      // 3. +컨설팅 여부 처리
      if (d.hasConsulting) {
        contentLines.push('- 서류 제출 전 채용기업 맞춤형 입사지원서 컨설팅을 실시함(컨설팅 증빙서류 참고).');
      }

      // 4. ◆ 채용정보 헤더 (앞에 "- " 가 아님!)
      contentLines.push(`◆ 채용정보 : ${d.infoProvider || '정보제공처'} / ${d.companyName || '회사명'} - ${d.jobTitle || '직종명'}`);

      // 5. 채용 세부 정보 항목 나열
      addLine('위치', d.location, false, false);
      addLine('업무', d.duty, true, false);
      addLine('학력', d.education, false, false);
      addLine('경력', d.experience, false, false);
      addLine('고용형태', d.employmentType, false, false);
      addLine('모집인원', d.recruitsCount, false, false);
      addLine('급여', d.salary, false, false);
      addLine('근무시간', d.workTime, false, false);
      addLine('제출서류', d.requiredDocuments, false, false);
      addLine('채용담당자', d.managerName, false, false);
      addLine('채용담당자 연락처', d.managerContact, false, false);
      break;
    }

    case '채용정보': {
      subject = '채용정보 제공';
      const d = formData as JobInfoFormData;
      addLine('지원 가능한 채용정보가 있어 참여자 지원할 수 있도록 안내함', d.guideText || '지원 가능한 채용정보가 있어 참여자 지원할 수 있도록 안내함.', true, false);
      addLine('기업명', d.companyName, false, false);
      addLine('근무지역', d.workRegion, false, false);
      addLine('모집 직종', d.jobTitle, false, false);
      addLine('임금조건', d.salaryCondition, false, false);
      addLine('근무형태', d.workType, false, false);
      addLine('근무조건', d.workCondition, true, false);
      addLine('접수마감', d.deadline, false, false);
      break;
    }

    case '직업훈련': {
      subject = '내일배움카드 및 직업훈련 신청';
      const d = formData as VocationalTrainingFormData;
      addLine('참여자는 (희망직종)으로 취업하기를 희망하며 적극적으로 구직활동 중임', d.wishJob, true, false);
      addLine('역량강화를 위해 필요한 직업훈련이 있어 신청서 작성 후 훈련 신청함', d.applyReason, true, false);
      addLine('(운영방식 안내) 성실하게 참여할 수 있도록 지지해드림', d.operationGuide, true, false);
      addLine('직업훈련 일정으로 (해당 회차) 이행과제 변경함', d.roundChange, true, false);

      // 헤더 추가
      contentLines.push('<내일배움카드 직업훈련 신청>');

      addLine('훈련기관명', d.instName, false, false);
      addLine('훈련과정명', d.courseName, false, false);
      addLine('훈련기간', d.period, false, false);
      break;
    }

    case '채용확정': {
      subject = '채용확정';
      const d = formData as EmploymentConfirmedFormData;
      addLine('내담자는 (기업) 면접 응시하였고 (합격일) 합격하여 (출근일)부터 출근하기로 연락받음', d.company, true, false);
      addLine('취업 성공을 축하드리며 취업성공수당 관련하여 안내하고 근속 유지 잘 할 수 있도록 지지해드림', d.congratsText || '취업 성공을 축하드리며 취업성공수당 관련하여 안내하고 근속 유지 잘 할 수 있도록 지지해드림.', true, false);
      break;
    }

    case '종료_풀': {
      subject = '취업지원 서비스 종료(취업) 안내';
      const d = formData as ExitFullFormData;
      addLine('내담자의 취업성공으로 취업지원 서비스 종료되어 안내차 연락을 드림', d.introText || '내담자의 취업성공으로 취업지원 서비스 종료되어 안내차 연락을 드림.', true, false);
      addLine(
        '취업 후 1개월 미만 근무 후 퇴직 시, 퇴직일 기준 1개월 이내 지속 참여 신청으로 취업지원서비스에 지속 참여 가능함을 안내함(1회 한정)',
        d.resignNotice || '취업 후 1개월 미만 근무 후 퇴직 시, 퇴직일 기준 1개월 이내 지속 참여 신청으로 취업지원서비스에 지속 참여 가능함을 안내함(1회 한정).',
        true,
        false
      );
      addLine('국취 (유형), (소득기준) 취업성공수당 지급대상 (해당여부)을 안내함', d.allowanceTargetNotice, true, false);
      addLine(
        '국민취업지원제도 재참여 유예기간 등을 안내드리며, 가급적 1년 이상 근속하여 경력을 형성하도록 적극 독려함(1년 근무자는 퇴사 후 즉시 재참여 가능)',
        d.reparticipationNotice || '국민취업지원제도 재참여 유예기간 등을 안내드리며, 가급적 1년 이상 근속하여 경력을 형성하도록 적극 독려함(1년 근무자는 퇴사 후 즉시 재참여 가능).',
        true,
        false
      );
      addLine('문의사항은 언제든 연락달라고 하였고, 취업일로부터 3개월간 근무 적응도 확인 등을 위해 사후관리 연락을 드리기로 함', d.contactNotice || '문의사항은 언제든 연락달라고 하였고, 취업일로부터 3개월간 근무 적응도 확인 등을 위해 사후관리 연락을 드리기로 함.', true, false);
      addLine('해당 사업장에서 계속근로 의지를 확인한 뒤 내담자의 동의 하에 취업처리를 진행함', d.agreementNotice || '해당 사업장에서 계속근로 의지를 확인한 뒤 내담자의 동의 하에 취업처리를 진행함.', true, false);

      // * 항목들 (앞에 "* "가 들어감!)
      addLine('취업지원 서비스 기간 종료일(취업일자)', d.endDate, false, false, '* ');
      addLine('취업자 사후관리 기간(3개월)', d.followUpPeriod, false, false, '* ');
      addLine('종료통지서 발행 방법', d.issueMethod, false, false, '* ');
      addLine('취업성공수당 지급대상', d.successAllowanceTarget, false, false, '* ');
      addLine('조기취업성공수당 지급대상', d.earlySuccessAllowanceTarget, false, false, '* ');
      addLine('종료구분', d.exitCategory || '취업', false, false, '* ');

      // - 항목들 (앞에 "- "가 들어감!)
      addLine('사업장명', d.companyName, false, false);
      addLine('직종명', d.jobTitle, false, false);
      addLine('주 소정 근로시간', d.weeklyWorkHours, false, false);
      addLine('월 평균 보수액', d.monthlySalary, false, false);
      addLine('구직마감유형', d.jobCloseType, false, false);
      addLine('고용보험 취득여부', d.insuranceAcquired, false, false);
      break;
    }

    case '종료_간단': {
      subject = '종료처리';
      const d = formData as ExitSimpleFormData;
      addLine('내담자는 (일자) (기업)에 취업하여 고용보험 확인 후 종료처리함', d.exitConfirmationText, true, false);
      addLine('취업성공수당 (대상/비대상)임을 안내함', d.allowanceNotice, true, false);
      break;
    }
  }

  // 조립 진행
  let result = `*주제: ${subject}\n*내용:\n`;
  result += contentLines.join('\n');

  // 미입력 필수항목 처리
  if (missingRequiredFields.length > 0) {
    result += `\n\n▶ 미입력 필수항목: ${missingRequiredFields.join(', ')}`;
  }

  return result;
}
