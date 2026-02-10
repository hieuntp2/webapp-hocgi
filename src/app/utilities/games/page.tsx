'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

const games = [
  { id: '1', name: 'Chuyền khéo về đích' },
  { id: '2', name: 'Kéo sao cho đều' },
  { id: '3', name: 'Đừng để bóng rơi' },
  { id: '4', name: 'Bóng ơi đi đâu' },
  { id: '5', name: 'Chạm trước - giành sau' },
];

export default function GamesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Khu trò chơi" onBack={() => router.push('/dashboard')} />
      
      <div className="px-4 py-6">
        {/* Map */}
        <img src="/Khu vực TRÒ CHƠI.png" alt="Khu vực trò chơi" className="w-full object-cover mb-6" />

        {/* Games list */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3">Danh sách trò chơi</h3>
        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.id} className="bg-background-primary rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </div>
                <h4 className="font-medium text-neutral-900">{game.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
