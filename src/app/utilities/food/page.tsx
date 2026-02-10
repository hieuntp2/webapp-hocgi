'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, InfoCard } from '@/components/ui';
import { Header } from '@/components/layout/Header';


export default function FoodPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Khu ẩm thực" onBack={() => router.push('/dashboard')} />
       
      <div className="px-4 py-6">
        <img src="/Khu vực ẨM THỰC.png" alt="Khu ẩm thực" className="w-full object-cover  mb-6" />
        
        {/* Food stalls */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3">MENU ẨM THỰC</h3>
         <img src="/Menu.png" alt="Khu ẩm thực" className="w-full object-cover  mb-6" />
      
      </div>
    </div>
  );
}
