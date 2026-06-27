import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, FileText, ImageIcon, RefreshCw, Clipboard, Trash2 } from 'lucide-react';

interface SmartJobParserProps {
  targetForm: string;
  onParsed: (data: any) => void;
  apiKey: string;
  onShowKeyModal: () => void;
}

const formConfigs: Record<string, { title: string; desc: string; labelText: string; placeholderText: string; successMsg: string; alertMsg: string }> = {
  직업훈련: {
    title: "Gemini AI 직업훈련 스마트 자동 완성",
    desc: "직업훈련 정보지, 포스터, 웹페이지 공고 텍스트, 수강 신청 상세 화면 캡처 등을 올려보세요.",
    labelText: "직업훈련 정보 복사 붙여넣기 (자유양식)",
    placeholderText: "예: 직무훈련 포스터나 수강신청 화면 정보를 긁어서 넣어주세요. 희망직종, 훈련기관명, 과정명, 훈련기간을 골라냅니다.",
    successMsg: "Gemini가 직업훈련 정보를 똑똑하게 파싱하여 양식에 자동으로 채워 넣었습니다! 아래 입력 항목들을 확인해 보세요.",
    alertMsg: "직업훈련 텍스트를 붙여넣거나, 관련 안내 캡처 이미지를 첨부해 주세요."
  },
  채용정보: {
    title: "Gemini AI 채용정보 스마트 자동 완성",
    desc: "채용공고 텍스트를 통째로 복사해 붙여넣거나 화면 캡처(Ctrl+V)해 올려보세요.",
    labelText: "채용공고 텍스트 복사 붙여넣기 (자유양식)",
    placeholderText: "예: 사람인이나 워크넷 채용 페이지의 본문 전체를 긁어서 복사 붙여넣기 해보세요. 기업명, 근무지, 급여 등 모든 데이터를 골라냅니다.",
    successMsg: "Gemini가 채용공고 정보를 똑똑하게 파싱하여 양식에 자동으로 채워 넣었습니다! 아래 입력 항목들을 확인해 보세요.",
    alertMsg: "채용 공고 텍스트를 붙여넣거나, 공고 화면 캡처 이미지를 첨부해 주세요."
  },
  알선: {
    title: "Gemini AI 채용알선 스마트 자동 완성",
    desc: "알선에 추천할 구인공고 내용을 붙여넣거나 화면 캡처 이미지를 올려보세요.",
    labelText: "알선 구인공고 텍스트 복사 붙여넣기 (자유양식)",
    placeholderText: "예: 알선할 채용 페이지 전체 복사본을 붙여넣으시면, 기업정보, 담당업무, 급여조건, 접수기간 등 모든 세부항목이 자동으로 기입됩니다.",
    successMsg: "Gemini가 알선 채용공고 정보를 파싱하여 알선 카드 양식에 채워 넣었습니다!",
    alertMsg: "알선 구인정보 텍스트를 붙여넣거나, 구인 화면 캡처 이미지를 첨부해 주세요."
  },
  초기상담: {
    title: "Gemini AI 초기상담 스마트 자동 완성",
    desc: "내담자 메모, 상담일지 초안 텍스트, 또는 자격증/학력 서류 캡처를 올려보세요.",
    labelText: "내담자 상담메모 복사 붙여넣기 (자유양식)",
    placeholderText: "예: '아버님과 거주중, 전문대 졸, 자격증 2개 있음...' 처럼 상담하면서 대충 적은 요약 메모나 텍스트를 쭉 붙여넣으면 각 항목별로 완벽히 정제하여 분배합니다.",
    successMsg: "Gemini가 상담 기록을 파싱하여 초기상담 양식에 나누어 채워 넣었습니다!",
    alertMsg: "초기상담 메모 텍스트를 붙여넣거나, 관련 기록 캡처 이미지를 첨부해 주세요."
  },
  IAP: {
    title: "Gemini AI IAP 수립 스마트 자동 완성",
    desc: "희망 직종, 희망 급여, 근무 형태나 훈련계획 등을 요약해서 올려보세요.",
    labelText: "IAP 관련 메모 복사 붙여넣기 (자유양식)",
    placeholderText: "예: 참여자가 희망하는 조건(주 5일, 서울 구로, 월 250만 이상 등)과 앞으로의 계획 내용을 편하게 붙여넣어주세요.",
    successMsg: "Gemini가 계획 정보를 파싱하여 IAP 수립 양식에 자동으로 채워 넣었습니다!",
    alertMsg: "IAP 수립 정보 텍스트를 붙여넣거나, 관련 캡처 이미지를 첨부해 주세요."
  },
  검사해석: {
    title: "Gemini AI 심리검사 결과 스마트 자동 완성",
    desc: "직업선호도검사 L형 결과지 또는 성격/생활사 요약 캡처/텍스트를 올려보세요.",
    labelText: "심리검사 결과 텍스트 복사 붙여넣기 (자유양식)",
    placeholderText: "예: '선호도검사 결과 SEC 코드가 강하게 나옴. 성격검사 외향성 높음...' 등의 검사 기록 텍스트나 결과지 화면 캡처 이미지를 올려주세요.",
    successMsg: "Gemini가 심리검사 결과를 파싱하여 자동 기재해 드렸습니다!",
    alertMsg: "심리검사 결과 텍스트를 붙여넣거나, 결과 화면 캡처 이미지를 첨부해 주세요."
  },
  수당: {
    title: "Gemini AI 수당이행 스마트 자동 완성",
    desc: "이행 점검 내역이나 활동 증빙 캡처 이미지/기록을 올려보세요.",
    labelText: "이행 정보 복사 붙여넣기 (자유양식)",
    placeholderText: "예: '2회차 이행 수당 신청함. 이력서 2개 제출 정상확인 완료' 같은 수당 신청 내역을 넣어주세요.",
    successMsg: "Gemini가 수당 이행점검 내역을 파싱하여 양식에 자동으로 채워 넣었습니다!",
    alertMsg: "이행 정보 텍스트를 붙여넣거나, 이행 증빙 캡처 이미지를 첨부해 주세요."
  },
  컨설팅: {
    title: "Gemini AI 입사컨설팅 스마트 자동 완성",
    desc: "컨설팅 진행 사유, 직무 등 첨삭 정보나 기록을 올려보세요.",
    labelText: "컨설팅 내용 복사 붙여넣기 (자유양식)",
    placeholderText: "예: '자기소개서 작성 경험이 없어서 NCS 분석 기반 주제 맞춤 코칭 지원함' 등의 내용을 자유롭게 넣어보세요.",
    successMsg: "Gemini가 컨설팅 상담 내용을 파싱하여 양식에 자동으로 채워 넣었습니다!",
    alertMsg: "컨설팅 정보 텍스트를 붙여넣거나, 관련 캡처 이미지를 첨부해 주세요."
  },
  채용확정: {
    title: "Gemini AI 채용확정 스마트 자동 완성",
    desc: "합격 문자, 이메일, 합격 통보 정보 혹은 캡처 사진을 올려보세요.",
    labelText: "합격통보 정보 복사 붙여넣기 (자유양식)",
    placeholderText: "예: '주식회사 삼표산업에서 물류 사무직 합격문자 받음. 7월 1일부터 출근 예정' 등 문자나 이메일 캡처본 또는 텍스트를 올려주세요.",
    successMsg: "Gemini가 합격 및 출근 전말 정보를 파싱하여 채용확정 양식에 자동으로 채워 넣었습니다!",
    alertMsg: "합격 통보 텍스트를 붙여넣거나, 문자/메일 캡처 이미지를 첨부해 주세요."
  }
};

