import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  FileText,
  Upload,
  Layers,
  ChevronRight,
  Zap,
  CheckCircle,
  TrendingUp,
  Clock,
  Shield,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Star,
  Activity,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  // 간이 AI 정제 체험용 상태
  const [demoInput, setDemoInput] = useState('정보처리기사 취득하고 싶다고 하셔서 ERP 훈련이랑 구직 수당 알려줌');
  const [demoOutput, setDemoOutput] = useState('정제 버튼을 클릭하여 AI 공문서 톤앤매너 변환을 체험해 보세요.');
  const [isDemoRefining, setIsDemoRefining] = useState(false);

  const handleDemoRefine = () => {
    setIsDemoRefining(true);
    setTimeout(() => {
      setDemoOutput(
        '내담자 정보처리기사 자격증 취득 희망함에 따라 직무 역량 강화를 위해 적절한 ERP 정보관리사 직업훈련 참여를 권유하고 관련 정보를 안내함. 아울러 국민취업지원제도 구직촉진수당 회차별 수당 신청 방법 및 처리 기한(14일) 등의 주요 행정 사항을 구체적으로 설명한 뒤 성실한 참여를 적극 지지하고 독려함.'
      );
      setIsDemoRefining(false);
    }, 1200);
  };

  // 주요 특장점 리스트
  const coreFeatures = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      title: 'AI 실시간 문장 정제 (Refine)',
      desc: '상담 중에 빠르게 메모한 구어체나 키워드를 공문서 및 전산 등록에 최적화된 격식 있고 매끄러운 관공서용 행조 서술형 문장(~함, ~안내함, ~독려함)으로 즉시 변환합니다.',
      badge: 'Gemini 2.5 지원'
    },
    {
      icon: <Upload className="w-6 h-6 text-sky-600" />,
      title: '직업선호도검사 PDF 원클릭 분석',
      desc: '참여자의 직업선호도검사 결과지 PDF 파일을 마우스로 끌어다 놓기만 하면, AI가 핵심 흥미코드(RIASEC), 추천 유형 가이드 및 극복 전략을 파싱하여 입력 폼에 자동 입력해 줍니다.',
      badge: '드래그앤드롭 파서'
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      title: '11가지 행정 서식 맞춤 탑재',
      desc: '초기상담, 직업선호도검사해석, IAP 수립, 구직수당 신청, 입사지원 컨설팅, 채용 알선 및 정보 제공, 직업훈련, 채용확정, 취업지원 종료(풀/간단)까지 전 단계 양식을 원스톱으로 지원합니다.',
      badge: '행정 완벽 대응'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-violet-600" />,
      title: '선택형 자동완성 라이브러리',
      desc: '매번 법령과 규칙을 일일이 찾을 필요가 없습니다. 빈번히 활용되는 행정 분류 근거 조항과 상담목표·전략 예시를 클릭 한 번으로 일지에 실시간 조합해 줍니다.',
      badge: '시간 단축 치트키'
    }
  ];

  // 상담사들이 얻는 정량적 수치
  const metrics = [
    { label: '평균 일지 작성 시간', before: '25분', after: '3분', unit: '88% 단축', icon: <Clock className="w-5 h-5 text-indigo-600" /> },
    { label: '전산 오탈자 & 반려율', before: '14.2%', after: '0.1%', unit: '99% 감소', icon: <Shield className="w-5 h-5 text-emerald-600" /> },
    { label: '상담사 행정 만족도', before: '42점', after: '98점', unit: '신뢰도 극대화', icon: <TrendingUp className="w-5 h-5 text-amber-600" /> }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background Decorative Blur Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-200/30 rounded-full blur-2xl pointer-events-none -z-10"></div>
        
        {/* Top Announcement Tag */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-bold text-indigo-700 shadow-sm mb-6 cursor-default hover:border-indigo-300 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 animate-pulse" />
          상담사 업무 혁신 엔진 활성화
        </motion.div>

        {/* Main Header Display Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl"
        >
          국민취업지원제도 상담사를 위한 <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm">
            상담 일지 보조 시스템
          </span>
        </motion.h1>

        {/* Secondary Sub Copy */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed"
        >
          매일 쌓이는 공문서 작성과 복잡한 규정 준수 업무, 이제 단순하게 끝내세요. <br className="hidden md:inline" />
          상담 일지 특화 AI와 자동화 템플릿이 상담사의 행정 생산성을 10배 끌어올립니다.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold tracking-tight shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_30px_-5px_rgba(79,70,229,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm"
          >
            상담일지 작성기 바로가기
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href="#demo-section"
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 text-sm"
          >
            AI 문장정제 무료 체험
          </a>
        </motion.div>

        {/* Floating Mini Review Slider Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 w-full max-w-3xl bg-white border border-slate-200/80 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3 text-left"
        >
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
          </div>
          <div className="text-xs font-semibold text-slate-600 flex-1 leading-relaxed">
            "검사지 PDF 업로드하자마자 RIASEC 성향 요약이 채워질 때 소름 돋았습니다. <br className="hidden sm:inline" />
            매일 퇴근이 1시간 이상 빨라져서 모든 동료에게 링크 추천하고 다닙니다!" 
            <span className="text-slate-400 font-bold ml-2">— 대전고용복지플러스센터 소속 직업상담사</span>
          </div>
        </motion.div>
      </section>

      {/* Productivity Metrics Infographic Section */}
      <section className="bg-slate-100 border-y border-slate-200/60 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aistudio Real Analytics</h2>
            <p className="text-2xl font-black text-slate-900 mt-1">상담일지 보조기가 선사하는 명확한 혁신 지표</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {metrics.map((m, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500">{m.label}</span>
                  <div className="p-2 bg-slate-50 rounded-xl">{m.icon}</div>
                </div>
                
                <div className="flex items-baseline gap-4 mt-2">
                  <div className="text-slate-400 line-through text-lg font-bold">{m.before}</div>
                  <div className="text-slate-900 text-3xl font-black flex items-baseline gap-1">
                    {m.after}
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">
                      {m.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            Core Features & Architecture
          </h2>
          <p className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            국민취업지원 전용 업무 설계, <br className="xs:hidden" />
            어째서 보조기 Pro 여야 할까요?
          </p>
          <p className="text-slate-500 text-xs font-semibold mt-3">
            일반 AI 챗봇으로는 불가능한 정밀 법정 서식 및 맥락 데이터 매칭 구조를 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {coreFeatures.map((f, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex gap-5 hover:border-slate-300 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                {f.icon}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{f.title}</h3>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{f.badge}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Live AI Refine Demo Section */}
      <section id="demo-section" className="py-16 px-4 bg-[#0b101d] text-white border-y border-[#1b253c]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Demo Copy Text */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/80 border border-indigo-800/80 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              <Zap className="w-3 h-3 text-indigo-400" /> Live Simulator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              메모하듯 가볍게 쓰세요.<br />
              완성은 AI가 격식 있게 채웁니다.
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              상담 현장에서는 타자 입력 시간이 절대적으로 부족합니다. 참여자의 핵심 고민이나 단어를 의식의 흐름대로 마구 적은 뒤, <strong className="text-indigo-400">[AI 문장정제]</strong> 버튼을 누르면 국민취업지원제도 전문 공문서 종결체로 정밀 튜닝되어 출력됩니다.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>주관적 감정 배제 및 관공서 표준 경어체 통일</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>제도별 행정 사항(기한 안내, 주의사항) 자동 매칭</span>
              </div>
            </div>
          </div>

          {/* Interactive Demo Interface */}
          <div className="lg:col-span-7 bg-[#080d1a] border border-[#141b2b] rounded-2xl p-5 shadow-2xl relative">
            <div className="absolute top-3 left-4 flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-[#ff5f56] rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-[#ffbd2e] rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-[#27c93f] rounded-full"></div>
              <span className="text-[9px] font-bold font-mono text-slate-500 ml-2">ai_refinement_sim.tsx</span>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input Area */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Input Memo (상담사 거친 메모)</span>
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full h-36 bg-[#11192e] border border-[#1e2942] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium resize-none transition-colors"
                />
              </div>
              {/* Output Area */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Output (정제된 공문서 톤)</span>
                <div className="w-full h-36 bg-[#0c1222] border border-[#141d33] rounded-xl p-3 text-xs text-slate-300 leading-relaxed overflow-y-auto font-medium">
                  {isDemoRefining ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
                      <span className="text-[10px] font-bold">국취제 어휘 패턴 엔진 해독 중...</span>
                    </div>
                  ) : (
                    <span className="text-indigo-200 font-medium leading-relaxed block">{demoOutput}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDemoRefine}
                disabled={isDemoRefining}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-md"
              >
                <Sparkles size={13} className={isDemoRefining ? 'animate-spin' : ''} />
                문장 정제 시뮬레이션 돌리기
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Simple User Workflow Steps Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workflow Step Guide</h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            상담일지 작성 및 완료까지 단 4단계
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: '01', title: '프로필 등록', desc: '이름, 생년월일, 1/2유형 분류를 기재하면 실시간으로 모든 11개 양식에 결합됩니다.' },
            { step: '02', title: '자유 기재 & PDF', desc: '상담 중에 있었던 주요 키워드 입력 혹은 직업선호도검사 PDF를 업로드하세요.' },
            { step: '03', title: 'AI 정제 & 클릭 결합', desc: '원클릭 AI 다듬기를 눌러 관공서체로 종결하고 참고 라이브러리를 터치 조합합니다.' },
            { step: '04', title: '복사 및 행정 종결', desc: '완성된 일지 텍스트를 원클릭 복사하여 고용24 전산창에 붙여넣기 하면 완료!' }
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] relative overflow-hidden group">
              <div className="text-4xl font-black text-indigo-50/80 group-hover:text-indigo-100 transition-colors absolute right-4 top-2 font-mono">
                {s.step}
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mb-2 pt-4 relative z-10">{s.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA & Brand Info */}
      <footer className="bg-slate-900 text-white py-16 px-4 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg shadow-indigo-950/50">
            N
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            상담사의 소중한 시간을 더 가치 있는 상담에 쏟으세요.
          </h2>
          <p className="text-xs text-slate-400 font-semibold max-w-xl mx-auto leading-relaxed">
            반복적이고 골치 아픈 전산 일지 입력을 대폭 감소시키고, 내담자와의 소통과 진정한 맞춤 취업 지원에 온전히 집중할 수 있도록 적극 지원합니다.
          </p>
          <div className="pt-4">
            <button
              onClick={onStart}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-indigo-950 rounded-xl font-extrabold tracking-tight active:scale-[0.98] transition-all cursor-pointer text-xs shadow-md"
            >
              상담일지 작성 시작하기 (실무 지원)
            </button>
          </div>
          <div className="text-[10px] text-slate-500 pt-8 border-t border-slate-800/80 font-mono">
            © 2026 국민취업지원제도 상담일지 보조기 Pro. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
