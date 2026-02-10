'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

// University data grouped by region
const universities = [
  {
    region: 'TP Hồ Chí Minh',
    schools: [
      'Trường Đại học Công nghệ thông tin, ĐHQG-HCM (UIT)',
      'Trường Đại học Bách khoa, ĐHQG-HCM (HCMUT)',
      'Trường Đại học Khoa học XH và Nhân văn (USSH-HCM)',
      'Trường Đại học Công thương (HUIT)',
      'Trường ĐH Tài chính – Marketing (UFM)',
      'ĐH Kinh tế TP.HCM (UEH)',
      'Trường ĐH Giao thông vận tải HCM (UTH)',
      'Học viện Hàng không (VAA)',
      'Trường ĐH Sư phạm HCM (HCMUE)',
      'Trường ĐH Kinh tế – Luật (UEL)',
      'Đại học Ngoại thương – Cơ sở II',
      'Đại học Fulbright Việt Nam',
      'Viện ISB – Đại học Kinh tế TP.HCM',
      'Trường ĐH Công nghệ Kỹ thuật TP.HCM',
      'Trường Đại học Luật TP.HCM',
      'Trường Đại học Ngân hàng TP.HCM',
      'Học viện cán bộ HCMC',
    ],
  },
  {
    region: 'Huế – Đà Nẵng',
    schools: [
      'Trường ĐH Kỹ thuật Y Dược Đà Nẵng',
      'Trường ĐH Kinh tế ĐN (DUE)',
      'Trường ĐH Ngoại ngữ, ĐH Huế (HUFLIS)',
      'Trường ĐH Bách khoa ĐN (DUT)',
      'Trường Đại học Ngoại ngữ Đà Nẵng',
      'Trường Đại học Sư phạm Đà Nẵng',
      'Trường Đại học Sư phạm Huế',
      'Trường Đại học Y Dược – Huế',
      'FPT Đà Nẵng',
    ],
  },
  {
    region: 'Hà Nội',
    schools: [
      'Trường Khoa học liên ngành và Nghệ thuật, ĐHQGHN (SIS)',
      'Học viện Tài chính (AOF)',
      'Học viện Ngoại giao (DAV)',
      'ĐH Kinh tế Quốc dân (NEU)',
      'Trường Đại học Sư phạm Hà Nội (HNUE)',
      'Đại học Bách khoa Hà Nội (HUST)',
      'Trường Đại học Khoa học XH & Nhân văn – ĐHQGHN',
      'Trường Đại học Thương mại (TMU)',
      'Học viện Báo chí & Tuyên truyền (AJC)',
    ],
  },
  {
    region: 'Trung Quốc',
    schools: [
      'Đại học Công nghệ Bắc Kinh',
      'Changsha University of Science and Technology',
    ],
  },
  {
    region: 'Úc',
    schools: [
      'Monash University',
    ],
  },
];

export default function SchoolPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF3E0', paddingBottom: '32px' }}>
      <Header 
        title="Chọn Trường" 
        onBack={() => router.push('/dashboard')}
      />
      
      <div style={{ padding: '16px' }}>
        {/* Map ĐSSV */}
        <img src="/Khu vực ĐSSV.png" alt="Khu vực Đại sứ sinh viên" style={{ width: '100%', objectFit: 'cover', marginBottom: '16px', borderRadius: '12px' }} />

        {/* University List by Region */}
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#D32F2F', marginBottom: '16px' }}>
            Danh Sách Trường Đại Học
          </h3>
          
          {universities.map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: '16px' }}>
              {/* Region Header */}
              <div style={{ 
                background: 'linear-gradient(to right, #D32F2F, #FF6F00)',
                borderRadius: '8px 8px 0 0',
                padding: '10px 16px',
              }}>
                <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>
                  {group.region}
                </h4>
              </div>
              
              {/* Schools List */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}>
                {group.schools.map((school, schoolIndex) => (
                  <div 
                    key={schoolIndex}
                    style={{ 
                      padding: '12px 16px',
                      borderBottom: schoolIndex < group.schools.length - 1 ? '1px solid #E5E7EB' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      backgroundColor: '#FFF3E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg style={{ width: '14px', height: '14px', color: '#FF6F00' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.4' }}>
                      {school}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

