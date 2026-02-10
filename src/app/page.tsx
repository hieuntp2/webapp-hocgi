'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary gradient-subtle px-6">
      {/* Centered content */}
      <div className="flex flex-col items-center text-center">
        {/* Event Logo */}
        <div className="mb-4">
          <Image
            src="/logo-tvts.png"
            alt="TVTS Logo"
            width={200}
            height={200}
            className="w-full max-w-[200px] h-auto object-contain" 
            priority
          />
        </div>
        
        {/* Event Title with gradient text */}
        <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight font-heading">
          Ngày Hội Tư Vấn<br />
          Tuyển Sinh
        </h1>
        <p className="mt-2 gradient-text font-bold text-lg font-heading">
          Định Hướng Nghề Nghiệp
        </p>
        
        {/* Welcome text */}
        <p className="mt-6 text-neutral-600 text-base leading-relaxed max-w-xs">
          Chào bạn đến chương trình, để bắt đầu, hãy check-in bên dưới
        </p>
        
        {/* Check-in Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full max-w-xs mt-6 uppercase tracking-wider"
          onClick={() => router.push('/login')}
        >
          CHECK-IN NGAY
        </Button>
        
        <p className="mt-4 text-sm text-neutral-500">
          Đã có tài khoản?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}