export default function SmartJobParser({ targetForm, onParsed, apiKey, onShowKeyModal }: SmartJobParserProps) {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isPasteActive, setIsPasteActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const parserRef = useRef<HTMLDivElement>(null);

  // 현재 양식 타입에 해당하는 설정 불러오기 (없으면 '채용정보' 설정으로 폴백)
  const config = formConfigs[targetForm] || formConfigs['채용정보'];

  // 컴포넌트가 활성화되었을 때 붙여넣기(Ctrl+V) 핸들러 바인딩
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // 파서 요소가 활성화되어 있을 때만 혹은 마우스 오버 상태일 때 동작하도록
      if (!isPasteActive) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageSelected(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [isPasteActive]);

  const handleImageSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG 등)만 업로드할 수 있습니다.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setInputText('');
    clearImage();
  };

  const handleParse = async () => {
    if (!inputText.trim() && !imagePreview) {
      alert(config.alertMsg);
      return;
    }

    if (!apiKey) {
      onShowKeyModal();
      alert('AI 스마트 분석 기능을 사용하려면 먼저 Gemini API Key를 설정하고 승인해 주세요.');
      return;
    }

    setIsParsing(true);
    try {
      const res = await fetch('/api/parse-job-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey,
        },
        body: JSON.stringify({
          inputText: inputText.trim() || undefined,
          imageData: imagePreview || undefined,
          mimeType: imageFile?.type || undefined,
          targetForm,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '정보 분석에 실패했습니다.');
      }

      const data = await res.json();
      onParsed(data);
      alert(config.successMsg);
    } catch (err: any) {
      console.error(err);
      alert(`분석 도중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div 
      ref={parserRef}
      onMouseEnter={() => setIsPasteActive(true)}
      onMouseLeave={() => setIsPasteActive(false)}
      className="bg-gradient-to-br from-indigo-50/50 via-violet-50/30 to-sky-50/40 border border-indigo-100 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-sm"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/10 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-4 h-4 fill-indigo-200" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              {config.title}
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-full">Pro 특화 기능</span>
            </h4>
            <p className="text-[10px] text-slate-500 font-semibold">{config.desc}</p>
          </div>
        </div>

        {(inputText.trim() || imagePreview) && (
          <button
            onClick={handleReset}
            className="self-end sm:self-auto text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            지우기
          </button>
        )}
      </div>

      {/* Main Dual Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Text Input Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Clipboard size={12} className="text-indigo-500" /> 
            {config.labelText}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={config.placeholderText}
            className="w-full h-28 p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
          />
        </div>

        {/* Image Attachment (Drag & Drop or Paste) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <ImageIcon size={12} className="text-violet-500" /> 
            이미지 올리기 (드롭 혹은 화면클릭 후 Ctrl+V)
          </label>
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-indigo-500 bg-indigo-50/80 scale-[0.99]' 
                : imagePreview 
                ? 'border-slate-200 bg-white' 
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="w-full h-full p-2 relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img
                  src={imagePreview}
                  alt="공고 캡처 미리보기"
                  referrerPolicy="no-referrer"
                  className="max-h-24 max-w-full rounded-lg object-contain shadow-sm"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                  title="이미지 삭제"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div className="text-center p-3 space-y-1">
                <Upload className="w-6 h-6 text-indigo-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-600">이곳을 클릭해 파일 찾기 또는 드래그</p>
                <p className="text-[9px] font-semibold text-slate-400">
                  {isPasteActive ? '🔥 지금 바로 복사한 이미지를 Ctrl+V 하셔도 됩니다' : '마우스를 올린 후 Ctrl+V로 붙여넣기 가능'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Parse Button */}
      <div className="mt-3.5 flex justify-end relative z-10">
        <button
          onClick={handleParse}
          disabled={isParsing}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-400 disabled:to-violet-400 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md hover:shadow-indigo-100 cursor-pointer"
        >
          {isParsing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Gemini가 분석 요약 중...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              캡처/텍스트 분석해서 자동 완성하기
            </>
          )}
        </button>
      </div>

    </div>
  );
}
