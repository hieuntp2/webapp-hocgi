'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

export default function FinishPage() {
  const router = useRouter();
  const feedbackLink = 'https://forms.gle/example'; // Link sẽ được cập nhật sau

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="Hoàn thành" 
        onBack={() => router.push('/dashboard')}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center mb-6 shadow-lg animate-fade-in">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Congratulations Text */}
        <div className="bg-background-primary rounded-2xl p-6 shadow-card border border-neutral-100 max-w-md mb-8">
          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-4 font-heading">
            🎉 Chúc mừng!
          </h2>
          <p className="text-center text-neutral-700 leading-relaxed">
            Chúc mừng bạn đã hoàn thành hành trình tìm hiểu và giải cứu bản thân khỏi mê cung ngành nghề, tiến gần đến kho báu quà tặng!
          </p>
          <p className="text-center text-neutral-700 leading-relaxed mt-4">
            Hãy hoàn thành <b>KHẢO SÁT CHẤT LƯỢNG "Ngày hội Tư vấn tuyển sinh - Hướng nghiệp Quảng Trị 2025"</b> và nhận ngay 01 phần quà giá trị tại khu vực check-out nhé!
          </p>
        </div>

        {/* Feedback Button */}
        <a
          href={feedbackLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-center shadow-warm hover:shadow-lg active:scale-95 transition-all duration-base flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Feedback
        </a>

        {/* Back to Dashboard */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 transition-colors duration-base"
        >
          ← Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
