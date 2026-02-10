'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LocationCard } from '@/components/ui';
import { Header } from '@/components/layout/Header';



const quickAccess = [
  {
    id: 'food',
    title: 'Khu ẩm thực',
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBgColor: 'bg-accent-lighter',
    path: '/utilities/food',
  },
  {
    id: 'games',
    title: 'Trò chơi',
    icon: (
      <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBgColor: 'bg-success/10',
    path: '/utilities/games',
  },
  {
    id: 'music',
    title: 'Âm nhạc',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    iconBgColor: 'bg-primary-lighter',
    path: '/utilities/music',
  },
];

export default function LocationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Bản đồ & Địa điểm" onBack={() => router.push('/dashboard')} />
      
      <div className="px-4 py-6">
        {/* Map */}
        <img src="/maptoantruong.jpg" alt="Bản đồ toàn trường" className="w-full object-cover rounded-2xl mb-6 shadow-card" />

        {/* Quick Access */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-3">Truy cập nhanh</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickAccess.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="p-4 bg-background-primary rounded-xl shadow-card text-center active:scale-95 transition-all duration-base"
              >
                <div className={`w-12 h-12 mx-auto rounded-full ${item.iconBgColor} flex items-center justify-center mb-2`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-neutral-700">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
}
