'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/Header';

export default function CareerPage() {
  const router = useRouter();

  const handleNotSure = () => {
    // TODO: Gọi API ONET sau
    alert('Tính năng làm bài test ONET sẽ được cập nhật sớm!');
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header 
        title="Chọn nghề" 
        onBack={() => router.push('/dashboard')} 
        showLogo
      />
      
      <div className="px-4 py-8">
       
        {/* Question */}
        <h1 className="text-2xl font-bold text-center text-neutral-900 mb-3 font-heading">
          BẠN ĐÃ CHỌN ĐƯỢC NGHỀ<br />YÊU THÍCH CHƯA?
        </h1>
        <p className="text-center text-neutral-500 mb-8">
          Chúng tôi sẽ giúp bạn tìm kiếm định hướng phù hợp
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full !bg-success hover:!bg-success/90"
            onClick={() => router.push('/career/list')}
          >
            RỒI, TÔI ĐÃ CHỌN NGHỀ
          </Button>
          
          <Button
            variant="gray"
            size="lg"
            className="w-full"
            onClick={handleNotSure}
          >
            CHƯA, TÔI CHƯA BIẾT
          </Button>
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
              <span className="font-medium">Gợi ý:</span> Nếu bạn chưa chắc chắn, hãy làm bài test ONET để khám phá năng lực và sở thích của bản thân!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
