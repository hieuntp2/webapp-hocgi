'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { checkInService } from '@/services/api/checkIn';

// Popular majors for quick select
const popularMajors = [
  'Công nghệ thông tin',
  'Kinh tế',
  'Y - Dược',
  'Kỹ thuật',
  'Ngoại ngữ',
  'Sư phạm',
];

// All majors for dropdown
const allMajors = [
  { value: 'cntt', label: 'Công nghệ thông tin' },
  { value: 'kinh-te', label: 'Kinh tế' },
  { value: 'ke-toan', label: 'Kế toán' },
  { value: 'y-khoa', label: 'Y khoa' },
  { value: 'duoc-hoc', label: 'Dược học' },
  { value: 'ngoai-ngu', label: 'Ngoại ngữ' },
  { value: 'luat', label: 'Luật' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'kien-truc', label: 'Kiến trúc' },
  { value: 'su-pham', label: 'Sư phạm' },
  { value: 'ky-thuat', label: 'Kỹ thuật' },
  { value: 'dieu-duong', label: 'Điều dưỡng' },
  { value: 'quan-tri', label: 'Quản trị kinh doanh' },
  { value: 'truyen-thong', label: 'Truyền thông đa phương tiện' },
];

type Step = 'initial' | 'select' | 'meet-professionals' | 'directions';

