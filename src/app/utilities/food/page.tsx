'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, InfoCard } from '@/components/ui';
import { Header } from '@/components/layout/Header';

const foodStalls = [
  { id: '1', name: 'Bánh tráng', description: '15k' },
  { id: '2', name: 'Cơm cháy', description: '10k' },
  { id: '3', name: 'Bánh Flan', description: '8k' },
  { id: '4', name: 'Bánh Panna Cotta', description: '8k' },
  { id: '5', name: 'Bánh bông lan trứng muối mini', description: '20k' },
  { id: '6', name: 'Trà tắc', description: '12k' },
];

export default function FoodPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Khu ẩm thực" onBack={() => router.push('/dashboard')} />
       
      <div className="px-4 py-6">
        <img src="/Khu vực ẨM THỰC.png" alt="Khu ẩm thực" className="w-full object-cover  mb-6" />
        

      

        {/* Food stalls */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3">MENU ẨM THỰC</h3>
        <div className="space-y-3">
          {foodStalls.map((stall) => (
            <InfoCard
              key={stall.id}
              title={stall.name}
              description={`${stall.description}  `}
              icon={
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              iconBgColor="bg-accent-lighter"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
