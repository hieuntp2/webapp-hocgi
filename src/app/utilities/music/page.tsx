'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

const schedule = [
  { time: '15:30 - 16:30', title: 'Band nhạc', artist: 'Biểu diễn band nhạc' },
  { time: '16:30 - 17:00', title: 'Random dance', artist: 'Giao lưu cùng nhảy' },
];

export default function MusicPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Sân khấu âm nhạc" onBack={() => router.push('/dashboard')} />
      
      <div className="px-4 py-6">
        {/* Map */}
        <img src="/Khu vực ÂM NHẠC.png" alt="Khu vực âm nhạc" className="w-full object-cover mb-6" />

        {/* Schedule */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3">Lịch biểu diễn</h3>
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div key={index} className="bg-background-primary rounded-xl p-4 shadow-card">
              <div className="flex items-start gap-3">
                <div className="w-16 text-center flex-shrink-0">
                  <span className="text-xs text-primary font-medium bg-primary-lighter px-2 py-1 rounded-full">
                    {item.time.split(' - ')[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">{item.title}</h4>
                  <p className="text-sm text-neutral-500 mt-0.5">{item.artist}</p>
                  <p className="text-xs text-neutral-400 mt-1">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}