export default function MajorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('initial');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing data on mount
  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        const response = await checkInService.getCustomFields();
        if (response.success && response.data) {
          const customMajorValue = response.data.customMajor || '';
          setCustomMajor(customMajorValue);
          // Check if customMajor matches any in allMajors dropdown
          const matchedMajor = allMajors.find(m => m.label === customMajorValue);
          if (matchedMajor) {
            setSelectedMajor(matchedMajor.value);
            setCustomMajor('');
          }
        }
      } catch (err) {
        // Ignore error - just means no data yet
        console.log('No custom fields data yet');
      }
    };

    loadCustomFields();
  }, []);

  // Handle quick select popular major
  const handleQuickSelect = (majorName: string) => {
    setCustomMajor(majorName);
    setSelectedMajor('');
  };

  // Validation: Chỉ cần 1 trong 2 được điền
  const isValid = selectedMajor || customMajor.trim();

  // Handle confirm major selection
  const handleConfirmMajor = async () => {
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      // Send either the selected major label or custom major
      const majorValue = selectedMajor 
        ? allMajors.find(m => m.value === selectedMajor)?.label || selectedMajor
        : customMajor.trim();

      await checkInService.setCustomMajor({
        customMajor: majorValue,
      });
      setStep('meet-professionals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Initial - Ask if already chosen
  if (step === 'initial') {
    return (
      <div className="min-h-screen bg-background-secondary">
        <Header 
          title="Chọn ngành" 
          onBack={() => router.push('/dashboard')} 
          showLogo
        />
        
        <div className="px-4 py-6">
          {/* Status indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-background-primary rounded-full shadow-card border border-neutral-100">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
              <span className="text-sm text-neutral-500 font-medium">CHƯA HOÀN THÀNH</span>
            </div>
          </div>

          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-warm">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* Question */}
          <h1 className="text-2xl font-bold text-center text-neutral-900 mb-2 font-heading">
            BẠN ĐÃ CHỌN ĐƯỢC<br />NGÀNH HỌC CHƯA?
          </h1>
          <p className="text-center text-neutral-500 mb-8">
            Ngành học sẽ quyết định con đường sự nghiệp của bạn
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setStep('select')}
              className="w-full py-4 rounded-xl bg-success text-white font-bold hover:bg-success/90 transition-colors duration-base shadow-md"
            >
              RỒI, TÔI ĐÃ CHỌN NGÀNH
            </button>
            
            <button
              onClick={() => setStep('directions')}
              className="w-full py-4 rounded-xl border-2 border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 transition-colors duration-base"
            >
              CHƯA, TÔI CẦN TƯ VẤN
            </button>
          </div>

          {/* Tip */}
          <div className="mt-6 p-4 bg-accent-lighter rounded-xl border border-accent-light">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Gợi ý:</span> Nếu bạn chưa chắc chắn, hãy đến phòng Định Hướng Nghề Nghiệp để được tư vấn kỹ hơn
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select major
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-background-secondary pb-24">
        <Header 
          title="Chọn ngành học" 
          onBack={() => setStep('initial')} 
          showLogo
        />
        
        <div className="px-4 py-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-warm">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <p className="text-center text-neutral-700 mb-6">
            Tuyệt vời! Hãy cho chúng tôi biết<br />
            <span className="font-bold">ngành bạn quan tâm:</span>
          </p>

          {/* Dropdown Select */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Chọn ngành từ danh sách
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => {
                setSelectedMajor(e.target.value);
                if (e.target.value) setCustomMajor('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-background-primary focus:outline-none focus:border-accent transition-colors duration-base"
            >
              <option value="">-- Chọn ngành --</option>
              {allMajors.map((major) => (
                <option key={major.value} value={major.value}>
                  {major.label}
                </option>
              ))}
            </select>
          </div>


          {/* Divider */}
          <div className="flex items-center gap-4 my-6">+
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-sm text-neutral-400">Hoặc</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Custom input */}
          <div>
            <label className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Nhập tên ngành khác
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khoa học máy tính, Luật..."
              value={customMajor}
              onChange={(e) => {
                setCustomMajor(e.target.value);
                if (e.target.value) setSelectedMajor('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-background-primary focus:outline-none focus:border-accent transition-colors duration-base"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA - Accent button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-primary border-t border-neutral-100">
          <button
            onClick={handleConfirmMajor}
            disabled={!isValid || isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold transition-colors duration-base ${
              isValid && !isLoading ? 'gradient-primary hover:opacity-90 shadow-warm' : 'bg-neutral-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ĐANG LƯU...
              </span>
            ) : (
              'XÁC NHẬN NGÀNH ĐÃ CHỌN'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Ask if want to meet professionals
  if (step === 'meet-professionals') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-background-primary rounded-3xl p-6 max-w-sm w-full shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Question */}
          <h1 className="text-xl font-bold text-center text-neutral-900 mb-4 font-heading">
            BẠN CÓ MUỐN GẶP<br />
            ANH CHỊ THÀNH ĐẠT<br />
            TRONG LĨNH VỰC ĐÓ?
          </h1>

          {/* Info box */}
          <div className="p-4 bg-success/10 rounded-xl border border-success/30 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Phòng định hướng nghề nghiệp</span> là nơi các anh chị đang làm việc trong ngành sẽ chia sẻ kinh nghiệm thực tế, cơ hội nghề nghiệp và định hướng phát triển trong lĩnh vực mà bạn quan tâm!
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setStep('directions')}
              className="w-full py-4 rounded-xl bg-success text-white font-bold hover:bg-success/90 transition-colors duration-base shadow-md"
            >
              CÓ, TÔI MUỐN GẶP
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-xl border-2 border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 transition-colors duration-base"
            >
              KHÔNG, QUAY LẠI TRANG CHỦ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Directions to guidance room
  if (step === 'directions') {
    return (
      <div className="min-h-screen bg-background-secondary pb-24">
        <Header 
          title="Phòng định hướng nghề nghiệp" 
          onBack={() => router.push('/dashboard')} 
          showLogo
        />
        
        <div className="px-4 py-6">
         

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-neutral-900 mb-1 font-heading">HƯỚNG DẪN ĐẾN</h2>
          <p className="text-center text-neutral-500 mb-6">Phòng định hướng nghề nghiệp</p>

      

        <img src="/Khu vực Định hướng nghề .png" alt="Hướng dẫn đến phòng định hướng nghề nghiệp" className="w-full object-cover  mb-6 shadow-card" />
          {/* Instructions */}
          <div className="bg-background-primary rounded-2xl p-4 shadow-card border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2 font-heading">
              <svg className="w-5 h-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              KHI ĐẾN PHÒNG ĐỊNH HƯỚNG
            </h3>
            <div className="space-y-3">
              {[
                'Gặp gỡ người đi trước trong ngành',
                'Nghe tư vấn về lộ trình phát triển',
                'Kết nối và xây dựng mạng lưới',
                'Tìm hiểu về công việc thực tế',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${
                    index < 2 ? 'bg-success' : 'bg-accent'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-primary border-t border-neutral-100">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-4 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity duration-base shadow-warm"
          >
            HOÀN THÀNH VÀ TIẾP TỤC
          </button>
        </div>
      </div>
    );
  }

  return null;
}
